import { Request, Response } from 'express';

import { IAuthController } from './protocols';

import { generateToken } from '@shared/utils/jwt';
import { verifyPassword } from '@shared/utils/bcrypt';
import { SignUpUseCase } from '@application/use-cases/sign-up-use-case/sign-up-use-case';
import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { SignUpUseCaseInput } from '@application/use-cases/sign-up-use-case/sign-up-use-case.dto';
import { OutputVM } from '@application/dtos/output-vm';
import { UserDTO } from '@application/use-cases/user-dto';

export class AuthController implements IAuthController {
	constructor(
		private readonly signUpUseCase: SignUpUseCase,
		private readonly userRepository: IUserRepository
	) { }

	async signUp(req: Request, res: Response): Promise<Response> {
		try {
			const input: SignUpUseCaseInput = req.body;
			const output = await this.signUpUseCase.handleSignUp(input);
			
			if(!output || !output.valid) {
				return res.status(400).send(new OutputVM(400, null, ['User already exists']));
			}

			return res.status(output.statusCode).send(output);

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async login(req: Request, res: Response): Promise<Response> {
		try {
			const { username, password } = req.body;

			if(!username || !password)
				return res.status(400).send(new OutputVM(400, null, ['Credentials are not in the correct format']));

			const user = await this.userRepository.findByUsername(username);

			if(!user)
				return res.status(400).send(new OutputVM(400, null, ['User does not exist']));

			const isPasswordValid = await verifyPassword(password, user.password);
			
			if (!isPasswordValid)
				return res.status(400).send(new OutputVM(400, null, ['Invalid username or password']));

			const token = generateToken({
				_id: user.id.toString(),
				username: user.username,
				role: user.role,
			});

			const userVM = new UserDTO(user.id, user.name, user.username, user.email, user.role);
			const output = { userVM, token };

			return res.status(200).send(new OutputVM(200, output, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(200, null, [error.message]));
		}
	}
}