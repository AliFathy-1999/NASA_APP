import { Request, Response, NextFunction,Router } from 'express';

import userRoutes from './users';
import nasaRoutes from './nasa'
import authRoutes from './auth';
import favoriteRoutes from './favorites';


const router = Router()

router.use("/v1/auth", authRoutes)
router.use("/v1/users", userRoutes)
router.use("/v1/nasa", nasaRoutes)
router.use("/v1/favorites", favoriteRoutes)
export default router;
