#!/usr/bin/env node

/* error handling middleware */

const undefinedPathHandler = (req, res) => {
  return res.status(404).json({ error: 'URL not found' });
};

module.exports = {
  undefinedPathHandler
};
