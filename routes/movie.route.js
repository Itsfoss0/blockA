#!/usr/bin/env node

/* Movies route */

const {
  userExtractor,
  tokenExtractor
} = require('../middleware/auth.middleware');
const Movie = require('../models/Movie');

const moviesRouter = require('express').Router();

moviesRouter.use(tokenExtractor);
moviesRouter.use(userExtractor);

moviesRouter.get('', async (req, resp, next) => {
  const limit = req.query.limit
  const movies = await Movie.find();
  try {
    if (movies.length > 0) return resp.json({ movies });
    return resp.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = moviesRouter;
