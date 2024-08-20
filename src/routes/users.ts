import { Router } from 'express';
import { authenticateJWT, authorizationJWT } from '../middlewares';

import { users } from '../controllers/users'

export default (router: Router) => {
    router.get('/users', authenticateJWT, users.getAllUsers);
    router.patch('/users/:id', authenticateJWT, authorizationJWT, users.updateUser);
    router.delete('/users/:id', authenticateJWT, authorizationJWT, users.deleteUser);
};