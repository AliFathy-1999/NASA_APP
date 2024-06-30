import { Router } from 'express';
    
import validate from '../middlewares/validation'
import { favoriteValidator } from '../Validation/index'

import { userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';

import { favoritesController, userController } from '../controllers';

import clearCacheMW from '../middlewares/clearCache';

const router = Router();

router.post('/', userAuth, validate(favoriteValidator.addFavorite), asyncWrapper(favoritesController.addFavorite))
router.get('/:id', userAuth, asyncWrapper(favoritesController.getFavoriteById))
router.get('/', userAuth, asyncWrapper(favoritesController.getAllFavorites))
router.delete('/:id', userAuth, asyncWrapper(favoritesController.deleteFavoriteItem))



export default router;