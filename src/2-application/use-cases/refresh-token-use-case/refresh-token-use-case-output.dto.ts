export class RefreshTokenUseCaseOutput {
	constructor(
        public valid: boolean,
        public accessToken?: string,
        public refreshToken?: string,
    ) { }
}