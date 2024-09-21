import { AuthController } from 'controllers/auth-controller';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { RedisCacheService } from 'services/redis-cache.service';
import { Request, Response } from 'express';
import { OutputVM } from 'dtos/output.vm';
import { AuthService } from 'services/auth.service';
import { UserRepository } from 'repositories/user-repository';

describe('AuthController - logout', () => {
    let authController: AuthController;
    let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        // Mocking the dependencies
        refreshTokenRepository = {
            deleteByToken: jest.fn(),
        } as unknown as jest.Mocked<RefreshTokenRepository>;

        // Mocking unused dependencies
        const mockAuthService = {} as jest.Mocked<AuthService>;
        const mockUserRepository = {} as jest.Mocked<UserRepository>;
        const mockCacheService = {} as jest.Mocked<RedisCacheService>;

        authController = new AuthController(
            mockAuthService,        // Empty mock
            mockUserRepository,     // Empty mock
            refreshTokenRepository, // Only relevant mock for this test
            mockCacheService        // Empty mock
        );

        req = {
            cookies: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            clearCookie: jest.fn(),
        };
    });

    it('should return 400 if no refresh token is provided', async () => {
        await authController.logout(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, ['Refresh token not provided.']));
    });

    it('should return 200 and clear the refresh token if logout is successful', async () => {
        req.cookies = { refreshToken: 'validRefreshToken' };
        refreshTokenRepository.deleteByToken.mockResolvedValueOnce();

        await authController.logout(req as Request, res as Response);

        expect(refreshTokenRepository.deleteByToken).toHaveBeenCalledWith('validRefreshToken');
        expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', {
            httpOnly: true,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, { message: 'Logged out successfully.' }, []));
    });

    it('should return 400 if an error occurs while deleting the refresh token', async () => {
        req.cookies = { refreshToken: 'invalidRefreshToken' };
        refreshTokenRepository.deleteByToken.mockRejectedValueOnce(new Error('Delete failed'));

        await authController.logout(req as Request, res as Response);

        expect(refreshTokenRepository.deleteByToken).toHaveBeenCalledWith('invalidRefreshToken');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, ['Delete failed']));
    });
});