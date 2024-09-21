import { Request, Response } from 'express';
import { AuthController } from 'controllers/auth-controller';
import { AuthService } from 'services/auth.service';
import { RefreshTokenInput, RefreshTokenOutput } from 'services/dtos';
import { OutputVM } from 'dtos/output.vm';
import { AuthenticatedRequest } from 'middlewares';
import { RedisCacheService } from 'services/redis-cache.service';
import { UserRepository } from 'repositories/user-repository';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';

describe('AuthController - refresh', () => {
    let authController: AuthController;
    let authService: jest.Mocked<AuthService>;
    let req: Partial<AuthenticatedRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        authService = {
            refreshToken: jest.fn(),
        } as unknown as jest.Mocked<AuthService>;

        const mockUserRepository = {} as jest.Mocked<UserRepository>;
        const mockRefreshTokenRepository = {} as jest.Mocked<RefreshTokenRepository>;
        const mockCacheService = {} as jest.Mocked<RedisCacheService>;

        authController = new AuthController(
            authService,
            mockUserRepository,
            mockRefreshTokenRepository,
            mockCacheService
        );

        req = {
            cookies: {},
            userId: '66eed3d11193ce398bcbff65',
            username: 'testuser',
            role: 'user',
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            cookie: jest.fn(),
        };
    });

    it('should return 401 if refreshToken is not found in cookies', async () => {
        req.cookies = {}; // missing refreshToken

        await authController.refresh(req as any, res as Response);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, ['Refresh Token not found']));
    });

    it('should return 400 if the refresh token is invalid or expired', async () => {
        const refreshToken = 'invalid-token';
        req.cookies = { refreshToken };

        const output: RefreshTokenOutput = {
            valid: false,
        };

        authService.refreshToken.mockResolvedValueOnce(output);

        await authController.refresh(req as any, res as Response);

        expect(authService.refreshToken).toHaveBeenCalledWith(expect.objectContaining({
            userId: req.userId,
            username: req.username,
            role: req.role,
            refreshToken: refreshToken,
        }));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, ['Invalid or expired token']));
    });

    it('should set new refresh token in cookie and return 201 with access token if refresh is successful', async () => {
        const refreshToken = 'valid-refresh-token';
        req.cookies = { refreshToken };

        const output: RefreshTokenOutput = {
            valid: true,
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
        };

        authService.refreshToken.mockResolvedValueOnce(output);

        await authController.refresh(req as any, res as Response);

        expect(authService.refreshToken).toHaveBeenCalledWith(expect.objectContaining({
            userId: req.userId,
            username: req.username,
            role: req.role,
            refreshToken: refreshToken,
        }));
        expect(res.cookie).toHaveBeenCalledWith('refreshToken', output.refreshToken, expect.objectContaining({
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(201, { accessToken: output.accessToken }, []));
    });

    it('should return 400 if an exception is thrown', async () => {
        const refreshToken = 'valid-refresh-token';
        req.cookies = { refreshToken };

        const errorMessage = 'Internal Server Error';
        authService.refreshToken.mockRejectedValueOnce(new Error(errorMessage));

        await authController.refresh(req as any, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});
