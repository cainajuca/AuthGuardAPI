
import { User } from '../entities/user';

export interface IUserRepository {
	findAllUsers(): Promise<User[]>;
	findById(id: string): Promise<User | null>;
	findByUsername(username: string): Promise<User | null>;
	save(user: User): Promise<void>;
	update(user: User): Promise<void>
	delete(id: string): Promise<void>;
}