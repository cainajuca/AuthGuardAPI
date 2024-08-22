import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('@shared', '../../../.env') });

interface EnvConfig {
	API_PORT: string;
	API_URL: string;
	DB_CONNECTION_STRING: string;
	JWT_SECRET: string;
}

const requiredEnvVariables: (keyof EnvConfig)[] = [
	'API_PORT',
	'API_URL',
	'DB_CONNECTION_STRING',
	'JWT_SECRET',
];

requiredEnvVariables.forEach((key) => {
	if (!process.env[key]) {
		throw new Error(`Environment variable ${key} is missing`);
	}
});

export const config: EnvConfig = {
	API_PORT: process.env.API_PORT!,
	API_URL: process.env.API_URL!,
	DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING!,
	JWT_SECRET: process.env.JWT_SECRET!,
};
