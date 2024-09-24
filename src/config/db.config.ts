import mongoose from 'mongoose';

import { seedData } from 'seeds/seed-data';

export async function connectToDatabase() {
	await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING).then()
		.then(async () => {
			console.log('Connected to MongoDB');

			await seedData();
		})
		.catch(err => {
			console.error('Failed to connect to MongoDB', err);
		});
}