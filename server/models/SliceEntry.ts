import { Schema, Document, Model, model, ObjectId } from 'mongoose';

export interface ISliceHistory extends Document {
	quantity: number;
	date: Date;
	rating: number;
	user: ObjectId;
}

const pizzaHistorySchema = new Schema<ISliceHistory>(
	{
		quantity: {
			type: Number,
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
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);

export const SliceEntry: Model<ISliceHistory> = model('SliceEntry', pizzaHistorySchema);

