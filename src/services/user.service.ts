import { UserRepository } from 'repositories/user-repository';
import { 
	DeleteUserInput, DeleteUserOutput,
	UpdateUserInput, UpdateUserOutput,
} from 'services/dtos';
import { hashPassword } from 'utils/bcrypt';
import logger from 'config/logger.config';

export class UserService {

	constructor(private readonly userRepository: UserRepository) { }

	async deleteUser(input: DeleteUserInput): Promise<DeleteUserOutput> {
		try {
			logger.info(`Attempting to delete user with ID: ${input.id}`);
			
			const user = await this.userRepository.findById(input.id);
			
			if (!user) {
				logger.warn(`User with ID ${input.id} does not exist.`);
				return new DeleteUserOutput(false, null, 'User does not exist.');
			}

			await this.userRepository.delete(user.id);
			logger.info(`User with ID ${input.id} successfully deleted.`);
			
			return new DeleteUserOutput(true, user);
		} catch (error) {
			logger.error(`Error while trying to delete user with ID ${input.id}: ${error.message}`);
			return new DeleteUserOutput(false, null, 'An error occurred while trying to delete the user.');
		}
	}

	async updateUser(input: UpdateUserInput): Promise<UpdateUserOutput> {
		try {
			logger.info(`Attempting to update user with username: ${input.username}`);
			
			const user = await this.userRepository.findByUsername(input.username);
			
			if (!user) {
				logger.warn(`User with username ${input.username} does not exist.`);
				return new UpdateUserOutput(false, null, 'User does not exist.');
			}
			
			if (input.password !== input.confirmPassword) {
				logger.warn(`Password confirmation does not match for user ${input.username}.`);
				return new UpdateUserOutput(false, null, 'Password confirmation does not match the password.');
			}

			const passwordHash = await hashPassword(input.password);
			
			user.name = input.name;
			user.email = input.email;
			user.username = input.username;
			user.password = passwordHash;

			await this.userRepository.update(user);
			logger.info(`User with username ${input.username} successfully updated.`);
			
			return new UpdateUserOutput(true, user);
		} catch (error) {
			logger.error(`Error while trying to update user ${input.username}: ${error.message}`);
			return new UpdateUserOutput(false, null, 'An error occurred while trying to update the user.');
		}
	}
}
