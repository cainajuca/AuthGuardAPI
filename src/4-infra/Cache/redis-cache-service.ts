import { ICacheService } from '@domain/Cache/cache-service.interface';
import { RedisClientType } from 'redis';

export class RedisCacheService implements ICacheService {

	constructor(private readonly redisClient: RedisClientType) { }

	async get<T>(key: string): Promise<T | null> {
		const data = await this.redisClient.get(key);
		return data ? JSON.parse(data) : null;
	}

	async set<T>(key: string, value: T, ttl?: number): Promise<void> {
		await this.redisClient.set(key, JSON.stringify(value), { EX: ttl });
	}

	async delete(key: string): Promise<void> {
		await this.redisClient.del(key);
	}
}
