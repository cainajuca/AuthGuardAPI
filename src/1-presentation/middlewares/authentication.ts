import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '.';
import { verifyToken } from '@shared/utils/jwt'
import { OutputVM } from '@application/dtos/output.vm';

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

	const bearerToken = req.headers.authorization?.split(' ')[1];

	if (!bearerToken) {
		return res.status(401).send(new OutputVM(401, null, ['The token was not found.']));
	}

	try {
		const decoded = verifyToken(bearerToken);

		req.userId = decoded._id;
		req.username = decoded.username;
		req.role = decoded.role;

		next();
	} catch (err) {
		return res.status(403).send(new OutputVM(403, null, ['Invalid or expired token.']));
	}
};
