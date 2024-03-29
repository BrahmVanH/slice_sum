import { JwtPayload } from 'jwt-decode';

// Global types for client
export interface ErrorProp {
	message?: string | null;
	status?: number | null;
}

export interface ToastProps {
	children: ReactNode;
}

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

export interface IUser extends Document {
	_id: Schema.Types.ObjectId;
	username: string;
	firstName: string;
	sliceEntries: Schema.Types.ObjectId[];
	isCorrectPassword?: Function;
}

interface IUserEntry {
	username: string;
	firstName: string;
}

export interface ISliceEntry extends Document {
	quantity: number;
	date: Date;
	rating: IRating;
	location: string;
	user: IUserEntry;
	imageKey?: string;
	expireAt: Date;
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

interface IRating {
	overall: number;
	crust: number;
	cheese: number;
	sauce: number;
}

export interface IEntryBody {
	quantity: number;
	rating: IRating;
	location: string;
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

export interface IEntryFormInput {
	quantity: number;
	location: string;
	imageFile?: File;
}

export interface IStarRatingProps {
	handlePassRating: Function;
	userOverallRating: number;
}

export interface IStarComponentProps {
	overallRating: number;
}

export interface IEntryCardProps {
	entry: ISliceEntry;
};

export interface IRatingChartProps {
	rating: IRating
}

export interface ILeaderboardProps {
	data: IStatsUser[];
}

export interface ISliceHistByDay {
	distance: number;
	quantity: number;
}
