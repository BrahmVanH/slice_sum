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
exports.deleteEntry = exports.createEntry = exports.getLastTwentyEntries = exports.getAllEntries = void 0;
const models_1 = require("../models");
const mongoose_1 = require("mongoose");
const multer_1 = __importDefault(require("multer"));
const s3_1 = require("../utils/s3");
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const helpers_1 = require("../utils/helpers");
const unlink = (0, util_1.promisify)(fs_1.default.unlink);
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const uploadImage = upload.single('imageFile');
const getAllEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entries = yield models_1.SliceEntry.find({});
        if (!entries) {
            return res.status(400).json({ message: 'No entries available in db' });
        }
        else {
            entries.forEach((entry) => {
                const imgUrl = (0, s3_1.getImage)(`${entry === null || entry === void 0 ? void 0 : entry.imageKey}`);
                entry.imageKey = imgUrl || entry.imageKey;
            });
            return res.json(entries);
        }
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.getAllEntries = getAllEntries;
const getLastTwentyEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entries = yield models_1.SliceEntry.find().sort({ createdAt: -1 }).limit(20).populate({ path: 'user', select: '-password -sliceEntry' });
        if (!entries) {
            return res.status(400).json({ message: 'No entries available in db' });
        }
        else {
            const entriesWithImgs = entries.map((entry) => {
                const imgUrl = (0, s3_1.getImage)(`${entry === null || entry === void 0 ? void 0 : entry.imageKey}`);
                let newModEntry = entry;
                if (entry.imageKey) {
                    newModEntry.imageKey = imgUrl || entry.imageKey;
                }
                return newModEntry;
            });
            return res.json(entriesWithImgs);
        }
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.getLastTwentyEntries = getLastTwentyEntries;
const createEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageKey;
        const ratingIsValid = (0, helpers_1.objPropsNotTNull)(req.body.rating);
        if (req.body && !Number.isNaN(req.body.quantity) && ratingIsValid) {
            uploadImage(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(500).json({ message: 'Error uploading file' });
                }
                const { quantity, location, user, overall: overallRating, crust: crustRating, cheese: cheeseRating, sauce: sauceRating } = req.body;
                if (req.file) {
                    imageKey = yield (0, s3_1.uploadImageS3)(req.file);
                    (0, helpers_1.emptyUploadsDir)();
                }
                else {
                    imageKey = undefined;
                }
                let newEntry;
                let _id;
                if (!quantity || !overallRating || !user || !location) {
                    return res.status(400).json({ message: 'All fields Need to be filled properly' });
                }
                else {
                    _id = new mongoose_1.Types.ObjectId(user);
                    const rating = {
                        overall: overallRating,
                        crust: crustRating,
                        cheese: cheeseRating,
                        sauce: sauceRating,
                    };
                    newEntry = imageKey
                        ? yield models_1.SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, location: location, user: _id, imageKey: imageKey })
                        : yield models_1.SliceEntry.create({ quantity: quantity, date: new Date(), rating: rating, location: location, user: _id });
                }
                if (!newEntry && _id) {
                    return res.status(400).json({ message: 'Something went really wrong in recording slice entry' });
                }
                else {
                    const user = yield models_1.User.findOneAndUpdate({ _id: _id }, { $push: { sliceEntries: newEntry._id } }, { new: true });
                    if (!user) {
                        return res.status(400).json({ message: 'User not found or unable to update sliceEntries' });
                    }
                    res.json(newEntry);
                }
            }));
        }
        else {
            return res.status(400).json({ message: 'All fields are required to create a new entry' });
        }
    }
    catch (err) {
        console.error('error: ', err);
        return res.status(500).json(err);
    }
});
exports.createEntry = createEntry;
const deleteEntry = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (body) {
            const deletedEntry = yield models_1.SliceEntry.remove({ id: body._id });
            if (!deletedEntry) {
                return res.status(400).json({ message: 'Something went really wrong in deleting slice entry' });
            }
            res.json(exports.deleteEntry);
        }
        else {
            return res.status(400).json({ message: 'Entry ID is required for deletion' });
        }
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.deleteEntry = deleteEntry;
