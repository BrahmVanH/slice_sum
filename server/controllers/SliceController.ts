import { ISliceEntry, SliceEntry } from '../models';
import { Request, Response, response } from 'express';
import { ObjectId } from 'mongoose';

export interface IEntryBody {
	quantity: Number;
	rating: Number;
	user: ObjectId;
}

export interface IEntryCreate {
	body?: IEntryBody;
}

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
	} catch (err) {
		return res.status(400).json(err);
	}
};

export const deleteEntry = async ({body}: )
