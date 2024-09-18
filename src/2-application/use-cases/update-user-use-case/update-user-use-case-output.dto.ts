import { UserDTO } from '../../dtos/user.dto';
import { User } from '@domain/entities/user';

export class UpdateUserUseCaseOutput {
	public user: UserDTO;

	constructor(user: User) {
		this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserUseCaseOutput:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *           description: The updated user details
 *       example:
 *         user:
 *           id: "61d4c8e1f5a6c404d1f4e5b9"
 *           username: "updated_user"
 *           name: "Updated User"
 *           email: "updated@example.com"
 *           role: "user"
 *           isActive: true
 */
