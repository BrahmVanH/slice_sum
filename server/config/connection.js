"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mongoose_1 = require("mongoose");
var connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pizzaTracker';
mongoose_1.default.connect(connectionString);
var db = mongoose_1.default.connection;
exports.db = db;
// Error handling for the database connection
db.on('error', function (error) {
    console.error('MongoDB connection error:', error);
});
db.once('open', function () {
    console.log('Connected to MongoDB database');
});
