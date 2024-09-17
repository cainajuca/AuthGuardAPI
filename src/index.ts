 // Environment configuration import
 import '@shared/config/env';

// External imports (third-party libraries)
import http from 'http';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Infrastructure-related imports (database connection, dependency injection)
import { connectToDatabase } from '@infra/database/context';
import { initDependencies } from '@shared/config/dependency-injection';

// Presentation-related imports (routes, Swagger)
import router from '@presentation/routes';
import { setupSwagger } from '@shared/config/swagger.config';

const main = async () => {

	const app = express();

	app.use(cors({ credentials: true }))
	app.use(compression());
	app.use(express.json());
	app.use(cookieParser());

	setupSwagger(app);

	const server = http.createServer(app);

	server.listen(process.env.API_PORT, () => {
		console.log(`Server running on ${process.env.API_URL}`);
	});

	await connectToDatabase();
		
	const dependencies = await initDependencies();

	app.use('/', router(dependencies));
}

main();