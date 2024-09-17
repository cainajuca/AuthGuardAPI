import { UserDTO } from '@application/dtos/user.dto';
import { User } from '@domain/entities/user';

export class LoginOutput {
    public user?: UserDTO;
    public accessToken?: string;

    constructor(user?: User, accessToken?: string) {
        this.user = new UserDTO(user.id, user.username, user.name, user.email, user.role, user.isActive);
        this.accessToken = accessToken;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginOutput:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *           description: The user details after successful login
 *         accessToken:
 *           type: string
 *           description: JWT access token provided after successful authentication
 */