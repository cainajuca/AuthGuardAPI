import { Request, Response } from 'express';

export interface IUserController {
    getAllUsers(req: Request, res: Response): Promise<Response>;
    getUserById(req: Request, res: Response): Promise<Response>;
    getUserByUsername(req: Request, res: Response): Promise<Response>;
    updateUser(req: Request, res: Response): Promise<Response>;
    deleteUser(req: Request, res: Response): Promise<Response>;
}

export interface IAuthController {
    signUp(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
}
