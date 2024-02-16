import { User, SliceEntry } from '../models'; // Assuming this is the path to your user model
import userSeeds from './user.json';
import entrySeeds from './sliceEntry.json';
import { ICreateBody, IUser, IEntryBody } from '../types';
import { db } from '../config/connection';

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

			if (newEntries) {
				await SliceEntry.create(newEntries);
			}

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