import {
  CommonPrefix,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import { awsCredentials } from "../utils/env.util";
import { getMimeType, MimeType } from "../utils/mimeType.util";

interface ListAllObjectsParams {
  nextRootDirectory: string;
  continuationToken?: string;
  maxKeys?: string;
}

interface FileObject {
  basename: string;
  type: "file";
  path: string;
  modifiedAt: number | null;
  size: number;
  mimeType: MimeType;
}

interface DirectoryObject {
  basename: string;
  type: "directory";
  path: string;
}

interface ListAllObjectsResult {
  data: (DirectoryObject | FileObject)[];
  currentPath: string;
  continuationToken?: string;
  isTruncated: boolean;
}

async function listAllObjects(
  params: ListAllObjectsParams,
): Promise<ListAllObjectsResult> {
  try {
    const { nextRootDirectory, continuationToken, maxKeys } = params;

    const s3 = new S3Client({
      region: awsCredentials.region as string,
      credentials: {
        accessKeyId: awsCredentials.accessKeyId as string,
        secretAccessKey: awsCredentials.secretAccessKey as string,
      },
    });

    const basePrefix: string =
      (awsCredentials.basePrefix as string) !== "/"
        ? (awsCredentials.basePrefix as string)
        : "";

    const prefix: string =
      nextRootDirectory && nextRootDirectory !== "/"
        ? `${nextRootDirectory}/`
        : "";

    const listParams: ListObjectsV2CommandInput = {
      Bucket: awsCredentials.s3BucketName as string,
      Delimiter: "/",
      MaxKeys: maxKeys ? parseInt(maxKeys, 10) : 1000,
      ContinuationToken: continuationToken,
      Prefix: `${basePrefix}/${prefix}`,
    };

    // Create a ListObjectsV2Command and send it to s3
    const command = new ListObjectsV2Command(listParams);
    const data: ListObjectsV2CommandOutput = await s3.send(command);

    // Process the files (objects) returned by S3
    const files: (FileObject | undefined)[] = await Promise.all(
      (data.Contents ?? []).map(async (file) => {
        const basename = file.Key?.split("/").pop() ?? "";
        const path = file.Key?.replace(`${basePrefix}/`, "") ?? "";
        const modifiedAt = file.LastModified
          ? file.LastModified.getTime()
          : null;
        const size = file.Size ?? 0;

        const mimeType = getMimeType(basename);

        // Skip files with empty basename or size 0
        if (!basename || size === 0) return undefined;

        return {
          basename,
          type: "file",
          path,
          modifiedAt,
          size,
          mimeType,
        };
      }),
    );

    // Process the directories (common prefixes) returned by S3
    const directories: DirectoryObject[] = (data.CommonPrefixes ?? [])
      .map((dir: CommonPrefix) => {
        const basename = dir.Prefix?.split("/").filter(Boolean).pop() ?? "";
        const path = dir.Prefix?.replace(`${basePrefix}/`, "") ?? "";

        // Exclude root directory if it's not a sub-directory
        if (basename === basePrefix || path === "/") return undefined;

        return {
          basename,
          type: "directory",
          path,
        };
      })
      .filter((dir): dir is DirectoryObject => !!dir);

    // Filter out undefined files
    const filteredFiles: FileObject[] = files.filter(
      (file): file is FileObject => !!file,
    );

    // Determine the current directory path
    const currentDirectoryPath =
      nextRootDirectory && nextRootDirectory !== "/" ? nextRootDirectory : "/";

    return {
      data: [...directories, ...filteredFiles],
      currentPath: currentDirectoryPath,
      continuationToken: data.NextContinuationToken,
      isTruncated: data.IsTruncated ?? false,
    };
  } catch (error) {
    console.log("ERROR: ", error);

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
}

export default {
  listAllObjects,
};
