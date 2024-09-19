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
	public user: UserDTO;

	constructor(user: IUser) {
		this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivateUserOutput:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *           description: The details of the activated user
 *       example:
 *         user:
 *           id: "61d4c8e1f5a6c404d1f4e5b9"
 *           username: "caina_juca"
 *           name: "Cainã Jucá"
 *           email: "caina@example.com"
 *           role: "user"
 *           isActive: true
 */