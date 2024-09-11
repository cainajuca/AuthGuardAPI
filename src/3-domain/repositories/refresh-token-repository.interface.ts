import { RefreshToken } from '../entities/refresh-token';

export interface IRefreshTokenRepository {
	findByToken(token: string): Promise<RefreshToken | null>;
	save(refreshToken: RefreshToken): Promise<RefreshToken>;
	deleteByToken(token: string): Promise<void>;
}