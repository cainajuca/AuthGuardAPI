import { UserRepository } from 'repositories/user-repository'
import { UserController } from 'controllers/user-controller';
import { AuthController } from 'controllers/auth-controller';

import { RedisCacheService } from 'services/redis-cache.service';
import { createRedisClient } from 'config/cache.config'

import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { UserService } from 'services/user.service';
import { AuthService } from 'services/auth.service';

export const initDependencies = async () => {
	// repositories
	const userRepository = new UserRepository();
	const refreshTokenRepository = new RefreshTokenRepository();

	// services
	const redisClient = await createRedisClient();
	const cacheService = new RedisCacheService(redisClient);
	const authService = new AuthService(userRepository, refreshTokenRepository);
	const userService = new UserService(userRepository);

	// controllers
	const authController = new AuthController(authService, userRepository, refreshTokenRepository, cacheService);
	const userController = new UserController(userService, userRepository, cacheService);

	return {
		authController,
		userController,
	};
}
