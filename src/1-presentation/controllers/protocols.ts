import { Request, Response } from 'express';

interface IUserController {
    getAllUsers(req: Request, res: Response): Promise<Response>;
    getUserById(req: Request, res: Response): Promise<Response>;
    getUserByUsername(req: Request, res: Response): Promise<Response>;
    updateUser(req: Request, res: Response): Promise<Response>;
    deleteUser(req: Request, res: Response): Promise<Response>;
}

interface IAuthController {
    signUp(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    refresh(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    requestPasswordReset(req: Request, res: Response): Promise<Response>;
    resetPassword(req: Request, res: Response): Promise<Response>;
}

export {
    IUserController,
    IAuthController,
}