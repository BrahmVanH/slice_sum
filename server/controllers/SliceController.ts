import { SliceEntry, User } from '../models';
import { Request, Response } from 'express';
import { IEntryPostParam, ISliceEntry, IUser } from '../types';
import { Types } from 'mongoose';
import multer, { Multer } from 'multer';
import { getImage, uploadImageS3 } from '../utils/s3';
import fs from 'fs';
import { promisify } from 'util';
import { emptyUploadsDir } from '../utils/helpers';

const unlink = promisify(fs.unlink);

const upload: Multer = multer({ dest: 'uploads/' });
const uploadImage = upload.single('imageFile');

export const getAllEntries = async (req: Request, res: Response) => {
	try {
		const entries = await SliceEntry.find({});

		if (!entries) {
			return res.status(400).json({ message: 'No entries available in db' });
		} else {
			entries.forEach((entry) => {
				const imgUrl: string | undefined = getImage(`${entry?.imageKey}`);
				entry.imageKey = imgUrl || entry.imageKey;
			});
			return res.json(entries);
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const getLastTwentyEntries = async (req: Request, res: Response) => {
	try {
		const entries = await SliceEntry.find({ createdAt: -1 }).populate({ path: 'user', select: '-password -sliceEntry' });
		if (!entries) {
			return res.status(400).json({ message: 'No entries available in db' });
		} else {
			const entriesWithImgs = entries.map((entry) => {
				const imgUrl: string | undefined = getImage(`${entry?.imageKey}`);
				let newModEntry = entry;
				if (entry.imageKey) {
					newModEntry.imageKey = imgUrl || entry.imageKey;
				}
				return newModEntry;
			});
			return res.json(entriesWithImgs);
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const createEntry = async (req: Request, res: Response) => {
	try {
		let imageKey: string | undefined;
		if (req.body && !Number.isNaN(req.body.quantity)) {
			uploadImage(req, res, async (err: any) => {
				if (err) {
					return res.status(500).json({ message: 'Error uploading file' });
				}

				const { quantity, location, overallRating, user, crustRating, cheeseRating, sauceRating } = req.body;

				if (req.file) {
					imageKey = await uploadImageS3(req.file);
					emptyUploadsDir();
				} else {
					imageKey = undefined;
				}

				let newEntry: ISliceEntry;
				let _id: Types.ObjectId;
				if (!quantity || !overallRating || !user || !location || Number.isNaN(quantity)) {
					return res.status(400).json({ message: 'All fields Need to be filled properly' });
				} else {
					_id = new Types.ObjectId(user);
					const rating = {
						overall: overallRating,
						crust: crustRating,
						cheese: cheeseRating,
						sauce: sauceRating,
					};
					imageKey
						? (newEntry = await SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, location: location, user: _id, imageKey: imageKey }))
						: (newEntry = await SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, location: location, user: _id }));
				}

				if (!newEntry && _id) {
					return res.status(400).json({ message: 'Something went really wrong in recording slice entry' });
				} else {
					const user: IUser | null = await User.findOneAndUpdate({ _id: _id }, { $push: { sliceEntries: newEntry._id } }, { new: true });
					if (!user) {
						return res.status(400).json({ message: 'User not found or unable to update sliceEntries' });
					}

					res.json(newEntry);
				}
			});
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
