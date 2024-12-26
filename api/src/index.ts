import app from "./app";
import { serverPort } from "./utils/env.util";

app.listen(serverPort, () => {
  console.log(`[API]: Listening at http://localhost:${serverPort}`);
});
