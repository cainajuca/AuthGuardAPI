import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export const createRedisClient = async (): Promise<RedisClientType> => {
    try {
        if (!redisClient) {
            redisClient = createClient({
                url: process.env.REDIS_URL,
            });
    
            await redisClient.connect();
            console.log('Redis client connected.');
        }
    
        return redisClient;
    } catch (error) {
        console.log('No caching available.');
    }
};