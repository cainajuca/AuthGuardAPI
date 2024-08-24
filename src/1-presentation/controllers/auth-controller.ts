import { Request, Response } from 'express';

import { IAuthController } from './protocols';

import { generateToken } from '@shared/utils/jwt';
import { verifyPassword } from '@shared/utils/bcrypt';
import { SignUpUseCase } from '@application/use-cases/sign-up-use-case/sign-up-use-case';
import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { SignUpUseCaseInput } from '@application/use-cases/sign-up-use-case/sign-up-use-case.dto';

export class AuthController implements IAuthController {
	constructor(
		private readonly signUpUseCase: SignUpUseCase,
		private readonly userRepository: IUserRepository
	) { }

	async signUp(req: Request, res: Response): Promise<Response> {
		try {
			const input: SignUpUseCaseInput = req.body;
			const output = await this.signUpUseCase.handleSignUp(input);
			
			if(!output) {
				return res.status(400).json({ message: 'User already exists' });
			}

			return res.status(201).send(output);

		  } catch (error) {
			return res.status(400).send({ message: error.message });
		  }
	}

	async login(req: Request, res: Response): Promise<Response> {
		try {
			const { username, password } = req.body;

			if(!username || !password)
				return res.status(400).json('Credentials are not in the correct format');

			const user = await this.userRepository.findByUsername(username);

			if(!user)
				return res.status(400).json('User does not exist');

			const isPasswordValid = await verifyPassword(password, user.password);
			
			if (!isPasswordValid)
				return res.status(401).send('Invalid username or password');

			const token = generateToken({
				_id: user.id.toString(),
				username: user.username,
			});

			return res.status(200).json({
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
				token 
			});

		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}
}