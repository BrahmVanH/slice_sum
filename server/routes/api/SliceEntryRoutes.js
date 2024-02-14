"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../utils/auth");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const entryRouter = (0, express_1.Router)();
entryRouter.route('/').get(controllers_1.getAllEntries).post(controllers_1.createEntry);
entryRouter.route('/:id').delete(auth_1.authMiddleware, controllers_1.deleteEntry);
entryRouter.route('/recent').get(controllers_1.getLastTwentyEntries);
exports.default = entryRouter;
