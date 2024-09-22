import { IsNotEmpty, IsEmail } from 'class-validator';
import { UserDTO } from 'dtos/user.dto';
import { IUser } from 'models/user';

export class UpdateUserInput
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
 *     UpdateUserInput:
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

export class UpdateUserOutput {
	public valid: boolean;
	public user?: UserDTO;
	public error?: string;

	constructor(valid: boolean, user?: IUser, error?: string) {
		this.valid = valid;

		if(user)
			this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);

		this.error = error;
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserOutput:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *           description: Indicates whether the operation was successful
 *           example: true
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *           description: The user details of the updated user, if the operation was successful
 *         error:
 *           type: string
 *           description: Error message in case of failure
 *           example: "User not found"
 *       example:
 *         valid: true
 *         user:
 *           id: "61d4c8e1f5a6c404d1f4e5b9"
 *           username: "updated_user"
 *           name: "Updated User"
 *           email: "updated@example.com"
 *           role: "user"
 *           isActive: true
 *         error: null
 */