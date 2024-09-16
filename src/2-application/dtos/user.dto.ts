export class UserDTO {
	constructor(
        public id: string,
		public username: string,
        public name: string,
		public email: string,
		public role: string,
		public isActive: boolean,
	) {}
}
