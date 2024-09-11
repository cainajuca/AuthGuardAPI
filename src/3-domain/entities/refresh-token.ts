export class RefreshToken {
    constructor(
        public token: string,
        public userId: string,
        public expiresAt: Date,
        public createdAt: Date
    ) {}

    isValid(): boolean {
        return new Date() < this.expiresAt;
    }
}