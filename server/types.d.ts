import { Document } from 'mongoose';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';

export interface ISliceEntry extends Document {
	quantity: number;
	date: Date;
	rating: number;
	user: Schema.Types.ObjectId;
	imageKey: String;
	expireAt: Date;
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
	rating: Number;
	user: Schema.Types.ObjectId;
	imageFile?: File;
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
