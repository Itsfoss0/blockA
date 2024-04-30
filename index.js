#!/usr/bin/env node

/* entry point to the api */

const api = require("./api");
const { PORT } = require("./config/config");

api.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
