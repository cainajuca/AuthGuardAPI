import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserUseCaseInput
{
    @IsNotEmpty()
	public id: string;

    @IsNotEmpty()
    public username: string;
    
    @IsNotEmpty()
    public name: string;
    
    @IsNotEmpty()
    @IsEmail()
    public email: string;
    
    @IsNotEmpty()
    public password: string;

    @IsNotEmpty()
    public confirmPassword: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserUseCaseInput:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - name
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user to be updated
 *           example: "61d4c8e1f5a6c404d1f4e5b9"
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: "updated_user"
 *         name:
 *           type: string
 *           description: The full name of the user
 *           example: "Updated User"
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *           example: "updated@example.com"
 *         password:
 *           type: string
 *           description: The new password for the user
 *           example: "NewPassword123!"
 *         confirmPassword:
 *           type: string
 *           description: Confirmation of the new password
 *           example: "NewPassword123!"
 */