import { Router } from 'express';

import { authenticateJWT, authorizationJWT } from '../middlewares';

import { userController } from '@shared/config/dependency-injection';

export default (router: Router) => {

	router.get('/users', authenticateJWT, userController.getAllUsers.bind(userController));
	router.get('/users/:id', authenticateJWT, userController.getUserById.bind(userController));
	router.patch('/users/:id', authenticateJWT, authorizationJWT, userController.updateUser.bind(userController));
	router.delete('/users/:id', authenticateJWT, authorizationJWT, userController.deleteUser.bind(userController));
};