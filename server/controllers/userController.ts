import { User } from '../models';
import { Request, Response } from 'express';
import { signToken } from '../utils/auth';
import { IUserCreate, IAddSlicePar, IGetUserReq, IUserPostParam } from '../types';

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find({}).select('-password').populate('sliceEntries');
		if (users === null) {
			return res.status(400).json({ message: 'Cannot find user with that username' });
		}

		return res.json(users);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const getSingleUser = async (req: IGetUserReq, res: Response) => {
	console.log('getting single user');
	try {
		const user = await User.findOne({ username: req?.user?.username }).select('-password').populate('sliceEntries');
		if (!user) {
			return res.status(400).json({ message: 'Cannot find user with that username' });
		} else {
			console.log('user: ', user);
			return res.json(user);
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const createUser = async ({ body }: IUserCreate, res: Response) => {
	try {
		const newUser = {
			username: body?.username,
			firstName: body?.firstName,
			password: body?.password,
		};
		const existingUser = await User.findOne({ username: body?.username });

		if (!existingUser) {
			const user = await User.create(newUser);
			if (user) {
				const token = signToken(user);

				res.json({
					token,
					user,
				});
			}
		} else {
			return res.status(403).json({ message: 'Another user already has that username' });
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const loginUser = async ({ body }: IUserPostParam, res: Response) => {
	try {
		const user = await User.findOne({ username: body?.username });
		if (!user) {
			return res.status(400).json({ message: 'Incorrect username' });
		}

		const isCorrectPassword: boolean = await user.isCorrectPassword(body?.password);
		if (!isCorrectPassword) {
			return res.status(400).json({ message: 'Incorrect Password' });
		}

		const token = signToken(user);
		res.json({
			token,
			user,
		});
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const deleteUser = async ({ body }: IUserPostParam, res: Response) => {
	try {
		const user = await User.findOne({ username: body?.username });
		if (user === null) {
			return res.status(400).json({ message: 'Incorrect username' });
		}

		const isCorrectPassword: boolean = await user.isCorrectPassword(body?.password);
		if (!isCorrectPassword) {
			return res.status(400).json({ message: 'Incorrect Password' });
		}
		const deletedUser = await User.findOneAndDelete({ username: body?.username });

		res.json({
			deletedUser,
		});
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const addSlices = async ({ body }: IAddSlicePar, res: Response) => {
	try {
		if (body) {
			const updatedUser = await User.findOneAndUpdate({ username: body?.username }, { $push: { slices: { quantity: body?.quantity, date: new Date() } } }, { new: true });

			if (!updatedUser) {
				return res.status(400).json({ message: 'Something went really wrong in updating user slice amount' });
			}
			res.json(updatedUser);
		} else {
			return res.status(400).json({ message: 'Incorrect username.. which is weird because the user needs to be already logged in to use this feature. Super weird.' });
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};
