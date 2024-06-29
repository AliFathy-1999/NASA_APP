import { Router } from 'express'; 
import validate from '../middlewares/validation'
import { usersValidator } from '../Validation/index'

import { asyncWrapper } from '../lib';

import { authController } from '../controllers';

import { Auth } from '../middlewares/auth';

const router = Router()

router.post('/register', validate(usersValidator.signUp), asyncWrapper(authController.register))
router.post('/login', validate(usersValidator.signIn), asyncWrapper(authController.signIn))
router.get('/profile', Auth, asyncWrapper(authController.getProfile))
router.get('/refresh-token', asyncWrapper(authController.refreshAccessToken))
router.patch('/logout', Auth, asyncWrapper(authController.logout))


export default router;