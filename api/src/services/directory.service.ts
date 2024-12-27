import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
  _Object as S3Object,
} from "@aws-sdk/client-s3";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import { awsCredentials } from "../utils/env.util";
import { isValidDirectoryName } from "../helper/validation.helper";

const createS3Client = (): S3Client => {
  return new S3Client({
    credentials: {
      accessKeyId: awsCredentials.accessKeyId as string,
      secretAccessKey: awsCredentials.secretAccessKey as string,
    },
    region: awsCredentials.region as string,
  });
};

export const checkIfExists = async (key: string): Promise<boolean> => {
  try {
    const s3 = createS3Client();
    const alreadyExists = await s3.send(
      new HeadObjectCommand({
        Bucket: awsCredentials.s3BucketName as string,
        Key: key,
      }),
    );

    return !!alreadyExists;
  } catch (
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error: any
  ) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }

    console.log("ERROR: ", error);
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

const listFromCurrentPath = async (
  directoryPath: string,
): Promise<S3Object[]> => {
  try {
    const s3 = createS3Client();

    const objects: S3Object[] = [];
    let continuationToken: string | undefined = undefined;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: awsCredentials.s3BucketName,
        Prefix: directoryPath,
        ContinuationToken: continuationToken,
      });

      const data: ListObjectsV2CommandOutput = await s3.send(listCommand);

      objects.push(...(data.Contents || []));

      continuationToken = data.NextContinuationToken;
    } while (continuationToken);

    return objects;
  } catch (error: any) {
    console.error("ERROR: ", error);

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

const create = async (params: {
  currentPath: string;
  directoryName: string;
}) => {
  try {
    const { currentPath, directoryName } = params;

    if (!isValidDirectoryName(directoryName)) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Directory name contains invalid characters.",
      );
    }

    const s3 = createS3Client();
    const basePrefix = awsCredentials.basePrefix;

    const directoryKey = `${basePrefix ? `${basePrefix}/` : ""}${
      currentPath !== "/" ? `${currentPath}/` : ""
    }${directoryName}/`;

    const directoryExists = await checkIfExists(directoryKey);
    if (directoryExists) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Directory ${directoryName} already exists.`,
      );
    }

    // It might create a file with no name and of size 0
    const putCommand = new PutObjectCommand({
      Bucket: awsCredentials.s3BucketName as string,
      Key: directoryKey,
      Body: "",
      ContentLength: 0,
    });

    await s3.send(putCommand);

    return {
      message: `Directory ${directoryName} has been created successfully.`,
    };
  } catch (error) {
    console.log("ERROR: ", error);

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

const remove = async (params: {
  currentPath: string;
  directoryName: string;
}) => {
  try {
    const { currentPath, directoryName } = params;

    if (!isValidDirectoryName(directoryName)) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Directory name can only contain letters, numbers, underscore(_) and hyphens(-).",
      );
    }

    const s3 = createS3Client();
    const basePrefix = awsCredentials.basePrefix;

    const directoryPath = `${basePrefix}/${
      currentPath !== "/" ? currentPath + "/" : ""
    }${directoryName}/`;

    const directoryExists = await checkIfExists(directoryPath);
    if (!directoryExists) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Directory named ${directoryName} doesn't exists.`,
      );
    }

    const objects = await listFromCurrentPath(directoryPath);

    // Delete each object (file or directory) individually
    const deletePromises = objects.map((object) => {
      if (!object.Key) return Promise.resolve();
      const deleteCommand = new DeleteObjectCommand({
        Bucket: awsCredentials.s3BucketName as string,
        Key: object.Key,
      });

      return s3.send(deleteCommand);
    });

    await Promise.all(deletePromises);

    // Delete the directory itself
    const deleteDirectoryCommand = new DeleteObjectCommand({
      Bucket: awsCredentials.s3BucketName as string,
      Key: directoryPath,
    });
    await s3.send(deleteDirectoryCommand);

    return {
      message: `${directoryName} directory has been deleted successfully.`,
    };
  } catch (error) {
    console.log("ERROR: ", error);

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

const update = async (params: {
  currentPath: string;
  oldDirectoryName: string;
  newDirectoryName: string;
}) => {
  try {
    const { currentPath, oldDirectoryName, newDirectoryName } = params;

    if (!isValidDirectoryName(oldDirectoryName)) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Directory name can only contain letters, numbers, underscores (_), and hyphens (-).",
      );
    }

    if (!isValidDirectoryName(newDirectoryName)) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Directory name can only contain letters, numbers, underscores (_), and hyphens (-).",
      );
    }

    const s3 = createS3Client();
    const bucketName = awsCredentials.s3BucketName;
    const basePrefix = awsCredentials.basePrefix;

    // TODO: More clarity needed
    const oldDirectoryPath = `${basePrefix}/${
      currentPath !== "/" ? currentPath + "/" : ""
    }${oldDirectoryName}/`;

    const newDirectoryPath = `${basePrefix}/${
      currentPath !== "/" ? currentPath + "/" : ""
    }${newDirectoryName}/`;

    const oldDirectoryExists = await checkIfExists(oldDirectoryPath);
    if (!oldDirectoryExists) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Directory named ${oldDirectoryName} doesn't exist.`,
      );
    }

    const newDirectoryExists = await checkIfExists(newDirectoryPath);
    if (newDirectoryExists) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Directory named ${newDirectoryName} already exists.`,
      );
    }

    // Move files from old directory to new directory
    const oldDirectoryContents = await listFromCurrentPath(oldDirectoryPath);

    const copyPromises = oldDirectoryContents.map((object) => {
      if (!object.Key) return Promise.resolve();
      const newKey = object.Key.replace(oldDirectoryPath, newDirectoryPath);
      const copyCommand = new CopyObjectCommand({
        Bucket: awsCredentials.s3BucketName as string,
        CopySource: `${awsCredentials.s3BucketName}/${encodeURIComponent(object.Key)}`,
        Key: newKey,
      });
      return s3.send(copyCommand);
    });

    await Promise.all(copyPromises);

    // Delete old directory objects
    const deletePromises = oldDirectoryContents.map((object) => {
      if (!object.Key) return Promise.resolve();
      const deleteCommand = new DeleteObjectCommand({
        Bucket: awsCredentials.s3BucketName as string,
        Key: object.Key,
      });
      return s3.send(deleteCommand);
    });

    await Promise.all(deletePromises);

    const deleteOldDirectoryCommand = new DeleteObjectCommand({
      Bucket: awsCredentials.s3BucketName as string,
      Key: oldDirectoryPath,
    });
    await s3.send(deleteOldDirectoryCommand);

    return {
      message: `${oldDirectoryName} has been updated to ${newDirectoryName} successfully.`,
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
  create,
  remove,
  update,
};
