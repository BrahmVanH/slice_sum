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
const db_1 = __importDefault(require("../mongo/db"));
const models_1 = require("../mongo/models");
const auth_1 = require("../utils/auth");
const sliceRoutes_1 = __importDefault(require("./sliceRoutes"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        // const UserModel = await getUserModel();
        const users = yield models_1.UserModel.find({}).select('-password').populate('sliceEntries');
        if (!users) {
            console.error('Error getting users');
            res.status(400).json({ error: 'Bad Request' });
        }
        else {
            res.status(200).json(users);
        }
    }
    catch (error) {
        console.error('Error getting users', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        const user = yield models_1.UserModel.findById(req.params.id).select('-password').populate('sliceEntries');
        if (!user) {
            console.error('Error getting user');
            res.status(400).json({ error: 'Bad Request' });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        console.error('Error getting user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const createUser = (_a, res_1) => __awaiter(void 0, [_a, res_1], void 0, function* ({ body }, res) {
    console.log('creating user');
    console.log('body', body);
    try {
        yield (0, db_1.default)();
        const existingUser = yield models_1.UserModel.findOne({ username: body === null || body === void 0 ? void 0 : body.username });
        if (existingUser) {
            console.error('User already exists');
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        const newUser = {
            username: body === null || body === void 0 ? void 0 : body.username,
            firstName: body === null || body === void 0 ? void 0 : body.firstName,
            password: body === null || body === void 0 ? void 0 : body.password,
        };
        console.log('newUser', newUser);
        const user = yield models_1.UserModel.create(newUser);
        if (!user) {
            console.error('Error creating user');
            res.status(400).json({ error: 'Bad Request' });
        }
        const token = (0, auth_1.signToken)(user);
        res.status(200).json({
            token,
            user,
        });
    }
    catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        const user = yield models_1.UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            console.error('Error deleting user');
            res.status(400).json({ error: 'Bad Request' });
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const loginUser = (_b, res_2) => __awaiter(void 0, [_b, res_2], void 0, function* ({ body }, res) {
    try {
        yield (0, db_1.default)();
        const user = yield models_1.UserModel.findOne({ username: body === null || body === void 0 ? void 0 : body.username });
        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }
        const token = (0, auth_1.signToken)(user);
        res.status(200).json({
            token,
            user,
        });
    }
    catch (error) {
        console.error('Error logging in user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
sliceRoutes_1.default.get('/', getAllUsers);
sliceRoutes_1.default.get('/:id', getUser);
sliceRoutes_1.default.post('/new', createUser);
sliceRoutes_1.default.post('/login', loginUser);
sliceRoutes_1.default.delete('/:id', deleteUser);
exports.default = sliceRoutes_1.default;
//# sourceMappingURL=userRoutes.js.map