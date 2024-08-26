import { IsNotEmpty, IsEmail } from 'class-validator';

import { UserDTO } from '../user-dto';

import { User } from '@domain/entities/user';

export class SignUpUseCaseInput
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
}

export class SignUpUseCaseOutput {
    public user: UserDTO;
    public token: string;

	constructor(user: User, token: string) {
		this.user = new UserDTO(user.id, user.username, user.name);
        this.token = token;
	}
}