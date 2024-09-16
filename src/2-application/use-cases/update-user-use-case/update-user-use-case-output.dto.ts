import { UserDTO } from '../../dtos/user.dto';
import { User } from '@domain/entities/user';

export class UpdateUserUseCaseOutput {
	public user: UserDTO;

	constructor(user: User) {
		this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
	}
}