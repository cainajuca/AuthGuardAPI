import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '.';
import { verifyToken } from '@shared/utils/jwt'

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

	const bearerToken = req.headers.authorization?.split(' ')[1];

	if (!bearerToken) {
		return res.status(401).json({ message: 'The token was not found.' });
	}

	try {
		const decoded = verifyToken(bearerToken);

		req.userId = decoded._id;
		req.username = decoded.username;
		req.role = decoded.role;

		next();
	} catch (err) {
		return res.status(403).json({ message: 'Invalid or expired token.' });
	}
};
