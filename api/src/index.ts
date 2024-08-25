import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import { generateSwaggerDocs } from "./configs/swagger.config";
import path from "path";

dotenv.config();

const PORT = parseInt(process.env.API_PORT || "8000", 10);

const app: Express = express();

// Generate swaggr docs
generateSwaggerDocs(app);
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`[API]: Listening at http://localhost:${PORT}`);
});
