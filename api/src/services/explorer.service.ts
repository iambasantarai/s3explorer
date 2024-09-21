import S3 from "aws-sdk/clients/s3";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import { s3Credentials } from "../utils/env.util";
import { getMimeType } from "../utils/mimeType.util";

const listAllObjects = async (params: {
  nextRootDirectory: string;
  continuationToken?: string;
  maxKeys?: string;
}) => {
  try {
    const { nextRootDirectory, continuationToken, maxKeys } = params;

    const s3 = new S3({
      accessKeyId: s3Credentials.accessKeyId,
      secretAccessKey: s3Credentials.secretAccessKey,
      region: s3Credentials.region,
    });

    let basePrefix: string = "";
    if (s3Credentials.basePrefix !== "/") {
      basePrefix = s3Credentials.basePrefix!;
    }

    const bucketParams: S3.ListObjectsV2Request = {
      Bucket: s3Credentials.bucket!,
      Delimiter: "/",
      MaxKeys: maxKeys ? parseInt(maxKeys, 10) : 1000,
      ContinuationToken: continuationToken,
    };

    const prefix =
      nextRootDirectory && nextRootDirectory !== "/"
        ? `${nextRootDirectory}/`
        : "";

    const listParams = Object.assign(bucketParams, {
      Prefix: `${basePrefix}/${prefix}`,
    });

    const data = await s3
      .listObjectsV2(listParams as S3.ListObjectsV2Request)
      .promise();

    const files = await Promise.all(
      (data.Contents ?? [])
        .map(async (file) => {
          const basename = file.Key?.split("/").pop() ?? "";
          const path = `${file.Key?.replace(basePrefix + "/", "") ?? ""}`;
          const modifiedAt = file.LastModified?.getTime() ?? null;
          const size = file.Size ?? 0;

          const mimeType = getMimeType(basename);

          // Skip files with empty basename or size 0
          if (!basename || size === 0) return;

          return {
            basename,
            type: "file",
            path,
            modifiedAt,
            size,
            mimeType,
          };
        })
        .filter(Boolean),
    );

    const directories =
      data.CommonPrefixes?.map((dir) => {
        const basename = dir.Prefix?.split("/").filter(Boolean).pop() ?? "";
        const path = `${dir.Prefix?.replace(basePrefix + "/", "") ?? ""}`;

        // Exclude root directory if it's not a sub-directory
        if (basename === basePrefix || path === "/") return;

        return {
          basename,
          type: "directory",
          path,
        };
      })?.filter(Boolean) ?? [];

    // Filter out falsy values
    const filteredFiles = files.filter((file) => file);

    const currentDirectoryPath =
      nextRootDirectory && nextRootDirectory !== "/"
        ? `${nextRootDirectory}`
        : "/";

    return {
      data: [...directories, ...filteredFiles],
      currentPath: currentDirectoryPath,
      continuationToken: data.NextContinuationToken,
      isTruncated: data.IsTruncated,
    };
  } catch (error) {
    console.log("ERROR: ", error);

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

export default {
  listAllObjects,
};
