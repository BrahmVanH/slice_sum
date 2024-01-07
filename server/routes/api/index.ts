import { Router } from 'express';
import userRouter from './UserRoutes';
import entryRouter from './SliceEntryRoutes';

const router = Router();

router.use('/user', userRouter);
router.use('/entries', entryRouter);

export default router;

