import jwt from 'jsonwebtoken';
import ms from 'ms';

export const secretKey = process.env.JWT_SECRET;
export const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
export const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

export function verifyToken(token: string): JwtPayload {
	return jwt.verify(token, secretKey) as JwtPayload;
}

export function checkAdmin(token: string): boolean {
	try {
		const decoded = verifyToken(token) as { role: string };
		
		return decoded.role === 'admin';
	} catch (error) {
		return false;
	}
};

export function generateAccessRefreshTokens(payload: JwtPayload): TokenPair[] {

	const accessTokenPair = generateToken(payload, accessTokenExpiry);
	const refreshTokenPair = generateToken(payload, refreshTokenExpiry);

	return [accessTokenPair, refreshTokenPair];
}

export function generateToken(payload: JwtPayload, tokenExpiry: string): TokenPair {

	const token = jwt.sign(payload, secretKey, { expiresIn: tokenExpiry });

	const expiresAt = new Date();
	expiresAt.setTime(expiresAt.getTime() + ms(tokenExpiry));

	return new TokenPair(token, expiresAt)
}

export interface JwtPayload {
	_id: string;
	username: string;
	role: string;
}

export class TokenPair {
	constructor(
		public token: string, 
		public expiresAt: Date,
	) { }
}