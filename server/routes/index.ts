import { Router, Request, Response, NextFunction } from 'express';
import apiRoutes from './api';

const router = Router();

router.use('/api', apiRoutes);

router.use((req: Request, res: Response, next: NextFunction) => {
	res.send('Wrong route!');
});

export default router;
