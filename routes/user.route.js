#!/usr/bin/env node

/*
 * user route for the api
 * restrict some of the paths to admin users
 * or owners of the resources
 */

const User = require('../models/User');
const {
  userExtractor,
  tokenExtractor
} = require('../middleware/auth.middleware');

const userRouter = require('express').Router();
userRouter.use(tokenExtractor);
userRouter.use(userExtractor);

userRouter.get('all/', async (req, resp, next) => {
  try {
    const users = await User.find({}).populate('movies', {
      title: 1,
      trailerUrl: 1,
      rating: 1,
      likes: 1,
      coverImageUrl: 1
    });
    // no users in the database
    if (users.length === 0) return resp.status(204).send();
    return resp.json({ data: users, message: 'success' });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/:id', async (req, resp, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate('movies', {
    title: 1,
    trailerUrl: 1,
    rating: 1,
    likes: 1,
    coverImageUrl: 1
  });
  if (!user) {
    return resp.status(404).json({ error: 'user not found' });
  }
  return resp.json({ message: 'success', data: user });
});

module.exports = userRouter;
