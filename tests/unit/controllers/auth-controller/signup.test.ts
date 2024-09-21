import { AuthController } from 'controllers/auth-controller';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { RedisCacheService } from 'services/redis-cache.service';
import { Request, Response } from 'express';
import { OutputVM } from 'dtos/output.vm';
import { AuthService } from 'services/auth.service';
import { UserRepository } from 'repositories/user-repository';
import { SignUpInput, SignUpOutput } from 'services/dtos';

describe('AuthController - signUp', () => {
    let authController: AuthController;
    let authService: jest.Mocked<AuthService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        // Mocking the dependencies
        authService = {
            signUp: jest.fn(),
        } as unknown as jest.Mocked<AuthService>;

        // Mocking unused dependencies
        const mockUserRepository = {} as jest.Mocked<UserRepository>;
        const mockRefreshTokenRepository = {} as jest.Mocked<RefreshTokenRepository>;
        const mockCacheService = {} as jest.Mocked<RedisCacheService>;

        authController = new AuthController(
            authService,                // Only relevant mock for this test
            mockUserRepository,         // Empty mock
            mockRefreshTokenRepository, // Empty mock
            mockCacheService            // Empty mock
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

    it('should return 201 and set refreshToken cookie if signUp is successful', async () => {
        
        const input: SignUpInput = {
            username: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };
        
        req.body = input;

        const output: SignUpOutput = {
            valid: true,
            user: {
                id: '1',
                username: 'testuser',
                name: 'Test User',
                email: 'testuser@example.com',
                role: 'user',
                isActive: true
            },
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        };

        authService.signUp.mockResolvedValueOnce(output);

        await authController.signUp(req as Request, res as Response);

        expect(authService.signUp).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.objectContaining({
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }));
        expect(res.send).toHaveBeenCalledWith(new OutputVM(201, {
            user: output.user,
            accessToken: output.accessToken,
        }, []));
    });

    it('should return 400 if signUp fails', async () => {
        const input: SignUpInput = {
            username: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };
        
        req.body = input;

        const output: SignUpOutput = {
            valid: false,
            error: 'User already exists',
        };

        authService.signUp.mockResolvedValueOnce(output);

        await authController.signUp(req as Request, res as Response);

        expect(authService.signUp).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, ['User already exists']));
    });

    it('should return 400 if an exception is thrown', async () => {
        const input: SignUpInput = {
            username: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };
        
        req.body = input;

        const errorMessage = 'Internal Server Error';
        authService.signUp.mockRejectedValueOnce(new Error(errorMessage));

        await authController.signUp(req as Request, res as Response);

        expect(authService.signUp).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});