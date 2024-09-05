import express, { Express, NextFunction, Request, Response } from "express";
import routes from "./routes";
import { generateSwaggerDocs } from "./configs/swagger.config";
import path from "path";
import morgan from "morgan";

import { serverPort } from "./utils/env.util";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
import { CustomError } from "./errors/custom.error";
import { StatusCodes } from "http-status-codes";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("short"));

// Generate swaggr docs
generateSwaggerDocs(app);
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.use("/api", routes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  throw new CustomError(
    StatusCodes.NOT_FOUND,
    `Can't find ${req.originalUrl} in the server!`,
  );
});

app.use(errorHandlerMiddleware);

app.listen(serverPort, () => {
  console.log(`[API]: Listening at http://localhost:${serverPort}`);
});
