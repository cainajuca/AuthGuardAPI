import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '.';

import { verifyToken } from '../utils/jwt';
import { OutputVM } from '../dtos/output.vm';

export const verifyBodyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  
    const token = req.body.token;
  
    if (!token) {
        return res.status(401).send(new OutputVM(401, null, ['Reset token was not found.']));
    }

    try {
        const decoded = verifyToken(token);

		req.userId = decoded._id;
		req.username = decoded.username;
		req.role = decoded.role;
        
        next();
    } catch (error) {
        return res.status(403).send(new OutputVM(403, null, ['Invalid or expired reset token.']));
    }
};
