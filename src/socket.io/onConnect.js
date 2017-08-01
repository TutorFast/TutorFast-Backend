
import User from '../models/User';
import { pjwt, pipe } from '../util';
import { JWT_SECRET } from '../config';


export default socket =>
  socket.on('auth', (socketId, token, cb) => {
    pjwt.verify(token, JWT_SECRET)
      .then(({ _id }) => User.findOne({ _id }))
      .then(user => user ? user : Promise.reject())
      .then(pipe(user => user.socketId = socketId))
      .then(user => user.save())
      .then(() => cb(undefined, 'authed'))
      .catch(cb)
    ;
  });

