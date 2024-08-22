import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '.';
import jwt from 'jsonwebtoken';

import { JwtPayload, secretKey } from '@shared/utils/jwt'

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const bearerToken = req.headers.authorization?.split(' ')[1];

	if (!bearerToken) {
		return res.status(401).json({ message: 'The token was not found.' });
	}

	try {
		const decoded = jwt.verify(bearerToken, secretKey) as JwtPayload;

		req.userId = decoded._id;

		next();
	} catch (err) {
		return res.status(403).json({ message: 'Invalid or expired token.' });
	}
};
