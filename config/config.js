#!/usr/bin/env node

/* configure database */

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

module.exports = {
  DATABASE_URL,
  PORT,
};
