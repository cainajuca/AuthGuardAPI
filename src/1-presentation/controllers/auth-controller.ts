import { Request, Response } from 'express';

import { IAuthController } from './protocols';

import { generateAccessRefreshTokens } from '@shared/utils/jwt';
import { AuthenticatedRequest } from '../middlewares';
import { verifyPassword } from '@shared/utils/bcrypt';
import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { OutputVM } from '@application/dtos/output-vm';
import { UserDTO } from '@application/use-cases/user-dto';
import { CacheKeys, ICacheService } from '@domain/Cache/cache-service.interface';
import { IRefreshTokenRepository } from '@domain/repositories/refresh-token-repository.interface';
import { RefreshToken } from '@domain/entities/refresh-token';

import { SignUpUseCase, SignUpUseCaseInput } from '@application/use-cases/sign-up-use-case';
import { RefreshTokenUseCase, RefreshTokenUseCaseInput } from '@application/use-cases/refresh-token-use-case';
import { RequestPasswordResetUseCase, RequestPasswordResetUseCaseInput } from '@application/use-cases/request-password-reset-use-case';
import { ResetPasswordUseCase, ResetPasswordUseCaseInput } from '@application/use-cases/reset-password-use-case';

export class AuthController implements IAuthController {
	constructor(
		private readonly signUpUseCase: SignUpUseCase,
		private readonly refreshTokenUseCase: RefreshTokenUseCase,
		private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
		private readonly resetPasswordUseCase: ResetPasswordUseCase,
		private readonly userRepository: IUserRepository,
		private readonly refreshTokenRepository: IRefreshTokenRepository,
		private readonly cacheService: ICacheService
	) { }

	async signUp(req: Request, res: Response): Promise<Response> {
		try {
			const input: SignUpUseCaseInput = req.body;
			const result = await this.signUpUseCase.handleSignUp(input);
			
			if(!result || !result.valid) {
				return res.status(400).send(new OutputVM(400, null, [result.error]));
			}

			await this.cacheService.delete(CacheKeys.USER_LIST);

			res.cookie('refreshToken', result.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
				
				// only in production environment:				
				// secure: true, // only for HTTPS
				// sameSite: 'strict', // Cross-Site Request Forgery protection
			});

			const output = {
				user: result.user,
				accessToken: result.accessToken,
			}

			return res.status(201).send(new OutputVM(201, output, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async login(req: Request, res: Response): Promise<Response> {
		try {
			const { username, password } = req.body;

			if(!username || !password)
				return res.status(400).send(new OutputVM(400, null, ['Credentials are not in the correct format']));

			const user = await this.userRepository.findByUsername(username);

			if(!user)
				return res.status(400).send(new OutputVM(400, null, ['User does not exist']));

			const isPasswordValid = await verifyPassword(password, user.password);
			
			if (!isPasswordValid)
				return res.status(400).send(new OutputVM(400, null, ['Invalid username or password']));

			const [ accessTokenPair, refreshTokenPair ] = generateAccessRefreshTokens({
				_id: user.id,
				username: user.username,
				role: user.role,
			});

			const tokenEntity = new RefreshToken(refreshTokenPair.token, user.id, refreshTokenPair.expiresAt, new Date());
			await this.refreshTokenRepository.save(tokenEntity);
			
			res.cookie('refreshToken', refreshTokenPair.token, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
				
				// only in production environment:				
				// secure: true, // only for HTTPS
				// sameSite: 'strict', // Cross-Site Request Forgery protection
			});

			const userVM = new UserDTO(user.id, user.name, user.username, user.email, user.role);

			const accessToken = accessTokenPair.token
			const output = { userVM, accessToken };

			return res.status(200).send(new OutputVM(200, output, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async refresh(req: AuthenticatedRequest, res: Response): Promise<Response> {
		try {
			const refreshToken = req.cookies.refreshToken;

			if (!refreshToken) {
				return res.status(401).json({ message: 'Refresh Token not found' });
			}

			const input: RefreshTokenUseCaseInput = {
				userId: req.userId,
				username: req.username,
				role: req.role,
				refreshToken: refreshToken,
			};

			const output = await this.refreshTokenUseCase.handleRefreshToken(input);

			if(!output || !output.valid) {
				return res.status(400).send(new OutputVM(400, null, ['Invalid or expired token']));
			}

			res.cookie('refreshToken', output.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
				
				// only in production environment:				
				// secure: true, // only for HTTPS
				// sameSite: 'strict', // Cross-Site Request Forgery protection
			});

			return res.status(201).send(new OutputVM(201, { accessToken: output.accessToken }, []));
		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async logout(req: Request, res: Response): Promise<Response> {

		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.status(400).send(new OutputVM(400, null, ['Refresh token not provided.']));
		}

		try {
			await this.refreshTokenRepository.deleteByToken(refreshToken);

			res.clearCookie('refreshToken', {
				httpOnly: true,
				// secure: true, // only for HTTPS
				// sameSite: 'strict', // Cross-Site Request Forgery protection
			});

			return res.status(200).send(new OutputVM(200, { message: 'Logged out successfully.' }, []));
		} catch (error) {
			return res.status(500).send(new OutputVM(400, null, [error.message]));
		}
	}
	
	async requestPasswordReset(req: Request, res: Response): Promise<Response> {
		try {
			const input: RequestPasswordResetUseCaseInput = req.body;
			const result = await this.requestPasswordResetUseCase.handleRequestPasswordReset(input);
			
			if(!result || !result.valid) {
				return res.status(400).send(new OutputVM(400, null, [result.error]));
			}

			const output = {
				message: "We've sent a password reset link to your e-mail. Please check your inbox and follow the instructions to reset your password within the next hour",
			}
			
			return res.status(200).send(new OutputVM(200, output, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}

	async resetPassword(req: Request, res: Response): Promise<Response> {
		try {
			const input: ResetPasswordUseCaseInput = req.body;
			const result = await this.resetPasswordUseCase.handleResetPassword(input);
			
			if(!result || !result.valid) {
				return res.status(400).send(new OutputVM(400, null, [result.error]));
			}

			const output = {
				message: "Your password has been successfully reset",
			}
			
			return res.status(200).send(new OutputVM(200, output, []));

		} catch (error) {
			return res.status(400).send(new OutputVM(400, null, [error.message]));
		}
	}
}