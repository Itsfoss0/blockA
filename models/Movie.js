#!/usr/bin/env node

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  cast: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Actor'
    }
  ],
  trailerUrl: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  coverImageUrl: {
    type: String,
    required: false
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
});

movieSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
