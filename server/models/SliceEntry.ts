import { Schema, Document, Model, model, ObjectId } from 'mongoose';
import { ISliceEntry } from '../types';

const pizzaHistorySchema = new Schema<ISliceEntry>(
	{
		quantity: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
		},
		rating: {
			type: Number,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		// Documents will expire after 60 days and be reaped from database
		expireAt: {
			type: Date,
			default: Date.now(),
			index: { expires: '60d' },
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);

export const SliceEntry: Model<ISliceEntry> = model('SliceEntry', pizzaHistorySchema);
