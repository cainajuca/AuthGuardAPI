import { ActivateUserInput } from 'services/dtos/activate-user.dto';
import { UserRepository } from 'repositories/user-repository';
import { User } from 'models/user';
import { UserDTO } from 'dtos/user.dto';
import { AuthService } from 'services/auth.service';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';

describe('AuthService - activateUser', () => {
    let authService: AuthService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {       
        userRepository = {
            findByActivationToken: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        const mockRefreshTokenRepository = {} as jest.Mocked<RefreshTokenRepository>;

        authService = new AuthService(
            userRepository,
            mockRefreshTokenRepository
        );
    });

    it('should activate user successfully if the token is valid', async () => {
        const input: ActivateUserInput = {
            token: 'valid-token',
        };

        const user = new User({
            _id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: false,
        });

        userRepository.findByActivationToken.mockResolvedValueOnce(user);

        const output = await authService.activateUser(input);

        expect(userRepository.findByActivationToken).toHaveBeenCalledWith(input.token);
        expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }));
        expect(output.valid).toBe(true);
        expect(output.user).toEqual(new UserDTO(user.id, user.username, user.name, user.email, user.role, true));
    });

    it('should return error if the user is not found', async () => {
        const input: ActivateUserInput = {
            token: 'invalid-token',
        };

        userRepository.findByActivationToken.mockResolvedValueOnce(null);

        const output = await authService.activateUser(input);

        expect(userRepository.findByActivationToken).toHaveBeenCalledWith(input.token);
        expect(userRepository.update).not.toHaveBeenCalled();
        expect(output.valid).toBe(false);
        expect(output.error).toBe('User does not exist.');
        expect(output.user).toBeUndefined();
    });

    it('should handle errors during user update', async () => {
        const input: ActivateUserInput = {
            token: 'valid-token',
        };

        const user = new User({
            _id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: false,
        });

        userRepository.findByActivationToken.mockResolvedValueOnce(user);
        userRepository.update.mockRejectedValueOnce(new Error('Database update error'));

        await expect(authService.activateUser(input)).rejects.toThrow('Database update error');

        expect(userRepository.findByActivationToken).toHaveBeenCalledWith(input.token);
        expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }));
    });
});
