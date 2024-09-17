import { UserDTO } from '../../dtos/user.dto';
import { User } from '@domain/entities/user';

export class SignUpUseCaseOutput {
    public valid: boolean;

    public error?: string;

    public user?: UserDTO;
    public accessToken?: string;
    public refreshToken?: string;

    constructor(valid: boolean, user?: User, accessToken?: string, refreshToken?: string, error?: string) {
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
 *     SignUpUseCaseOutput:
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
