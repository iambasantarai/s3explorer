import S3, { PutObjectRequest } from "aws-sdk/clients/s3";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import { s3Credentials } from "../utils/env.util";
import { isValidDirectoryName } from "../helper/validation.helper";

const createS3Client = (): S3 => {
  return new S3({
    accessKeyId: s3Credentials.accessKeyId,
    secretAccessKey: s3Credentials.secretAccessKey,
    region: s3Credentials.region,
  });
};

const checkIfExists = async (key: string): Promise<boolean> => {
  try {
    const s3 = createS3Client();
    const params: S3.HeadObjectRequest = {
      Bucket: s3Credentials.bucket as string,
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
  const bucketName = s3Credentials.bucket;

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
        "Directory name can only contain letters, numbers, underscore(_) and hyphens(-).",
      );
    }

    const s3 = createS3Client();
    const bucketName = s3Credentials.bucket;
    const basePrefix = s3Credentials.basePrefix;

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

    // it might create a file with no name and of size 0
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
    const bucketName = s3Credentials.bucket;
    const basePrefix = s3Credentials.basePrefix;

    const directoryPath = `${basePrefix}/${
      currentPath !== "/" ? currentPath + "/" : ""
    }${directoryName}/`;

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

export default {
  create,
  remove,
};
