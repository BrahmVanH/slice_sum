import { connect, set } from 'mongoose';

const connectToDb = async () => {
	try {
		const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzaTracker';
		if (!MONGO_URI) {
			throw new Error('MONGO_URI not found');
		}
		set('strictQuery', true);
		await connect(MONGO_URI).then(() => console.log('Connected to MongoDB'));
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
		throw new Error('Error connecting to MongoDB');
	}
};

export default connectToDb;
