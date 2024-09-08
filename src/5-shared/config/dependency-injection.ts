import { UserRepository } from '@infra/repositories/user-repository'
import { SignUpUseCase } from '@application/use-cases/sign-up-use-case/sign-up-use-case'
import { UpdateUserUseCase } from '@application/use-cases/update-user-use-case/update-user-use-case';
import { DeleteUserUseCase } from '@application/use-cases/delete-user-use-case/delete-user-use-case';
import { UserController } from '@presentation/controllers/user-controller';
import { AuthController } from '@presentation/controllers/auth-controller';

import { RedisCacheService } from '@infra/Cache/redis-cache-service';
import { createRedisClient } from '@infra/Cache/context';

export const initDependencies = async () => {
	// repositories
	const userRepository = new UserRepository();

	// cache
	const redisClient = await createRedisClient();
	const cacheService = new RedisCacheService(redisClient);

	// use cases
	const signUpUseCase = new SignUpUseCase(userRepository);
	const updateUserUseCase = new UpdateUserUseCase(userRepository);
	const deleteUserUseCase = new DeleteUserUseCase(userRepository);

	// controllers
	const authController = new AuthController(signUpUseCase, userRepository, cacheService);
	const userController = new UserController(updateUserUseCase, deleteUserUseCase, userRepository, cacheService);

	return {
		userRepository,

		signUpUseCase,
		updateUserUseCase,

		authController,
		userController,
	};
}
