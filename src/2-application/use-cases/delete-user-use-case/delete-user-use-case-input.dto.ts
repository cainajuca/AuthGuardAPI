import { IsNotEmpty } from 'class-validator';

export class DeleteUserUseCaseInput
{
    @IsNotEmpty()
	public id: string;
}