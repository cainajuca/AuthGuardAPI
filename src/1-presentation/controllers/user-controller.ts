import { Request, Response} from "express";

import { UserVM } from "../view-models/user-vm";

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { UpdateUserUseCaseInput } from "@application/use-cases/update-user-use-case/update-user-use-case.dto";
import { IUserController } from "./protocols";
import { IDeleteUserUseCase, IUpdateUserUseCase } from "@application/use-cases/protocols";
import { DeleteUserUseCaseInput } from "@application/use-cases/delete-user-use-case/delete-user-use-case.dto";

export class UserController implements IUserController {
	
	constructor(
		private readonly updateUserUseCase: IUpdateUserUseCase,
		private readonly deleteUserUseCase: IDeleteUserUseCase,
		private readonly userRepository: IUserRepository) { }

	async getAllUsers(req: Request, res: Response): Promise<Response> {
		try {
			
			const users = await this.userRepository.findAllUsers();

			if (!users) {
				return res.status(404).send({ message: 'User not found' });
			}

			const usersVM = users.map(u => new UserVM(u.id, u.username, u.name, u.email));
			
			return res.status(200).json(usersVM);

		} catch (error) {
			console.log(error);
			return res.status(400).send({ message: error.message });
		}
	}

	async getUserById(req: Request, res: Response): Promise<Response> {
		try {
			
			const { id } = req.params;

			const user = await this.userRepository.findById(id);

			if (!user) {
				return res.status(404).send({ message: 'User not found' });
			}

			const userVM = new UserVM(user.id, user.username, user.name, user.email);

			return res.status(200).json(userVM);

		} catch (error) {
			console.log(error);
			return res.status(400).send({ message: error.message });
		}
	}

	async updateUser(req: Request, res: Response): Promise<Response> {
		try {
			const input: UpdateUserUseCaseInput = req.body;
			const output = await this.updateUserUseCase.handleUpdateUser(input);

			return res.status(200).send(output);

		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}

	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;

			const input: DeleteUserUseCaseInput = { id };

			const output = await this.deleteUserUseCase.handleDeleteUser(input);

			return res.status(200).send(output);

		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}
}
