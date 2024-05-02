#!/usr/bin/env node

/* main application for the api */

const express = require("express");
const cors = require("cors");
const { DATABASE_URL } = require("./config/config");
const connectDB = require("./db/db");
const authRouter = require("./auth/auth");
const actorRouter = require("./routes/actor.route");
const docsRouter = require("./docs/docs");
const moviesRouter = require("./routes/movie.route");
const userRouter = require("./routes/user.route");
statusRouter = require("./routes/status.route");
const { undefinedPathHandler } = require("./middleware/error.middleware");
const logger = require("./logging/logger");

connectDB(DATABASE_URL);

const api = express();
api.use(express.json());
api.use(cors());
api.use(logger);
api.use("/api/v1", docsRouter);
api.use("/api/v1/status", statusRouter);
api.use("/api/v1/auth", authRouter);
api.use("/api/v1/actors", actorRouter);
api.use("/api/v1/movies", moviesRouter);
api.use("/api/v1/users", userRouter);
api.use(undefinedPathHandler);

module.exports = api;
