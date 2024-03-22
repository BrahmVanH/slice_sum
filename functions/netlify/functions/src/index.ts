import express, { Request, Response, NextFunction } from 'express';
//  { Request, Response, NextFunction }
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();

interface IRequest extends Request {
	headers: {
		host?: string;
	};
}

const getAllowedOrigins = (req: IRequest, res: Response, next: NextFunction) => {
	const allowedOrigins = ['https://main--slice-sum.netlify.app', 'http://localhost:3000', 'https://slice-sum.netlify.app'];

	const host = req.headers.host ?? '';
	console.log('host', host);

	if (allowedOrigins.includes(host)) {
		next();
	} else {
		res.status(405).send('Host not allowed');
	}
};
app.use(getAllowedOrigins);

app.use('/.netlify/functions/actions', router);

const handler = serverless(app);

export { handler, app };
