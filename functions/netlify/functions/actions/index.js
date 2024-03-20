"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
//  { Request, Response, NextFunction } 
const serverless_http_1 = __importDefault(require("serverless-http"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// interface IRequest extends Request {
// 	headers: {
// 		host?: string;
// 	};
// }
// const getAllowedOrigins = (req: IRequest, res: Response, next: NextFunction) => {
// 	const allowedOrigins = ['https://slicesum.org', 'https://slice-sum-25ec1c3c5361.herokuapp.com'];
// 	const host = req.headers.host ?? '';
// 	console.log('host', host);
// 	if (allowedOrigins.includes(host)) {
// 		next();
// 	} else {
// 		res.status(405).send('Host not allowed');
// 	}
// };
// app.use(getAllowedOrigins);
app.use('/.netlify/functions/actions', routes_1.default);
const handler = (0, serverless_http_1.default)(app);
exports.handler = handler;
//# sourceMappingURL=index.js.map