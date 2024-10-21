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

    const uploadResults = await Promise.all(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      files.map(async (file: any) => {
        const fileInfo = {
          originalName: file.originalname,
          mimeType: file.mimetype,
        };

        try {
          await fileService.upload(destinationDirectory, file.path, fileInfo);

          return { file: file.originalname, status: "success" };
        } catch (
          /* eslint-disable @typescript-eslint/no-explicit-any */
          error: any
        ) {
          console.error(`Failed to upload ${file.originalname}:`, error);
          return {
            file: file.originalname,
            status: "failure",
            error: error.message,
          };
        }
      }),
    );

    return res.status(StatusCodes.OK).json({
      message: "File upload process completed.",
      results: uploadResults,
    });
  } catch (error) {
    console.error("ERROR:", error);
    next(error);
  }
};

export default {
  uploadFile,
};
