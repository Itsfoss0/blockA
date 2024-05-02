#!/usr/bin/env node

/* configure the database */

const mongoose = require('mongoose');

const connectDB = async (DATABASE_URL) => {
  await mongoose.connect(DATABASE_URL);
  console.log(`Connected to database at ${DATABASE_URL}`);
};

module.exports = connectDB;
