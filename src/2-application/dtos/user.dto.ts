export class UserDTO {
	constructor(
        public id: string,
		public username: string,
        public name: string,
		public email: string,
		public role: string,
		public isActive: boolean,
	) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - name
 *         - email
 *         - role
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user.
 *           example: "61d4c8e1f5a6c404d1f4e5b9"
 *         username:
 *           type: string
 *           description: The username of the user in the system.
 *           example: "caina_juca"
 *         name:
 *           type: string
 *           description: The full name of the user.
 *           example: "Cainã Jucá"
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: "caina@example.com"
 *         role:
 *           type: string
 *           description: The role of the user in the system.
 *           example: "user"
 *         isActive:
 *           type: boolean
 *           description: Indicates whether the user's account is active.
 *           example: true
 */

