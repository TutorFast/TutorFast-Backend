import { Router } from 'express';
import User from '../models/User';
import Appointment from '../models/Appointment';
import stripe from '../stripe';
import mailgun from '../mailgun';
import { MAILGUN_DOMAIN, FRONTEND_URI } from '../config';
import { pipe } from '../util';


const router = Router();

router.get('/', (req, res) => {
  Promise.all([
    Appointment.find({ tutor: req.user._id }).populate('learner').populate('tutor').exec(),
    Appointment.find({ learner: req.user._id }).populate('learner').populate('tutor').exec(),
  ])
    .then(([asTutor, asLearner]) =>
      res.json({ asTutor, asLearner }))
    .catch(err =>
      res.status(400).json({ err, message: 'Could not fetch appointments.' }))
  ;
});

router.post('/', (req, res) => {
  const learner = req.user;

  if (!learner.card) {
    res.status(400)
      .json({ message: 'Learner must have a registered card to create an appointment.' });
    return;
  }

  User.findOne({ _id: req.body.tutor, isTutor: true })
    .then(tutor => new Appointment({
      tutor: tutor._id,
      learner: learner._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      subject: req.body.subject,
      cost: tutor.wage * ((new Date(req.body.endDate) - new Date(req.body.startDate)) / 1000 / 60 / 60),
    }))
    .then(appointment => appointment.populate('learner').populate('tutor').execPopulate())
    .then(appointment => appointment.save())
    .then(pipe(appointment => res.json({ appointment, message: 'Appointment was created.' })))
    .catch(err => res.status(400).json({ err, message: 'Appointment could not be created.' }))
    .then(pipe(console.log))
    .then(appointment => new Promise((resolve, reject) =>
      mailgun.messages().send(
        {
          from: `TurorFast <tutorfast@${MAILGUN_DOMAIN}>`,
          to: appointment.tutor.email,
          subject: `${appointment.learner.username} has Proposed an Appointment.`,
          text:
            `${
              appointment.learner.username
            } would like to meet you on ${
              new Date(appointment.startDate).toLocaleDateString()
            } from ${
              new Date(appointment.startDate).toLocaleTimeString()
            } to ${
              new Date(appointment.endDate).toLocaleTimeString()
            } at ${
              appointment.location
            } and be taught ${
              appointment.subject
            }.  To approve or reject the appointment visit this address: ${
              FRONTEND_URI}/#/appointment/${appointment._id
            }`,
          html:
            `<p><em>${
              appointment.learner.username
            }</em> would like to meet you on <em>${
              new Date(appointment.startDate).toLocaleDateString()
            }</em> from <em>${
              new Date(appointment.startDate).toLocaleTimeString()
            }</em> to <em>${
              new Date(appointment.endDate).toLocaleTimeString()
            }</em> at <em>${
              appointment.location
            }</em> and be taught <em>${
              appointment.subject
            }</em>.</p><p>To approve or reject the appointment visit this address: <a href="${
              FRONTEND_URI}/#/appointment/${appointment._id
            }">${
              FRONTEND_URI}/#/appointment/${appointment._id
            }</a></p>`,
        },
        (err, body) => err && reject(err) || resolve(body),
      )
    ))
    .catch(console.log)
    .then(console.log)
  ;
});

router.post('/approve/:id', (req, res) => {
  const tutor = req.user;

  if (!tutor.account) {
    res.status(400).json({ message: 'Tutor must have account registered.' });
    return;
  }

  Appointment.findOne({ _id: req.params.id, tutor: tutor._id, state: 'proposed' })
    .then(appointment => appointment.populate('learner').populate('tutor').execPopulate())
    .then(appointment => appointment.learner.card
      ? appointment
      : Promise.reject('Learner must have a registred card.'))
    .then(async appointment => {
      const learner = appointment.learner;

      appointment.charge = (await stripe.charges.create({
        amount: appointment.cost * 100,
        currency: 'usd',
        customer: learner.card,
      }, {
        stripe_account: tutor.account,
      })).id;

      return appointment.save();
    })
    .then(appointment => {
      appointment.state = 'approved';
      return appointment.save();
    })
    .then(appointment => res.json({ appointment, message: 'Appointment approved.' }))
    .catch(err => res.status(400).json({ err, message: 'Appointment could not be approved.' }))
  ;
});

router.post('/reject/:id', (req, res) => {
  const tutor = req.user;

  Appointment.findOne({ _id: req.params.id, tutor: tutor._id, state: 'proposed' })
    .then(appointment => {
      appointment.state = 'rejected';
      return appointment.save();
    })
    .then(appointment => appointment.populate('learner').populate('tutor').execPopulate())
    .then(appointment => res.json({ appointment, message: 'Appointment rejected.' }))
    .catch(err => res.status(400).json({ err, message: 'Appointment could not be rejected.' }))
  ;
});

export default router;
