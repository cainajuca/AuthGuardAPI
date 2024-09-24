import http from 'http';
import { createApp } from './app';

const main = async () => {
	const app = await createApp();

	const server = http.createServer(app);

	server.listen(process.env.API_PORT, () => {
		console.log(`Server running on ${process.env.API_URL}`);
	});
};

main();