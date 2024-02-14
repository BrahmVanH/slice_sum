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
exports.deleteUser = exports.loginUser = exports.createUser = exports.getSingleUser = exports.getAllUsers = void 0;
const models_1 = require("../models");
const auth_1 = require("../utils/auth");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.find({}).select('-password').populate('sliceEntries');
        if (users === null) {
            return res.status(400).json({ message: 'Cannot find user with that username' });
        }
        return res.json(users);
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield models_1.User.findOne({ username: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.username }).select('-password').populate('sliceEntries');
        if (!user) {
            return res.status(400).json({ message: 'Cannot find user with that username' });
        }
        else {
            return res.json(user);
        }
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.getSingleUser = getSingleUser;
const createUser = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = {
            username: body === null || body === void 0 ? void 0 : body.username,
            firstName: body === null || body === void 0 ? void 0 : body.firstName,
            password: body === null || body === void 0 ? void 0 : body.password,
        };
        const existingUser = yield models_1.User.findOne({ username: body === null || body === void 0 ? void 0 : body.username });
        if (!existingUser) {
            const user = yield models_1.User.create(newUser);
            if (user) {
                const token = (0, auth_1.signToken)(user);
                res.json({
                    token,
                    user,
                });
            }
        }
        else {
            return res.status(403).json({ message: 'Another user already has that username' });
        }
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.createUser = createUser;
const loginUser = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOne({ username: body === null || body === void 0 ? void 0 : body.username });
        if (!user) {
            return res.status(400).json({ message: 'Incorrect username' });
        }
        const isCorrectPassword = yield user.isCorrectPassword(body === null || body === void 0 ? void 0 : body.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }
        const token = (0, auth_1.signToken)(user);
        res.json({
            token,
            user,
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.loginUser = loginUser;
const deleteUser = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOne({ username: body === null || body === void 0 ? void 0 : body.username });
        if (user === null) {
            return res.status(400).json({ message: 'Incorrect username' });
        }
        const isCorrectPassword = yield user.isCorrectPassword(body === null || body === void 0 ? void 0 : body.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }
        const deletedUser = yield models_1.User.findOneAndDelete({ username: body === null || body === void 0 ? void 0 : body.username });
        res.json({
            deletedUser,
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.deleteUser = deleteUser;
