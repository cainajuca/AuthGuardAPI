import express from 'express';

import authentication from './auth';
import users from './user';

const router = express.Router();

export default (dependencies: any): express.Router => {
	authentication(router, dependencies.authController);
	users(router, dependencies.userController);

	return router;
}