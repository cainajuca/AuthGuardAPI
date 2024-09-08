import { Router } from 'express';

import { authenticateJWT, authorizationJWT } from '../middlewares';
import { IUserController } from '../controllers/protocols';

export default (router: Router, userController: IUserController) => {
	router.get('/users', authenticateJWT, userController.getAllUsers.bind(userController));
	router.get('/users/id/:id', authenticateJWT, userController.getUserById.bind(userController));
	router.get('/users/username/:username', authenticateJWT, userController.getUserByUsername.bind(userController));
	router.patch('/users/:id', authenticateJWT, authorizationJWT, userController.updateUser.bind(userController));
	router.delete('/users/:id', authenticateJWT, authorizationJWT, userController.deleteUser.bind(userController));
};