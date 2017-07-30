import mailgun from 'mailgun-js';
import { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_PUBLIC_API_KEY, FRONTEND_URI } from './config';

import type Appointment from './types/Appointment';

const mg = mailgun({
  apiKey: MAILGUN_API_KEY,
  publicApiKey: MAILGUN_PUBLIC_API_KEY,
  domain: MAILGUN_DOMAIN,
});

export const notifyTutor : Appointment => Promise<{}> =
appointment =>
  new Promise((resolve, reject) =>
    mg.messages().send(
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
  );

export default mg;
