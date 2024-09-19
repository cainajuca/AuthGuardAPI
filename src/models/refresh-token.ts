import { Schema, Document, model } from 'mongoose';

export interface IRefreshToken extends Document {
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}

const RefreshTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: { createdAt: 'createdAt' } });

export const RefreshToken = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);