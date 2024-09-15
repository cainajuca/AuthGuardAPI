import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
    username: string;
    name: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    resetToken?: string;
    resetTokenExpiresAt?: Date;
    activationToken?: string;
    activationTokenExpiresAt?: Date;
}

const UserSchema: Schema = new Schema({
	username: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, required: true, default: 'user' },
    isActive: { type: Boolean, required: true, default: false },
    resetToken: { type: String },
    resetTokenExpiresAt: { type: Date },
    activationToken: { type: String },
    activationTokenExpiresAt: { type: Date },
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
