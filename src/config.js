import dotenv from 'dotenv-safe';
dotenv.load();

export const TOKEN_LIFE = { expiresIn: 60 * 60 * 24 * 7 };
export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_URI = process.env.DB_URI;
export const PORT = process.env.PORT || 8888;
export const STRIPE_CLIENT_SECRET = process.env.STRIPE_CLIENT_SECRET;
export const FRONTEND_URI = process.env.FRONTEND_URI;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;
export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
export const MAILGUN_PUBLIC_API_KEY = process.env.MAILGUN_PUBLIC_API_KEY;
