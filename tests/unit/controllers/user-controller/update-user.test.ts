import { Request, Response } from 'express';
import { UserController } from 'controllers/user-controller';
import { UserRepository } from 'repositories/user-repository';
import { CacheKeys, RedisCacheService } from 'services/redis-cache.service';
import { UserService } from 'services/user.service';
import { OutputVM } from 'dtos/output.vm';
import { UpdateUserInput, UpdateUserOutput } from 'services/dtos';

describe('UserController - updateUser', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let userRepository: jest.Mocked<UserRepository>;
    let cacheService: jest.Mocked<RedisCacheService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = {
            updateUser: jest.fn(),
        } as unknown as jest.Mocked<UserService>;

        userRepository = {} as jest.Mocked<UserRepository>;
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

    it('should update user successfully and delete cache if user is active', async () => {
        const input: UpdateUserInput = {
            id: 'user1',
            username: 'updatedusername',
            name: 'Updated Name',
            email: 'updated@example.com',
            password: 'newpassword',
            confirmPassword: 'newpassword',
        };

        req.body = input;

        const output: UpdateUserOutput = {
            valid: true,
            user: {
                id: 'user1',
                username: 'updatedusername',
                name: 'Updated Name',
                email: 'updated@example.com',
                role: 'user',
                isActive: true,
            },
        };

        userService.updateUser.mockResolvedValueOnce(output);

        await userController.updateUser(req as Request, res as Response);

        expect(userService.updateUser).toHaveBeenCalledWith(input);
        expect(cacheService.delete).toHaveBeenCalledWith(CacheKeys.USER_LIST); // Should delete cache if user is active
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, output, []));
    });

    it('should update user successfully without deleting cache if user is inactive', async () => {
        const input: UpdateUserInput = {
            id: 'user2',
            username: 'inactiveuser',
            name: 'Inactive Name',
            email: 'inactive@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };

        req.body = input;

        const output: UpdateUserOutput = {
            valid: true,
            user: {
                id: 'user2',
                username: 'inactiveuser',
                name: 'Inactive Name',
                email: 'inactive@example.com',
                role: 'admin',
                isActive: false,
            },
        };

        userService.updateUser.mockResolvedValueOnce(output);

        await userController.updateUser(req as Request, res as Response);

        expect(userService.updateUser).toHaveBeenCalledWith(input);
        expect(cacheService.delete).not.toHaveBeenCalled(); // Should not delete cache if user is inactive
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, output, []));
    });

    it('should return 400 if update fails due to validation error', async () => {
        const input: UpdateUserInput = {
            id: 'user3',
            username: 'erroruser',
            name: 'Error Name',
            email: 'error@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };

        req.body = input;

        const output: UpdateUserOutput = {
            valid: false,
            error: 'Validation failed',
        };

        userService.updateUser.mockResolvedValueOnce(output);

        await userController.updateUser(req as Request, res as Response);

        expect(userService.updateUser).toHaveBeenCalledWith(input);
        expect(cacheService.delete).not.toHaveBeenCalled(); // Should not delete cache if the update fails
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [output.error]));
    });

    it('should return 400 and handle exceptions', async () => {
        const input: UpdateUserInput = {
            id: 'user4',
            username: 'exceptionuser',
            name: 'Exception User',
            email: 'exception@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };

        req.body = input;

        const errorMessage = 'Unexpected error';
        userService.updateUser.mockRejectedValueOnce(new Error(errorMessage));

        await userController.updateUser(req as Request, res as Response);

        expect(userService.updateUser).toHaveBeenCalledWith(input);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});
