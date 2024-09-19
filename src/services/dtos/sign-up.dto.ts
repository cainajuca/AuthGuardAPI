import { IsNotEmpty, IsEmail } from 'class-validator';
import { UserDTO } from 'dtos/user.dto';
import { IUser } from 'models/user';

export class SignUpInput
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
 *     SignUpInput:
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

export class SignUpOutput {
    public valid: boolean;

    public error?: string;

    public user?: UserDTO;
    public accessToken?: string;
    public refreshToken?: string;

    constructor(valid: boolean, user?: IUser, accessToken?: string, refreshToken?: string, error?: string) {
        this.valid = valid;

        if (valid) {
            this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        } else {
            this.error = error;
        }
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpOutput:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *         accessToken:
 *           type: string
 *           description: JWT access token provided after successful signup
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token provided after successful signup
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       example:
 *         user:
 *           id: "61d4c8e1f5a6c404d1f4e5b9"
 *           username: "caina_juca"
 *           name: "Cainã Jucá"
 *           email: "caina@example.com"
 *           role: "user"
 *           isActive: true
 *         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
