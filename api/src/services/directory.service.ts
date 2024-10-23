import S3, { HeadObjectRequest, PutObjectRequest } from "aws-sdk/clients/s3";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import { awsCredentials } from "../utils/env.util";
import { isValidDirectoryName } from "../helper/validation.helper";

const createS3Client = (): S3 => {
  return new S3({
    accessKeyId: awsCredentials.accessKeyId,
    secretAccessKey: awsCredentials.secretAccessKey,
    region: awsCredentials.region,
  });
};

const checkIfExists = async (key: string): Promise<boolean> => {
  try {
    const s3 = createS3Client();
    const params: HeadObjectRequest = {
      Bucket: awsCredentials.s3BucketName as string,
      Key: key,
    };

    const alreadyExists = await s3.headObject(params).promise();
    return !!alreadyExists;
  } catch (error: any) {
    if (error.code === "NotFound") {
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
): Promise<S3.Object[]> => {
  const s3 = createS3Client();
  const bucketName = awsCredentials.s3BucketName;

  const objects: S3.Object[] = [];
  let continuationToken: string | undefined = undefined;

  do {
    const data: any = await s3
      .listObjectsV2({
        Bucket: bucketName as string,
        Prefix: directoryPath,
        ContinuationToken: continuationToken,
      })
      .promise();

    objects.push(...(data.Contents || []));

    continuationToken = data.NextContinuationToken;
  } while (continuationToken);

  return objects;
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
    const bucketName = awsCredentials.s3BucketName;
    const basePrefix = awsCredentials.basePrefix;

    const directoryKey = `${basePrefix ? basePrefix + "/" : ""}${
      currentPath !== "/" ? currentPath + "/" : ""
    }${directoryName}/`;

    // TODO: Should check for existance of destniation

    const directoryExists = await checkIfExists(directoryKey);
    if (directoryExists) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Directory ${directoryName} already exists.`,
      );
    }

    // Create the "directory" with an empty body and content length set to 0
    const bucketParams: PutObjectRequest = {
      Bucket: bucketName as string,
      Key: directoryKey,
      Body: "",
      ContentLength: 0,
    };

    // It might create a file with no name and of size 0
    await s3.putObject(bucketParams).promise();

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
    const bucketName = awsCredentials.s3BucketName;
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
    for (const object of objects) {
      await s3
        .deleteObject({
          Bucket: bucketName as string,
          Key: object.Key!,
        })
        .promise();
    }

    // Delete the directory itself
    await s3
      .deleteObject({
        Bucket: bucketName as string,
        Key: directoryPath,
      })
      .promise();

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
    await Promise.all(
      oldDirectoryContents.map(async (object: any) => {
        const copyParams = {
          Bucket: bucketName as string,
          CopySource: encodeURIComponent(`${bucketName}/${object.Key}`),
          Key: object.Key!.replace(oldDirectoryPath, newDirectoryPath),
        };

        await s3.copyObject(copyParams).promise();
      }),
    );

    // Delete old directory objects
    await Promise.all(
      oldDirectoryContents.map(async (object: any) => {
        await s3
          .deleteObject({
            Bucket: bucketName as string,
            Key: object.Key!,
          })
          .promise();
      }),
    );

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
