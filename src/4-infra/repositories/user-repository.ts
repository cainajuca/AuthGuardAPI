import { UserModel } from '../database/schemas/user-schema';

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { User } from '@domain/entities/user';

export class UserRepository implements IUserRepository {
	
	async findAllUsers(): Promise<User[]> {
		const usersDoc = await UserModel.find().exec();

		return usersDoc.map(doc => new User(doc._id.toString(), doc.username, doc.name, doc.email, doc.password));
	}
	
	async findById(id: string): Promise<User | null> {
		const userDoc = await UserModel.findById(id).exec();
		return userDoc ? new User(userDoc.id, userDoc.username, userDoc.name, userDoc.email, userDoc.password) : null;
	}

	async findByUsername(username: string): Promise<User | null> {
		const userDoc = await UserModel.findOne({ username }).exec();
		return userDoc ? new User(userDoc.id, userDoc.username, userDoc.name, userDoc.email, userDoc.password) : null;
	}

	async save(user: User): Promise<void> {
		const userDoc = new UserModel({
			_id: user.id,
			username: user.username,
			name: user.name,
			email: user.email,
			password: user.password,
		});

		await userDoc.save();
	}

	async update(user: User): Promise<void> {
		await UserModel.findByIdAndUpdate(user.id, user).exec();
	}

	async delete(id: string): Promise<void> {
		await UserModel.findByIdAndDelete(id).exec();
	}
}
