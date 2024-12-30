import { Request, Response, NextFunction } from "express";
import explorerService from "../services/explorer.service";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/log.util";

async function listAll(req: Request, res: Response, next: NextFunction) {
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
    logger.error("ERROR: ", error);

    next(error);
  }
}

export default {
  listAll,
};
