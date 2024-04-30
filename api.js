#!/usr/bin/env node

/* main application for the api */

const express = require("express");
const cors = require("cors");
const { DATABASE_URL } = require("./config/config");
const connectDB = require("./db/db");
const actorRouter = require("./routes/actor.route");
const docsRouter = require("./docs/docs");
const { undefinedPathError } = require("./middleware/error.middleware");

connectDB(DATABASE_URL);

const api = express();
api.use(express.json());
api.use(cors());
api.use("/api/v1", docsRouter);
api.use("/api/v1/actors", actorRouter);
api.use(undefinedPathError);
module.exports = api;
