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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzaTracker';
        if (!MONGO_URI) {
            throw new Error('MONGO_URI not found');
        }
        (0, mongoose_1.set)('strictQuery', true);
        yield (0, mongoose_1.connect)(MONGO_URI).then(() => console.log('Connected to MongoDB'));
    }
    catch (error) {
        console.error('Error connecting to MongoDB', error);
        throw new Error('Error connecting to MongoDB');
    }
});
exports.default = connectToDb;
//# sourceMappingURL=db.js.map