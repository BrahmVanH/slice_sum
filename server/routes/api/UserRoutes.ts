import { Router, RequestHandler } from 'express';
import { getSingleUser, createUser, loginUser, addSlices, getAllUsers, deleteUser } from '../../controllers';
import { ICreateBody, IUserPostBody, IAddSliceBody } from '../../types';
import { authMiddleware } from '../../utils/auth';

type RequestHandlerWithType<T> = RequestHandler<{}, {}, T>;

const userRouter = Router();

userRouter.route('/users').get(getAllUsers);
userRouter.route('/').post(createUser as RequestHandlerWithType<ICreateBody>);

userRouter.route('/login').post(loginUser as RequestHandlerWithType<IUserPostBody>);

userRouter.route('/user').get(authMiddleware, getSingleUser);

userRouter.route('/remove').delete(deleteUser);

userRouter.route('/addSlices').post(authMiddleware, addSlices as RequestHandlerWithType<IAddSliceBody>);

export default userRouter;
