import { Schema, Model, model } from 'mongoose';
import { IRating, ISliceEntry } from '../../types';

const ratingSchema = new Schema<IRating>({
	overall: {
		type: Number,
	},
	crust: {
		type: Number,
	},
	cheese: {
		type: Number,
	},
	sauce: {
		type: Number,
	},
});

const pizzaHistorySchema = new Schema<ISliceEntry>(
	{
		quantity: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
		},
		rating: ratingSchema,
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		location: {
			type: String,
			maxLength: 50,
		},
		// Documents will expire after 60 days and be reaped from database
		expireAt: {
			type: Date,
			default: Date.now() + 5184000000,
			index: { expires: '60d' },
		},
		imageKey: {
			type: String,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);

const SliceEntry: Model<ISliceEntry> = model('SliceEntry', pizzaHistorySchema);

export default SliceEntry;
