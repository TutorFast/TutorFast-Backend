import { Router } from 'express';
import { mapOn } from '../util';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, TOKEN_LIFE } from '../config';

const router = Router();

import cardRouter from './card';

router.use('/card', cardRouter);


router.post('/', (req, res) => {
  if (!req.body.password) {
    res.status(422).json({ err: 'Password must be present.' });
    return;
  }

  let newUser;

  const userObj = [
    'email',
    'username',
    'isTutor',
    'subjects',
    'zipCode',
    'wage',
  ].reduce(mapOn(req.body), {});

  // hash the user password for storage
  bcrypt.hash(req.body.password, 10)

    // create a user model object
    .then(
      passwordDigest =>
        newUser = new User({
          ...userObj,
          passwordDigest,
        })
    )

    // save the object to the db
    .then(user => user.save())

    // create a jwt for the new user
    .then(
      ({ _id }) =>
        jwt.sign(
          { _id },
          JWT_SECRET,
          TOKEN_LIFE,
        )
    )

    // send the token and user data back to the
    // new user
    .then(token => res.json({ token, user: newUser }))

    // if anything goes wrong send the error back
    // to the user
    .catch(err => res.status(400).json({ err }))
  ;
});

router.get('/', (req, res) => {
  res.json(req.user);
});

router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => res.json({ message: 'User retrieved successfuly.', user }))
    .catch(err => res.status(404).json({ message: 'User does not exist.', err }))
  ;
});

router.patch('/', (req, res) => {
  [
    'email',
    'username',
    'password',
    'isTutor',
    'zipCode',
    'subjects',
    'wage',
  ].reduce(mapOn(req.body), req.user);

  req.user.save()
    .then(user => res.json({ user }))
    .catch(err => res.status(400).json({ err }))
  ;
});

router.delete('/', (req, res) => {
  req.user
    .authenticate(req.body.password)
    .then(() => req.user.remove())
    .then(user => res.json({
      message: 'User deleted successfully.',
      user,
    }))
    .catch(err => res.status(400).json({ err }));
});

export default router;
