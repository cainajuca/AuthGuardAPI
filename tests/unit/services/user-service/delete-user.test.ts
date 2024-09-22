import { DeleteUserInput, DeleteUserOutput } from 'services/dtos';
import { UserRepository } from 'repositories/user-repository';
import { UserService } from 'services/user.service';
import { User } from 'models/user';
import { UserDTO } from 'dtos/user.dto';

describe('UserService - deleteUser', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        userRepository = {
            findById: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        userService = new UserService(userRepository);
    });

    it('should delete the user if the user exists', async () => {
        const input: DeleteUserInput = {
            id: 'user1',
        };

        const user = new User({
            _id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
        });

        userRepository.findById.mockResolvedValueOnce(user);

        const output = await userService.deleteUser(input);

        expect(userRepository.findById).toHaveBeenCalledWith(input.id);
        expect(userRepository.delete).toHaveBeenCalledWith(user.id);
        expect(output.valid).toBe(true);
        expect(output.error).toBeUndefined();
        expect(output.user).toEqual(new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive));
    });

    it('should return an error if the user does not exist', async () => {
        const input: DeleteUserInput = {
            id: 'nonexistent-user-id',
        };

        userRepository.findById.mockResolvedValueOnce(null);

        const output = await userService.deleteUser(input);

        expect(userRepository.findById).toHaveBeenCalledWith(input.id);
        expect(userRepository.delete).not.toHaveBeenCalled(); // No deletion should happen if the user does not exist
        expect(output.valid).toBe(false);
        expect(output.error).toBe('User does not exist.');
    });

    it('should handle errors during the delete process', async () => {
        const input: DeleteUserInput = {
            id: 'user1',
        };

        const user = new User({
            _id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
        });

        userRepository.findById.mockResolvedValueOnce(user);
        userRepository.delete.mockRejectedValueOnce(new Error('Database error'));

        const output = await userService.deleteUser(input);

        expect(userRepository.findById).toHaveBeenCalledWith(input.id);
        expect(userRepository.delete).toHaveBeenCalledWith(user.id);
        expect(output.valid).toBe(false);
        expect(output.error).toBe('An error occurred while trying to delete the user.');
    });
});
