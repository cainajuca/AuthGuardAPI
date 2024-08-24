import mongoose from 'mongoose';

import { seedData } from '@infra/database/seed-data';

export async function connectToDatabase() {
	mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING).then()
		.then(async () => {
			console.log('Connected to MongoDB');

			await seedData();
		})
		.catch(err => {
			console.error('Failed to connect to MongoDB', err);
		});
}