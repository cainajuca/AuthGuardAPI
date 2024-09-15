import { OutputVM } from "../dtos/output-vm";
import { DeleteUserUseCaseInput, DeleteUserUseCaseOutput } from "./delete-user-use-case";
import { SignUpUseCaseInput, SignUpUseCaseOutput } from "./sign-up-use-case";
import { UpdateUserUseCaseInput, UpdateUserUseCaseOutput } from "./update-user-use-case";
import { RefreshTokenUseCaseInput, RefreshTokenUseCaseOutput } from "./refresh-token-use-case";
import { RequestPasswordResetUseCaseInput, RequestPasswordResetUseCaseOutput } from "./request-password-reset-use-case";
import { ResetPasswordUseCaseInput, ResetPasswordUseCaseOutput } from "./reset-password-use-case";
import { ActivateUserUseCaseInput, ActivateUserUseCaseOutput } from "./activate-user-use-case";

export interface ISignUpUseCase {
    handleSignUp(input: SignUpUseCaseInput): Promise<SignUpUseCaseOutput>;
}

export interface IUpdateUserUseCase {
    handleUpdateUser(input: UpdateUserUseCaseInput): Promise<OutputVM<UpdateUserUseCaseOutput>>;
}

export interface IDeleteUserUseCase {
    handleDeleteUser(input: DeleteUserUseCaseInput): Promise<OutputVM<DeleteUserUseCaseOutput>>;
}

export interface IRefreshTokenUseCase {
    handleRefreshToken(input: RefreshTokenUseCaseInput): Promise<RefreshTokenUseCaseOutput>;
}

export interface IRequestPasswordResetUseCase {
    handleRequestPasswordReset(input: RequestPasswordResetUseCaseInput): Promise<RequestPasswordResetUseCaseOutput>;
}

export interface IResetPasswordUseCase {
    handleResetPassword(input: ResetPasswordUseCaseInput): Promise<ResetPasswordUseCaseOutput>;
}

export interface IActivateUserUseCase {
    handleActivateUser(input: ActivateUserUseCaseInput): Promise<OutputVM<ActivateUserUseCaseOutput>>;
}