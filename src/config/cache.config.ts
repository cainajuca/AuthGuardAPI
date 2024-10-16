import { createClient, RedisClientType } from 'redis';
import logger from 'config/logger.config';

let redisClient: RedisClientType | null = null;

export const createRedisClient = async (): Promise<RedisClientType> => {
    try {
        if (!redisClient) {
            redisClient = createClient({
                url: process.env.REDIS_URL,
            });
    
            await redisClient.connect();
            logger.info('Successfully connected to Redis.');
        }
    
        return redisClient;
    } catch (error) {
        logger.warn('No caching available. Failed to connect to Redis.');
    }
};

export const disconnectRedisClient = async (): Promise<void> => {
    if (redisClient) {
        try {
            await redisClient.disconnect();
            logger.info('Redis client disconnected successfully.');
            redisClient = null; // Set to null to allow reconnection later
        } catch (error) {
            logger.error('Error disconnecting from Redis.', { error: error.message, stack: error.stack });
        }
    }
};