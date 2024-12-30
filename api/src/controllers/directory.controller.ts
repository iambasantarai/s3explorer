import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import directoryService from "../services/directory.service";
import logger from "../utils/log.util";

async function createDirectory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { currentPath, directoryName } = req.body;

    const apiResponse = await directoryService.create({
      currentPath,
      directoryName,
    });

    return res.status(StatusCodes.CREATED).json(apiResponse);
  } catch (error) {
    logger.error("ERROR: ", error);

    next(error);
  }
}

async function deleteDirectory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { currentPath, directoryName } = req.body;

    const apiResponse = await directoryService.remove({
      currentPath,
      directoryName,
    });

    return res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    logger.error("ERROR: ", error);

    next(error);
  }
}

async function updateDirectory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { currentPath, oldDirectoryName, newDirectoryName } = req.body;

    const apiResponse = await directoryService.update({
      currentPath,
      oldDirectoryName,
      newDirectoryName,
    });

    return res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    logger.error("ERROR: ", error);

    next(error);
  }
}

export default {
  createDirectory,
  deleteDirectory,
  updateDirectory,
};
