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

export class RefreshTokenUseCaseOutput {
	constructor(
        public valid: boolean,
        public accessToken?: string,
        public refreshToken?: string,
    ) { }
}