import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.API_PORT || "8000", 10);

const app: Express = express();

app.get("/heartbeat", (_req: Request, res: Response) => {
  const hrtime = process.hrtime.bigint();
  res.status(200).json({ heartbeat: hrtime.toString() });
});

app.listen(PORT, () => {
  console.log(`[API]: Listening at http://localhost:${PORT}`);
});
