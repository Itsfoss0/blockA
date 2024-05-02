#!/usr/bin/env node

/* module for defining custom exceptions */

class InvalidLoginCredentials extends Error {
  constructor (message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 401;
    Error.captureStackTrace(this, this.constructor);
  }
}

class WrongPermissions extends Error {
  constructor (message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 403;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  InvalidLoginCredentials,
  WrongPermissions
};
