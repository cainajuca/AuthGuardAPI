import { Request, Response } from 'express';
import { AuthController } from 'controllers/auth-controller';
import { AuthService } from 'services/auth.service';
import { RequestPasswordResetInput, RequestPasswordResetOutput } from 'services/dtos';
import { OutputVM } from 'dtos/output.vm';
import { UserRepository } from 'repositories/user-repository';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { RedisCacheService } from 'services/redis-cache.service';

describe('AuthController - requestPasswordReset', () => {
    let authController: AuthController;
    let authService: jest.Mocked<AuthService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        authService = {
            requestPasswordReset: jest.fn(),
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
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should return 400 if the requestPasswordReset service returns invalid result', async () => {
        const input: RequestPasswordResetInput = {
            email: 'invalidemail@test.com',
        };

        req.body = input;

        const result: RequestPasswordResetOutput = {
            valid: false,
            error: 'Invalid email address',
        };

        authService.requestPasswordReset.mockResolvedValueOnce(result);

        await authController.requestPasswordReset(req as Request, res as Response);

        expect(authService.requestPasswordReset).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [result.error]));
    });

    it('should return 200 if the requestPasswordReset service is successful', async () => {
        const input: RequestPasswordResetInput = {
            email: 'validemail@test.com',
        };

        req.body = input;

        const result: RequestPasswordResetOutput = {
            valid: true,
        };

        authService.requestPasswordReset.mockResolvedValueOnce(result);

        await authController.requestPasswordReset(req as Request, res as Response);

        const output = {
            message: "We've sent a password reset link to your e-mail. Please check your inbox and follow the instructions to reset your password within the next hour",
        };

        expect(authService.requestPasswordReset).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, output, []));
    });

    it('should return 400 if an exception is thrown', async () => {
        const input: RequestPasswordResetInput = {
            email: 'testemail@test.com',
        };

        req.body = input;

        const errorMessage = 'Unexpected error';
        authService.requestPasswordReset.mockRejectedValueOnce(new Error(errorMessage));

        await authController.requestPasswordReset(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});
