import { User, SliceEntry } from '../models'; // Assuming this is the path to your user model
import { faker } from '@faker-js/faker';

async function seedDatabase() {
	try {
		// Create 10 users
		const users = [];
		for (let i = 0; i < 10; i++) {
			const user = await User.create({
				username: faker.internet.userName(),
				firstName: faker.person.firstName(),
				password: faker.internet.password(),
			});
			users.push(user);
		}

		// Create 4 entries for each user
		for (const user of users) {
			for (let i = 0; i < 4; i++) {
				await SliceEntry.create({
					quantity: faker.number.int({ min: 1, max: 10 }),
					date: faker.date.past(),
					rating: {
						overall: faker.number.int({ min: 1, max: 5 }),
						crust: faker.number.int({ min: 1, max: 5 }),
						cheese: faker.number.int({ min: 1, max: 5 }),
						sauce: faker.number.int({ min: 1, max: 5 }),
					},
					user: user._id,
					location: faker.helpers.arrayElement(['main-street-mqt', 'main-street-harvey', 'LSP']),
				});
			}
		}

		console.log('Database seeded successfully!');
	} catch (error) {
		console.error('Error seeding database:', error);
	}
}

seedDatabase();
