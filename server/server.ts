import express from 'express';
import cors from 'cors';
import { db } from './config/connection';
import routes from './routes';
import dotenv from 'dotenv';
import { authMiddleware } from './utils/auth';
import path from 'path';

const PORT = process.env.PORT || 3001;
const app = express();
const allowedOrigins = ['https://slicesum.org', 'https://slice-sum-25ec1c3c5361.herokuapp.com'];
const corsOptions = {
	origin: process.env.NODE_ENV === 'production' ? allowedOrigins : 'http://localhost:3000',
	optionsSuccessStatus: 200,
};
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(authMiddleware);
app.use(cors(corsOptions));
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build/static')));
}

db.once('open', () => {
	app.listen(PORT, () => {
		console.log(`API server running on port ${PORT}`);
	});
});
