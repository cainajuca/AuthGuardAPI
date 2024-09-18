import { IsNotEmpty } from 'class-validator';

export class DeleteUserUseCaseInput
{
    @IsNotEmpty()
	public id: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteUserUseCaseInput:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user to be deleted
 *           example: "61d4c8e1f5a6c404d1f4e5b9"
 */
