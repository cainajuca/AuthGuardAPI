import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
    username: string;
    name: string;
    email: string;
    password: string;
    role: string;
    resetToken?: string;
    resetTokenExpiresAt?: Date;
}

const UserSchema: Schema = new Schema({
	username: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, default: 'user' },
    resetToken: { type: String },
    resetTokenExpiresAt: { type: Date },
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
