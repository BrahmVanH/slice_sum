import { Router, RequestHandler } from 'express';
import { getAllEntries, getLastTwentyEntries, createEntry, deleteEntry } from '../../controllers';

import { authMiddleware } from '../../utils/auth';
import { IEntryBody, IEntryPostBody,  } from '../../types';

type RequestHandlerWithType<T> = RequestHandler<{}, {}, T>;

const entryRouter = Router();

entryRouter.route('/').get(getAllEntries as RequestHandler).post(createEntry as RequestHandlerWithType<IEntryBody>);

entryRouter.route('/:id').delete(authMiddleware, deleteEntry as RequestHandlerWithType<IEntryPostBody>);

entryRouter.route('/recent').get(getLastTwentyEntries as RequestHandler);

export default entryRouter;
