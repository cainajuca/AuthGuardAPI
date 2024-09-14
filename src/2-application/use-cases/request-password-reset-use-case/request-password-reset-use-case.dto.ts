import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetUseCaseInput
{
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}

export class RequestPasswordResetUseCaseOutput {
	constructor(
        public valid: boolean,
        public error?: string,
    ) { }
}