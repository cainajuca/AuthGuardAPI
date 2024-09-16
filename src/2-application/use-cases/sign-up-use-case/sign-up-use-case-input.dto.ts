import { IsNotEmpty, IsEmail } from 'class-validator';

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
