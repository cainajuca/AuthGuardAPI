import { Schema, Document, model } from 'mongoose';

export interface RefreshTokenDocument extends Document {
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}

const refreshTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const RefreshTokenModel = model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);