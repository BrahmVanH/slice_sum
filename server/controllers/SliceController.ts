import { SliceEntry, User } from '../models';
import { Request, Response, response } from 'express';
import { IEntryBody, IEntryCreate, IEntryPostParam, ISliceEntry } from '../types';

export const getAllEntries = async (req: Request, res: Response) => {
	try {
		const entries = await SliceEntry.find({});

		if (!entries) {
			return res.status(400).json({ message: 'No entries available in db' });
		}
		console.log(entries);
		return res.json(entries);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const getLastTwentyEntries = async (req: Request, res: Response) => {
	try {
		const entries = await SliceEntry.find({}).limit(20);
		if (!entries) {
			return res.status(400).json({ message: 'No entries available in db' });
		}
		console.log('response: ', entries);
		return res.json(entries);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const createEntry = async ({ body }: IEntryCreate, res: Response) => {
	console.log('body: ', body);
	try {
		if (body) {
			console.log('body present: ', body);
			let newEntry: ISliceEntry;
			body?.imageFile
				? (newEntry = await SliceEntry.create({ quantity: body?.quantity, date: new Date(), rating: body?.rating, user: body?.user, imageFile: body?.imageFile }))
				: (newEntry = await SliceEntry.create({ quantity: body?.quantity, date: new Date(), rating: body?.rating, user: body?.user }));
			console.log(newEntry);

			if (!newEntry) {
				return res.status(400).json({ message: 'Something went really wrong in recording slice entry' });
			} else {
				const user = await User.findOneAndUpdate({ _id: body?.user }, { $push: { sliceEntries: newEntry._id } }, { new: true });
				if (!user) {
					return res.status(400).json({ message: 'User not found or unable to update sliceEntries' });
				}
				res.json(newEntry);
			}
		} else {
			return res.status(400).json({ message: 'All fields are required to create a new entry' });
		}
	} catch (err) {
		console.error('error: ', err);
		return res.status(500).json(err);
	}
};

export const deleteEntry = async ({ body }: IEntryPostParam, res: Response) => {
	try {
		if (body) {
			const deletedEntry = await SliceEntry.remove({ id: body._id });

			if (!deletedEntry) {
				return res.status(400).json({ message: 'Something went really wrong in deleting slice entry' });
			}

			res.json(deleteEntry);
		} else {
			return res.status(400).json({ message: 'Entry ID is required for deletion' });
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};
