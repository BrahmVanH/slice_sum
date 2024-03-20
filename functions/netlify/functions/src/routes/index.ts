import sliceRouter from './sliceRoutes';
import userRouter from './userRoutes';
import { Router } from 'express';

const router = Router();

router.use('/slices', sliceRouter);
router.use('/user', userRouter);

export default router;
