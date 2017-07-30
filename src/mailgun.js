import mailgun from 'mailgun-js';
import { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_PUBLIC_API_KEY } from './config';


export default mailgun({
  apiKey: MAILGUN_API_KEY,
  publicApiKey: MAILGUN_PUBLIC_API_KEY,
  domain: MAILGUN_DOMAIN,
});
