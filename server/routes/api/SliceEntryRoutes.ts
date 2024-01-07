import { Router, RequestHandler } from 'express';
import { getAllEntries, getLastTwentyEntries, createEntry, deleteEntry } from '../../controllers';

import { authMiddleware } from '../../utils/auth';

type RequestHandlerWithType<T> = RequestHandler<{}, {}, T>;

const entryRouter = Router();

entryRouter.route('/').get(getAllEntries).post(authMiddleware, createEntry);

entryRouter.route('/:id').delete(authMiddleware, deleteEntry);

entryRouter.route('/recent').get(getLastTwentyEntries);

export default entryRouter;
