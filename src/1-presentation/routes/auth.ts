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
	/**
	 * @swagger
	 * /auth/refresh:
	 *   post:
	 *     summary: Refreshes access token using the refreshToken cookie
	 *     description: This endpoint refreshes the access token if a valid refresh token is provided in the cookies. The token is validated by the middleware. If the refresh token is missing, invalid, or expired, an error is returned.
	 *     tags: [Auth]
	 *     requestBody:
	 *       required: false
	 *     responses:
	 *       201:
	 *         description: Returns a new access token and sets a new refresh token as a cookie.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/OutputVM'
	 *             example:
	 *               valid: true
	 *               statusCode: 201
	 *               data:
	 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	 *               errors: []
	 *       400:
	 *         description: Bad request, typically due to an invalid or expired refresh token.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/OutputVM'
	 *             examples:
	 *               invalidToken:
	 *                 summary: Invalid or expired refresh token
	 *                 value:
	 *                   valid: false
	 *                   statusCode: 400
	 *                   data: null
	 *                   errors:
	 *                     - "Invalid or expired token"
	 *               error:
	 *                 summary: Unexpected error
	 *                 value:
	 *                   valid: false
	 *                   statusCode: 400
	 *                   data: null
	 *                   errors:
	 *                     - "An unexpected error occurred"
	 *       401:
	 *         description: Unauthorized, refresh token not found or missing in the cookies.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/OutputVM'
	 *             example:
	 *               valid: false
	 *               statusCode: 401
	 *               data: null
	 *               errors:
	 *                 - "Refresh Token not found."
	 *       403:
	 *         description: Forbidden, refresh token is invalid or expired.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/OutputVM'
	 *             example:
	 *               valid: false
	 *               statusCode: 403
	 *               data: null
	 *               errors:
	 *                 - "Invalid or expired refresh token."
	 */
	
	router.post('/auth/logout', authController.logout.bind(authController));
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out the user by clearing the refresh token
 *     description: This endpoint logs out the user by removing the refresh token from cookies and deleting it from the database. If the refresh token is not provided, an error is returned.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logs out the user and clears the refresh token cookie.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: true
 *               statusCode: 200
 *               data:
 *                 message: "Logged out successfully."
 *               errors: []
 *       400:
 *         description: Bad request, typically due to a missing refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               noToken:
 *                 summary: Refresh token not provided
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "Refresh token not provided."
 *               error:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred"
 */

	router.post('/auth/password-reset/request', authController.requestPasswordReset.bind(authController));
/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Requests a password reset by sending a reset link to the user's email
 *     description: This endpoint sends a password reset link to the user's email if the email is valid. The link allows the user to reset their password within the next hour.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestPasswordResetUseCaseInput'
 *     responses:
 *       200:
 *         description: Password reset link sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: true
 *               statusCode: 200
 *               data:
 *                 message: "We've sent a password reset link to your e-mail. Please check your inbox and follow the instructions to reset your password within the next hour."
 *               errors: []
 *       400:
 *         description: Bad request, typically due to invalid input or missing email.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               invalidEmail:
 *                 summary: Invalid or missing email
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "Invalid email address provided."
 *               error:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred"
 */

	router.post('/auth/password-reset/reset', verifyBodyToken, authController.resetPassword.bind(authController));
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Resets the user's password
 *     description: This endpoint allows the user to reset their password using a valid reset token and new password. The reset token is validated by the middleware.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordUseCaseInput'
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: true
 *               statusCode: 200
 *               data:
 *                 message: "Your password has been successfully reset."
 *               errors: []
 *       400:
 *         description: Bad request, typically due to an invalid token or other input errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               invalidPassword:
 *                 summary: Invalid new password format
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "New password must meet security requirements"
 *               error:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred"
 *       401:
 *         description: Unauthorized, reset token not found in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 401
 *               data: null
 *               errors:
 *                 - "Reset token was not found."
 *       403:
 *         description: Forbidden, reset token is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 403
 *               data: null
 *               errors:
 *                 - "Invalid or expired reset token."
 */
	
	router.post('/auth/activate', verifyBodyToken, authController.activateUser.bind(authController));
/**
 * @swagger
 * /auth/activate-user:
 *   post:
 *     summary: Activates a user account
 *     description: This endpoint activates a user's account. Upon successful activation, the user list cache is cleared.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivateUserUseCaseInput'
 *     responses:
 *       200:
 *         description: User activated successfully and cache cleared.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ActivateUserUseCaseOutput'
 *       400:
 *         description: Bad request due to invalid input or unexpected error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             examples:
 *               invalidInput:
 *                 summary: Invalid input data
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "Invalid input data provided."
 *               error:
 *                 summary: Unexpected error
 *                 value:
 *                   valid: false
 *                   statusCode: 400
 *                   data: null
 *                   errors:
 *                     - "An unexpected error occurred"
 *       401:
 *         description: Unauthorized, activation token not found in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 401
 *               data: null
 *               errors:
 *                 - "Activation token was not found."
 *       403:
 *         description: Forbidden, activation token is invalid or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutputVM'
 *             example:
 *               valid: false
 *               statusCode: 403
 *               data: null
 *               errors:
 *                 - "Invalid or expired activation token."
 */

};
