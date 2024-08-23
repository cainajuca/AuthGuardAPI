import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from '@presentation/routes'



import mongoose from 'mongoose';

const main = async () => {

	const app = express();

	app.use(cors({ credentials: true }))
	app.use(compression());
	app.use(cookieParser());
	app.use(bodyParser.json());

	const server = http.createServer(app);

	server.listen(process.env.API_PORT, () => {
		console.log(`Server running on ${process.env.API_URL}`);
	});

	mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING).then()
	.catch(err => {
		console.error('Failed to connect to MongoDB', err);
	});
		
	app.use('/', router());
}

main();