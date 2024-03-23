import mongoose, { Connection } from 'mongoose';
import { UserModel as User, SliceEntryModel as SliceEntry } from '../netlify/functions/src/mongo/models';
import userSeeds from './user.json';
import entrySeeds from './sliceEntry.json';
import dotenv from 'dotenv';

dotenv.config();

const connectionString: string = process.env.MONGO_URI ?? '';

mongoose.connect(connectionString, { serverSelectionTimeoutMS: 30000 });

const db: Connection = mongoose.connection;

db.once('open', async () => {
	const seedUsers = async () => {
		try {
			// Create 10 users
			await User.deleteMany();

			await User.create(userSeeds);

			console.log('Users seeded successfully!');
			return true;
		} catch (error) {
			console.error('Error seeding database:', error);
			return false;
		}
	};

	const seedEntries = async () => {
		try {
			await SliceEntry.deleteMany();

			const allUsers = await User.find();

			let userIds: String[] = [];

			console.log(allUsers);
			if (allUsers) {
				userIds = allUsers.map((user) => {
					return user._id;
				});
			}

			const newEntries = entrySeeds.map((entry) => {
				if (userIds.length > 0) {
					console.log(userIds);
					return { quantity: entry.quantity, date: entry.date, rating: entry.rating, location: entry.location, user: userIds[Math.floor(Math.random() * userIds.length)] };
				}
			});

			if (!newEntries) {
				console.error('Error seeding entries');
				return false;
			}

			const seededEntries = await SliceEntry.create(newEntries);

			const compareIds = async (entries: any) => {
				try {
					console.log('Comparing ids');
					entries.forEach((entry: any) => {
						const user = allUsers.find((user) => {
							return user._id === entry.user;
						});
						if (user) {
							console.log('User found:', user);
							console.log('adding entry.id to user.sliceEntries:', entry._id);
							user.sliceEntries.push(entry._id);
							user.save();
							console.log('User updated:', user);
						}
					});
				} catch (error) {
					console.error('Error comparing ids:', error);
					throw error;
				}
			};

			await compareIds(seededEntries)
				.then(() => {
					console.log('Entries seeded successfully!');
				})
				.catch((error) => {
					console.error('Error seeding entries:', error);
					return false;
				});

			return true;
		} catch (error) {
			console.error('Error seeding entries:', error);
			return false;
		}
	};

	const seedDatabase = async () => {
		try {
			let entrySuccess: boolean = false;
			const success: boolean = await seedUsers();
			if (success) {
				entrySuccess = await seedEntries();
			}

			if (entrySuccess) {
				console.error('Database seeded successfully!');
				process.exit(0);
			} else {
				console.log("Seeding didn't finish properly");
				process.exit(1);
			}
		} catch (error) {
			console.error('Error seeding database:', error);
			process.exit(1);
		}
	};

	seedDatabase();
});
