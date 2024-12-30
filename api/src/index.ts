import app from "./app";
import { serverPort } from "./utils/env.util";
import logger from "./utils/log.util";

app.listen(serverPort, () => {
  logger.info(`[API]: Listening at http://localhost:${serverPort}`);
});
