import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const keysJsonPath = 'utils/usedS3Keys.json';

type JSONItem = {
	key: string;
};

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

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

const saveUniqueKeyToJson = async (key: string) => {
	try {
		console.log('saving unique key to json');
		const existingKeysData = await readFileAsync(keysJsonPath, 'utf-8');
		if (existingKeysData) {
			const existingKeys = JSON.parse(existingKeysData);
			console.log('existing keys data: ', existingKeysData);
			existingKeys.push({
				key: key,
			});
			console.log('updated existing key data: ', existingKeysData);

			await writeFileAsync(keysJsonPath, JSON.stringify(existingKeys, null, 2), 'utf-8');
			console.log('finished saving to json file');
		}
	} catch (err) {
		console.error('error in saving unique key to json');
	}
};

export const checkIfUniqueKey = async (Key: string) => {
	try {
		const existingKeysData = await readFileAsync(keysJsonPath, 'utf-8');

		if (existingKeysData) {
			const existingKeys = JSON.parse(existingKeysData);
			console.log('existing keys data in check if unique: ', existingKeysData);
			if (existingKeys.length > 0) {
				if (!existingKeys.some((item: JSONItem) => item.key === Key)) {
					console.log('key does not exist, returning true');
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	} catch (err) {
		console.error('error in check if unique key: ', err);
	}
};

export const generateRandomKey = async () => {
	try {
		let randomKey = crypto.randomBytes(20).toString('hex');
		let isUnique: boolean | undefined = await checkIfUniqueKey(randomKey);

		while (!isUnique) {
			randomKey = crypto.randomBytes(20).toString('hex');
			isUnique = await checkIfUniqueKey(randomKey);
		}
		saveUniqueKeyToJson(randomKey);
		return `${randomKey}`;
	} catch (err) {
		console.error('there wa an error generating random key', err);
	}
};
