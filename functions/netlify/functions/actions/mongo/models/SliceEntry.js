"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    overall: {
        type: Number,
    },
    crust: {
        type: Number,
    },
    cheese: {
        type: Number,
    },
    sauce: {
        type: Number,
    },
});
const pizzaHistorySchema = new mongoose_1.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
    },
    rating: ratingSchema,
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    location: {
        type: String,
        maxLength: 50,
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
const SliceEntry = (0, mongoose_1.model)('SliceEntry', pizzaHistorySchema);
exports.default = SliceEntry;
//# sourceMappingURL=SliceEntry.js.map