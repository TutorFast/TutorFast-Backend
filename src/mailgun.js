import mailgun from 'mailgun-js';
import { MAILGUN_API_KEY, MAILGUN_DOMAIN } from './config';


export default mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
});
