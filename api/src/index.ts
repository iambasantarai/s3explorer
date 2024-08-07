import express, {
  type Application,
  type Request,
  type Response
} from 'express';
const PORT = 6942;

const app: Application = express();

app.get('/heartbeat', (_req: Request, res: Response) => {
  const hrtime = process.hrtime.bigint();

  res.status(200).json({ heartbeat: hrtime.toString() });
});

app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});
