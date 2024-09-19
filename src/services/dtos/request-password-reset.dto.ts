import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetInput
{
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestPasswordResetInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user requesting the password reset
 *           example: "user@example.com"
 */

export class RequestPasswordResetOutput {
	constructor(
        public valid: boolean,
        public error?: string,
    ) { }
}