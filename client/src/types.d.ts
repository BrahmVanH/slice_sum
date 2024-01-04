import { JwtPayload } from 'jwt-decode';

export interface ErrorProp {
	message?: string | null;
	status?: number | null;
}

export interface ToastProps {
	error: ErrorProp | null;
	children: ReactNode;
}

interface IErrMessage {
	status: number | null;
	message: string | null;
}

export interface IError {
	throwError: boolean;
	errorMessage: IErrMessage;
}

export type ErrorState = {
	error: IError;
};

 type ErrorAction = {
 	type: string;
 	throwError: boolean;
 	errorMessage: IErrMessage;
 };

export type DispatchType = (args: ErrorAction) => ErrorAction;

export interface IPayload extends JwtPayload {
	data: {
		username: string;
		_id: string;
	};
}

export type LoginProps = {
	handleDisplayLogin: Function;
};

export type SliceHistProps = {
	clicked: boolean;
};

export type AddSlicesProps = {
	handleSetClicked: Function;
};

interface ISliceHistory {
	quantity: number;
	date: Date;
}

export interface IUser {
	username: string;
	firstName: string;
	slices: [ISliceHistory];
	isCorrectPassword: Function;
}

export interface ISliceStats {
	lastDay: number;
	lastWeek: number;
	lastMonth: number;
	lastYear: number;
}

interface IStatsUser {
	username: string;
	sliceStats: ISliceStats;
}

interface ICreateBody {
	firstName: string;
	password: string;
	username: string;
}

export interface ILoginBody {
	username: string;
	password: string;
}

export interface IUserLogin {
	body?: ILoginBody;
}

export interface ISliceHistChartData {
	x: number;
	y: number;
}
