import mongoose from 'mongoose';

import { User } from '../models/user';
import { hashPassword } from '../utils/bcrypt';
import logger from 'config/logger.config';

export async function seedData() {
	try {
		await seedUsersCollection();
		await seedAdmin();
        
	} catch (error) {
		logger.error('Failed to initialize database during seeding process.', { error: error.message, stack: error.stack });
		throw new Error('Failed to initialize database.');
	}
}

async function seedUsersCollection() {
	const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
	if (collections.length === 0) {
		await mongoose.connection.db.createCollection('users');
		logger.info('Users collection created successfully.');
	} else {
		logger.info('Users collection already exists. Skipping creation.');
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
		logger.info('Admin user created successfully.');
	} else {
		logger.info('Admin user already exists. Skipping creation.');
	}
}