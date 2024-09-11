import { RefreshToken } from '../entities/refresh-token';

export interface IRefreshTokenRepository {
	findByToken(token: string): Promise<RefreshToken | null>;
	save(refreshToken: RefreshToken): Promise<RefreshToken>;
	delete(token: string): Promise<void>;
}