import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignUpUseCaseInput
{
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
 *     SignUpUseCaseInput:
 *       type: object
 *       required:
 *         - username
 *         - name
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           description: A valid email address for the user
 *         password:
 *           type: string
 *           description: User's password
 *         confirmPassword:
 *           type: string
 *           description: Password confirmation
 */