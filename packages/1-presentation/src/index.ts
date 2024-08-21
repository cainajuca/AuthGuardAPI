import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './routes'

import { config } from '@shared/config/env';

const app = express();

app.use(cors({
    credentials: true
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(config.API_PORT, () => {
    console.log(`Server running on ${config.API_URL}`);
});

mongoose.Promise = Promise;
mongoose.connect(config.DB_CONNECTION_STRING);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());