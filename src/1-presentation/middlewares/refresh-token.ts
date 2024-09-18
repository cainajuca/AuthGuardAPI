import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '.';

import { verifyToken } from '@shared/utils/jwt';
import { OutputVM } from '@application/dtos/output.vm';

export const refreshJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  
    // Cookie HttpOnly
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).send(new OutputVM(401, null, ['Refresh token was not found.']));
    }

    try {
        const decoded = verifyToken(refreshToken);
        
		req.userId = decoded._id;
		req.username = decoded.username;
		req.role = decoded.role;

        next();
    } catch (err) {
        return res.status(403).send(new OutputVM(403, null, ['Invalid or expired refresh token.']));
    }
};
