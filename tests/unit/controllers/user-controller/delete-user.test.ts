import { Request, Response } from 'express';
import { UserController } from 'controllers/user-controller';
import { UserRepository } from 'repositories/user-repository';
import { CacheKeys, RedisCacheService } from 'services/redis-cache.service';
import { UserService } from 'services/user.service';
import { OutputVM } from 'dtos/output.vm';
import { DeleteUserInput, DeleteUserOutput, UpdateUserInput, UpdateUserOutput } from 'services/dtos';

describe('UserController - deleteUser', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let userRepository: jest.Mocked<UserRepository>;
    let cacheService: jest.Mocked<RedisCacheService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = {
            deleteUser: jest.fn(),
        } as unknown as jest.Mocked<UserService>;

        userRepository = {} as jest.Mocked<UserRepository>; // Not used directly in this method
        cacheService = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<RedisCacheService>;

        userController = new UserController(userService, userRepository, cacheService);

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should delete user successfully and clear cache if user is active', async () => {
        const input: DeleteUserInput = { id: 'user1' };

        req.params = { id: 'user1' };

        const output: DeleteUserOutput = {
            valid: true,
            user: {
                id: 'user1',
                username: 'activeuser',
                name: 'Active User',
                email: 'active@example.com',
                role: 'admin',
                isActive: true,
            },
        };

        userService.deleteUser.mockResolvedValueOnce(output);

        await userController.deleteUser(req as Request, res as Response);

        expect(userService.deleteUser).toHaveBeenCalledWith(input);
        expect(cacheService.delete).toHaveBeenCalledWith(CacheKeys.USER_LIST); // Cache should be cleared if the user is active
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, output, []));
    });

    it('should delete user successfully without clearing cache if user is inactive', async () => {
        const input: DeleteUserInput = { id: 'user2' };

        req.params = { id: 'user2' };

        const output: DeleteUserOutput = {
            valid: true,
            user: {
                id: 'user2',
                username: 'inactiveuser',
                name: 'Inactive User',
                email: 'inactive@example.com',
                role: 'user',
                isActive: false,
            },
        };

        userService.deleteUser.mockResolvedValueOnce(output);

        await userController.deleteUser(req as Request, res as Response);

        expect(userService.deleteUser).toHaveBeenCalledWith(input);
        expect(cacheService.delete).not.toHaveBeenCalled(); // Cache should not be cleared if the user is inactive
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, output, []));
    });

    it('should return 400 if deletion fails due to invalid input', async () => {
        const input: DeleteUserInput = { id: 'user3' };

        req.params = { id: 'user3' };

        const output: DeleteUserOutput = {
            valid: false,
            error: 'User deletion failed',
        };

        userService.deleteUser.mockResolvedValueOnce(output);

        await userController.deleteUser(req as Request, res as Response);

        expect(userService.deleteUser).toHaveBeenCalledWith(input);
        expect(cacheService.delete).not.toHaveBeenCalled(); // Cache should not be cleared if deletion fails
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [output.error]));
    });

    it('should return 400 and handle exceptions', async () => {
        const input: DeleteUserInput = { id: 'user4' };

        req.params = { id: 'user4' };

        const errorMessage = 'Unexpected error';
        userService.deleteUser.mockRejectedValueOnce(new Error(errorMessage));

        await userController.deleteUser(req as Request, res as Response);

        expect(userService.deleteUser).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});
