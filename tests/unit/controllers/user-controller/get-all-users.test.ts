import { Request, Response } from 'express';
import { UserController } from 'controllers/user-controller';
import { UserRepository } from 'repositories/user-repository';
import { RedisCacheService, CacheKeys } from 'services/redis-cache.service';
import { User } from 'models/user';
import { UserService } from 'services/user.service';
import { OutputVM } from 'dtos/output.vm';
import { UserDTO } from 'dtos/user.dto';

describe('UserController - getAllUsers', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let userRepository: jest.Mocked<UserRepository>;
    let cacheService: jest.Mocked<RedisCacheService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = {} as jest.Mocked<UserService>; // Não utilizado diretamente
        userRepository = {
            findAllUsers: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        cacheService = {
            get: jest.fn(),
            set: jest.fn(),
        } as unknown as jest.Mocked<RedisCacheService>;

        userController = new UserController(userService, userRepository, cacheService);

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should return users from cache if available', async () => {
        const cachedUsers = [
            new User({
                _id: 'user1',
                username: 'john.doe',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedpassword',
                role: 'user',
                isActive: true,
            }),
        ];

        cacheService.get.mockResolvedValueOnce(cachedUsers);

        await userController.getAllUsers(req as Request, res as Response);

        const usersVM = cachedUsers.map(u => new UserDTO(u.id, u.username, u.name, u.email, u.role, u.isActive));

        expect(cacheService.get).toHaveBeenCalledWith(CacheKeys.USER_LIST);
        expect(userRepository.findAllUsers).not.toHaveBeenCalled(); // Should not fetch from repository
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, usersVM, []));
    });

    it('should fetch users from repository if cache is empty and set cache', async () => {
        const repoUsers = [
            new User({
                _id: 'user2',
                username: 'jane.doe',
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'hashedpassword',
                role: 'admin',
                isActive: true,
            }),
        ];

        cacheService.get.mockResolvedValueOnce(null); // Cache is empty
        userRepository.findAllUsers.mockResolvedValueOnce(repoUsers);

        await userController.getAllUsers(req as Request, res as Response);

        const usersVM = repoUsers.map(u => new UserDTO(u.id, u.username, u.name, u.email, u.role, u.isActive));

        expect(cacheService.get).toHaveBeenCalledWith(CacheKeys.USER_LIST);
        expect(userRepository.findAllUsers).toHaveBeenCalledWith(true); // Should fetch from repository
        expect(cacheService.set).toHaveBeenCalledWith(CacheKeys.USER_LIST, repoUsers); // Cache should be set
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, usersVM, []));
    });

    it('should return 400 if an exception is thrown', async () => {
        const errorMessage = 'Unexpected error';
        cacheService.get.mockRejectedValueOnce(new Error(errorMessage));

        await userController.getAllUsers(req as Request, res as Response);

        expect(cacheService.get).toHaveBeenCalledWith(CacheKeys.USER_LIST);
        expect(userRepository.findAllUsers).not.toHaveBeenCalled(); // Should not fetch from repository if cache fails
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});
