import { Router, Request, Response } from 'express';
import { Types } from 'mongoose';
import connectToDb from '../mongo/db';
import { SliceEntryModel as SliceEntry, UserModel } from '../mongo/models';
import { ISliceEntry, IUser } from '../types';
import { objPropsNotTNull } from '../utils/helpers';
import { uploadImageS3, getImage } from '../utils/s3';
import multer, { Multer } from 'multer';
import { authMiddleware } from '../utils/auth';

const storage = multer.memoryStorage();
const upload: Multer = multer({ storage: storage });

const router = Router();

const getEntries = async (req: Request, res: Response) => {
	try {
		await connectToDb();

		const sliceEntries = await SliceEntry.find({}).populate('user');
		if (!sliceEntries) {
			console.error('Error getting entries');
			res.status(400).json({ error: 'Bad Request' });
		}
		res.status(200).json(sliceEntries);
	} catch (error) {
		console.error('Error getting entries', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getLastTwentyEntries = async (req: Request, res: Response) => {
	console.log('getting last 20 entries');
	try {
		await connectToDb()
			.then(() => console.log('connected to db'))
			.catch((err) => console.error('error connecting to db', err));

		const sliceEntries = await SliceEntry.find().sort({ createdAt: -1 }).limit(20).populate({ path: 'user', select: '-password -sliceEntry' });

		if (!sliceEntries) {
			console.error('Error getting entries');
			res.status(400).json({ error: 'Bad Request' });
		} else {
			console.log('sliceEntries', sliceEntries);

			const entriesWithImgs = sliceEntries.map((entry) => {
				const imgUrl: string | undefined = getImage(`${entry?.imageKey}`);
				let newModEntry = entry;
				if (entry.imageKey) {
					newModEntry.imageKey = imgUrl || entry.imageKey;
				}
				return newModEntry;
			});
			return res.json(entriesWithImgs);
		}
	} catch (error) {
		console.error('Error getting entries', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
	console.log('uploading slice entry');
	try {
		await connectToDb()
			.then(() => console.log('connected to db'))
			.catch((err) => console.error('error connecting to db', err));

		if (!req.body) {
			console.log('no req.body');
			res.status(400).json({ error: 'Bad Request' });
			return;
		}

		let imageKey: string | undefined;

		const ratingIsValid = objPropsNotTNull(req.body.rating);
		console.log('ratingIsValid', ratingIsValid);

		if (!ratingIsValid) {
			console.log('ratingIsValid', ratingIsValid);
			res.status(400).json({ error: 'Bad Request' });
		}

		const { quantity, location, user, overall: overallRating, crust: crustRating, cheese: cheeseRating, sauce: sauceRating } = req.body;
		console.log('req.body', req.body);

		if (req.file) {
			imageKey = await uploadImageS3(req.file);
		} else {
			imageKey = undefined;
		}
		if (!quantity || !overallRating || !user || !location) {
			return res.status(400).json({ message: 'All fields Need to be filled properly' });
		}
		console.log('user', user);
		const _id = user._id as Types.ObjectId;
		const rating = {
			overall: overallRating,
			crust: crustRating,
			cheese: cheeseRating,
			sauce: sauceRating,
		};
		console.log('rating', rating);
		const newEntry = imageKey
			? await SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, location: location, user: _id, imageKey: imageKey })
			: await SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, location: location, user: _id });

		console.log('newEntry', newEntry);
		if (!newEntry && _id) {
			return res.status(400).json({ message: 'Something went really wrong in recording slice entry' });
		}
		const updatedUser: IUser | null = await UserModel.findOneAndUpdate({ _id: _id }, { $push: { sliceEntries: newEntry._id } }, { new: true });
		console.log('updatedUser', updatedUser);
		if (!updatedUser) {
			return res.status(400).json({ message: 'User not found or unable to update sliceEntries' });
		}

		res.json(newEntry);
	} catch (error) {
		console.error('Error uploading file', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

const deleteEntry = async (req: Request, res: Response) => {
	try {
		await connectToDb();

		const { id } = req.params;
		if (!id) {
			res.status(400).json({ error: 'Bad Request' });
			return;
		}

		const deletedEntry = await SliceEntry.findByIdAndDelete(id);
		if (!deletedEntry) {
			res.status(400).json({ error: 'Bad Request' });
			return;
		}
		res.status(200).json({ message: 'Deleted entry' });
	} catch (error) {
		console.error('Error deleting entry', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
router.route('/entries').get(getEntries);

router.route('/recent').get(getLastTwentyEntries);

router.route('/:id').delete(authMiddleware, deleteEntry);

router.get('/', (req, res) => {
	console.log('it at least got into the test route');
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write('Hello, actions');
	res.end();
});

export default router;
