import '@shared/config/env';

import http from 'http';

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectToDatabase } from '@infra/database/context';
import router from '@presentation/routes';
import { initDependencies } from '@shared/config/dependency-injection';

const main = async () => {

	const app = express();

	app.use(cors({ credentials: true }))
	app.use(compression());
	app.use(express.json());
	app.use(cookieParser());

	const server = http.createServer(app);

	server.listen(process.env.API_PORT, () => {
		console.log(`Server running on ${process.env.API_URL}`);
	});

	await connectToDatabase();
		
	const dependencies = await initDependencies();

	app.use('/', router(dependencies));
}

main();