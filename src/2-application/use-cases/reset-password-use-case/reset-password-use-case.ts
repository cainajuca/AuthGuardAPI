import { IResetPasswordUseCase } from '../protocols';
import { ResetPasswordUseCaseInput, ResetPasswordUseCaseOutput } from '.';
import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { hashPassword } from '@shared/utils/bcrypt';

export class ResetPasswordUseCase implements IResetPasswordUseCase {

    constructor(private readonly userRepository: IUserRepository) {}

    async handleResetPassword(input: ResetPasswordUseCaseInput): Promise<ResetPasswordUseCaseOutput> {
        try {
            
            const user = await this.userRepository.findByEmail(input.email);
            
            if(!user) {
                return new ResetPasswordUseCaseOutput(false, 'No user was found with this e-mail');
            }

            const newPasswordHash = await hashPassword(input.newPassword);

            user.password = newPasswordHash;
            user.resetToken = undefined;
            user.resetTokenExpiresAt = undefined;

            await this.userRepository.update(user);
            
            return new ResetPasswordUseCaseOutput(true);
        } catch (error) {
            return new ResetPasswordUseCaseOutput(false, 'An error occurred while attempting to send the password reset email');
        }    
    }
}
