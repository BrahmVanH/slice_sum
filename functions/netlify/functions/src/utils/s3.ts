import AWS from 'aws-sdk';
import fs from 'fs';
import { generateRandomKey } from './helpers';

const imageBucket = process.env.S3_BUCKET_NAME || '';


const s3 = new AWS.S3();

export const uploadImageS3 = async (image: Express.Multer.File | undefined) => {
	try {
		AWS.config.update({
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
			region: process.env.S3_REGION,
		});

		const Key = await generateRandomKey();
		if (image?.path && image?.originalname) {
			const blob = fs.readFileSync(image.path);
			const uploadedImage = await s3
				.upload({
					Bucket: imageBucket,
					Key: Key || `sliceImage${Math.floor(Math.random() * 10000)}`,
					Body: blob,
				})
				.promise();

			if (!uploadedImage) {
				console.error('something went wrong uploading image in s3');
			} else {
				const key: string = uploadedImage.Key;
				return key;
			}
		} else {
			console.log('path or original name are undefined');
		}
	} catch (err) {
		console.error('There was an error uploading to s3...', err);
	}
};

const getSignedUrl = (imageKey: string) => {
	if (imageKey) {
		return s3.getSignedUrl('getObject', {
			Bucket: 'slicesumuserupload',
			Key: imageKey,
			Expires: 60,
		});
	} else {
		console.error('image key undefined: ', imageKey);
		return false;
	}
};

export const getImage = (imageKey: string) => {
	AWS.config.update({
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		region: process.env.S3_REGION,
	});
	const imgUrl = getSignedUrl(imageKey);
	if (imgUrl) {
		return imgUrl;
	} else {
		console.error('no image url got signed');
	}
};
