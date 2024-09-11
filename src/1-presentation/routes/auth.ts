import { Router } from 'express';
import { IAuthController } from '../controllers/protocols';
import { refreshJWT } from '../middlewares';

export default (router: Router, authController: IAuthController) => {
	router.post('/auth/signup', authController.signUp.bind(authController));
	router.post('/auth/login', authController.login.bind(authController));
	router.post('/auth/refresh', refreshJWT, authController.refresh.bind(authController));
	router.post('/auth/logout', authController.logout.bind(authController));
};
