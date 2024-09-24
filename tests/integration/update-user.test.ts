import { Express } from 'express'; 
import request from 'supertest';
import mongoose from 'mongoose';
import { IUser, User } from 'models/user';
import { createRedisClient, disconnectRedisClient } from 'config/cache.config';
import { CacheKeys } from 'services/redis-cache.service';
import { createApp } from 'app';
import { RedisClientType } from 'redis';
import { generateAccessRefreshTokens } from 'utils/jwt';

let app: Express;
let redisClient: RedisClientType;

beforeAll(async () => {
    app = await createApp();
    redisClient = await createRedisClient();
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
});

afterAll(async () => {
    await mongoose.connection.close();
    await disconnectRedisClient(); 
});

describe('PATCH /users/:id - Update User', () => {

    let user : IUser;
    let token : string;

    beforeEach(async () => {
        // Clear the database and Redis before each test
        await User.deleteMany({});
        await redisClient.flushAll();

        // Create a test user in the database
        user = new User({
            username: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'hashedpassword',
            role: 'user',
            isActive: true
        });
        await user.save();

        // Generate a JWT token for the test user
        const [ accessTokenPair, _ ] = generateAccessRefreshTokens({
            _id: user._id.toString(),
            username: user.username,
            role: user.role
        });

        token = accessTokenPair.token;
    });

    it('should update the user and clear the cache', async () => {
        const newUserData = {
            id: user._id.toString(),
            username: 'testuser',
            name: 'Updated User',
            email: 'updateduser@example.com',
            password: 'newpassword',
            confirmPassword: 'newpassword'
        };

        // Make a PATCH request to update the user
        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(200);

        // Check that the user was updated in the database
        const updatedUser = await User.findById(user._id);
        expect(updatedUser).toBeDefined();
        expect(updatedUser.username).toBe(newUserData.username);
        expect(updatedUser.name).toBe(newUserData.name);
        expect(updatedUser.email).toBe(newUserData.email);

        // Verify that the password was updated (assume password hashing is being tested separately)
        expect(updatedUser.password).not.toBe(user.password); // The password should now be hashed

        // Verify that the Redis cache was cleared
        const cachedUsers = await redisClient.get(CacheKeys.USER_LIST);
        expect(cachedUsers).toBeNull(); // Cache should be cleared
    });

    it('should return 400 if passwords do not match', async () => {
        const newUserData = {
            id: user._id.toString(),
            username: 'testuser',
            name: 'Updated User',
            email: 'updateduser@example.com',
            password: 'newpassword',
            confirmPassword: 'differentpassword'
        };

        // Make a PATCH request to update the user with mismatched passwords
        const response = await request(app)
            .patch(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newUserData)
            .expect(400);

        expect(response.body.errors[0]).toBe('Password confirmation does not match the password.');
    });

    it('should return 403 if the token does not match the user', async () => {
        const newUserData = {
            id: user._id.toString(),
            username: 'updateduser',
            name: 'Updated User',
            email: 'updateduser@example.com',
            password: 'newpassword',
            confirmPassword: 'newpassword'
        };

        // Create a JWT token for a different user
        const [ accessTokenPair, _ ] = generateAccessRefreshTokens({
            _id: new mongoose.Types.ObjectId().toString(),
            username: 'anotheruser',
            role: 'user'
        });

        const differentToken = accessTokenPair.token;

        // Attempt to update the user with a token that doesn't match the user
        await request(app)
            .patch(`/users/${user._id}`)
            .set('Authorization', `Bearer ${differentToken}`)
            .send(newUserData)
            .expect(403);
    });
});
