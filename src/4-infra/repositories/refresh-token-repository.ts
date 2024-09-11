import { RefreshTokenModel } from '../database/schemas/refresh-token-schema';
import { IRefreshTokenRepository } from '@domain/repositories/refresh-token-repository.interface';
import { RefreshToken } from '@domain/entities/refresh-token';

export class RefreshTokenRepository implements IRefreshTokenRepository {
    
    async findByToken(token: string): Promise<RefreshToken | null> {
        
        const refreshTokenDoc = await RefreshTokenModel.findOne({ token }).exec();

        if (!refreshTokenDoc) return null;

        return new RefreshToken(
            refreshTokenDoc.token,
            refreshTokenDoc.userId,
            refreshTokenDoc.expiresAt,
            refreshTokenDoc.createdAt
        );
    }
    
    async save(refreshToken: RefreshToken): Promise<RefreshToken> {

        const createdToken = new RefreshTokenModel({
            token: refreshToken.token,
            userId: refreshToken.userId,
            expiresAt: refreshToken.expiresAt,
            createdAt: refreshToken.createdAt
        });
      
        await createdToken.save();
          
        return new RefreshToken(
            createdToken.token,
            createdToken.userId,
            createdToken.expiresAt,
            createdToken.createdAt
        );
    }
    
    async deleteByToken(token: string): Promise<void> {
        await RefreshTokenModel.findOneAndDelete({ token }).exec();
    }
}