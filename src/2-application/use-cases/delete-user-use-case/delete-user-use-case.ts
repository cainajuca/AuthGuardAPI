import { DeleteUserUseCaseInput, DeleteUserUseCaseOutput } from './delete-user-use-case.dto'
import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { IDeleteUserUseCase } from '../protocols';

export class DeleteUserUseCase implements IDeleteUserUseCase {

	constructor(private readonly userRepository: IUserRepository) { }

	async handleDeleteUser(input: DeleteUserUseCaseInput): Promise<DeleteUserUseCaseOutput | null> {

		const user = await this.userRepository.findById(input.id);

		if(!user) {
			throw new Error('User does not exist.');
		}

		await this.userRepository.delete(user.id);

		return new DeleteUserUseCaseOutput(user)
	}
}
