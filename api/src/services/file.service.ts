import { createReadStream } from "node:fs";
import S3 from "aws-sdk/clients/s3";
import { awsCredentials } from "../utils/env.util";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import fileOperationHelper from "../helper/fileOperation.helper";

type TFileInfo = {
  originalName: string;
  mimeType: string;
};

const createS3Client = (): S3 => {
  return new S3({
    accessKeyId: awsCredentials.accessKeyId,
    secretAccessKey: awsCredentials.secretAccessKey,
    region: awsCredentials.region,
  });
};

const upload = async (
  destinationDirectory: string,
  filePath: string,
  fileInfo: TFileInfo,
) => {
  try {
    const s3 = createS3Client();

    const fileStream = createReadStream(filePath);

    let fileKey = `${awsCredentials.basePrefix}${
      destinationDirectory !== "/" ? `/${destinationDirectory}` : ""
    }/${fileInfo.originalName}`;

    const uploadParams = {
      Bucket: awsCredentials.s3BucketName as string,
      ContentType: fileInfo.mimeType,
      Key: fileKey,
      Body: fileStream,
    };

    const data = await s3.upload(uploadParams).promise();

    await fileOperationHelper.removeFile(filePath);

    return data;
  } catch (error) {
    console.log("ERROR: ", error);

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

export default {
  upload,
};
