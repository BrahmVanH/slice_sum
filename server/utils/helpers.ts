import crypto from 'crypto';

export const generateRandomKey = () => {
	const randomName = crypto.randomBytes(20).toString('hex');
	return `${randomName}`;
};
