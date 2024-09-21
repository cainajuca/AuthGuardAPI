import { Request, Response } from 'express';
import { AuthController } from 'controllers/auth-controller';
import { AuthService } from 'services/auth.service';
import { ActivateUserInput, ActivateUserOutput } from 'services/dtos';
import { OutputVM } from 'dtos/output.vm';
import { UserRepository } from 'repositories/user-repository';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { CacheKeys, RedisCacheService } from 'services/redis-cache.service';

describe('AuthController - activateUser', () => {
    let authController: AuthController;
    let authService: jest.Mocked<AuthService>;
    let cacheService: jest.Mocked<RedisCacheService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        authService = {
            activateUser: jest.fn(),
        } as unknown as jest.Mocked<AuthService>;

        cacheService = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<RedisCacheService>;

        const mockUserRepository = {} as jest.Mocked<UserRepository>;
        const mockRefreshTokenRepository = {} as jest.Mocked<RefreshTokenRepository>;

        authController = new AuthController(
            authService,
            mockUserRepository,
            mockRefreshTokenRepository,
            cacheService
        );

        req = {
            body: {
                token: 'valid-token',
            } as ActivateUserInput,
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should return the correct response and delete cache if activation is successful', async () => {
        const input: ActivateUserInput = {
            token: 'valid-token',
        };

        req.body = input;

        const output: ActivateUserOutput = {
            valid: true,
            user: {
                id: 'user123',
                username: 'john.doe',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'user',
                isActive: true,
            },
        };

        authService.activateUser.mockResolvedValueOnce(output);

        await authController.activateUser(req as Request, res as Response);

        expect(authService.activateUser).toHaveBeenCalledWith(input);
        expect(cacheService.delete).toHaveBeenCalledWith(CacheKeys.USER_LIST);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, output, []));
    });

    it('should return the correct response without deleting cache if activation fails', async () => {
        const input: ActivateUserInput = {
            token: 'invalid-token',
        };

        req.body = input;

        const output = {
            valid: false,
            error: 'Unexpected error.'
        };

        authService.activateUser.mockResolvedValueOnce(output);

        await authController.activateUser(req as Request, res as Response);

        expect(authService.activateUser).toHaveBeenCalledWith(input);
        expect(cacheService.delete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [output.error]));
    });

    it('should return 400 and handle exceptions', async () => {
        const input: ActivateUserInput = {
            token: 'valid-token',
        };

        req.body = input;

        const errorMessage = 'Unexpected error';
        authService.activateUser.mockRejectedValueOnce(new Error(errorMessage));

        await authController.activateUser(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});