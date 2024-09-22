import { UserRepository } from 'repositories/user-repository';
import { AuthService } from 'services/auth.service';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { generateToken, TokenPair } from 'utils/jwt';
import { RequestPasswordResetInput } from 'services/dtos';
import { User } from 'models/user';
import { sendResetPasswordEmail } from 'services/email-sender.service';

jest.mock('utils/jwt', () => ({
    generateToken: jest.fn(),
    TokenPair: jest.fn().mockImplementation((token: string, expiresAt: Date) => ({
        token,
        expiresAt,
    })),
}));

jest.mock('services/email-sender.service', () => ({
    sendResetPasswordEmail: jest.fn(),
}));

describe('AuthService - requestPasswordReset', () => {
    let authService: AuthService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = {
            findByEmail: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        const mockRefreshTokenRepository  = {} as jest.Mocked<RefreshTokenRepository>;

        authService = new AuthService(userRepository, mockRefreshTokenRepository);
    });

    it('should send reset password email if user is found', async () => {
        const input: RequestPasswordResetInput = {
            email: 'john.doe@example.com',
        };

        const user = new User({
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
            resetToken: '',
            resetTokenExpiresAt: null,
        });

        const tokenPair = new TokenPair('reset-token', new Date(Date.now() + 3600000)); // 1h

        userRepository.findByEmail.mockResolvedValueOnce(user);
        (generateToken as jest.Mock).mockReturnValueOnce(tokenPair);

        const output = await authService.requestPasswordReset(input);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(generateToken).toHaveBeenCalledWith({
            _id: expect.any(String),
            username: user.username,
            role: user.role,
        }, '1h');
        expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            resetToken: tokenPair.token,
            resetTokenExpiresAt: tokenPair.expiresAt,
        }));
        expect(sendResetPasswordEmail).toHaveBeenCalledWith(user.email, tokenPair.token);
        expect(output.valid).toBe(true);
        expect(output.error).toBeUndefined();
    });

    it('should return an error if no user is found with the provided email', async () => {
        const input: RequestPasswordResetInput = {
            email: 'unknown@example.com',
        };

        userRepository.findByEmail.mockResolvedValueOnce(null);

        const output = await authService.requestPasswordReset(input);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(generateToken).not.toHaveBeenCalled();
        expect(userRepository.update).not.toHaveBeenCalled();
        expect(sendResetPasswordEmail).not.toHaveBeenCalled();
        expect(output.valid).toBe(false);
        expect(output.error).toBe('No user was found with this e-mail');
    });

    it('should handle errors during the password reset process', async () => {
        const input: RequestPasswordResetInput = {
            email: 'john.doe@example.com',
        };

        const user = new User({
            _id: 'user1',
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
            resetToken: '',
            resetTokenExpiresAt: null,
        });
        
        userRepository.findByEmail.mockResolvedValueOnce(user);
        userRepository.update.mockRejectedValueOnce(new Error('Database error'));
        
        const tokenPair = new TokenPair('reset-token', new Date(Date.now() + 3600000));
        (generateToken as jest.Mock).mockReturnValueOnce(tokenPair);

        const output = await authService.requestPasswordReset(input);

        expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
        expect(generateToken).toHaveBeenCalled();
        expect(userRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            resetToken: tokenPair.token,
            resetTokenExpiresAt: tokenPair.expiresAt,
        }));
        expect(sendResetPasswordEmail).not.toHaveBeenCalled();
        expect(output.valid).toBe(false);
        expect(output.error).toBe('An error occurred while attempting to send the password reset email');
    });
});
