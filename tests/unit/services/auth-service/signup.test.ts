import { UserRepository } from 'repositories/user-repository';
import { AuthService } from 'services/auth.service';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { generateAccessRefreshTokens, generateActivationToken, TokenPair } from 'utils/jwt';
import { SignUpInput } from 'services/dtos';
import { User } from 'models/user';
import { sendActivationEmail } from 'services/email-sender.service';
import { hashPassword } from 'utils/bcrypt';

jest.mock('utils/bcrypt', () => ({
    hashPassword: jest.fn(),
}));

jest.mock('services/email-sender.service', () => ({
    sendActivationEmail: jest.fn(),
}));

jest.mock('utils/jwt', () => ({
    generateActivationToken: jest.fn(),
    generateAccessRefreshTokens: jest.fn(),
    TokenPair: jest.fn().mockImplementation((token: string, expiresAt: Date) => ({
        token,
        expiresAt,
    })),
}));

describe('AuthService - signUp', () => {
    let authService: AuthService;
    let userRepository: jest.Mocked<UserRepository>;
    let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks before each test

        userRepository = {
            findByUsername: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        refreshTokenRepository = {
            save: jest.fn(),
        } as unknown as jest.Mocked<RefreshTokenRepository>;

        authService = new AuthService(userRepository, refreshTokenRepository);
    });

    it('should return an error if passwords do not match', async () => {
        const input: SignUpInput = {
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            confirmPassword: 'differentpassword',
        };

        const output = await authService.signUp(input);

        expect(output.valid).toBe(false);
        expect(output.error).toBe('Please ensure password and confirm password are matching.');
    });

    it('should return an error if user already exists', async () => {
        const input: SignUpInput = {
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };

        const existingUser = new User({
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true,
        });

        userRepository.findByUsername.mockResolvedValueOnce(existingUser);

        const output = await authService.signUp(input);

        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
        expect(output.valid).toBe(false);
        expect(output.error).toBe('User already exists.');
    });

    it('should sign up a new user successfully', async () => {
        const input: SignUpInput = {
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };

        userRepository.findByUsername.mockResolvedValueOnce(null); // No user found

        const passwordHash = 'hashedpassword123';
        const activationTokenPair = new TokenPair('activation-token', new Date(Date.now() + 3600000));
        const accessTokenPair = new TokenPair('access-token', new Date(Date.now() + 3600000));
        const refreshTokenPair = new TokenPair('refresh-token', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

        (hashPassword as jest.Mock).mockResolvedValueOnce(passwordHash);
        (generateActivationToken as jest.Mock).mockReturnValueOnce(activationTokenPair);
        (generateAccessRefreshTokens as jest.Mock).mockReturnValueOnce([accessTokenPair, refreshTokenPair]);

        const output = await authService.signUp(input);

        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
        expect(hashPassword).toHaveBeenCalledWith(input.password);
        expect(generateActivationToken).toHaveBeenCalledWith({
            _id: expect.any(String),
            username: input.username,
            role: 'user',
        });

        expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            username: input.username,
            email: input.email,
            password: passwordHash,
            activationToken: activationTokenPair.token,
            activationTokenExpiresAt: activationTokenPair.expiresAt,
        }));

        expect(refreshTokenRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            token: refreshTokenPair.token,
            userId: expect.any(String),
            expiresAt: refreshTokenPair.expiresAt,
        }));

        expect(sendActivationEmail).toHaveBeenCalledWith(input.email, activationTokenPair.token, activationTokenPair.expiresAt);
        expect(output.valid).toBe(true);
        expect(output.user).toBeDefined();
        expect(output.accessToken).toBe(accessTokenPair.token);
        expect(output.refreshToken).toBe(refreshTokenPair.token);
    });

    it('should handle errors during the sign-up process', async () => {
        const input: SignUpInput = {
            username: 'john.doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };

        userRepository.findByUsername.mockRejectedValueOnce(new Error('Database error'));

        const output = await authService.signUp(input);

        expect(userRepository.findByUsername).toHaveBeenCalledWith(input.username);
        expect(output.valid).toBe(false);
        expect(output.error).toBe('An error occurred during sign-up.');
    });
});
