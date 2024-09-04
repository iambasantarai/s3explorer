import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = async (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let displayedError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    message: error.message,
    stack: error.stack,
  };

  res.setHeader("Content-Type", "application/json");
  res.status(displayedError.statusCode).json(displayedError);
};

export default errorHandlerMiddleware;
