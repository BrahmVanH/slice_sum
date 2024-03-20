"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sliceRoutes_1 = __importDefault(require("./sliceRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use('/slices', sliceRoutes_1.default);
router.use('/user', userRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map