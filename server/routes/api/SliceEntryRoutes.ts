import { Router, RequestHandler, Request, Response } from 'express';
import { getAllEntries, getLastTwentyEntries, createEntry, deleteEntry } from '../../controllers';
import multer from 'multer';
import { authMiddleware } from '../../utils/auth';
import { IEntryBody, IEntryPostBody,  } from '../../types';
const upload = multer({ dest: 'uploads/' });

type RequestHandlerWithType<T> = RequestHandler<{}, {}, T>;


const entryRouter = Router();

entryRouter.route('/').get(getAllEntries as RequestHandler).post(createEntry as RequestHandlerWithType<IEntryBody>);

entryRouter.route('/:id').delete(authMiddleware, deleteEntry as RequestHandlerWithType<IEntryPostBody>);

entryRouter.route('/recent').get(getLastTwentyEntries as RequestHandler);

export default entryRouter;
