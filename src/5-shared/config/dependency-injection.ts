import { UserRepository } from '@infra/repositories/user-repository'
import { SignUpUseCase } from '@application/use-cases/sign-up-use-case/sign-up-use-case'
import { UpdateUserUseCase } from '@application/use-cases/update-user-use-case/update-user-use-case';
import { DeleteUserUseCase } from '@application/use-cases/delete-user-use-case/delete-user-use-case';
import { UserController } from '@presentation/controllers/user-controller';
import { AuthController } from '@presentation/controllers/auth-controller';

import { RedisCacheService } from '@infra/cache/redis-cache-service';
import { createRedisClient } from '@infra/cache/context';
import { RefreshTokenRepository } from '@infra/repositories/refresh-token-repository';
import { RefreshTokenUseCase } from '@application/use-cases/refresh-token-use-case/refresh-token-use-case';

export const initDependencies = async () => {
	// repositories
	const userRepository = new UserRepository();
	const refreshTokenRepository = new RefreshTokenRepository();

	// cache
	const redisClient = await createRedisClient();
	const cacheService = new RedisCacheService(redisClient);

	// use cases
	const signUpUseCase = new SignUpUseCase(userRepository, refreshTokenRepository);
	const updateUserUseCase = new UpdateUserUseCase(userRepository);
	const deleteUserUseCase = new DeleteUserUseCase(userRepository);
	const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository);

	// controllers
	const authController = new AuthController(signUpUseCase, refreshTokenUseCase, userRepository, refreshTokenRepository, cacheService);
	const userController = new UserController(updateUserUseCase, deleteUserUseCase, userRepository, cacheService);

	return {
		userRepository,

		signUpUseCase,
		updateUserUseCase,
		deleteUserUseCase,
		refreshTokenUseCase,

		authController,
		userController,
	};
}
