import { UserDTO } from '../../dtos/user.dto';
import { User } from '@domain/entities/user';

export class DeleteUserUseCaseOutput {
	public user: UserDTO;

	constructor(user: User) {
		this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteUserUseCaseOutput:
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