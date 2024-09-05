import S3 from "aws-sdk/clients/s3";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../utils/error.util";

const listAllObjects = async () => {
  try {
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
