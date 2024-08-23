import { SignUpUseCaseInput, SignUpUseCaseOutput } from './sign-up-use-case.dto'

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { User } from '@domain/entities/user';
import { hashPassword } from '@shared/utils/bcrypt'
import { generateToken } from '@shared/utils/jwt'
import { ISignUpUseCase } from '../protocols';

import { ObjectId } from 'mongodb';

export class SignUpUseCase implements ISignUpUseCase {
	
	constructor(private readonly userRepository: IUserRepository) {}

	async handleSignUp(input: SignUpUseCaseInput): Promise<SignUpUseCaseOutput | null> {

		const existingUser = await this.userRepository.findByUsername(input.username);

		if(existingUser) {
			throw new Error('User already exists.');
		}

		const passwordHash = await hashPassword(input.password);
		
		const user = new User(
			new ObjectId().toString(), 
			input.username,
			input.name,
			input.email,
			passwordHash,
		);

		await this.userRepository.save(user);

		const token = generateToken({
			_id: user.id.toString(),
			username: user.username,
		});

		return new SignUpUseCaseOutput(user, token)
	}
}
