import { generateAccessRefreshTokens, generateActivationToken, generateToken } from 'utils/jwt';
import { hashPassword } from 'utils/bcrypt';
import { sendActivationEmail, sendResetPasswordEmail } from 'services/email-sender.service';
import { OutputVM } from 'dtos/output.vm';
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

export class AuthService {

	constructor(
        private readonly userRepository: UserRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) { }

	async activateUser(input: ActivateUserInput): Promise<ActivateUserOutput> {

		const user = await this.userRepository.findByActivationToken(input.token);

		if(!user) {
			return new ActivateUserOutput(false, null, 'User does not exist.');
		}
		
		user.isActive = true;

		await this.userRepository.update(user);

		const output = new ActivateUserOutput(true, user);

		return output;
	}

    async refreshToken(input: RefreshTokenInput): Promise<RefreshTokenOutput> {

        const dbRefreshToken = await this.refreshTokenRepository.findByToken(input.refreshToken);

        if(!dbRefreshToken || input.userId != dbRefreshToken.userId) {
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
                
        return new RefreshTokenOutput(true, accessTokenPair.token, refreshTokenPair.token);
    }

    async requestPasswordReset(input: RequestPasswordResetInput): Promise<RequestPasswordResetOutput> {
        try {
            
            const user = await this.userRepository.findByEmail(input.email);
            
            if(!user) {
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

            return new RequestPasswordResetOutput(true);
        } catch (error) {
            return new RequestPasswordResetOutput(false, 'An error occurred while attempting to send the password reset email');
        }  
    }

    async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
        try {
            
            const user = await this.userRepository.findByEmail(input.email);
            
            if(!user) {
                return new ResetPasswordOutput(false, 'No user was found with this e-mail');
            }

            const newPasswordHash = await hashPassword(input.newPassword);

            user.password = newPasswordHash;
            user.resetToken = undefined;
            user.resetTokenExpiresAt = undefined;

            await this.userRepository.update(user);
            
            return new ResetPasswordOutput(true);
        } catch (error) {
            return new ResetPasswordOutput(false, 'An error occurred while attempting to send the password reset email');
        }    
    }

    async signUp(input: SignUpInput): Promise<SignUpOutput> {

		if(input.password != input.confirmPassword) {
			return new SignUpOutput(false, null, null, null, 'Please ensure password and confirm password are matching.');
		}

		const existingUser = await this.userRepository.findByUsername(input.username);

		if(existingUser)
			return new SignUpOutput(false, null, null, null, 'User already exists.');

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

		const [ accessTokenPair, refreshTokenPair ] = generateAccessRefreshTokens(jwtPayload);

        const tokenEntity = new RefreshToken({
            token: refreshTokenPair.token,
            userId: user.id,
            expiresAt: refreshTokenPair.expiresAt,
        });

		await this.refreshTokenRepository.save(tokenEntity);

		sendActivationEmail(user.email, activationTokenPair.token, activationTokenPair.expiresAt);

		return new SignUpOutput(true, user, accessTokenPair.token, refreshTokenPair.token);
	}
}