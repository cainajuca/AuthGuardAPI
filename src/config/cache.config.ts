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

export const disconnectRedisClient = async (): Promise<void> => {
    if (redisClient) {
        try {
            await redisClient.disconnect();
            console.log('Redis client disconnected.');
            redisClient = null; // Set to null to allow reconnection later
        } catch (error) {
            console.error('Error disconnecting from Redis:', error);
        }
    }
};