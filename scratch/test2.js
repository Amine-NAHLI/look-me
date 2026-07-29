const express = require('express');
const app = express();
app.get('/', (req, res) => {
  console.log('typeof req.query.limit before', typeof req.query.limit);
  req.query.limit = 24;
  console.log('typeof req.query.limit after', typeof req.query.limit);
  res.json({ limit: req.query.limit, type: typeof req.query.limit });
});
app.listen(3000, () => console.log('Listening on 3000'));
