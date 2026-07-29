const express = require('express');
const app = express();
app.get('/', (req, res) => {
  req.query = { a: 1 };
  res.json({ query: req.query });
});
app.listen(3000, () => console.log('Listening on 3000'));
