"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expiration = '1440h';
const signToken = ({ username, _id }) => {
    const secret = process.env.AUT_SECRET;
    if (secret) {
        const payload = { username, _id };
        return jsonwebtoken_1.default.sign({ data: payload }, secret, { expiresIn: expiration });
    }
    else {
        return;
    }
};
exports.signToken = signToken;
const authMiddleware = (req, res, next) => {
    var _a;
    const secret = process.env.AUT_SECRET;
    let token = req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
        token = (_a = token === null || token === void 0 ? void 0 : token.toString().split(' ').pop()) === null || _a === void 0 ? void 0 : _a.trim();
    }
    if (!token) {
        return next();
    }
    const verifyOptions = { maxAge: expiration };
    try {
        // Extract user from token 
        if (secret) {
            const { data } = jsonwebtoken_1.default.verify(token, secret, verifyOptions);
            req.user = data;
        }
    }
    catch (error) {
        console.log('Invalid token');
    }
    return next();
};
exports.authMiddleware = authMiddleware;
