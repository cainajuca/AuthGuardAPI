import { IsNotEmpty } from 'class-validator';

export class RefreshTokenInput
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

export class RefreshTokenOutput {
	constructor(
        public valid: boolean,
        public accessToken?: string,
        public refreshToken?: string,
    ) { }
}