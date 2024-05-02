const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
    message: '{VALUE} is already taken, try a different one'
  },
  name: {
    type: String,
    required: true,
    minLenght: 3
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  passwordHash: {
    type: String,
    required: true
  },
  movies: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Movie'
    }
  ]
});

userSchema.set('toJSON', {
  transform: (doc, returnedDoc) => {
    returnedDoc.id = returnedDoc._id.toString();
    delete returnedDoc._id;
    delete returnedDoc.__v;
    delete returnedDoc.passwordHash;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
