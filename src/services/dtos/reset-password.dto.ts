import { IsNotEmpty } from 'class-validator';

export class ResetPasswordInput
{
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public newPassword: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPasswordInput:
 *       type: object
 *       required:
 *         - email
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user resetting the password
 *           example: "user@example.com"
 *         newPassword:
 *           type: string
 *           description: The new password for the user
 *           example: "NewStrongPassword123"
 */

export class ResetPasswordOutput {
	constructor(
        public valid: boolean,
        public error?: string,
    ) { }
}