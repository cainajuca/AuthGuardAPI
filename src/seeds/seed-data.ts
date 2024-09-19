import mongoose from 'mongoose';

import { User } from '../models/user';
import { hashPassword } from '../utils/bcrypt'

export async function seedData() {
	try {
		await seedUsersCollection();
		await seedAdmin();
        
	} catch (error) {
		throw new Error("Failed to initialize database.")
	}
}

async function seedUsersCollection() {
	const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
	if (collections.length === 0) {
		await mongoose.connection.db.createCollection('users');
		console.log('Users collection created!');
	}
}

async function seedAdmin() {
	const adminUser = await User.findOne({ username: 'admin' });
	if (!adminUser) {
		const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD);
		const newAdmin = new User({
			username: 'admin',
			name: 'Administrador',
			email: 'admin@example.com',
			password: passwordHash,
			role: 'admin',
			isActive: true,
		});

		await newAdmin.save();
		console.log('Admin user created!');
	}
}