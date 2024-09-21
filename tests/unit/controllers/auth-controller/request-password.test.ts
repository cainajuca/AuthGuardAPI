import { Request, Response } from 'express';
import { AuthController } from 'controllers/auth-controller';
import { AuthService } from 'services/auth.service';
import { ResetPasswordInput, ResetPasswordOutput } from 'services/dtos';
import { OutputVM } from 'dtos/output.vm';
import { UserRepository } from 'repositories/user-repository';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { RedisCacheService } from 'services/redis-cache.service';

describe('AuthController - resetPassword', () => {
    let authController: AuthController;
    let authService: jest.Mocked<AuthService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        authService = {
            resetPassword: jest.fn(),
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

    it('should return 400 if resetPassword service returns invalid result', async () => {
        const input: ResetPasswordInput = {
            email: 'invalidemail@test.com',
            newPassword: 'password123',
        };

        req.body = input;

        const result: ResetPasswordOutput = {
            valid: false,
            error: 'Invalid email or token',
        };

        authService.resetPassword.mockResolvedValueOnce(result);

        await authController.resetPassword(req as Request, res as Response);

        expect(authService.resetPassword).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [result.error]));
    });

    it('should return 200 if resetPassword service is successful', async () => {
        const input: ResetPasswordInput = {
            email: 'validemail@test.com',
            newPassword: 'newpassword123',
        };

        req.body = input;

        const result: ResetPasswordOutput = {
            valid: true,
        };

        authService.resetPassword.mockResolvedValueOnce(result);

        await authController.resetPassword(req as Request, res as Response);

        const output = {
            message: "Your password has been successfully reset",
        };

        expect(authService.resetPassword).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, output, []));
    });

    it('should return 400 if an exception is thrown', async () => {
        const input: ResetPasswordInput = {
            email: 'testemail@test.com',
            newPassword: 'newpassword123',
        };

        req.body = input;

        const errorMessage = 'Unexpected error';
        authService.resetPassword.mockRejectedValueOnce(new Error(errorMessage));

        await authController.resetPassword(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});
