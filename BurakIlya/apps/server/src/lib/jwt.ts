import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors';

// Ensure JWT secrets are provided (no fallback values for security)
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET environment variable is required');
}

if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required');
}

// Assert non-null for TypeScript
const accessSecret: string = JWT_ACCESS_SECRET;
const refreshSecret: string = JWT_REFRESH_SECRET;

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, accessSecret as jwt.Secret, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  } as any);
}

export function generateRefreshToken(payload: TokenPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, refreshSecret as jwt.Secret, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  } as any);
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, accessSecret as jwt.Secret);
    return decoded as TokenPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired access token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, refreshSecret as jwt.Secret);
    return decoded as TokenPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
}
