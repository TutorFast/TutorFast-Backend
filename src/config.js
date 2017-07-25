import dotenv from 'dotenv-safe';
dotenv.load();

export const TOKEN_LIFE = { expiresIn: 60 * 60 * 24 };
export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_URI = process.env.DB_URI;
export const PORT = process.env.PORT || 8888;
export const STRIPE_CLIENT_SECRET = process.env.STRIPE_CLIENT_SECRET;
export const FRONTEND_URI = process.env.FRONTEND_URI;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
