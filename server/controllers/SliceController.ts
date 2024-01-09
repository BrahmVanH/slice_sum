import { SliceEntry, User } from '../models';
import { Request, Response, response } from 'express';
import { IEntryCreate, IEntryPostParam, ISliceEntry, IUser } from '../types';
import { Types } from 'mongoose';
import multer, { Multer } from 'multer';
import { uploadImageS3 } from '../utils/s3';

const upload: Multer = multer({ dest: 'uploads/' });
const uploadImage = upload.single('imageFile');

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

				uploadImageS3(req.file);

				let newEntry: ISliceEntry;
				let _id: Types.ObjectId;
				if (!quantity || !rating || !user) {
					return res.status(400).json({ message: 'All fields are required to submit entry' });
				} else {
					_id = new Types.ObjectId(user);
					console.log('_id: ', _id);
					console.log('imageFile: ', imageFile);
					imageFile
						? (newEntry = await SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, user: _id, imageFile: imageFile }))
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
