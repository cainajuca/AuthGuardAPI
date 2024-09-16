import { IsNotEmpty } from 'class-validator';

export class ResetPasswordUseCaseInput
{
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public newPassword: string;
}