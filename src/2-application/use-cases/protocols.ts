import { OutputVM } from "../dtos/output-vm";
import { DeleteUserUseCaseInput, DeleteUserUseCaseOutput } from "./delete-user-use-case/delete-user-use-case.dto";
import { SignUpUseCaseInput, SignUpUseCaseOutput } from "./sign-up-use-case/sign-up-use-case.dto";
import { UpdateUserUseCaseInput, UpdateUserUseCaseOutput } from "./update-user-use-case/update-user-use-case.dto";

export interface ISignUpUseCase {
    handleSignUp(input: SignUpUseCaseInput): Promise<OutputVM<SignUpUseCaseOutput>>;
}

export interface IUpdateUserUseCase {
    handleUpdateUser(input: UpdateUserUseCaseInput): Promise<OutputVM<UpdateUserUseCaseOutput>>;
}

export interface IDeleteUserUseCase {
    handleDeleteUser(input: DeleteUserUseCaseInput): Promise<OutputVM<DeleteUserUseCaseOutput>>;
}