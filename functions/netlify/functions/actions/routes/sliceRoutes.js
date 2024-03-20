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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../mongo/db"));
const models_1 = require("../mongo/models");
const helpers_1 = require("../utils/helpers");
const s3_1 = require("../utils/s3");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
const getEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        const sliceEntries = yield models_1.SliceEntryModel.find({}).populate('user');
        if (!sliceEntries) {
            console.error('Error getting entries');
            res.status(400).json({ error: 'Bad Request' });
        }
        res.status(200).json(sliceEntries);
    }
    catch (error) {
        console.error('Error getting entries', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const getLastTwentyEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        const sliceEntries = yield models_1.SliceEntryModel.find().sort({ createdAt: -1 }).limit(20).populate({ path: 'user', select: '-password -sliceEntry' });
        if (!sliceEntries) {
            console.error('Error getting entries');
            res.status(400).json({ error: 'Bad Request' });
        }
        else {
            const entriesWithImgs = sliceEntries.map((entry) => {
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
    catch (error) {
        console.error('Error getting entries', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        if (!req.body) {
            console.log('no req.body');
            res.status(400).json({ error: 'Bad Request' });
            return;
        }
        let imageKey;
        const ratingIsValid = (0, helpers_1.objPropsNotTNull)(req.body.rating);
        if (!ratingIsValid) {
            console.log('ratingIsValid', ratingIsValid);
            res.status(400).json({ error: 'Bad Request' });
        }
        const { quantity, location, user, overall: overallRating, crust: crustRating, cheese: cheeseRating, sauce: sauceRating } = req.body;
        if (req.file) {
            imageKey = yield (0, s3_1.uploadImageS3)(req.file);
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
            _id = user._id;
            const rating = {
                overall: overallRating,
                crust: crustRating,
                cheese: cheeseRating,
                sauce: sauceRating,
            };
            newEntry = imageKey
                ? yield models_1.SliceEntryModel.create({ quantity: quantity, date: new Date(), rating: rating, location: location, user: _id, imageKey: imageKey })
                : yield models_1.SliceEntryModel.create({ quantity: quantity, date: new Date(), rating: rating, location: location, user: _id });
        }
        if (!newEntry && _id) {
            return res.status(400).json({ message: 'Something went really wrong in recording slice entry' });
        }
        else {
            const user = yield models_1.UserModel.findOneAndUpdate({ _id: _id }, { $push: { sliceEntries: newEntry._id } }, { new: true });
            if (!user) {
                return res.status(400).json({ message: 'User not found or unable to update sliceEntries' });
            }
            res.json(newEntry);
        }
    }
    catch (error) {
        console.error('Error uploading file', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
const deleteEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'Bad Request' });
            return;
        }
        const deletedEntry = yield models_1.SliceEntryModel.findByIdAndDelete(id);
        if (!deletedEntry) {
            res.status(400).json({ error: 'Bad Request' });
            return;
        }
        res.status(200).json({ message: 'Deleted entry' });
    }
    catch (error) {
        console.error('Error deleting entry', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/entries', getEntries);
router.get('/recent', getLastTwentyEntries);
router.delete('/:id', deleteEntry);
router.get('/', (req, res) => {
    console.log('it at least got into the test route');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Hello, actions');
    res.end();
});
exports.default = router;
//# sourceMappingURL=sliceRoutes.js.map