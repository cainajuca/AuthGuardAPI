import { OutputVM } from 'dtos/output.vm';
import { UserRepository } from 'repositories/user-repository';
import { 
	DeleteUserInput, DeleteUserOutput,
	UpdateUserInput, UpdateUserOutput,
} from 'services/dtos'
import { hashPassword } from 'utils/bcrypt'


export class UserService {

	constructor(private readonly userRepository: UserRepository) { }

	async deleteUser(input: DeleteUserInput): Promise<DeleteUserOutput> {
		try {
			
			const user = await this.userRepository.findById(input.id);
			
			if(!user) {
				return new DeleteUserOutput(false, null, 'User does not exist.');
			}
			
			await this.userRepository.delete(user.id);
			
			return new DeleteUserOutput(true, user);
		} catch (error) {
			return new DeleteUserOutput(false, null, 'An error occurred while trying to delete the user.');
		}
	}

    async updateUser(input: UpdateUserInput): Promise<UpdateUserOutput> {
		try {
			const user = await this.userRepository.findByUsername(input.username);
			
			if(!user) {
				return new UpdateUserOutput(false, null, 'User does not exist.');
			}
			
			if(input.password != input.confirmPassword) {
				return new UpdateUserOutput(false, null, 'Password confirmation does not match the password.');
			}
			
			const passwordHash = await hashPassword(input.password);
			
			user.name = input.name;
			user.email = input.email;
			user.username = input.username;
			user.password = passwordHash;
			
			await this.userRepository.update(user);
			
			return new UpdateUserOutput(true, user);
		} catch (error) {
			return new UpdateUserOutput(false, null, 'An error occurred while trying to update the user.');
		}
	}
}