import '@shared/config/env';

import http from 'http';

import express from 'express';
import compression from 'compression';
import cors from 'cors';

import { connectToDatabase } from '@infra/database/context';
import router from '@presentation/routes';

const main = async () => {

	const app = express();

	app.use(cors({ credentials: true }))
	app.use(compression());
	app.use(express.json());

	const server = http.createServer(app);

	server.listen(process.env.API_PORT, () => {
		console.log(`Server running on ${process.env.API_URL}`);
	});

	await connectToDatabase();
		
	app.use('/', router());
}

main();