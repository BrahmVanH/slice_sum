import { Request, Response } from 'express';
import connectToDb from '../mongo/db';
import { UserModel } from '../mongo/models';
import { IUserCreate, IGetUserReq, IUserPostParam } from '../types';
import { signToken } from '../utils/auth';
import router from './sliceRoutes';

const getAllUsers = async (req: Request, res: Response) => {
	try {
		await connectToDb();
		// const UserModel = await getUserModel();
		const users = await UserModel.find({}).select('-password').populate('sliceEntries');

		if (!users) {
			console.error('Error getting users');
			res.status(400).json({ error: 'Bad Request' });
		} else {
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

		const user = await UserModel.findById(req.params.id).select('-password').populate('sliceEntries');

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

const createUser = async ({ body }: IUserCreate, res: Response) => {
	console.log('creating user');
	console.log('body', body);
	try {
		await connectToDb();

		const existingUser = await UserModel.findOne({ username: body?.username });

		if (existingUser) {
			console.error('User already exists');
			res.status(400).json({ error: 'User already exists' });
			return;
		}
		const newUser = {
			username: body?.username,
			firstName: body?.firstName,
			password: body?.password,
		};
		console.log('newUser', newUser);
		const user = await UserModel.create(newUser);

		if (!user) {
			console.error('Error creating user');
			res.status(400).json({ error: 'Bad Request' });
		}

		const token = signToken(user);

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

		const user = await UserModel.findByIdAndDelete(req.params.id);

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

const loginUser = async ({ body }: IUserPostParam, res: Response) => {
	try {
		await connectToDb();

		const user = await UserModel.findOne({ username: body?.username });

		if (!user) {
			res.status(400).json({ error: 'User not found' });
			return;
		}
		const token = signToken(user);
		res.status(200).json({
			token,
			user,
		});
	} catch (error) {
		console.error('Error logging in user', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

router.get('/', getAllUsers);

router.get('/:id', getUser);

router.post('/new', createUser);

router.post('/login', loginUser);

router.delete('/:id', deleteUser);

export default router;
