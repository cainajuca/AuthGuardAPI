import mongoose from 'mongoose';
import { seedData } from 'seeds/seed-data';
import logger from 'config/logger.config';

export async function connectToDatabase() {
	await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING).then(async () => {
			logger.info('Successfully connected to MongoDB');
			
			await seedData();
			logger.info('Database seeding completed successfully.');
		})
		.catch(err => {
			logger.error('Error connecting to MongoDB', { error: err.message, stack: err.stack });
		});
}