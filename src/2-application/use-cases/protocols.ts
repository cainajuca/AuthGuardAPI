import { OutputVM } from "../dtos/output-vm";
import { DeleteUserUseCaseInput, DeleteUserUseCaseOutput } from "./delete-user-use-case";
import { SignUpUseCaseInput, SignUpUseCaseOutput } from "./sign-up-use-case";
import { UpdateUserUseCaseInput, UpdateUserUseCaseOutput } from "./update-user-use-case";
import { RefreshTokenUseCaseInput, RefreshTokenUseCaseOutput } from "./refresh-token-use-case";

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