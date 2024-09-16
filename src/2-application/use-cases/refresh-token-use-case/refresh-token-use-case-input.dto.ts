import { IsNotEmpty } from 'class-validator';

export class RefreshTokenUseCaseInput
{
    @IsNotEmpty()
    public userId: string;

    @IsNotEmpty()
    public username: string;

    @IsNotEmpty()
    public role: string;

    @IsNotEmpty()
    public refreshToken: string;
}