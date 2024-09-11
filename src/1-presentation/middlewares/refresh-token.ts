import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '.';

import { verifyToken } from '@shared/utils/jwt';

export const refreshJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  
    // Cookie HttpOnly
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token was not found.' });
    }

    try {
        const decoded = verifyToken(refreshToken);
        
		req.userId = decoded._id;
		req.username = decoded.username;
		req.role = decoded.role;

        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }
};
