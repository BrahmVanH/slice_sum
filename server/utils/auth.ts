import jwt, { VerifyOptions } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

const expiration = '1440h';

interface UserPayload {
	username: string;
	_id: string;
}

interface AuthenticatedRequest extends Request {
	user?: UserPayload;
}

interface SignTokenParams {
	username: string;
	_id: string;
}

export type AuthMiddlewareHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;

export const signToken = ({ username, _id }: SignTokenParams): string | undefined => {
	const secret: string | undefined = process.env.AUTH_SECRET;
	if (secret) {
		const payload: UserPayload = { username, _id };
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	} else {
		return;
	}
};

export const authMiddleware: AuthMiddlewareHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
	const secret: string | undefined = process.env.AUT_SECRET;
	let token = req.query.token || req.headers.authorization;
	if (req.headers.authorization) {
		token = token?.toString().split(' ').pop()?.trim();
	}

	if (!token) {
		return next();
	}

	const verifyOptions: VerifyOptions = { maxAge: expiration };

	try {
		// Extract user from token
		if (secret) {
			const { data } = jwt.verify(token as string, secret, verifyOptions) as { data: UserPayload };
			req.user = data;
		}
	} catch (error) {
		console.log('Invalid token');
	}

	return next();
};
