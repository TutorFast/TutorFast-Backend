import User from '../models/User';
import { pjwt } from '../util';
import { JWT_SECRET } from '../config';


export default (req, res, next) => {
  if (isWhitelistedRequest(req)) {
    next();
    return;
  }

  const token = isStripeRedirect(req)
    ? req.query && req.query.state
    : req.headers.authorization
  ;

  // reject if no token
  if (!token) {
    console.log('no token given to auth.');
    res.status(401).json({ err: 'Auth required.' });
    return;
  }

  pjwt
    // verifty the server signed the token
    .verify(token, JWT_SECRET)

    // get the user with the use id from the db
    .then(({ _id }) => User.findOne({ _id }))

    // if no user was found reject
    .then(user => user ? user : Promise.reject())

    // hange user at req.user for use downstream
    .then(user => req.user = user)

    // handoff execution to the next part of the pipeline
    .then(() => next())

    // if something goes wrong reject the req.
    .catch(_ => res.status(401).json({ err: 'Auth required.' }))
  ;

  return;
};

function isWhitelistedRequest(req) {
  return isPreflight(req)
    || isLoggingInOrSigningUp(req)
    || isGettingTutors(req)
    || isFailedStripeRedirect(req);
}

function isLoggingInOrSigningUp(req) {
  if (req.method.toLowerCase() !== 'post') return false;

  const loggingIn = req.path.includes('session');
  const signingUp = req.path === '/user';

  return loggingIn || signingUp;
}

function isGettingTutors(req) {
  if (req.method.toLowerCase() !== 'get') return false;

  return req.path.includes('tutor');
}

function isPreflight(req) {
  return req.method.toLowerCase() === 'options';
}

function isStripeRedirect(req) {
  return req.method.toLowerCase() === 'get' && req.path === '/stripe/pad';
}

function isFailedStripeRedirect(req) {
  return isStripeRedirect(req) && (!req.query || req.query.error);
}
