import { ICacheService } from '@domain/Cache/cache-service.interface';
import { RedisClientType } from 'redis';

export class RedisCacheService implements ICacheService {

	constructor(private readonly redisClient: RedisClientType) { }

	async get<T>(key: string): Promise<T | null> {

		try {
			const data = await this.redisClient.get(key);
			
			return data ? JSON.parse(data) : null;
		} catch (error) {
			return null;
		}
	}

	async set<T>(key: string, value: T, ttl?: number): Promise<void> {

		try {
			await this.redisClient.set(key, JSON.stringify(value), { EX: ttl });
		} catch (error) {
		}
	}

	async delete(key: string): Promise<void> {

		try {
			await this.redisClient.del(key);
		} catch (error) {
		}
	}
}
