import { IsNotEmpty } from 'class-validator';

export class ResetPasswordUseCaseInput
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
 *     ResetPasswordUseCaseInput:
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