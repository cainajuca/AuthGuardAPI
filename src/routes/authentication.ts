import { Router } from 'express';
import { authenticateJWT } from '../middlewares';

import { auth } from '../controllers/authentication';

export default (router: Router) => {
    router.get('/auth/signup', authenticateJWT, auth.signup_get);
    router.post('/auth/signup', auth.signup_post);

    router.get('/auth/login', authenticateJWT, auth.login_get);
    router.post('/auth/login', auth.login_post);
};