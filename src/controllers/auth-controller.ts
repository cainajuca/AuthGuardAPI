// External imports (third-party libraries)
import { Request, Response } from 'express';

// Domain-related imports (interfaces, entities)
import { UserRepository } from 'repositories/user-repository';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { CacheKeys, RedisCacheService } from 'services/redis-cache.service';
import { RefreshToken } from 'models/refresh-token';

// Application-related imports (use cases, DTOs)
import { 
	SignUpInput,
	RefreshTokenInput,
	RequestPasswordResetInput,
	ResetPasswordInput,
	ActivateUserInput
 } from 'services/dtos';
 import logger from 'config/logger.config';
import { OutputVM } from 'dtos/output.vm';

// Utility and shared imports (shared/utils)
import { generateAccessRefreshTokens } from 'utils/jwt';
import { verifyPassword } from 'utils/bcrypt';

// Presentation-related imports (protocols, middlewares, view models)
import { AuthenticatedRequest } from '../middlewares';
import { IAuthController } from './protocols';
import { LoginOutput } from '../dtos/login-output';
import { AuthService } from 'services/auth.service';

export class AuthController implements IAuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userRepository: UserRepository,
		private readonly refreshTokenRepository: RefreshTokenRepository,
		private readonly cacheService: RedisCacheService
	) { }

	async signUp(req: Request, res: Response): Promise<Response> {
		try {
			const input: SignUpInput = req.body;
			logger.info(`Received sign-up request for username: ${input.username}`);

			const result = await this.authService.signUp(input);
			
			if(!result || !result.valid) {
				logger.warn(`Sign-up failed for username: ${input.username}, reason: ${result?.error}`);
				return res.status(400).send(new OutputVM(400, null, [result.error]));
			}

			res.cookie('refreshToken', result.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
				
				// only in production environment:				
				// secure: true, // only for HTTPS
				// sameSite: 'strict', // Cross-Site Request Forgery protection
			});

			logger.info(`User signed up successfully: ${input.username}`);

			const output = {
				user: result.user,
				accessToken: result.accessToken,
			}

			return res.status(201).send(new OutputVM(201, output, []));

		} catch (error) {
			logger.error('Error during sign-up', { error: error.message, stack: error.stack });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async login(req: Request, res: Response): Promise<Response> {
		try {
			const { username, password } = req.body;

			logger.info(`Login attempt for username: ${username}`);

			if(!username || !password) {
				logger.warn(`Login failed: Missing credentials for username: ${username}`);
				return res.status(400).send(new OutputVM(400, null, ['Credentials are not in the correct format']));
			}

			const user = await this.userRepository.findByUsername(username);

			if(!user) {
				logger.warn(`Login failed: User not found for username: ${username}`);
				return res.status(400).send(new OutputVM(400, null, ['User does not exist']));
			}

			if(!user.isActive) {
				logger.warn(`Login failed: User is not active: ${username}`);
				return res.status(400).send(new OutputVM(400, null, ['User is not active']));
			}
			
			const isPasswordValid = await verifyPassword(password, user.password);
			
			if (!isPasswordValid)
				return res.status(400).send(new OutputVM(400, null, ['Invalid username or password']));

			logger.info(`Password verified for username: ${username}`);

			const [ accessTokenPair, refreshTokenPair ] = generateAccessRefreshTokens({
				_id: user.id,
				username: user.username,
				role: user.role,
			});

			logger.info(`Access and refresh tokens generated for user: ${username}`);

			const tokenEntity = new RefreshToken({
				token: refreshTokenPair.token,
				userId: user._id,
				expiresAt: refreshTokenPair.expiresAt,
			});

			await this.refreshTokenRepository.save(tokenEntity);
			
			logger.info(`Refresh token saved for user: ${username}`);

			res.cookie('refreshToken', refreshTokenPair.token, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
				
				// only in production environment:				
				// secure: true, // only for HTTPS
				// sameSite: 'strict', // Cross-Site Request Forgery protection
			});

			const output = new LoginOutput(user, accessTokenPair.token);

			logger.info(`User ${username} logged in successfully`);

			return res.status(200).send(new OutputVM(200, output, []));

		} catch (error) {
			logger.error(`Error during login for username: ${req.body.username}`, { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async refresh(req: AuthenticatedRequest, res: Response): Promise<Response> {
		try {
			logger.info(`Refresh token attempt for user: ${req.username} (ID: ${req.userId})`);

			const refreshToken = req.cookies.refreshToken;

			if (!refreshToken) {
				logger.warn(`Refresh token missing for user: ${req.username} (ID: ${req.userId})`);
				return res.status(401).send(new OutputVM(400, null, ['Refresh Token not found']));
			}

			const input: RefreshTokenInput = {
				userId: req.userId,
				username: req.username,
				role: req.role,
				refreshToken: refreshToken,
			};

			logger.info(`Prepared input for refresh token validation for user: ${req.username}`);

			const output = await this.authService.refreshToken(input);

			if(!output || !output.valid) {
				logger.warn(`Invalid or expired refresh token for user: ${req.username}`);
				return res.status(400).send(new OutputVM(400, null, ['Invalid or expired token']));
			}

			logger.info(`New access token and refresh token generated for user: ${req.username}`);

			res.cookie('refreshToken', output.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
				
				// only in production environment:				
				// secure: true, // only for HTTPS
				// sameSite: 'strict', // Cross-Site Request Forgery protection
			});

			logger.info(`Refresh token successfully updated for user: ${req.username}`);

			return res.status(201).send(new OutputVM(201, { accessToken: output.accessToken }, []));
		} catch (error) {
			logger.error(`Error during refresh token process for user: ${req.username}`, { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async logout(req: Request, res: Response): Promise<Response> {
		const { refreshToken } = req.cookies;
	
		if (!refreshToken) {
			logger.warn('Logout failed: Refresh token not provided.');
			return res.status(400).send(new OutputVM(400, null, ['Refresh token not provided.']));
		}
	
		try {
			logger.info(`Logout attempt for user with refresh token: ${refreshToken}`);
	
			await this.refreshTokenRepository.deleteByToken(refreshToken);
	
			logger.info(`Refresh token deleted: ${refreshToken}`);
	
			res.clearCookie('refreshToken', {
				httpOnly: true,
				// secure: true, // only for HTTPS
				// sameSite: 'strict', // Cross-Site Request Forgery protection
			});
	
			logger.info('User logged out successfully.');
	
			return res.status(200).send(new OutputVM(200, { message: 'Logged out successfully.' }, []));
		} catch (error) {
			logger.error('Error during logout process:', { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}
	
	async requestPasswordReset(req: Request, res: Response): Promise<Response> {
		try {
			const input: RequestPasswordResetInput = req.body;
	
			logger.info(`Password reset request received for email: ${input.email}`);
	
			const result = await this.authService.requestPasswordReset(input);
	
			if (!result || !result.valid) {
				logger.warn(`Password reset failed for email: ${input.email}. Reason: ${result?.error || 'Unknown error'}`);
				return res.status(400).send(new OutputVM(400, null, [result?.error || 'Unknown error']));
			}
	
			logger.info(`Password reset link sent to email: ${input.email}`);
	
			const output = {
				message: "We've sent a password reset link to your e-mail. Please check your inbox and follow the instructions to reset your password within the next hour",
			};
	
			return res.status(200).send(new OutputVM(200, output, []));
		} catch (error) {
			logger.error('Error during password reset request:', { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}
	
	async resetPassword(req: Request, res: Response): Promise<Response> {
		try {
			const input: ResetPasswordInput = req.body;
	
			logger.info(`Password reset request received for email: ${input.email}`);
	
			const result = await this.authService.resetPassword(input);
	
			if (!result || !result.valid) {
				logger.warn(`Password reset failed for email: ${input.email}. Reason: ${result?.error || 'Unknown error'}`);
				return res.status(400).send(new OutputVM(400, null, [result?.error || 'Unknown error']));
			}
	
			logger.info(`Password successfully reset for email: ${input.email}`);
	
			const output = {
				message: "Your password has been successfully reset",
			};
			
			return res.status(200).send(new OutputVM(200, output, []));
		} catch (error) {
			logger.error('Error during password reset:', { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}
	
	async activateUser(req: Request, res: Response): Promise<Response> {
		try {
			const input: ActivateUserInput = req.body;
	
			logger.info(`User activation request received for token: ${input.token}`);
	
			const output = await this.authService.activateUser(input);
	
			if (!output.valid) {
				logger.warn(`User activation failed for token: ${input.token}. Reason: ${output.error || 'Unknown error'}`);
				return res.status(400).send(new OutputVM(400, null, [output.error]));
			}
	
			logger.info(`User successfully activated with ID: ${output.user?.id}`);
	
			await this.cacheService.delete(CacheKeys.USER_LIST);
			logger.info('User list cache invalidated after activation.');
	
			return res.status(200).send(new OutputVM(200, output, []));
		} catch (error) {
			logger.error('Error during user activation:', { error });
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}
}