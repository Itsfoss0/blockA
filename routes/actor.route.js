#!/usr/bin/env node

/* Actor router for the /api/v1/actors endpoint */

const {
  userExtractor,
  tokenExtractor
} = require('../middleware/auth.middleware');

const Actor = require('../models/Actor');
const actorRouter = require('express').Router();

actorRouter.use(tokenExtractor);
actorRouter.use(userExtractor);

actorRouter.get('', async (req, res, next) => {
  try {
    const actors = await Actor.find();
    if (actors.length > 0) { return res.json({ message: 'success', data: actors }); }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

actorRouter.post('', async (req, res, next) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const newActor = new Actor({
      firstName,
      lastName,
      bio
    });
    const actor = await newActor.save();
    return res.status(201).json({ message: 'success', data: actor });
  } catch (err) {
    next(err);
  }
});

actorRouter.get('/:id', async (req, resp, next) => {
  const { id } = req.params;
  const actor = await Actor.findById(id).populate('movies', {
    title: 1,
    trailerUrl: 1,
    rating: 1,
    likes: 1,
    coverImageUrl: 1
  });

  console.log(actor);
  if (!actor) return resp.status(404).json({ error: 'not found' });
  return resp.json({ actor });
});

module.exports = actorRouter;
