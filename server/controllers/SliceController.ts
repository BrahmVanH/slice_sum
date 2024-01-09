import { SliceEntry, User } from '../models';
import { Request, Response, response } from 'express';
import { IEntryCreate, IEntryPostParam, ISliceEntry, IUser } from '../types';
import { Types } from 'mongoose';
import multer, { Multer } from 'multer';
import { getImage, uploadImageS3 } from '../utils/s3';

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
			console.log('entries: ', entries);
			return res.json(entries);
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const getLastTwentyEntries = async (req: Request, res: Response) => {
	try {
		console.log('getting last twenty: ');
		const entries = await SliceEntry.find({}).limit(20);
		if (!entries) {
			console.log('no entries found');
			return res.status(400).json({ message: 'No entries available in db' });
		} else {
			console.log('entries: ', entries);
			const entriesWithImgs = entries.map((entry) => {
				const imgUrl: string | undefined = getImage(`${entry?.imageKey}`);
				let newModEntry = entry;
				if (entry.imageKey) {
					newModEntry.imageKey = imgUrl || entry.imageKey;

				}
				return newModEntry;
			});
			console.log('respons entries with images: ', entriesWithImgs);
			return res.json(entriesWithImgs);
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};

export const createEntry = async (req: Request, res: Response) => {
	try {
		if (req.body) {
			uploadImage(req, res, async (err: any) => {
				if (err) {
					console.error('Multer Error: ', err);
					return res.status(500).json({ message: 'Error uploading file' });
				}

				const { quantity, rating, user } = req.body;
				const imageFile = req.file;

				const imageKey = await uploadImageS3(req.file);

				let newEntry: ISliceEntry;
				let _id: Types.ObjectId;
				if (!quantity || !rating || !user || !imageKey) {
					return res.status(400).json({ message: 'All fields are required to submit entry' });
				} else {
					_id = new Types.ObjectId(user);
					console.log('_id: ', _id);
					console.log('imageKey: ', imageKey);
					imageFile
						? (newEntry = await SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, user: _id, imageKey: imageKey }))
						: (newEntry = await SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, user: _id }));
					console.log(newEntry);
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
// })
// console.log('body: ', body);
// const _id = new Types.ObjectId(body?.user);
// console.log("_id: ", _id);
// let newEntry: ISliceEntry;
// body?.imageFile
// 	? (newEntry = await SliceEntry.create({ quantity: body?.quantity, date: new Date(), rating: body?.rating, user: _id, imageFile: body?.imageFile }))
// 	: (newEntry = await SliceEntry.create({ quantity: body?.quantity, date: new Date(), rating: body?.rating, user: _id }));
// console.log(newEntry);

// if (!newEntry) {
// 	return res.status(400).json({ message: 'Something went really wrong in recording slice entry' });
// } else {
// 	const user = await User.findOneAndUpdate({ _id: body?.user }, { $push: { sliceEntries: newEntry._id } }, { new: true });
// 	if (!user) {
// 		return res.status(400).json({ message: 'User not found or unable to update sliceEntries' });
// 	}
// 	res.json(newEntry);
// }

//

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
