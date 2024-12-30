import { Request, Response, NextFunction } from "express";
import fileService from "../services/file.service";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/log.util";

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { files } = req;
    const { directory } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "No file provided.");
    }

    const apiResponse = await fileService.upload(directory, files);

    return res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    logger.error("ERROR: ", error);

    next(error);
  }
};

const updateFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { directory, oldFileName, newFileName } = req.body;

    const apiResponse = await fileService.update(
      directory,
      oldFileName,
      newFileName,
    );

    return res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    logger.error("ERROR: ", error);

    next(error);
  }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { directory, files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      throw new CustomError(StatusCodes.BAD_REQUEST, "No file paths provided.");
    }

    const apiResponse = await fileService.remove(directory, files);

    return res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    logger.error("ERROR: ", error);

    next(error);
  }
};

export default {
  uploadFile,
  updateFile,
  deleteFile,
};
