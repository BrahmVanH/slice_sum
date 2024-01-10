"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceEntry = void 0;
var mongoose_1 = require("mongoose");
var pizzaHistorySchema = new mongoose_1.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
    },
    rating: {
        type: Number,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    // Documents will expire after 60 days and be reaped from database
    expireAt: {
        type: Date,
        default: Date.now() + 5184000000,
        index: { expires: '60d' },
    },
    imageKey: {
        type: String,
    },
}, {
    toJSON: {
        virtuals: true,
    },
});
exports.SliceEntry = (0, mongoose_1.model)('SliceEntry', pizzaHistorySchema);
