require('dotenv').config();
const { createApp } = require('../app');
const { connectDatabase } = require('../config/db');

const app = createApp();
let dbConnected = false;

app.use(async (req, res, next) => {
  if (!dbConnected) {
    await connectDatabase();
    dbConnected = true;
  }
  next();
});

module.exports = app;
