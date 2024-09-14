import { IRequestPasswordResetUseCase } from '../protocols';
import { RequestPasswordResetUseCaseInput, RequestPasswordResetUseCaseOutput } from '.';
import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { sendResetPasswordEmail } from '@infra/email-sender/email-sender';
import { generateToken, GetExpirationDate } from '@shared/utils/jwt';

export class RequestPasswordResetUseCase implements IRequestPasswordResetUseCase {

    constructor(private readonly userRepository: IUserRepository) {}

    async handleRequestPasswordReset(input: RequestPasswordResetUseCaseInput): Promise<RequestPasswordResetUseCaseOutput> {
        try {
            
            const user = await this.userRepository.findByEmail(input.email);
            
            if(!user) {
                return new RequestPasswordResetUseCaseOutput(false, 'No user was found with this e-mail');
            }

            const jwtPayload = {
                _id: user.id,
                username: user.username,
                role: user.role,
            };

            const token = generateToken(jwtPayload, '1h');

            user.resetToken = token;
            user.resetTokenExpiresAt = GetExpirationDate('1h');

            await this.userRepository.update(user);

            await sendResetPasswordEmail(user.email, token);
            
            return new RequestPasswordResetUseCaseOutput(true);
        } catch (error) {
            return new RequestPasswordResetUseCaseOutput(false, 'An error occurred while attempting to send the password reset email');
        }  
    }
}
