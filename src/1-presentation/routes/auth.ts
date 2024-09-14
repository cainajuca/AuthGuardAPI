import { Router } from 'express';
import { IAuthController } from '../controllers/protocols';
import { refreshJWT, verifyResetToken } from '../middlewares';

export default (router: Router, authController: IAuthController) => {
	router.post('/auth/signup', authController.signUp.bind(authController));
	router.post('/auth/login', authController.login.bind(authController));
	router.post('/auth/refresh', refreshJWT, authController.refresh.bind(authController));
	router.post('/auth/logout', authController.logout.bind(authController));

	router.post('/auth/password-reset/request', authController.requestPasswordReset.bind(authController));
	router.post('/auth/password-reset/reset', verifyResetToken, authController.resetPassword.bind(authController));
};
