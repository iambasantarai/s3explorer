import { createReadStream } from "node:fs";
import S3 from "aws-sdk/clients/s3";
import { awsCredentials } from "../utils/env.util";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import fileOperationHelper from "../helper/fileOperation.helper";

const createS3Client = (): S3 => {
  return new S3({
    accessKeyId: awsCredentials.accessKeyId,
    secretAccessKey: awsCredentials.secretAccessKey,
    region: awsCredentials.region,
  });
};

const upload = async (
  destinationDirectory: string,
  files: Express.Multer.File[],
) => {
  try {
    const s3 = createS3Client();

    const uploadResults = await Promise.all(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      files.map(async (file: any) => {
        const fileKey = `${awsCredentials.basePrefix}${
          destinationDirectory !== "/" ? `/${destinationDirectory}` : ""
        }/${file.originalname}`;

        // Check if the file already exists
        try {
          await s3
            .headObject({
              Bucket: awsCredentials.s3BucketName as string,
              Key: fileKey,
            })
            .promise();
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            `A file with the name ${file.originalname} already exists in ${destinationDirectory}.`,
          );
        } catch (
          /* eslint-disable @typescript-eslint/no-explicit-any */
          error: any
        ) {
          if (error.code !== "NotFound") {
            throw error;
          }
        }

        const fileStream = createReadStream(file.path);
        const uploadParams = {
          Bucket: awsCredentials.s3BucketName as string,
          ContentType: file.mimetype,
          Key: fileKey,
          Body: fileStream,
        };

        const data = await s3.upload(uploadParams).promise();

        // Remove the local file after successful upload
        await fileOperationHelper.removeFile(file.path);

        return {
          message: `${file.originalname} has been uploaded successfully.`,
          fileUrl: data.Location,
        };
      }),
    );

    return uploadResults;
  } catch (error) {
    console.error("ERROR:", error);

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

const update = async (
  destinationDirectory: string,
  oldFileName: string,
  newFileName: string,
) => {
  try {
    const s3 = createS3Client();

    const oldKey = `${awsCredentials.basePrefix}${
      destinationDirectory !== "/" ? `/${destinationDirectory}` : ""
    }/${oldFileName}`;

    const newKey = `${awsCredentials.basePrefix}${
      destinationDirectory !== "/" ? `/${destinationDirectory}` : ""
    }/${newFileName}`;

    // Check if the old file exists
    await s3
      .headObject({
        Bucket: awsCredentials.s3BucketName as string,
        Key: oldKey,
      })
      .promise();

    // Ensure the new file name doesn't already exist
    try {
      await s3
        .headObject({
          Bucket: awsCredentials.s3BucketName as string,
          Key: newKey,
        })
        .promise();
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `A file with the name ${newFileName} already exists in ${destinationDirectory}.`,
      );
    } catch (
      /* eslint-disable @typescript-eslint/no-explicit-any */
      error: any
    ) {
      if (error.code !== "NotFound") {
        throw error;
      }
    }

    // Rename the file by copying and deleting the old one
    await s3
      .copyObject({
        Bucket: awsCredentials.s3BucketName as string,
        CopySource: `/${awsCredentials.s3BucketName}/${oldKey}`,
        Key: newKey,
      })
      .promise();

    // After successful copy, delete the old file
    await s3
      .deleteObject({
        Bucket: awsCredentials.s3BucketName as string,
        Key: oldKey,
      })
      .promise();

    return {
      message: `${oldFileName} has been renamed to ${newFileName} successfully.`,
    };
  } catch (
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error: any
  ) {
    console.error("ERROR:", error);

    if (error.code === "NotFound") {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `The file ${oldFileName} was not found in ${destinationDirectory}.`,
      );
    }

    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

const remove = async (filePaths: string[]) => {
  try {
    const s3 = createS3Client();

    const deletePromises = filePaths.map(async (filePath) => {
      const deleteParams = {
        Bucket: awsCredentials.s3BucketName as string,
        Key: `${awsCredentials.basePrefix}/${filePath}`,
      };

      try {
        await s3.deleteObject(deleteParams).promise();
        return { filePath, status: "deleted" };
      } catch (error) {
        console.error(`Failed to delete ${filePath}:`, error);
        return { filePath, status: "failed", error: getErrorMessage(error) };
      }
    });

    const results = await Promise.all(deletePromises);

    const deletedFiles = results.filter(
      (result) => result.status === "deleted",
    ).length;

    return {
      message: `${deletedFiles} file(s) have been deleted.`,
      results,
    };
  } catch (error) {
    console.error("ERROR:", error);
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
};

export default {
  upload,
  update,
  remove,
};
