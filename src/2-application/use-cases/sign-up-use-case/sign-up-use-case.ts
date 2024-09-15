import { ObjectId } from 'mongodb';
import { ISignUpUseCase } from '../protocols';
import { SignUpUseCaseInput, SignUpUseCaseOutput } from './sign-up-use-case.dto'

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { IRefreshTokenRepository } from '@domain/repositories/refresh-token-repository.interface';
import { User } from '@domain/entities/user';
import { hashPassword } from '@shared/utils/bcrypt'
import { generateAccessRefreshTokens, generateActivationToken } from '@shared/utils/jwt';
import { RefreshToken } from '@domain/entities/refresh-token';
import { sendActivationEmail } from '@infra/email-sender/email-sender';

export class SignUpUseCase implements ISignUpUseCase {
	
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly refreshTokenRepository: IRefreshTokenRepository,
	) {}

	async handleSignUp(input: SignUpUseCaseInput): Promise<SignUpUseCaseOutput> {

		if(input.password != input.confirmPassword) {
			return new SignUpUseCaseOutput(false, null, null, null, 'Please ensure password and confirm password are matching');
		}

		const existingUser = await this.userRepository.findByUsername(input.username);

		if(existingUser)
			return new SignUpUseCaseOutput(false, null, null, null, 'User already exists.');

		const jwtPayload = {
			_id: new ObjectId().toString(),
			username: input.username,
			role: 'user',
		};

		const activationTokenPair = generateActivationToken(jwtPayload);

		const passwordHash = await hashPassword(input.password);
		
		const user = new User(
			jwtPayload._id, 
			input.username,
			input.name,
			input.email,
			passwordHash,
			jwtPayload.role,
			false, // not active
			null, // resetToken
			null, // resetTokenExpiresAt
			activationTokenPair.token,
			activationTokenPair.expiresAt,
		);

		await this.userRepository.save(user);

		const [ accessTokenPair, refreshTokenPair ] = generateAccessRefreshTokens(jwtPayload);

		const tokenEntity = new RefreshToken(refreshTokenPair.token, user.id, refreshTokenPair.expiresAt, new Date());
		await this.refreshTokenRepository.save(tokenEntity);

		sendActivationEmail(user.email, activationTokenPair.token, activationTokenPair.expiresAt);

		return new SignUpUseCaseOutput(true, user, accessTokenPair.token, refreshTokenPair.token);
	}
}
