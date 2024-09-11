import { OutputVM } from "../dtos/output-vm";
import { DeleteUserUseCaseInput, DeleteUserUseCaseOutput } from "./delete-user-use-case/delete-user-use-case.dto";
import { SignUpUseCaseInput, SignUpUseCaseOutput } from "./sign-up-use-case/sign-up-use-case.dto";
import { UpdateUserUseCaseInput, UpdateUserUseCaseOutput } from "./update-user-use-case/update-user-use-case.dto";
import { RefreshTokenUseCaseInput, RefreshTokenUseCaseOutput } from "./refresh-token-use-case/refresh-token-use-case.dto";

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