import { Request, Response } from 'express';
import { UserController } from 'controllers/user-controller';
import { UserRepository } from 'repositories/user-repository';
import { RedisCacheService } from 'services/redis-cache.service';
import { User } from 'models/user';
import { UserService } from 'services/user.service';
import { OutputVM } from 'dtos/output.vm';
import { UserDTO } from 'dtos/user.dto';

describe('UserController - getUserByUsername', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let userRepository: jest.Mocked<UserRepository>;
    let cacheService: jest.Mocked<RedisCacheService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = {} as jest.Mocked<UserService>; // Não utilizado diretamente
        userRepository = {
            findByUsername: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        cacheService = {} as jest.Mocked<RedisCacheService>; // Não utilizado neste método

        userController = new UserController(userService, userRepository, cacheService);

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should return user successfully by username', async () => {
        const user = new User({
            _id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
        });

        req.params = { username: 'john.doe' };

        userRepository.findByUsername.mockResolvedValueOnce(user);

        await userController.getUserByUsername(req as Request, res as Response);

        const userVM = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);

        expect(userRepository.findByUsername).toHaveBeenCalledWith('john.doe');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(200, userVM, []));
    });

    it('should return 404 if user is not found', async () => {
        req.params = { username: 'john.doe' };

        userRepository.findByUsername.mockResolvedValueOnce(null);

        await userController.getUserByUsername(req as Request, res as Response);

        expect(userRepository.findByUsername).toHaveBeenCalledWith('john.doe');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(404, null, ['User not found']));
    });

    it('should return 400 and handle exceptions', async () => {
        const errorMessage = 'Unexpected error';
        req.params = { username: 'john.doe' };

        userRepository.findByUsername.mockRejectedValueOnce(new Error(errorMessage));

        await userController.getUserByUsername(req as Request, res as Response);

        expect(userRepository.findByUsername).toHaveBeenCalledWith('john.doe');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(new OutputVM(400, null, [errorMessage]));
    });
});
