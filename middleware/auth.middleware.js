#!/usr/bin/env node

/* user auth middleware module */

const { JWT_SECRET_KEY } = require('../config/config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenExtractor = (req, resp, next) => {
  if (req.method === 'GET') return next();
  const auth = req.get('authorization').replace('Bearer ', '');
  req.auth = auth;
  return next();
};

const userExtractor = async (req, resp, next) => {
  if (req.method === 'GET') return next();
  try {
    const decodedToken = jwt.verify(req.auth, JWT_SECRET_KEY);
    const user = await User.findById(decodedToken.userId);
    if (user) {
      req.user = user;
      return next();
    }
    req.user = null;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  tokenExtractor,
  userExtractor
};
