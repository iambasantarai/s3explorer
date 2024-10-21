import { Request, Response, NextFunction } from "express";
import fileService from "../services/file.service";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { files } = req;
    const { destinationDirectory } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "No file provided.");
    }

    const apiResponse = await fileService.upload(destinationDirectory, files);

    return res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    console.error("ERROR:", error);
    next(error);
  }
};

const updateFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationDirectory, oldFileName, newFileName } = req.body;

    const apiResponse = await fileService.update(
      destinationDirectory,
      oldFileName,
      newFileName,
    );

    return res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    console.error("ERROR:", error);
    next(error);
  }
};

export default {
  uploadFile,
  updateFile,
};
