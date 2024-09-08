import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export const createRedisClient = async (): Promise<RedisClientType> => {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL,
        });

        await redisClient.connect();
        console.log('Redis client connected.'); // remove when completed
    }

    return redisClient;
};