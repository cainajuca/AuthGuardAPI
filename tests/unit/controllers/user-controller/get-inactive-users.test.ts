import { Request, Response } from 'express';
import { UserController } from 'controllers/user-controller';
import { UserRepository } from 'repositories/user-repository';
import { RedisCacheService } from 'services/redis-cache.service';
import { User } from 'models/user';
import { UserService } from 'services/user.service';
import { OutputVM } from 'dtos/output.vm';
import { UserDTO } from 'dtos/user.dto';

describe('UserController - getInactiveUsers', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let userRepository: jest.Mocked<UserRepository>;
    let cacheService: jest.Mocked<RedisCacheService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = {} as jest.Mocked<UserService>;
        userRepository = {
            findAllUsers: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        cacheService = {} as jest.Mocked<RedisCacheService>;

        userController = new UserController(userService, userRepository, cacheService);

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should return inactive users successfully', async () => {
        const inactiveUsers = [
            new User({
                _id: 'user1',
                username: 'john.inactive',
                name: 'John Inactive',
                email: 'john.inactive@example.com',
                password: 'hashedpassword',
                role: 'user',
                isActive: false,
            }),
        ];

        userRepository.findAllUsers.mockResolvedValueOnce(inactiveUsers);

        await userController.getInactiveUsers(req as Request, res as Response);

        const usersVM = inactiveUsers.map(u => new UserDTO(u.id, u.username, u.name, u.email, u.role, u.isActive));

        expect(userRepository.findAllUsers).toHaveBeenCalledWith(false); // Fetches for inactive users
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, usersVM, []));
    });

    it('should return 400 and handle exceptions', async () => {
        const errorMessage = 'Unexpected error';
        userRepository.findAllUsers.mockRejectedValueOnce(new Error(errorMessage));

        await userController.getInactiveUsers(req as Request, res as Response);

        expect(userRepository.findAllUsers).toHaveBeenCalledWith(false);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});
