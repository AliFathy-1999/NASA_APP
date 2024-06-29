import { Router } from 'express';
    
import validate from '../middlewares/validation'
import { searchValidator, usersValidator } from '../Validation/index'

import { Auth, adminAuth, userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';

import { userController } from '../controllers';

import clearCacheMW from '../middlewares/clearCache';

const router = Router();

router.patch('/', Auth, validate(usersValidator.signUp), clearCacheMW, asyncWrapper(userController.updateUser))
router.get('/:id', Auth, asyncWrapper(userController.getUserById))



export default router;