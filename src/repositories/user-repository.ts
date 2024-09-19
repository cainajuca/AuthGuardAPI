import { IUser, User } from '../models/user';

export class UserRepository {
	
	async findAllUsers(isActive? : boolean): Promise<IUser[]> {
		return await User.find({ isActive });
	}
	
	async findById(id: string): Promise<IUser | null> {
		return await User.findById(id);
	}

	async findByUsername(username: string): Promise<IUser | null> {
		return await User.findOne({ username });
	}

	async findByEmail(email: string): Promise<IUser | null> {
		return await User.findOne({ email });
	}

	async findByActivationToken(activationToken: string): Promise<IUser | null> {
		return await User.findOne({ activationToken });
	}

	async save(user: IUser): Promise<void> {
		await user.save();
	}

	async update(user: IUser): Promise<void> {
		await User.findByIdAndUpdate(user.id, user);
	}

	async delete(id: string): Promise<void> {
		await User.findByIdAndDelete(id);
	}
}
