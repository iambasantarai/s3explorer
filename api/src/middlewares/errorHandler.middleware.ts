import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";

// we need eslint because we have to pass next arg for the error middleware
async function errorHandlerMiddleware(
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  const displayedError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    message: error.message,
    stack: error.stack,
  };

  res.setHeader("Content-Type", "application/json");
  res.status(displayedError.statusCode).json(displayedError);
}

export default errorHandlerMiddleware;
