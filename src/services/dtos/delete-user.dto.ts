import { IsNotEmpty } from 'class-validator';
import { UserDTO } from 'dtos/user.dto';
import { IUser } from 'models/user';

export class DeleteUserInput
{
    @IsNotEmpty()
	public id: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteUserInput:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user to be deleted
 *           example: "61d4c8e1f5a6c404d1f4e5b9"
 */

export class DeleteUserOutput {
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
 *     DeleteUserOutput:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *           description: Indicates whether the operation was successful
 *           example: true
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *           description: The user details of the deleted user, if the operation was successful
 *         error:
 *           type: string
 *           description: Error message in case of failure
 *           example: "User not found"
 *       example:
 *         valid: true
 *         user:
 *           id: "61d4c8e1f5a6c404d1f4e5b9"
 *           username: "deleted_user"
 *           name: "Deleted User"
 *           email: "deleted@example.com"
 *           role: "user"
 *           isActive: false
 *         error: null
 */