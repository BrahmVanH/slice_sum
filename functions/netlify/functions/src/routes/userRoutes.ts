import { Router, Request, Response } from 'express';
import connectToDb from '../mongo/db';
import { UserModel } from '../mongo/models';
import { IGetUserReq, ICreateBody, IUserPostBody } from '../types';
import { signToken, authMiddleware } from '../utils/auth';
import { extractObjectFromBuffer } from '../utils/helpers';

const router = Router();

const getAllUsers = async (req: Request, res: Response) => {
	try {
		console.log('getting all users');
		await connectToDb();
		const users = await UserModel.find().select('-password').populate('sliceEntries');

		if (!users) {
			console.error('Error getting users');
			res.status(400).json({ error: 'Bad Request' });
		} else {
			console.log('users', users);
			res.status(200).json(users);
		}
	} catch (error) {
		console.error('Error getting users', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getUser = async (req: IGetUserReq, res: Response) => {
	try {
		await connectToDb();

		console.log('req.user', req?.user);
		const user = await UserModel.findOne({ username: req?.user?.username }).select('-password').populate('sliceEntries');

		if (!user) {
			console.error('Error getting user');
			res.status(400).json({ error: 'Bad Request' });
		} else {
			res.status(200).json(user);
		}
	} catch (error) {
		console.error('Error getting user', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const createUser = async (req: Request, res: Response) => {
	console.log('creating user');
	console.log('req.body', req.body);

	try {
		const secret: string = process.env.AUTH_SECRET || '';

		await connectToDb();
		const newUser: ICreateBody = extractObjectFromBuffer(req.body);

		const existingUser = await UserModel.findOne({ username: newUser?.username });

		if (existingUser) {
			console.error('User already exists');
			res.status(400).json({ error: 'User already exists' });
			return;
		}

		console.log('newUser', newUser);
		const user = await UserModel.create(newUser);

		if (!user) {
			console.error('Error creating user');
			res.status(400).json({ error: 'Bad Request' });
		}

		const token = signToken(user, secret);

		res.status(200).json({
			token,
			user,
		});
	} catch (error) {
		console.error('Error creating user', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const deleteUser = async (req: IGetUserReq, res: Response) => {
	try {
		await connectToDb();

		const user = await UserModel.findByIdAndDelete(req?.user?.id);

		if (!user) {
			console.error('Error deleting user');
			res.status(400).json({ error: 'Bad Request' });
		} else {
			res.status(200).json(user);
		}
	} catch (error) {
		console.error('Error deleting user', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const loginUser = async (req: Request, res: Response) => {
	console.log('logging in user');
	console.log('req.body', req.body);
	try {
		const secret: string = process.env.AUTHORIZATION_SECRET ?? '';

		await connectToDb();
		const body: IUserPostBody = extractObjectFromBuffer(req.body);

		const user = await UserModel.findOne({ username: body?.username });

		if (!user) {
			res.status(400).json({ error: 'User not found' });
			return;
		}

		const validPassword = await user.isCorrectPassword(body?.password);

		if (!validPassword) {
			res.status(400).json({ error: 'Incorrect password' });
			return;
		}

		console.log('signing token, user: ', user);
		const token = signToken(user, secret);

		if (!token) {
			console.error('Error signing token');
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}

		res.status(200).json({
			token,
			user,
		});
	} catch (error) {
		console.error('Error logging in user', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

router.route('/').get(getAllUsers);

router.route('/:id').get(authMiddleware, getUser);

router.route('/new').post(createUser);

router.route('/login').post(loginUser);

router.route('/:id').delete(deleteUser);

export default router;
