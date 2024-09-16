import { IsNotEmpty, IsEmail } from 'class-validator';

import { UserDTO } from '../user-dto';

import { User } from '@domain/entities/user';

export class SignUpUseCaseInput
{
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

export class SignUpUseCaseOutput {
    public valid: boolean;

    public error?: string;

    public user?: UserDTO;
    public accessToken?: string;
    public refreshToken?: string;

    constructor(valid: boolean, user?: User, accessToken?: string, refreshToken?: string, error?: string) {
        this.valid = valid;

        if (valid) {
            this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        } else {
            this.error = error;
        }
    }
}