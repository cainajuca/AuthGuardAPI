import { UserRepository } from 'repositories/user-repository';
import { AuthService } from 'services/auth.service';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { generateToken, TokenPair } from 'utils/jwt';
import { RequestPasswordResetInput, ResetPasswordInput } from 'services/dtos';
import { User } from 'models/user';
import { sendResetPasswordEmail } from 'services/email-sender.service';
import { hashPassword } from 'utils/bcrypt';

jest.mock('utils/bcrypt', () => ({
    hashPassword: jest.fn(),
}));

describe('AuthService - resetPassword', () => {
    let authService: AuthService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks(); // Clears all mocks before each test

        userRepository = {
            findByEmail: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        const mockRefreshTokenRepository  = {} as jest.Mocked<RefreshTokenRepository>;

        authService = new AuthService(userRepository, mockRefreshTokenRepository);
    });

    it('should reset the password successfully if the user is found', async () => {
        const input: ResetPasswordInput = {
            email: 'john.doe@example.com',
            newPassword: 'newpassword123',
        };

        const user = new User({
            _id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
            resetToken: 'reset-token',
            resetTokenExpiresAt: new Date(Date.now() + 3600000),
        });

        const newPasswordHash = 'newhashedpassword123';

        userRepository.findByEmail.mockResolvedValueOnce(user);
        (hashPassword as jest.Mock).mockResolvedValueOnce(newPasswordHash);

        const output = await authService.resetPassword(input);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(hashPassword).toHaveBeenCalledWith(input.newPassword);
        expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            password: newPasswordHash,
            resetToken: undefined,
            resetTokenExpiresAt: undefined,
        }));
        expect(output.valid).toBe(true);
        expect(output.error).toBeUndefined();
    });

    it('should return an error if no user is found with the provided email', async () => {
        const input: ResetPasswordInput = {
            email: 'unknown@example.com',
            newPassword: 'newpassword123',
        };

        userRepository.findByEmail.mockResolvedValueOnce(null);

        const output = await authService.resetPassword(input);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(hashPassword).not.toHaveBeenCalled(); // Password should not be hashed if user is not found
        expect(userRepository.update).not.toHaveBeenCalled(); // User should not be updated if not found
        expect(output.valid).toBe(false);
        expect(output.error).toBe('No user was found with this e-mail');
    });

    it('should handle errors during the password reset process', async () => {
        const input: ResetPasswordInput = {
            email: 'john.doe@example.com',
            newPassword: 'newpassword123',
        };

        const user = new User({
            _id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
            resetToken: 'reset-token',
            resetTokenExpiresAt: new Date(Date.now() + 3600000),
        });

        userRepository.findByEmail.mockResolvedValueOnce(user);
        (hashPassword as jest.Mock).mockRejectedValueOnce(new Error('Hashing error'));

        const output = await authService.resetPassword(input);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(hashPassword).toHaveBeenCalledWith(input.newPassword);
        expect(userRepository.update).not.toHaveBeenCalled(); // Update should not be called due to error
        expect(output.valid).toBe(false);
        expect(output.error).toBe('An error occurred while attempting to send the password reset email');
    });
});
