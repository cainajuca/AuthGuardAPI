import jwt from 'jsonwebtoken';

import { config } from '@shared/config/env';

export interface JwtPayload {
  _id: string;
  username: string;
}

export const secretKey = config.JWT_SECRET;

export function generateToken(payload: JwtPayload): string {
	return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}
