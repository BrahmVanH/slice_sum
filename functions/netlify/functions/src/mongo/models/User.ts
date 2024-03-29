import { Schema, Model, model } from 'mongoose';
import { IUser } from '../../types';
import * as bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			maxLength: 50,
		},
		firstName: {
			type: String,
			required: true,
			maxLength: 50,
		},
		password: {
			type: String,
			required: true,
			maxLength: 50,
		},
		sliceEntries: [
			{
				type: Schema.Types.ObjectId,
				ref: 'SliceEntry',
			},
		],
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);

userSchema.pre('save', async function (next: Function) {
	if (this.isNew || this.isModified('password')) {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}
	next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
	if (this !== undefined) {
		return bcrypt.compare(password, this.password);
	}
};

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
