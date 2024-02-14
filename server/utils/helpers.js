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
exports.objPropsNotTNull = exports.generateRandomKey = exports.emptyUploadsDir = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const emptyUploadsDir = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directory = 'uploads/';
        const files = yield fs_1.default.promises.readdir(directory);
        for (const file of files) {
            yield fs_1.default.promises.unlink(path_1.default.join(directory, file));
        }
    }
    catch (err) {
        console.error('Error in emptying uploads directory', err);
    }
});
exports.emptyUploadsDir = emptyUploadsDir;
const generateRandomKey = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const randomKey = crypto_1.default.randomBytes(20).toString('hex');
        if (randomKey) {
            return `${randomKey}`;
        }
        else {
            console.error('There was an error generating random key for s3 image');
        }
    }
    catch (err) {
        console.error('there wa an error generating random key', err);
    }
});
exports.generateRandomKey = generateRandomKey;
// This takes in an object, iterates through it and checks if all properties have a value
const objPropsNotTNull = (obj) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === null) {
            return false;
        }
    }
    return true;
};
exports.objPropsNotTNull = objPropsNotTNull;
