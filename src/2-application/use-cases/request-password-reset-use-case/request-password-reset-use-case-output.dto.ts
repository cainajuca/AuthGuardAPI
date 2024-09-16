export class RequestPasswordResetUseCaseOutput {
	constructor(
        public valid: boolean,
        public error?: string,
    ) { }
}