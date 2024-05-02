#!/usr/bin/env node

/* configure database */

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;

module.exports = {
  DATABASE_URL,
  PORT,
  JWT_SECRET_KEY,
  CLIENT_URL
};
