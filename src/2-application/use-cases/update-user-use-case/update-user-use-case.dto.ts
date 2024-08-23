import { IsNotEmpty, IsEmail } from 'class-validator';

import { UserDTO } from '../user-dto';

import { User } from '@domain/entities/user';

export class UpdateUserUseCaseInput
{
    @IsNotEmpty()
	public id: string;

    @IsNotEmpty()
    public username: string;
    
    @IsNotEmpty()
    public name: string;
    
    @IsNotEmpty()
    @IsEmail()
    public email: string;
    
    @IsNotEmpty()
    public password: string;

    @IsNotEmpty()
    public confirmPassword: string;
}

export class UpdateUserUseCaseOutput {
	public user: UserDTO;

	constructor(user: User) {
		this.user = new UserDTO(user.id, user.username, user.name);
	}
}