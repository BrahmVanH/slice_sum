"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.uploadImageS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const imageBucket = 'slicesumuserupload';
if (process.env.NODE_ENV == 'production') {
    aws_sdk_1.default.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
    });
}
else {
    aws_sdk_1.default.config.loadFromPath('./utils/awsCredentials.json');
}
const s3 = new aws_sdk_1.default.S3();
const uploadImageS3 = (image) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Key = yield (0, helpers_1.generateRandomKey)();
        if ((image === null || image === void 0 ? void 0 : image.path) && (image === null || image === void 0 ? void 0 : image.originalname)) {
            const blob = fs_1.default.readFileSync(image.path);
            const uploadedImage = yield s3
                .upload({
                Bucket: imageBucket,
                Key: Key || `sliceImage${Math.floor(Math.random() * 10000)}`,
                Body: blob,
            })
                .promise();
            if (!uploadedImage) {
                console.error('something went wrong uploading image in s3');
            }
            else {
                const key = uploadedImage.Key;
                (0, helpers_1.emptyUploadsDir)();
                return key;
            }
        }
        else {
            console.log('path or original name are undefined');
        }
    }
    catch (err) {
        console.error('There was an error uploading to s3...', err);
    }
});
exports.uploadImageS3 = uploadImageS3;
const getSignedUrl = (imageKey) => {
    if (imageKey) {
        return s3.getSignedUrl('getObject', {
            Bucket: 'slicesumuserupload',
            Key: imageKey,
            Expires: 60,
        });
    }
    else {
        console.error('image key undefined: ', imageKey);
        return false;
    }
};
const getImage = (imageKey) => {
    const imgUrl = getSignedUrl(imageKey);
    if (imgUrl) {
        return imgUrl;
    }
    else {
        console.error('no image url got signed');
    }
};
exports.getImage = getImage;
