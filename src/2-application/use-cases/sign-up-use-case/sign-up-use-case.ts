import { ObjectId } from 'mongodb';
import { ISignUpUseCase } from '../protocols';
import { SignUpUseCaseInput, SignUpUseCaseOutput } from './sign-up-use-case.dto'

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { IRefreshTokenRepository } from '@domain/repositories/refresh-token-repository.interface';
import { User } from '@domain/entities/user';
import { hashPassword } from '@shared/utils/bcrypt'
import { generateAccessRefreshTokens } from '@shared/utils/jwt';
import { RefreshToken } from '@domain/entities/refresh-token';

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

		const passwordHash = await hashPassword(input.password);
		
		const user = new User(
			new ObjectId().toString(), 
			input.username,
			input.name,
			input.email,
			passwordHash,
			'user'
		);

		await this.userRepository.save(user);

		const { accessToken, refreshToken, refreshTokenExpiresAt } = generateAccessRefreshTokens({
			_id: user.id,
			username: user.username,
			role: user.role,
		});

		const tokenEntity = new RefreshToken(refreshToken, user.id, refreshTokenExpiresAt, new Date());
		await this.refreshTokenRepository.save(tokenEntity);

		return new SignUpUseCaseOutput(true, existingUser, accessToken, refreshToken, '');
	}
}
