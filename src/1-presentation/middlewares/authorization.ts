import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '.';
import { checkAdmin } from '@shared/utils/jwt';

export const authorizationJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	try {
		const bearerToken = req.headers.authorization?.split(' ')[1];

		if (!bearerToken) {
			return res.status(401).json({ message: 'Authorization token missing' });
		}
		
		if (checkAdmin(bearerToken)){
			next();
			return;
		}
		
		const { id } = req.params;
		const currentUserId = req.userId;

		if(!currentUserId){
			return res.sendStatus(403);
		}

		// current user can only modify his own data
		if(currentUserId != id){
			return res.sendStatus(403);
		}

		next();
	} catch (err) {
		return res.status(403).json({ message: 'Invalid or expired token.' });
	}
};
