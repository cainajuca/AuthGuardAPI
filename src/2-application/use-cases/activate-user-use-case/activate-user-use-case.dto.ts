import { IsNotEmpty } from 'class-validator';

import { UserDTO } from '../user-dto';

import { User } from '@domain/entities/user';

export class ActivateUserUseCaseInput
{
    @IsNotEmpty()
	public token: string;
}

export class ActivateUserUseCaseOutput {
	public user: UserDTO;

	constructor(user: User) {
		this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role);
	}
}