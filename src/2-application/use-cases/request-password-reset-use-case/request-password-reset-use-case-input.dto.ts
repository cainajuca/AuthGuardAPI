import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetUseCaseInput
{
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestPasswordResetUseCaseInput:
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
