import db from '../db';
import bcrypt from 'bcrypt';
import { JWT_SECRET, TOKEN_LIFE } from '../config';
import { pjwt } from '../util';
import { io } from '../socket.io';

export const userSchema = db.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  passwordDigest: {
    type: String,
    required: true,
  },

  isTutor: {
    type: Boolean,
    default: false,
  },

  subjects: [String],

  zipCode: {
    type: Number,
    default: null,
  },

  wage: {
    type: Number,
    default: 0,
  },

  card: String,

  account: String,

  socketId: String,
});

userSchema.set('toObject', {
  transform: (_, ret) => {
    delete ret.passwordDigest;
    delete ret.__v;
  },
});

userSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.passwordDigest;
    delete ret.__v;
  },
});

userSchema.methods.authenticate = function (password) {
  return bcrypt.compare(password, this.passwordDigest)

    // reject if comare fails and produce a token on success.
    .then(match => match
      ? pjwt.sign({ _id: this._id }, JWT_SECRET, TOKEN_LIFE)
      : Promise.reject('Password mismatch.')
    )
  ;
};

userSchema.methods.send = function (...args) {
  if (this.socketId)
    io.to(this.socketId).emit(...args);
};

export default db.model('User', userSchema);
