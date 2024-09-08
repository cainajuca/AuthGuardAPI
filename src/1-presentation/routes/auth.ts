import { Router } from 'express';
import { IAuthController } from '../controllers/protocols';

export default (router: Router, authController: IAuthController) => {
	router.post('/auth/signup', authController.signUp.bind(authController));
	router.post('/auth/login', authController.login.bind(authController));
};
