import { OutputVM } from 'dtos/output.vm';
import { UserRepository } from 'repositories/user-repository';
import { 
	DeleteUserInput, DeleteUserOutput,
	UpdateUserInput, UpdateUserOutput,
} from 'services/dtos'
import { hashPassword } from 'utils/bcrypt'


export class UserService {

	constructor(private readonly userRepository: UserRepository) { }

	async deleteUser(input: DeleteUserInput): Promise<OutputVM<DeleteUserOutput>> {

		const user = await this.userRepository.findById(input.id);

		if(!user) {
			return new OutputVM<DeleteUserOutput>(400, null, ['User does not exist.']);
		}

		await this.userRepository.delete(user.id);

		const output = new DeleteUserOutput(user);

		return new OutputVM<DeleteUserOutput>(200, output, [])
	}

    async updateUser(input: UpdateUserInput): Promise<OutputVM<UpdateUserOutput>> {

		const user = await this.userRepository.findByUsername(input.username);

		if(!user) {
			return new OutputVM<UpdateUserOutput>(400, null, ['User does not exist.']);
		}

		if(input.password != input.confirmPassword) {
			return new OutputVM<UpdateUserOutput>(400, null, ['Password confirmation does not match the password.']);
		}

		const passwordHash = await hashPassword(input.password);
		
		user.name = input.name;
		user.email = input.email;
		user.username = input.username;
		user.password = passwordHash;

		await this.userRepository.update(user);

		const output = new UpdateUserOutput(user);

		return new OutputVM<UpdateUserOutput>(200, output, []);
	}
}