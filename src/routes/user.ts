import { Router } from 'express';

import { authenticateJWT, authorizationJWT } from '../middlewares';
import { IUserController } from '../controllers/protocols';

export default (router: Router, userController: IUserController) => {

	router.get('/users', authenticateJWT, userController.getAllUsers.bind(userController));
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieves a list of all users
 *     description: This endpoint retrieves all users from the database or cache. It requires a valid JWT token for authorization. If no users are found, a 404 status is returned.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Requisição autenticada com JWT
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserDTO'
 *             example:
 *               valid: true
 *               statusCode: 200
 *               data:
 *                 - id: "61d4c8e1f5a6c404d1f4e5b9"
 *                   username: "caina_juca"
 *                   name: "Cainã Jucá"
 *                   email: "caina@example.com"
 *                   role: "admin"
 *               errors: []
 *       400:
 *         description: Bad request, typically due to an error during the request processing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               error:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred."
 *       401:
 *         description: Unauthorized, the JWT token was not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 401
 *               data: null
 *               errors:
 *                 - "The token was not found."
 *       403:
 *         description: Forbidden, the JWT token is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 403
 *               data: null
 *               errors:
 *                 - "Invalid or expired token."
 *       404:
 *         description: No users were found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 404
 *               data: null
 *               errors:
 *                 - "User not found."
 */

	router.get('/users/inactive', authenticateJWT, userController.getInactiveUsers.bind(userController));
/**
 * @swagger
 * /users/inactive:
 *   get:
 *     summary: Retrieves a list of all inactive users
 *     description: This endpoint retrieves all inactive users from the database. It requires a valid JWT token for authorization.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Requisição autenticada com JWT
 *     responses:
 *       200:
 *         description: A list of inactive users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserDTO'
 *             example:
 *               valid: true
 *               statusCode: 200
 *               data:
 *                 - id: "61d4c8e1f5a6c404d1f4e5b9"
 *                   username: "inactive_user1"
 *                   name: "Inactive User"
 *                   email: "inactive@example.com"
 *                   role: "user"
 *               errors: []
 *       400:
 *         description: Bad request, typically due to an error during the request processing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               error:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred."
 *       401:
 *         description: Unauthorized, the JWT token was not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 401
 *               data: null
 *               errors:
 *                 - "The token was not found."
 *       403:
 *         description: Forbidden, the JWT token is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 403
 *               data: null
 *               errors:
 *                 - "Invalid or expired token."
 */

	router.get('/users/id/:id', authenticateJWT, userController.getUserById.bind(userController));
/**
 * @swagger
 * /users/id/{id}:
 *   get:
 *     summary: Retrieves a user by their ID
 *     description: This endpoint retrieves a user by their ID. It requires a valid JWT token for authorization.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Requisição autenticada com JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UserDTO'
 *             example:
 *               valid: true
 *               statusCode: 200
 *               data:
 *                 id: "61d4c8e1f5a6c404d1f4e5b9"
 *                 username: "caina_juca"
 *                 name: "Cainã Jucá"
 *                 email: "caina@example.com"
 *                 role: "admin"
 *               errors: []
 *       400:
 *         description: Bad request, typically due to an error during the request processing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               error:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred."
 *       401:
 *         description: Unauthorized, the JWT token was not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 401
 *               data: null
 *               errors:
 *                 - "The token was not found."
 *       403:
 *         description: Forbidden, the JWT token is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 403
 *               data: null
 *               errors:
 *                 - "Invalid or expired token."
 *       404:
 *         description: No user was found with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 404
 *               data: null
 *               errors:
 *                 - "User not found."
 */

	router.get('/users/username/:username', authenticateJWT, userController.getUserByUsername.bind(userController));
/**
 * @swagger
 * /users/username/{username}:
 *   get:
 *     summary: Retrieves a user by their username
 *     description: This endpoint retrieves a user by their username. It requires a valid JWT token for authorization.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Requisição autenticada com JWT
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UserDTO'
 *             example:
 *               valid: true
 *               statusCode: 200
 *               data:
 *                 id: "61d4c8e1f5a6c404d1f4e5b9"
 *                 username: "caina_juca"
 *                 name: "Cainã Jucá"
 *                 email: "caina@example.com"
 *                 role: "admin"
 *               errors: []
 *       400:
 *         description: Bad request, typically due to an error during the request processing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               error:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred."
 *       401:
 *         description: Unauthorized, the JWT token was not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 401
 *               data: null
 *               errors:
 *                 - "The token was not found."
 *       403:
 *         description: Forbidden, the JWT token is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 403
 *               data: null
 *               errors:
 *                 - "Invalid or expired token."
 *       404:
 *         description: No user was found with the provided username.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 404
 *               data: null
 *               errors:
 *                 - "User not found."
 */

	router.patch('/users/:id', authenticateJWT, authorizationJWT, userController.updateUser.bind(userController));
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Updates a user's information
 *     description: This endpoint updates a user's information. It requires a valid JWT token for authorization, and the user must either be an admin or updating their own data.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Requisição autenticada com JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User information updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UpdateUserOutput'
 *       400:
 *         description: Bad request, typically due to validation errors or other input-related issues.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               validationError:
 *                 summary: Invalid input data
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "Invalid input data provided."
 *               unexpectedError:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred."
 *       401:
 *         description: Unauthorized, the JWT token was not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 401
 *               data: null
 *               errors:
 *                 - "The token was not found."
 *       403:
 *         description: Forbidden, the user is not allowed to update this information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               adminOnly:
 *                 summary: User is not an admin and cannot update other users' data
 *                 value:
 *                   valid: false
 *                   statusCode: 403
 *                   data: null
 *                   errors:
 *                     - "Token does not match with current user."
 *               invalidToken:
 *                 summary: Invalid or expired token
 *                 value:
 *                   valid: false
 *                   statusCode: 403
 *                   data: null
 *                   errors:
 *                     - "Invalid or expired token."
 */

	router.delete('/users/:id', authenticateJWT, authorizationJWT, userController.deleteUser.bind(userController));
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletes a user
 *     description: This endpoint deletes a user by their ID. It requires a valid JWT token for authorization, and the user must either be an admin or deleting their own account.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Requisição autenticada com JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to be deleted
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: true
 *               statusCode: 200
 *               data:
 *                 message: "User deleted successfully."
 *               errors: []
 *       400:
 *         description: Bad request, typically due to validation errors or other input-related issues.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               validationError:
 *                 summary: Invalid user ID
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "Invalid input data provided."
 *               unexpectedError:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred."
 *       401:
 *         description: Unauthorized, the JWT token was not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 401
 *               data: null
 *               errors:
 *                 - "The token was not found."
 *       403:
 *         description: Forbidden, the user is not allowed to delete this account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               adminOnly:
 *                 summary: User is not an admin and cannot delete another user's account
 *                 value:
 *                   valid: false
 *                   statusCode: 403
 *                   data: null
 *                   errors:
 *                     - "Token does not match with current user."
 *               invalidToken:
 *                 summary: Invalid or expired token
 *                 value:
 *                   valid: false
 *                   statusCode: 403
 *                   data: null
 *                   errors:
 *                     - "Invalid or expired token."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 404
 *               data: null
 *               errors:
 *                 - "User not found."
 */
};