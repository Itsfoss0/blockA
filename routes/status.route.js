#!/usr/bin/env node

/* status of the api */

const statusRouter = require("express").Router();

statusRouter.get("", (req, res) => {
  return res.json({ status: "OK" });
});

module.exports = statusRouter;
