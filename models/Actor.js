const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profileAvatar: {
    type: String,
    default: 'https://github.com/Itsfoss0.png',
    required: false
  },
  bio: {
    type: String
  },
  movies: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Movie'
    }
  ]
});

actorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
