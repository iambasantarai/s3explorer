const express = require('express');
const PORT = 6942;

const app = express();

app.get('/heartbeat', (_req, res) => {
  const hrtime = process.hrtime.bigint();

  res.status(200).json({ heartbeat: hrtime.toString() });
});

app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});
