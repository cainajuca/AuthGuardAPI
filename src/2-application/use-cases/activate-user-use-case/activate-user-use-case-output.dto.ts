import { UserDTO } from "@application/dtos/user.dto";
import { User } from "@domain/entities/user";

export class ActivateUserUseCaseOutput {
	public user: UserDTO;

	constructor(user: User) {
		this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivateUserUseCaseOutput:
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