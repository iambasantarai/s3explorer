import { Application, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "s3explorer",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"],
};

const openAPISpecification = swaggerJsdoc(options);

export const generateSwaggerDocs = async (app: Application) => {
  app.use(
    "/api/docs/explorer",
    swaggerUI.serve,
    swaggerUI.setup(openAPISpecification),
  );

  app.get("/api/docs/openapi.json", (_req: Request, res: Response) => {
    res.setHeader("Content-type", "application/json");
    res.send(openAPISpecification);
  });
};
