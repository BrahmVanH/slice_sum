import { ActionType } from './actionTypes';

export interface IError {
	throwError: boolean;
	errorMessage: IErrMessage;
}

interface IErrMessage {
	status: number | null;
	message: string | null;
}

interface ErrorAction {
	type: ActionType.SET_THROW_ERROR;
	payload: IError;
}

export type Action = ErrorAction;