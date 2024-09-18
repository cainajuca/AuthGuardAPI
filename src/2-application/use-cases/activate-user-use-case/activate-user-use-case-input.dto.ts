import { IsNotEmpty } from 'class-validator';

export class ActivateUserUseCaseInput
{
    @IsNotEmpty()
	public token: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivateUserUseCaseInput:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: The token used to activate the user account
 *           example: "abc123activationtoken"
 */
