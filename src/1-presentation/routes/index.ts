import express from 'express';

import authentication from './auth';
import users from './user';

const router = express.Router();

export default (): express.Router => {
	authentication(router);
	users(router);

	return router;
}