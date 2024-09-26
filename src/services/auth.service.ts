import { generateAccessRefreshTokens, generateActivationToken, generateToken } from 'utils/jwt';
import { hashPassword } from 'utils/bcrypt';
import { sendActivationEmail, sendResetPasswordEmail } from 'services/email-sender.service';
import { 
    ActivateUserInput, ActivateUserOutput,
    RefreshTokenInput, RefreshTokenOutput,
    RequestPasswordResetInput, RequestPasswordResetOutput,
    ResetPasswordInput, ResetPasswordOutput,
    SignUpInput, SignUpOutput,
} from 'services/dtos'
import { UserRepository } from 'repositories/user-repository';
import { RefreshTokenRepository } from 'repositories/refresh-token-repository';
import { RefreshToken } from 'models/refresh-token';
import { User } from 'models/user';
import { ObjectId } from 'mongodb';
import logger from 'config/logger.config';

export class AuthService {

	constructor(
        private readonly userRepository: UserRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) { }

	async activateUser(input: ActivateUserInput): Promise<ActivateUserOutput> {
        logger.info(`Activating user with token: ${input.token}`);

		const user = await this.userRepository.findByActivationToken(input.token);

		if(!user) {
            logger.warn(`User activation failed: No user found for token: ${input.token}`);
			return new ActivateUserOutput(false, null, 'User does not exist.');
		}
		
		user.isActive = true;
        logger.info(`User activated successfully with ID: ${user._id}`);

		await this.userRepository.update(user);

		const output = new ActivateUserOutput(true, user);

		return output;
	}

    async refreshToken(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
        logger.info(`Refreshing token for user: ${input.userId}`);

        const dbRefreshToken = await this.refreshTokenRepository.findByToken(input.refreshToken);

        if(!dbRefreshToken || input.userId != dbRefreshToken.userId) {
            logger.warn(`Token refresh failed for user: ${input.userId}. Token mismatch or not found.`);
            return new RefreshTokenOutput(false);
        }

        const [ accessTokenPair, refreshTokenPair ] = generateAccessRefreshTokens({
            _id: input.userId,
            username: input.username,
            role: input.role,
        });

        await this.refreshTokenRepository.deleteByToken(input.refreshToken);

        const refreshTokenEntity = new RefreshToken({
            token: refreshTokenPair.token,
            userId: input.userId,
            expiresAt: refreshTokenPair.expiresAt,
        });

        await this.refreshTokenRepository.save(refreshTokenEntity);
        logger.info(`Token refresh successful for user: ${input.userId}`);

        return new RefreshTokenOutput(true, accessTokenPair.token, refreshTokenPair.token);
    }

    async requestPasswordReset(input: RequestPasswordResetInput): Promise<RequestPasswordResetOutput> {
        try {
            logger.info(`Password reset requested for email: ${input.email}`);
            
            const user = await this.userRepository.findByEmail(input.email);
            
            if(!user) {
                logger.warn(`Password reset failed: No user found with email: ${input.email}`);
                return new RequestPasswordResetOutput(false, 'No user was found with this e-mail');
            }

            const jwtPayload = {
                _id: user.id,
                username: user.username,
                role: user.role,
            };

            const tokenPair = generateToken(jwtPayload, '1h');

            user.resetToken = tokenPair.token;
            user.resetTokenExpiresAt = tokenPair.expiresAt;

            await this.userRepository.update(user);

            await sendResetPasswordEmail(user.email, tokenPair.token);
            logger.info(`Password reset email sent successfully to: ${input.email}`);

            return new RequestPasswordResetOutput(true);
        } catch (error) {
            logger.error(`Error during password reset for email: ${input.email}`, { error });
            return new RequestPasswordResetOutput(false, 'An error occurred while attempting to send the password reset email');
        }  
    }

    async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
        try {
            logger.info(`Resetting password for email: ${input.email}`);
            
            const user = await this.userRepository.findByEmail(input.email);
            
            if(!user) {
                logger.warn(`Password reset failed: No user found with email: ${input.email}`);
                return new ResetPasswordOutput(false, 'No user was found with this e-mail');
            }

            const newPasswordHash = await hashPassword(input.newPassword);

            user.password = newPasswordHash;
            user.resetToken = undefined;
            user.resetTokenExpiresAt = undefined;

            await this.userRepository.update(user);
            logger.info(`Password reset successfully for email: ${input.email}`);

            return new ResetPasswordOutput(true);
        } catch (error) {
            logger.error(`Error during password reset for email: ${input.email}`, { error });
            return new ResetPasswordOutput(false, 'An error occurred while attempting to send the password reset email');
        }    
    }

    async signUp(input: SignUpInput): Promise<SignUpOutput> {
        try {
            logger.info(`User sign-up requested for username: ${input.username}`);

            if(input.password != input.confirmPassword) {
                logger.warn(`Sign-up failed: Password mismatch for username: ${input.username}`);
                return new SignUpOutput(false, null, null, null, 'Please ensure password and confirm password are matching.');
            }

            const existingUser = await this.userRepository.findByUsername(input.username);

            if(existingUser) {
                logger.warn(`Sign-up failed: User already exists with username: ${input.username}`);
                return new SignUpOutput(false, null, null, null, 'User already exists.');
            }

            const jwtPayload = {
                _id: new ObjectId().toString(),
                username: input.username,
                role: 'user',
            };

            const activationTokenPair = generateActivationToken(jwtPayload);

            const passwordHash = await hashPassword(input.password);
            
            const user = new User({
                _id: jwtPayload._id,
                username: input.username,
                name: input.name,
                email: input.email,
                password: passwordHash,
                role: jwtPayload.role,
                isActive: false, // not active
                activationToken: activationTokenPair.token,
                activationTokenExpiresAt: activationTokenPair.expiresAt,
            });

            await this.userRepository.save(user);
            logger.info(`User created successfully with ID: ${user._id}`);

            const [ accessTokenPair, refreshTokenPair ] = generateAccessRefreshTokens(jwtPayload);

            const tokenEntity = new RefreshToken({
                token: refreshTokenPair.token,
                userId: user.id,
                expiresAt: refreshTokenPair.expiresAt,
            });

            await this.refreshTokenRepository.save(tokenEntity);

            sendActivationEmail(user.email, activationTokenPair.token, activationTokenPair.expiresAt);
            logger.info(`Activation email sent to: ${user.email}`);

            return new SignUpOutput(true, user, accessTokenPair.token, refreshTokenPair.token);
        } catch (error) {
            logger.error(`Sign-up error for username: ${input.username}`, { error });
            return new SignUpOutput(false, null, null, null, 'An error occurred during sign-up.');
        }
    }
}
