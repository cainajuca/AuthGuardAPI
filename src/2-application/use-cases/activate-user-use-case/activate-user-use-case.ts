import { OutputVM } from '@application/dtos/output-vm';
import { IActivateUserUseCase } from '../protocols';

import { ActivateUserUseCaseInput, ActivateUserUseCaseOutput } from './activate-user-use-case.dto'

import { IUserRepository } from '@domain/repositories/user-repository.interface';

export class ActivateUserUseCase implements IActivateUserUseCase {

	constructor(private readonly userRepository: IUserRepository) { }

	async handleActivateUser(input: ActivateUserUseCaseInput): Promise<OutputVM<ActivateUserUseCaseOutput>> {

		const user = await this.userRepository.findByActivationToken(input.token);

		if(!user) {
			return new OutputVM<ActivateUserUseCaseOutput>(400, null, ['User does not exist.']);
		}
		
		user.isActive = true;

		await this.userRepository.update(user);

		const output = new ActivateUserUseCaseOutput(user);

		return new OutputVM<ActivateUserUseCaseOutput>(200, output, []);
	}
}