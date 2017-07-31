import io from './index.js';
import User from '../models/User';
import { pjwt } from '../util';
import { JWT_SECRET } from '../config';


io.on('auth', (socketId, token, cb) =>
  pjwt.verify
    .then(token, JWT_SECRET)
    .then(({ _id }) => User.findOne({ _id }))
    .then(user => user ? user : Promise.reject())
    .then(user => user.socketId = socketId)
    .then(user => user.save())
    .then(() => cb(undefined, 'authed'))
    .catch(cb)
);
