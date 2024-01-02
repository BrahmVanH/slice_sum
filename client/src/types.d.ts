import { JwtPayload } from 'jwt-decode';

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
}

export type AddSlicesProps = {
  handleSetClicked: Function;
}

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