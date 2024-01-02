import express from 'express';
import cors from 'cors';
import { db } from './config/connection';
import routes from './routes';
import dotenv from 'dotenv';
import { authMiddleware } from './utils/auth';

const PORT = process.env.PORT || 3001;
const app = express();
var corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
};
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(authMiddleware);
app.use(cors(corsOptions));

db.once('open', () => {
	app.listen(PORT, () => {
		console.log(`API server running on port ${PORT}`);

	});
});
