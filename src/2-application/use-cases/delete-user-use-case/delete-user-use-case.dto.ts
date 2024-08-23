import { IsNotEmpty } from 'class-validator';
import { UserDTO } from '../user-dto';
import { User } from '@domain/entities/user';

export class DeleteUserUseCaseInput
{
    @IsNotEmpty()
	public id: string;
}

export class DeleteUserUseCaseOutput {
	public user: UserDTO;

	constructor(user: User) {
		this.user = new UserDTO(user.id, user.username, user.name);
	}
}