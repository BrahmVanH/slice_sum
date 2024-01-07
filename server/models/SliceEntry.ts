import { Schema, Document, Model, model, ObjectId } from 'mongoose';

export interface ISliceEntry extends Document {
	quantity: number;
	date: Date;
	rating: number;
	user: ObjectId;
}

const pizzaHistorySchema = new Schema<ISliceEntry>(
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

export const SliceEntry: Model<ISliceEntry> = model('SliceEntry', pizzaHistorySchema);
