import { ObjectId } from 'mongodb';

import { ISignUpUseCase } from '../protocols';

import { SignUpUseCaseInput, SignUpUseCaseOutput } from './sign-up-use-case.dto'

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { User } from '@domain/entities/user';
import { hashPassword } from '@shared/utils/bcrypt'
import { generateToken } from '@shared/utils/jwt'
import { OutputVM } from '@application/dtos/output-vm';

export class SignUpUseCase implements ISignUpUseCase {
	
	constructor(private readonly userRepository: IUserRepository) {}

	async handleSignUp(input: SignUpUseCaseInput): Promise<OutputVM<SignUpUseCaseOutput>> {

		if(input.password != input.confirmPassword)
			return new OutputVM<SignUpUseCaseOutput>(400, null, ['Please ensure password and confirm password are matching']);

		const existingUser = await this.userRepository.findByUsername(input.username);

		if(existingUser)
			return new OutputVM<SignUpUseCaseOutput>(400, null, ['User already exists.']);

		const passwordHash = await hashPassword(input.password);
		
		const user = new User(
			new ObjectId().toString(), 
			input.username,
			input.name,
			input.email,
			passwordHash,
			'user'
		);

		await this.userRepository.save(user);

		const token = generateToken({
			_id: user.id.toString(),
			username: user.username,
			role: user.role,
		});

		const output = new SignUpUseCaseOutput(user, token);

		return new OutputVM<SignUpUseCaseOutput>(201, output, []);
	}
}
