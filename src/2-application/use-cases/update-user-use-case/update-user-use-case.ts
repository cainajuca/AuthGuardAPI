import { OutputVM } from '@application/dtos/output.vm';
import { IUpdateUserUseCase } from '../protocols';

import { UpdateUserUseCaseInput, UpdateUserUseCaseOutput } from '.'

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { hashPassword } from '@shared/utils/bcrypt'

export class UpdateUserUseCase implements IUpdateUserUseCase {

	constructor(private readonly userRepository: IUserRepository) { }

	async handleUpdateUser(input: UpdateUserUseCaseInput): Promise<OutputVM<UpdateUserUseCaseOutput>> {

		const user = await this.userRepository.findByUsername(input.username);

		if(!user) {
			return new OutputVM<UpdateUserUseCaseOutput>(400, null, ['User does not exist.']);
		}

		if(input.password != input.confirmPassword) {
			return new OutputVM<UpdateUserUseCaseOutput>(400, null, ['Password confirmation does not match the password.']);
		}

		const passwordHash = await hashPassword(input.password);
		
		user.name = input.name;
		user.email = input.email;
		user.username = input.username;
		user.password = passwordHash;

		await this.userRepository.update(user);

		const output = new UpdateUserUseCaseOutput(user);

		return new OutputVM<UpdateUserUseCaseOutput>(200, output, []);
	}
}
