import { IRefreshToken, RefreshToken } from '../models/refresh-token';

export class RefreshTokenRepository {
    
    async findByToken(token: string): Promise<IRefreshToken | null> {
        
        const refreshTokenDoc = await RefreshToken.findOne({ token });

        if (!refreshTokenDoc) return null;

        return refreshTokenDoc;
    }
    
    async save(refreshToken: IRefreshToken): Promise<IRefreshToken> {
        return await refreshToken.save();
    }
    
    async deleteByToken(token: string): Promise<void> {
        await RefreshToken.findOneAndDelete({ token });
    }
}