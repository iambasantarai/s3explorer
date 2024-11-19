import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject } from "zod";

export const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        files: req.files,
      });

      next();
    } catch (
      /* eslint-disable @typescript-eslint/no-explicit-any */
      error: any
    ) {
      res.status(StatusCodes.BAD_REQUEST).json(error.errors);
    }
  };
