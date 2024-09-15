export class User {
	constructor(
		public id: string,
		public username: string,
		public name: string,
		public email: string,
		public password: string,
		public role: string,
		public isActive: boolean,
		public resetToken?: string,
		public resetTokenExpiresAt?: Date,
		public activationToken?: string,
		public activationTokenExpiresAt?: Date,
	) {}
}
  