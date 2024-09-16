import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetUseCaseInput
{
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}