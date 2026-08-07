require('dotenv').config();
const { createApp } = require('../app');
const { connectDatabase } = require('../config/db');

const app = createApp();
let connection;

module.exports = async (req, res) => {
  connection ||= connectDatabase();
  await connection;
  return app(req, res);
};
