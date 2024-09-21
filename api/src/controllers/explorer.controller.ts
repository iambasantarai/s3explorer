import { Request, Response, NextFunction } from "express";
import explorerService from "../services/explorer.service";
import { StatusCodes } from "http-status-codes";

const listAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nextRootDirectory = req.query.nextRootDirectory as string;
    const continuationToken = req.query.continuationToken as string | undefined;
    const maxKeys = req.query.maxKeys as string | undefined;

    const apiResponse = await explorerService.listAllObjects({
      nextRootDirectory,
      continuationToken,
      maxKeys,
    });

    return res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    console.log("ERROR: ", error);
    next(error);
  }
};

export default {
  listAll,
};
