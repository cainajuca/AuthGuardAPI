import { IRefreshTokenRepository } from '@domain/repositories/refresh-token-repository.interface';
import { RefreshToken } from '@domain/entities/refresh-token';
import { generateAccessRefreshTokens } from '@shared/utils/jwt';
import { IRefreshTokenUseCase } from '../protocols';
import { RefreshTokenUseCaseInput, RefreshTokenUseCaseOutput } from './refresh-token-use-case.dto';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {

    constructor(private readonly refreshTokenRepository: IRefreshTokenRepository) {}

    async handleRefreshToken(input: RefreshTokenUseCaseInput): Promise<RefreshTokenUseCaseOutput> {

        const dbRefreshToken = await this.refreshTokenRepository.findByToken(input.refreshToken);

        if(!dbRefreshToken || input.userId != dbRefreshToken.userId) {
            return new RefreshTokenUseCaseOutput(false);
        }
        
        const { accessToken, refreshToken, refreshTokenExpiresAt } = generateAccessRefreshTokens({
            _id: input.userId,
            username: input.username,
            role: input.role,
        });
        
        await this.refreshTokenRepository.deleteByToken(input.refreshToken);
        
        const refreshTokenEntity = new RefreshToken(refreshToken, input.userId, refreshTokenExpiresAt, new Date());
        await this.refreshTokenRepository.save(refreshTokenEntity);
                
        return new RefreshTokenUseCaseOutput(true, accessToken, refreshToken);
    }
}
