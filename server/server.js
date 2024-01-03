"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = require("./config/connection");
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./utils/auth");
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};
dotenv_1.default.config();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(routes_1.default);
app.use(auth_1.authMiddleware);
app.use((0, cors_1.default)(corsOptions));
connection_1.db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}`);
    });
});
