#!/usr/bin/env node

/* documentation for the api */

const docsRouter = require("express").Router();

docsRouter.get("", async (req, res) => {
  res.json({
    message: "Movie Database API",
    status: "OK",
  });
});

module.exports = docsRouter;
