import { Document } from 'mongoose';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';

interface IRating {
	overall: number;
	crust: number;
	cheese: number;
	sauce: number;
}

export interface ISliceEntry extends Document {
	quantity: number;
	date: Date;
	rating: IRating;
	user: Schema.Types.ObjectId;
	imageKey: String;
	expireAt: Date;
}

export interface IEntryBody {
	quantity: Number;
	rating: IRating;
	user: string;
	imageFile?: File | undefined;
}

export interface IUser extends Document {
	username: string;
	firstName: string;
	password: string;
	sliceEntries: Schema.Types.ObjectId[];
	isCorrectPassword: Function;
}

export interface IEntryBody {
	quantity: Number;
	rating: number;
	user: string;
	imageFile?: File | undefined;
}

export interface IEntryCreate {
	body?: IEntryBody;
}

export interface IEntryPostBody {
	_id: Schema.Types.ObjectId;
}

export interface IEntryPostParam {
	body?: IEntryPostBody;
}

export interface UserRequest extends Request {
	body: {
		username?: string;
	};
}

export interface ICreateBody {
	username: string;
	firstName: string;
	password: string;
}

export interface IUserCreate {
	body?: ICreateBody;
}

export interface IUserPostBody {
	username: string;
	password: string;
}

export interface IUserPostParam {
	body?: IUserPostBody;
}

export interface IAddSliceBody {
	username: string;
	quantity: number;
}

export interface IAddSlicePar {
	body?: IAddSliceBody;
}

export interface IGetUserReq extends Request {
	user?: IUser;
}

export interface UserPayload {
	username: string;
	_id: string;
}

export interface AuthenticatedRequest extends Request {
	user?: UserPayload;
}

export interface SignTokenParams {
	username: string;
	_id: string;
}

export type AuthMiddlewareHandler = (req: AuthenticatedRequest, res: Response, next: Function) => void;
