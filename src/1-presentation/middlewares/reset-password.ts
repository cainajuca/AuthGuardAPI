import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '.';

import { verifyToken } from '@shared/utils/jwt';

export const verifyResetToken  = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  
    const token = req.body.token;
  
    if (!token) {
        return res.status(401).json({ message: 'Reset token was not found' });
    }

    try {
        const decoded = verifyToken(token);

		req.userId = decoded._id;
		req.username = decoded.username;
		req.role = decoded.role;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired reset token.' });
    }
};
