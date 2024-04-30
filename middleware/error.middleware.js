#!/usr/bin/env node

/* error handling middleware */

const undefinedPathError = (req, resp, next) => {
  resp.status(404).json({
    error: "Not found",
  });
};

module.exports = {
  undefinedPathError,
};
