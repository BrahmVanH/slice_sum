import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

type JSONItem = {
	key: string;
};

export const emptyUploadsDir = async () => {
	try {
		const directory = 'uploads/';
		const files = await fs.promises.readdir(directory);

		for (const file of files) {
			await fs.promises.unlink(path.join(directory, file));
		}
	} catch (err) {
		console.error('Error in emptying uploads directory', err);
	}
};

export const generateRandomKey = async () => {
	try {
		const randomKey = crypto.randomBytes(20).toString('hex');
		if (randomKey) {
			return `${randomKey}`;
		} else {
			console.error('There was an error generating random key for s3 image');
		}
	} catch (err) {
		console.error('there wa an error generating random key', err);
	}
};

// This takes in an object, iterates through it and checks if all properties have a value
export const objPropsNotTNull = (obj: any) => {
	for (const key in obj) {
		if (obj.hasOwnProperty(key) && obj[key] === null) {
			return false;
		}
	}
	return true;
};

