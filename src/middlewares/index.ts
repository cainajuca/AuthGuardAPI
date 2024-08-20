import { Request } from 'express';

export * from './authentication';
export * from './owner';

export interface AuthenticatedRequest extends Request {
    userId?: string;
    // maybe add name or username in here
}
