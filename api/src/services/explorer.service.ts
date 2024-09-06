import S3 from "aws-sdk/clients/s3";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";
import { s3Credentials } from "../utils/env.util";

const listAllObjects = async () => {
  try {
    const s3 = new S3({
      accessKeyId: s3Credentials.accessKeyId,
      secretAccessKey: s3Credentials.secretAccessKey,
      region: s3Credentials.region,
    });
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
