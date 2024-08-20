import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JwtPayload, secretKey } from '../utils/jwt'

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization?.split(' ')[1];

    if (!bearerToken) {
        return res.status(401).json({ message: 'The token was not found.' });
    }

    try {
        
        jwt.verify(bearerToken, secretKey) as JwtPayload;

        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};
