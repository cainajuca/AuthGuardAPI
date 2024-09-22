import { DeleteUserInput, DeleteUserOutput, UpdateUserInput } from 'services/dtos';
import { UserRepository } from 'repositories/user-repository';
import { UserService } from 'services/user.service';
import { User } from 'models/user';
import { UserDTO } from 'dtos/user.dto';
import { hashPassword } from 'utils/bcrypt';

jest.mock('utils/bcrypt', () => ({
    hashPassword: jest.fn(),
}));

describe('UserService - updateUser', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks(); // Clears all mocks before each test

        userRepository = {
            findByUsername: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        userService = new UserService(userRepository);
    });

    it('should return an error if the user does not exist', async () => {
        const input: UpdateUserInput = {
            id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'newpassword123',
            confirmPassword: 'newpassword123',
        };

        userRepository.findByUsername.mockResolvedValueOnce(null); // No user found

        const output = await userService.updateUser(input);

        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
        expect(output.valid).toBe(false);
        expect(output.error).toBe('User does not exist.');
    });

    it('should return an error if password confirmation does not match', async () => {
        const input: UpdateUserInput = {
            id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'newpassword123',
            confirmPassword: 'differentpassword',
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

        userRepository.findByUsername.mockResolvedValueOnce(user); // User found

        const output = await userService.updateUser(input);

        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
        expect(output.valid).toBe(false);
        expect(output.error).toBe('Password confirmation does not match the password.');
    });

    it('should update the user successfully if valid data is provided', async () => {
        const input: UpdateUserInput = {
            id: 'user1',
            username: 'john.doe',
            name: 'John Doe Updated',
            email: 'john.doe.updated@example.com',
            password: 'newpassword123',
            confirmPassword: 'newpassword123',
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

        const passwordHash = 'newhashedpassword123';

        userRepository.findByUsername.mockResolvedValueOnce(user); // User found
        (hashPassword as jest.Mock).mockResolvedValueOnce(passwordHash); // Password hashing

        const output = await userService.updateUser(input);

        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
        expect(hashPassword).toHaveBeenCalledWith(input.password);
        expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            username: input.username,
            name: input.name,
            email: input.email,
            password: passwordHash,
        }));
        expect(output.valid).toBe(true);
        expect(output.user).toEqual(new UserDTO(user.id, input.username, input.name, input.email, user.role, user.isActive));
        expect(output.error).toBeUndefined();
    });

    it('should handle errors during the update process', async () => {
        const input: UpdateUserInput = {
            id: 'user1',
            username: 'john.doe',
            name: 'John Doe Updated',
            email: 'john.doe.updated@example.com',
            password: 'newpassword123',
            confirmPassword: 'newpassword123',
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

        userRepository.findByUsername.mockResolvedValueOnce(user); // User found
        userRepository.update.mockRejectedValueOnce(new Error('Database error')); // Simulate database error

        const output = await userService.updateUser(input);

        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
        expect(userRepository.update).toHaveBeenCalled(); // Update should be attempted
        expect(output.valid).toBe(false);
        expect(output.error).toBe('An error occurred while trying to update the user.');
    });
});
