import { IsNotEmpty } from 'class-validator';

export class ActivateUserUseCaseInput
{
    @IsNotEmpty()
	public token: string;
}