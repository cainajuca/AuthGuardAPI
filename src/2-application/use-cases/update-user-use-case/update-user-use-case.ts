import { IUpdateUserUseCase } from '../protocols';

import { UpdateUserUseCaseInput, UpdateUserUseCaseOutput } from './update-user-use-case.dto'

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { hashPassword } from '@shared/utils/bcrypt'

export class UpdateUserUseCase implements IUpdateUserUseCase {

	constructor(private readonly userRepository: IUserRepository) { }

	async handleUpdateUser(input: UpdateUserUseCaseInput): Promise<UpdateUserUseCaseOutput | null> {

		const user = await this.userRepository.findByUsername(input.username);

		if(!user) {
			throw new Error('User does not exist.');
		}

		if(input.password != input.confirmPassword) {
			throw new Error('Password confirmation does not match the password.');
		}

		const passwordHash = await hashPassword(input.password);
		
		user.name = input.name;
		user.email = input.email;
		user.username = input.username;
		user.password = passwordHash;

		await this.userRepository.update(user);

		return new UpdateUserUseCaseOutput(user)
	}
}
