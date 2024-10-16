import { Request, Response, NextFunction } from "express";
import fileService from "../services/file.service";
import { CustomError } from "../errors/custom.error";
import { StatusCodes } from "http-status-codes";

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req;
    const { destinationDirectory } = req.body;

    if (!file)
      throw new CustomError(StatusCodes.BAD_REQUEST, "No file provided.");

    const fileInfo = {
      originalName: file.originalname,
      mimeType: file.mimetype,
    };

    const uploadResult = await fileService.upload(
      destinationDirectory,
      file.path,
      fileInfo,
    );

    return res.status(StatusCodes.OK).json({
      message: "File has been uploaded.",
      data: uploadResult.Location,
    });
  } catch (error) {
    console.log("ERROR: ", error);
    next(error);
  }
};

export default {
  uploadFile,
};
