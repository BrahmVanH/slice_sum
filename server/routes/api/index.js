"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserRoutes_1 = __importDefault(require("./UserRoutes"));
const SliceEntryRoutes_1 = __importDefault(require("./SliceEntryRoutes"));
const router = (0, express_1.Router)();
router.use('/user', UserRoutes_1.default);
router.use('/entries', SliceEntryRoutes_1.default);
exports.default = router;
