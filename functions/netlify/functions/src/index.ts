import express from 'express';
//  { Request, Response, NextFunction } 
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();

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

app.use('/.netlify/functions/actions', router);

const handler = serverless(app);

export { handler, app };
