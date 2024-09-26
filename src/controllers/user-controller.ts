import { Request, Response } from "express";
import { UserRepository } from 'repositories/user-repository';
import { RedisCacheService, CacheKeys } from 'services/redis-cache.service';
import { IUser } from "models/user";
import { UserService } from "services/user.service";
import { OutputVM } from "dtos/output.vm";
import { UserDTO } from "dtos/user.dto";
import { IUserController } from "./protocols";
import { UpdateUserInput, DeleteUserInput } from 'services/dtos';
import logger from 'config/logger.config';

export class UserController implements IUserController {

	constructor(
		private readonly userService: UserService,
		private readonly userRepository: UserRepository,
		private readonly cacheService: RedisCacheService) { }

	async getAllUsers(req: Request, res: Response): Promise<Response> {
		try {
			logger.info('Fetching all users.');
			const cacheKey = CacheKeys.USER_LIST;
			let users = await this.cacheService.get(cacheKey) as IUser[];

			if (!users) {
				logger.info('Cache miss for user list, fetching from database.');
				users = await this.userRepository.findAllUsers(true);
				await this.cacheService.set(cacheKey, users);
				logger.info('User list cached.');
			} else {
				logger.info('User list found in cache.');
			}

			const usersVM = users.map(u => new UserDTO(u.id, u.username, u.name, u.email, u.role, u.isActive));
			
			return res.status(200).send(new OutputVM(200, usersVM, []));
		} catch (error) {
			logger.error('Error fetching all users', { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async getInactiveUsers(req: Request, res: Response): Promise<Response> {
		try {
			logger.info('Fetching inactive users.');
			const users = await this.userRepository.findAllUsers(false);

			const usersVM = users.map(u => new UserDTO(u.id, u.username, u.name, u.email, u.role, u.isActive));
			
			return res.status(200).send(new OutputVM(200, usersVM, []));
		} catch (error) {
			logger.error('Error fetching inactive users', { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async getUserById(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			logger.info(`Fetching user by ID: ${id}`);

			const user = await this.userRepository.findById(id);

			if (!user) {
				logger.warn(`User not found by ID: ${id}`);
				return res.status(404).send(new OutputVM(404, null, ['User not found']));
			}

			const userVM = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);

			return res.status(200).send(new OutputVM(200, userVM, []));
		} catch (error) {
			logger.error(`Error fetching user by ID: ${req.params.id}`, { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async getUserByUsername(req: Request, res: Response): Promise<Response> {
		try {
			const { username } = req.params;
			logger.info(`Fetching user by username: ${username}`);

			const user = await this.userRepository.findByUsername(username);

			if (!user) {
				logger.warn(`User not found by username: ${username}`);
				return res.status(404).send(new OutputVM(404, null, ['User not found']));
			}

			const userVM = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);

			return res.status(200).send(new OutputVM(200, userVM, []));
		} catch (error) {
			logger.error(`Error fetching user by username: ${req.params.username}`, { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async updateUser(req: Request, res: Response): Promise<Response> {
		try {
			const input: UpdateUserInput = req.body;
			logger.info(`Updating user with ID: ${input.id}`);

			const output = await this.userService.updateUser(input);

			if (!output.valid) {
				logger.warn(`Failed to update user with ID: ${input.id} - ${output.error}`);
				return res.status(400).send(new OutputVM(400, null, [output.error]));
			}

			if (output.valid && output.user.isActive) {
				await this.cacheService.delete(CacheKeys.USER_LIST);
				logger.info(`User list cache invalidated after user update with ID: ${input.id}`);
			}

			return res.status(200).send(new OutputVM(200, output, []));
		} catch (error) {
			logger.error(`Error updating user with ID: ${req.body.id}`, { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			logger.info(`Deleting user with ID: ${id}`);

			const input: DeleteUserInput = { id };

			const output = await this.userService.deleteUser(input);

			if (!output.valid) {
				logger.warn(`Failed to delete user with ID: ${id} - ${output.error}`);
				return res.status(400).send(new OutputVM(400, null, [output.error]));
			}

			if (output.valid && output.user.isActive) {
				await this.cacheService.delete(CacheKeys.USER_LIST);
				logger.info(`User list cache invalidated after user deletion with ID: ${id}`);
			}

			return res.status(200).send(new OutputVM(200, output, []));
		} catch (error) {
			logger.error(`Error deleting user with ID: ${req.params.id}`, { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}
}
