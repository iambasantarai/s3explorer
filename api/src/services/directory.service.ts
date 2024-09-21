import S3, { PutObjectRequest } from "aws-sdk/clients/s3";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import { s3Credentials } from "../utils/env.util";

const createS3Client = (): S3 => {
  return new S3({
    accessKeyId: s3Credentials.accessKeyId,
    secretAccessKey: s3Credentials.secretAccessKey,
    region: s3Credentials.region,
  });
};

const checkIfExists = async (key: string) => {
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

const create = async (params: {
  currentPath: string;
  directoryName: string;
}) => {
  try {
    const { currentPath, directoryName } = params;

    const s3 = createS3Client();
    const bucketName = s3Credentials.bucket;
    const basePrefix = s3Credentials.basePrefix;

    const destinationKey = `${basePrefix ? basePrefix + "/" : ""}${
      currentPath !== "/" ? currentPath + "/" : ""
    }`;
    const directoryKey = `${destinationKey}${directoryName}/`;

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
      message: `Directory ${directoryName} created successfully.`,
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
};
