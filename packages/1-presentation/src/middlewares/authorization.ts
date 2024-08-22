import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '.';

export const authorizationJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	try {

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
