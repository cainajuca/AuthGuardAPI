import { UserModel } from '../database/schemas/user-schema';

import { IUserRepository } from '@domain/repositories/user-repository.interface';
import { User } from '@domain/entities/user';

export class UserRepository implements IUserRepository {
	
	async findAllUsers(isActive? : boolean): Promise<User[]> {
		const usersDoc = await UserModel.find({ isActive });

		return usersDoc.map(doc => new User(doc._id.toString(), doc.username, doc.name, doc.email, doc.password, doc.role, doc.isActive));
	}
	
	async findById(id: string): Promise<User | null> {
		const userDoc = await UserModel.findById(id);
		return userDoc ? new User(userDoc.id, userDoc.username, userDoc.name, userDoc.email, userDoc.password, userDoc.role, userDoc.isActive) : null;
	}

	async findByUsername(username: string): Promise<User | null> {
		const userDoc = await UserModel.findOne({ username });
		return userDoc ? new User(userDoc.id, userDoc.username, userDoc.name, userDoc.email, userDoc.password, userDoc.role, userDoc.isActive) : null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const userDoc = await UserModel.findOne({ email });
		return userDoc ? new User(userDoc.id, userDoc.username, userDoc.name, userDoc.email, userDoc.password, userDoc.role, userDoc.isActive) : null;
	}

	async findByActivationToken(activationToken: string): Promise<User | null> {
		const userDoc = await UserModel.findOne({ activationToken });
		return userDoc ? new User(userDoc.id, userDoc.username, userDoc.name, userDoc.email, userDoc.password, userDoc.role, userDoc.isActive) : null;
	}

	async save(user: User): Promise<void> {
		const userDoc = new UserModel({
			_id: user.id,
			username: user.username,
			name: user.name,
			email: user.email,
			password: user.password,
			role: 'user',
			activationToken: user.activationToken,
			activationTokenExpiresAt: user.activationTokenExpiresAt,
		});

		await userDoc.save();
	}

	async update(user: User): Promise<void> {
		await UserModel.findByIdAndUpdate(user.id, user);
	}

	async delete(id: string): Promise<void> {
		await UserModel.findByIdAndDelete(id);
	}
}
