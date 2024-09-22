import { UserRepository } from 'repositories/user-repository';
import { AuthService } from 'services/auth.service';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { generateAccessRefreshTokens, TokenPair } from 'utils/jwt';
import { RefreshTokenInput } from 'services/dtos';
import { RefreshToken } from 'models/refresh-token';

jest.mock('utils/jwt', () => ({
    generateAccessRefreshTokens: jest.fn(),
    TokenPair: jest.fn().mockImplementation((token: string, expiresAt: Date) => ({
        token,
        expiresAt,
    })),
}));

describe('AuthService - refreshToken', () => {
    let authService: AuthService;
    let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;

    beforeEach(() => {
        refreshTokenRepository = {
            findByToken: jest.fn(),
            deleteByToken: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<RefreshTokenRepository>;

        const mockUserRepository = {} as jest.Mocked<UserRepository>;

        authService = new AuthService(mockUserRepository, refreshTokenRepository);
    });

    it('should return new access and refresh tokens if the input is valid', async () => {
        const input: RefreshTokenInput = {
            userId: 'user1',
            username: 'john.doe',
            role: 'user',
            refreshToken: 'valid-refresh-token',
        };

        const dbRefreshToken = new RefreshToken({
            token: 'valid-refresh-token',
            userId: 'user1',
            expiresAt: new Date(),
            createdAt: new Date(),
        });

        const accessTokenPair = new TokenPair('new-access-token', new Date(Date.now() + 3600000)); // 1 hour
        const refreshTokenPair = new TokenPair('new-refresh-token', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days

        refreshTokenRepository.findByToken.mockResolvedValueOnce(dbRefreshToken);
        (generateAccessRefreshTokens as jest.Mock).mockReturnValueOnce([accessTokenPair, refreshTokenPair]);

        const output = await authService.refreshToken(input);

        expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(input.refreshToken);
        expect(generateAccessRefreshTokens).toHaveBeenCalledWith({
            _id: input.userId,
            username: input.username,
            role: input.role,
        });
        expect(refreshTokenRepository.deleteByToken).toHaveBeenCalledWith(input.refreshToken);

        expect(refreshTokenRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            token: refreshTokenPair.token,
            userId: input.userId,
            expiresAt: refreshTokenPair.expiresAt,
        }));

        expect(output.valid).toBe(true);
        expect(output.accessToken).toBe(accessTokenPair.token);
        expect(output.refreshToken).toBe(refreshTokenPair.token);
    });

    it('should return invalid if the refresh token does not exist', async () => {
        const input: RefreshTokenInput = {
            userId: 'user1',
            username: 'john.doe',
            role: 'user',
            refreshToken: 'invalid-refresh-token',
        };

        refreshTokenRepository.findByToken.mockResolvedValueOnce(null);

        const output = await authService.refreshToken(input);

        expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(input.refreshToken);
        expect(refreshTokenRepository.deleteByToken).not.toHaveBeenCalled();
        expect(refreshTokenRepository.save).not.toHaveBeenCalled();
        expect(output.valid).toBe(false);
        expect(output.accessToken).toBeUndefined();
        expect(output.refreshToken).toBeUndefined();
    });

    it('should return invalid if the user Id does not match', async () => {
        const input: RefreshTokenInput = {
            userId: 'user1',
            username: 'john.doe',
            role: 'user',
            refreshToken: 'valid-refresh-token',
        };

        const dbRefreshToken = new RefreshToken({
            token: 'valid-refresh-token',
            userId: 'differentUserId',
            expiresAt: new Date(),
            createdAt: new Date(),
        });

        refreshTokenRepository.findByToken.mockResolvedValueOnce(dbRefreshToken);

        const output = await authService.refreshToken(input);

        expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(input.refreshToken);
        expect(refreshTokenRepository.deleteByToken).not.toHaveBeenCalled();
        expect(refreshTokenRepository.save).not.toHaveBeenCalled();
        expect(output.valid).toBe(false);
        expect(output.accessToken).toBeUndefined();
        expect(output.refreshToken).toBeUndefined();
    });

    it('should handle errors during refresh token process', async () => {
        const input: RefreshTokenInput = {
            userId: 'user1',
            username: 'john.doe',
            role: 'user',
            refreshToken: 'valid-refresh-token',
        };

        refreshTokenRepository.findByToken.mockRejectedValueOnce(new Error('Database error'));

        await expect(authService.refreshToken(input)).rejects.toThrow('Database error');

        expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(input.refreshToken);
        expect(refreshTokenRepository.deleteByToken).not.toHaveBeenCalled();
        expect(refreshTokenRepository.save).not.toHaveBeenCalled();
    });
});
