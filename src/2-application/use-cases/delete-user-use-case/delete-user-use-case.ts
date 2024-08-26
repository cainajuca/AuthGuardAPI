import { OutputVM } from '@root/2-application/dtos/output-vm';
import { IDeleteUserUseCase } from '../protocols';

import { DeleteUserUseCaseInput, DeleteUserUseCaseOutput } from './delete-user-use-case.dto'

import { IUserRepository } from '@domain/repositories/user-repository.interface';

export class DeleteUserUseCase implements IDeleteUserUseCase {

	constructor(private readonly userRepository: IUserRepository) { }

	async handleDeleteUser(input: DeleteUserUseCaseInput): Promise<OutputVM<DeleteUserUseCaseOutput>> {

		const user = await this.userRepository.findById(input.id);

		if(!user) {
			return new OutputVM<DeleteUserUseCaseOutput>(400, null, ['User does not exist.']);
		}

		await this.userRepository.delete(user.id);

		const output = new DeleteUserUseCaseOutput(user);

		return new OutputVM<DeleteUserUseCaseOutput>(200, output, [])
	}
}
