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

export function generateAccessRefreshTokens(payload: JwtPayload): TokenPair {

	const accessToken = generateAccessToken(payload);
	const refreshToken = generateRefreshToken(payload);

	const refreshTokenExpiresAt = new Date();
	refreshTokenExpiresAt.setTime(refreshTokenExpiresAt.getTime() + ms(refreshTokenExpiry));

	return new TokenPair(accessToken, refreshToken, refreshTokenExpiresAt);
}

function generateAccessToken(payload: JwtPayload): string {
	return jwt.sign(payload, secretKey, { expiresIn: accessTokenExpiry });
}

function generateRefreshToken(payload: JwtPayload): string {
	return jwt.sign(payload, secretKey, { expiresIn: refreshTokenExpiry });
}

export interface JwtPayload {
	_id: string;
	username: string;
	role: string;
}

export class TokenPair {
	constructor(
		public accessToken: string, 
		public refreshToken: string,
		public refreshTokenExpiresAt: Date,
	) { }
}