import { IsNotEmpty } from 'class-validator';
import { UserDTO } from "dtos/user.dto";
import { IUser } from "models/user";

export class ActivateUserInput
{
    @IsNotEmpty()
	public token: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivateUserInput:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: The token used to activate the user account
 *           example: "abc123activationtoken"
 */

export class ActivateUserOutput {
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
 *     ActivateUserOutput:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *           description: Indicates whether the operation was successful
 *           example: true
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *           description: The user data returned after activation, if successful
 *         error:
 *           type: string
 *           description: Error message in case of failure
 *           example: "Invalid activation token"
 *       example:
 *         valid: true
 *         user:
 *           id: "61d4c8e1f5a6c404d1f4e5b9"
 *           username: "caina_juca"
 *           name: "Cainã Jucá"
 *           email: "caina@example.com"
 *           role: "user"
 *           isActive: true
 *         error: null
 */