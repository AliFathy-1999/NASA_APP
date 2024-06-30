import { Router } from 'express';
    
import validate from '../middlewares/validation'
import { searchValidator } from '../Validation/index'

import { Auth, adminAuth, userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';

import { nasaController } from '../controllers';

import clearCacheMW from '../middlewares/clearCache';

const router = Router();
router.get('/:endpoint', userAuth, validate(searchValidator),asyncWrapper(nasaController.fetchNasaDataByEndpoint))



export default router;