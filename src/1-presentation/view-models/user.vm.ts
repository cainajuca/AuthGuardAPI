export class UserVM {
	constructor(
		public id: string,
		public username: string,
		public name: string,
		public email: string,
		public role: string,
	) {}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserVM:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user
 *           example: "61d4c8e1f5a6c404d1f4e5b9"
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: "caina_juca"
 *         name:
 *           type: string
 *           description: The full name of the user
 *           example: "Cainã Jucá"
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *           example: "caina@example.com"
 *         role:
 *           type: string
 *           description: The role of the user within the system
 *           example: "user"
 */
