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
	public user: UserDTO;

	constructor(user: IUser) {
		this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteUserOutput:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *           description: The user details of the deleted user
 *       example:
 *         user:
 *           id: "61d4c8e1f5a6c404d1f4e5b9"
 *           username: "deleted_user"
 *           name: "Deleted User"
 *           email: "deleted@example.com"
 *           role: "user"
 *           isActive: false
 */