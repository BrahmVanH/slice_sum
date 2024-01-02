import { Router, Request, Response, NextFunction } from 'express';
import apiRoutes from './api';
import path from 'path';

const router = Router();

router.use('/api', apiRoutes);

router.use((req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

export default router;
