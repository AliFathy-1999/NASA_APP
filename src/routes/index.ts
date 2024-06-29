import { Request, Response, NextFunction,Router } from 'express';

import userRoutes from './users';
import nasaRoutes from './nasa'
import authRoutes from './auth';


const router = Router()

router.use("/v1/auth", authRoutes)
router.use("/v1/users", userRoutes)
router.use("/v1/nasa", nasaRoutes)

export default router;
