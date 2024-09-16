export class ResetPasswordUseCaseOutput {
	constructor(
        public valid: boolean,
        public error?: string,
    ) { }
}