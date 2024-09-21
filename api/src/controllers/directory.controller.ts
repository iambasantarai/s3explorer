import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import directoryService from "../services/directory.service";

const createDirectory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { currentPath, directoryName } = req.body;

    const apiResponse = await directoryService.create({
      currentPath,
      directoryName,
    });

    return res.status(StatusCodes.CREATED).json(apiResponse);
  } catch (error) {
    console.log("ERROR: ", error);
    next(error);
  }
};

export default {
  createDirectory,
};
