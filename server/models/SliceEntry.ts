import { Schema, Document, Model, model, ObjectId } from 'mongoose';

export interface ISliceEntry extends Document {
	quantity: number;
	date: Date;
	rating: number;
	user: ObjectId;
	expireAt: Date;
}

const pizzaHistorySchema = new Schema<ISliceEntry>(
	{
		quantity: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
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
