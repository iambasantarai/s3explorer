import { Request, Response, NextFunction } from "express";
import explorerService from "../services/explorer.service";

const listAllObjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { nextRootDirectory, continuationToken, maxKeys } = req.params;

    const apiResponse = await explorerService.listAllObjects();

    return res.json(apiResponse);
  } catch (error) {
    console.log("ERROR: ", error);
    next(error);
  }
};

export default {
  listAllObjects,
};
