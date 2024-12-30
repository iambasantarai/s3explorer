import { createReadStream } from "node:fs";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { awsCredentials } from "../utils/env.util";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import fileOperationHelper from "../helper/fileOperation.helper";
import { isValidDirectoryName } from "../helper/validation.helper";
import directoryService from "./directory.service";

function createS3Client(): S3Client {
  return new S3Client({
    credentials: {
      accessKeyId: awsCredentials.accessKeyId as string,
      secretAccessKey: awsCredentials.secretAccessKey as string,
    },
    region: awsCredentials.region as string,
  });
}

async function upload(directory: string, files: Express.Multer.File[]) {
  try {
    const s3 = createS3Client();

    const uploadResults = await Promise.all(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      files.map(async (file: any) => {
        const fileKey = `${awsCredentials.basePrefix}${
          directory !== "/" ? `/${directory}` : ""
        }/${file.originalname}`;

        // Check if the file already exists
        try {
          await s3.send(
            new HeadObjectCommand({
              Bucket: awsCredentials.s3BucketName as string,
              Key: fileKey,
            }),
          );

          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            `A file with the name ${file.originalname} already exists in ${directory}.`,
          );
        } catch (
          /* eslint-disable @typescript-eslint/no-explicit-any */
          error: any
        ) {
          if (
            error.name !== "NotFound" &&
            error.$metadata?.httpStatusCode !== 404
          ) {
            throw error;
          }
        }

        const fileStream = createReadStream(file.path);
        const uploadParams = new PutObjectCommand({
          Bucket: awsCredentials.s3BucketName as string,
          ContentType: file.mimetype,
          Key: fileKey,
          Body: fileStream,
        });

        await s3.send(uploadParams);

        // Remove the local file after successful upload
        await fileOperationHelper.removeFile(file.path);

        return {
          message: `${file.originalname} has been uploaded successfully.`,
          fileUrl: `https://${awsCredentials.s3BucketName}.s3.${awsCredentials.region}.amazonaws.com/${fileKey}`,
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
}

async function update(
  directory: string,
  oldFileName: string,
  newFileName: string,
) {
  try {
    const s3 = createS3Client();

    const oldKey = `${awsCredentials.basePrefix}${
      directory !== "/" ? `/${directory}` : ""
    }/${oldFileName}`;

    const newKey = `${awsCredentials.basePrefix}${
      directory !== "/" ? `/${directory}` : ""
    }/${newFileName}`;

    // Check if the old file exists
    await s3.send(
      new HeadObjectCommand({
        Bucket: awsCredentials.s3BucketName,
        Key: oldKey,
      }),
    );

    // Ensure the new file name doesn't already exist
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: awsCredentials.s3BucketName,
          Key: newKey,
        }),
      );

      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `A file with the name ${newFileName} already exists in ${directory}.`,
      );
    } catch (
      /* eslint-disable @typescript-eslint/no-explicit-any */
      error: any
    ) {
      if (
        error.name !== "NotFound" &&
        error.$metadata?.httpStatusCode !== 404
      ) {
        throw error;
      }
    }

    // Rename the file by copying and deleting the old one
    await s3.send(
      new CopyObjectCommand({
        Bucket: awsCredentials.s3BucketName as string,
        CopySource: `/${awsCredentials.s3BucketName}/${oldKey}`,
        Key: newKey,
      }),
    );

    // After successful copy, delete the old file
    await s3.send(
      new DeleteObjectCommand({
        Bucket: awsCredentials.s3BucketName as string,
        Key: oldKey,
      }),
    );

    return {
      message: `${oldFileName} has been renamed to ${newFileName} successfully.`,
    };
  } catch (
    /* eslint-disable @typescript-eslint/no-explicit-any */
    error: any
  ) {
    console.error("ERROR:", error);

    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `The file ${oldFileName} was not found in ${directory}.`,
      );
    }
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getErrorMessage(error),
    );
  }
}

async function remove(directory: string, files: string[]) {
  try {
    if (!isValidDirectoryName(directory)) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Destination directory name contains invalid characters.",
      );
    }

    const s3 = createS3Client();

    const directoryKey: string = `${awsCredentials.basePrefix}/${directory}/`;
    const directoryExists = await directoryService.checkIfExists(directoryKey);
    if (!directoryExists) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        `Destination directory ${directory} does not exist.`,
      );
    }

    const deletePromises = files.map(async (file) => {
      const deleteParams = {
        Bucket: awsCredentials.s3BucketName as string,
        Key: `${awsCredentials.basePrefix}/${directory ? directory + "/" : ""}${file}`,
      };

      try {
        await s3.send(new DeleteObjectCommand(deleteParams));

        return { file, status: "deleted" };
      } catch (error) {
        console.error(`Failed to delete ${file}:`, error);
        return { file, status: "failed", error: getErrorMessage(error) };
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
}

export default {
  upload,
  update,
  remove,
};
