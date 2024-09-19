import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '.';
import { checkAdmin } from '../utils/jwt';
import { OutputVM } from '../dtos/output.vm';

export const authorizationJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	try {
		const bearerToken = req.headers.authorization?.split(' ')[1];

		if (!bearerToken) {
			return res.status(401).send(new OutputVM(401, null, ['Authorization token missing.']));
		}
		
		if (checkAdmin(bearerToken)){
			next();
			return;
		}
		
		const { id } = req.params;
		const currentUserId = req.userId;

		if(!currentUserId) {
			return res.status(403).send(new OutputVM(403, null, ['Token does not match with currrent user.']));
		}

		// current user can only modify his own data
		if(currentUserId != id){
			return res.sendStatus(403);
		}

		next();
	} catch (err) {
		return res.status(403).send(new OutputVM(403, null, ['Invalid or expired token.']));
	}
};
