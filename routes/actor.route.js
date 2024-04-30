#!/usr/bin/env node

/* Actor router for the /api/v1/actors endpoint */

const Actor = require("../models/Actor");
const actorRouter = require("express").Router();

actorRouter.get("", async (req, res) => {
  return res
    .status(200)
    .json({ message: "success", payload: ["actor1", "actor2"] });
});

module.exports = actorRouter;
