import http from 'http';
import { createApp } from './app';
import logger from 'config/logger.config';

const main = async () => {
	const app = await createApp();

	const server = http.createServer(app);

	server.listen(process.env.API_PORT, () => {
		logger.info(`Server running on ${process.env.API_URL}`);
	});
};

main();