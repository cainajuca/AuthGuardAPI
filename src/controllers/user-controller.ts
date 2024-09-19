// External imports (third-party libraries)
import { Request, Response } from "express";

// Domain-related imports (interfaces, entities)
import { UserRepository } from 'repositories/user-repository';
import { RedisCacheService, CacheKeys } from 'services/redis-cache.service';
import { IUser } from "models/user";

// Application-related imports (use cases, DTOs)
import { UserService } from "services/user.service";
import { OutputVM } from "dtos/output.vm";

// Presentation-related imports (protocols, middlewares)
import { UserDTO } from "dtos/user.dto";
import { IUserController } from "./protocols";


import { UpdateUserInput, DeleteUserInput } from 'services/dtos'

export class UserController implements IUserController {
	
	constructor(
		private readonly userService: UserService,
		private readonly userRepository: UserRepository,
		private readonly cacheService: RedisCacheService) { }

	async getAllUsers(req: Request, res: Response): Promise<Response> {
		try {
			const cacheKey = CacheKeys.USER_LIST;
			let users = await this.cacheService.get(cacheKey) as IUser[];

			if (!users) {
				users = await this.userRepository.findAllUsers(true);
				await this.cacheService.set(cacheKey, users); // no TTL
			}

			const usersVM = users.map(u => new UserDTO(u.id, u.username, u.name, u.email, u.role, u.isActive));
			
			return res.status(200).send(new OutputVM(200, usersVM, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async getInactiveUsers(req: Request, res: Response): Promise<Response> {
		try {

			const users = await this.userRepository.findAllUsers(false);

			const usersVM = users.map(u => new UserDTO(u.id, u.username, u.name, u.email, u.role, u.isActive));
			
			return res.status(200).send(new OutputVM(200, usersVM, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async getUserById(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;

			const user = await this.userRepository.findById(id);

			if (!user)
				return res.status(404).send(new OutputVM(404, null, ['User not found']));

			const userVM = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);

			return res.status(200).send(new OutputVM(200, userVM, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async getUserByUsername(req: Request, res: Response): Promise<Response> {
		try {
			
			const { username } = req.params;

			const user = await this.userRepository.findByUsername(username);

			if (!user)
				return res.status(404).send(new OutputVM(404, null, ['User not found']));

			const userVM = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);

			return res.status(200).send(new OutputVM(200, userVM, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async updateUser(req: Request, res: Response): Promise<Response> {
		try {
			const input: UpdateUserInput = req.body;
			const output = await this.userService.updateUser(input);

			if (output.valid && output.data.user.isActive) {
				await this.cacheService.delete(CacheKeys.USER_LIST);
			}

			return res.status(output.statusCode).send(output);

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;

			const input: DeleteUserInput = { id };

			const output = await this.userService.deleteUser(input);

			if (output.valid && output.data.user.isActive) {
				await this.cacheService.delete(CacheKeys.USER_LIST);
			}

			return res.status(output.statusCode).send(output);

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}
}
