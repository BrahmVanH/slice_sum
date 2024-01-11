export interface IError {
	throwError: boolean;
	errorMessage: IErrMessage;
}

export type ErrorState = {
	error: IError;
};

export type ErrorAction = {
	type: string;
	throwError: boolean;
	errorMessage: IErrMessage;
};
interface IErrMessage {
	status: number | null;
	message: string | null;
}

