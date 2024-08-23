import { Router } from 'express';

import { authController } from '@shared/config/dependency-injection';

export default (router: Router) => {

	router.post('/auth/signup', authController.signUp.bind(authController));
	router.post('/auth/login', authController.login.bind(authController));
};
