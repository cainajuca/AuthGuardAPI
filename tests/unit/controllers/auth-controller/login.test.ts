import { AuthController } from "controllers/auth-controller";
import { RefreshTokenRepository } from "repositories/refresh-token-repository";
import { UserRepository } from "repositories/user-repository";
import { AuthService } from "services/auth.service";
import { RedisCacheService } from "services/redis-cache.service";
import { Request, Response } from 'express';
import { LoginOutput } from "dtos/login-output";
import { User } from "models/user";
import { verifyPassword } from "utils/bcrypt";
import { generateAccessRefreshTokens, TokenPair } from "utils/jwt";
import { OutputVM } from "dtos/output.vm";
import { RefreshToken } from "models/refresh-token";

jest.mock('utils/bcrypt', () => ({
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
}));

jest.mock('utils/jwt', () => ({
    generateAccessRefreshTokens: jest.fn(),
    TokenPair: jest.fn().mockImplementation((token: string, expiresAt: Date) => ({
        token,
        expiresAt,
    })),
}));

describe('AuthController - login', () => {
    let authController: AuthController;
    let userRepository: jest.Mocked<UserRepository>;
    let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        // Mocking the dependencies
        userRepository = {
            findByUsername: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        refreshTokenRepository = {
            save: jest.fn(),
        } as unknown as jest.Mocked<RefreshTokenRepository>;

        // Mocking unused dependencies
        const mockAuthService = {} as jest.Mocked<AuthService>;
        const mockCacheService = {} as jest.Mocked<RedisCacheService>;
        
        authController = new AuthController(
            mockAuthService,        // Empty mock
            userRepository,         // Only relevant mock for this test
            refreshTokenRepository, // Only relevant mock for this test
            mockCacheService        // Empty mock
        );

        req = {
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            cookie: jest.fn(),
        };
    });

    it('should return 400 if username or password is missing', async () => {
        req.body = { username: '', password: '' };

        await authController.login(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, ['Credentials are not in the correct format']));
    });

    it('should return 400 if the user does not exist', async () => {
        req.body = { username: 'nonexistentuser', password: 'password123' };
        userRepository.findByUsername.mockResolvedValueOnce(null);

        await authController.login(req as Request, res as Response);

        expect(userRepository.findByUsername).toHaveBeenCalledWith('nonexistentuser');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, ['User does not exist']));
    });

    it('should return 400 if the password is invalid', async () => {
        const user = new User({
            username: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
        });

        req.body = { username: 'testuser', password: 'wrongpassword' };
        userRepository.findByUsername.mockResolvedValueOnce(user);
        (verifyPassword as jest.Mock).mockResolvedValueOnce(false);

        await authController.login(req as Request, res as Response);

        expect(verifyPassword).toHaveBeenCalledWith('wrongpassword', user.password);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, ['Invalid username or password']));
    });

    it('should return 200 and set refreshToken if login is successful', async () => {
        const user = new User({
            username: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
        });

        const accessTokenPair = new TokenPair('access-token', new Date(Date.now() + 24 * 60 * 60 * 1000)); // 1 day
        const refreshTokenPair = new TokenPair('refresh-token', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days

        req.body = { username: 'testuser', password: 'password123' };
        userRepository.findByUsername.mockResolvedValueOnce(user);
        (verifyPassword as jest.Mock).mockResolvedValueOnce(true);
        (generateAccessRefreshTokens as jest.Mock).mockReturnValueOnce([accessTokenPair, refreshTokenPair]);

        await authController.login(req as Request, res as Response);

        expect(verifyPassword).toHaveBeenCalledWith('password123', user.password);
        expect(generateAccessRefreshTokens).toHaveBeenCalledWith({
            _id: user.id,
            username: user.username,
            role: user.role,
        });

        expect(refreshTokenRepository.save).toHaveBeenCalledWith(expect.any(RefreshToken));

        expect(res.cookie).toHaveBeenCalledWith('refreshToken', refreshTokenPair.token, expect.objectContaining({
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }));
        expect(res.status).toHaveBeenCalledWith(200);

        const loginOutput = new LoginOutput(user, accessTokenPair.token);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, loginOutput, []));
    });

    it('should return 400 if an exception is thrown', async () => {
        const errorMessage = 'Unexpected error';
        req.body = { username: 'testuser', password: 'password123' };
        userRepository.findByUsername.mockRejectedValueOnce(new Error(errorMessage));

        await authController.login(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});