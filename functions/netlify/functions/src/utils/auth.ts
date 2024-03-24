import jwt, { VerifyOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { UserPayload, AuthenticatedRequest, AuthMiddlewareHandler, SignTokenParams } from '../types';
const expiration = '1440h';

export const signToken = ({ username, _id }: SignTokenParams, secret: string): string | undefined => {
	if (secret) {
		const payload: UserPayload = { username, _id };
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	} else {
		return;
	}
};

export const authMiddleware: AuthMiddlewareHandler = (req: AuthenticatedRequest, res: Response, next: Function): void => {
	const secret: string | undefined = process.env.AUTHORIZATION_SECRET;
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
		} else {
			req.statusCode === 400;
		}
	} catch (error) {
		console.error('Invalid token');
	}

	return next();
};
