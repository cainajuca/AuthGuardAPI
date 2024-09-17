import { Router } from 'express';
import { IAuthController } from '../controllers/protocols';
import { refreshJWT, verifyBodyToken } from '../middlewares';

export default (router: Router, authController: IAuthController) => {

	router.post('/auth/signup', authController.signUp.bind(authController));
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registers users in the application
 *     description: Registers new users.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpUseCaseInput'
 *     responses:
 *       201:
 *         description: Returns the access token in the response body and sets the refresh token in an HTTP-only cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SignUpUseCaseOutput'
 *       400:
 *         description: Bad request, returns null for data and a list of errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               missingFields:
 *                 summary: Missing required fields
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "User validation failed: username: Path `username` is required."
 *                     - "User validation failed: name: Path `name` is required."
 *               invalidInput:
 *                 summary: Invalid password and confirm password
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "Please ensure password and confirm password are matching."
 *               userExists:
 *                 summary: User already exists
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "User already exists."
 */

	router.post('/auth/login', authController.login.bind(authController));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs users into the application
 *     description: Authenticates users and returns the access token in the response body and sets the refresh token in an HTTP-only cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login, returns access token and user info.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/LoginOutput'
 *       400:
 *         description: Bad request, returns null for data and a list of errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               missingFields:
 *                 summary: Missing required fields
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "Credentials are not in the correct format."
 *               userDoesNotExist:
 *                 summary: User does not exist
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "User does not exist."
 *               invalidInput:
 *                 summary: Invalid credentials
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "Invalid username or password."
 */

	router.post('/auth/refresh', refreshJWT, authController.refresh.bind(authController));
	router.post('/auth/logout', authController.logout.bind(authController));

	router.post('/auth/password-reset/request', authController.requestPasswordReset.bind(authController));
	router.post('/auth/password-reset/reset', verifyBodyToken, authController.resetPassword.bind(authController));

	router.post('/auth/activate', verifyBodyToken, authController.activateUser.bind(authController));
};
