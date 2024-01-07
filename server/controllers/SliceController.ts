import { SliceEntry } from '../models';
import { Request, Response, response } from 'express';
import { ObjectId } from 'mongoose';
import { IEntryCreate, IEntryPostParam } from '../types';


export const getAllEntries = async (req: Request, res: Response) => {
	try {
		const entries = await SliceEntry.find({});
		if (!entries) {
			return res.status(400).json({ message: 'No entries available in db' });
		}

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

		return res.json(entries);
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const createEntry = async ({ body }: IEntryCreate, res: Response) => {
	try {
		if (body) {
			const entry = {
				quantity: body?.quantity,
				date: new Date(),
				rating: body?.rating,
				user: body?.user,
			};

			const newEntry = await SliceEntry.create({ entry });

			if (!newEntry) {
				return res.status(400).json({ message: 'Something went really wrong in recording slice entry' });
			}

			res.json(newEntry);
		} else {
			return res.status(400).json({ message: 'All fields are required to create a new entry' });
		}
	} catch (err) {
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


