import AWS from 'aws-sdk';
import fs from 'fs';

if (process.env.NODE_ENV == 'production') {
	AWS.config.update({
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
		region: process.env.S3_REGION,
	});
} else {
	AWS.config.loadFromPath('./utils/awsCredentials.json');
}

const s3 = new AWS.S3();

export const uploadImageS3 = async (image: Express.Multer.File | undefined) => {
	try {
		console.log('image: ', image);
		if (image?.path && image?.originalname) {
			const blob = fs.readFileSync(image.path);
			const uploadedImage = await s3
				.upload({
					Bucket: 'slicesumuserupload',
					Key: image.originalname,
					Body: blob,
				})
				.promise();

			if (!uploadedImage) {
				console.log('something went wrong uploading image in s3');
			} else {
        const key: string = uploadedImage.Key;
				return key;
			}
		} else {
			console.log('path or originalname are undefined');
		}
	} catch (err) {
		console.error('There was an error uploading to s3...', err);
	}
};
