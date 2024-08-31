import { Request, Response} from "express";

import { UserVM } from "../view-models/user-vm";

import { IUserController } from "./protocols";

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { UpdateUserUseCaseInput } from "@application/use-cases/update-user-use-case/update-user-use-case.dto";
import { IDeleteUserUseCase, IUpdateUserUseCase } from "@application/use-cases/protocols";
import { DeleteUserUseCaseInput } from "@application/use-cases/delete-user-use-case/delete-user-use-case.dto";
import { OutputVM } from "@application/dtos/output-vm";

export class UserController implements IUserController {
	
	constructor(
		private readonly updateUserUseCase: IUpdateUserUseCase,
		private readonly deleteUserUseCase: IDeleteUserUseCase,
		private readonly userRepository: IUserRepository) { }

	async getAllUsers(req: Request, res: Response): Promise<Response> {
		try {
			
			const users = await this.userRepository.findAllUsers();

			if (!users)
				return res.status(404).send(new OutputVM(404, null, ['User not found']));

			const usersVM = users.map(u => new UserVM(u.id, u.username, u.name, u.email, u.role));
			
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

			const userVM = new UserVM(user.id, user.username, user.name, user.email, user.role);

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

			const userVM = new UserVM(user.id, user.username, user.name, user.email, user.role);

			return res.status(200).send(new OutputVM(200, userVM, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async updateUser(req: Request, res: Response): Promise<Response> {
		try {
			const input: UpdateUserUseCaseInput = req.body;
			const output = await this.updateUserUseCase.handleUpdateUser(input);

			return res.status(output.statusCode).send(output);

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;

			const input: DeleteUserUseCaseInput = { id };

			const output = await this.deleteUserUseCase.handleDeleteUser(input);

			return res.status(output.statusCode).send(output);

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}
}
