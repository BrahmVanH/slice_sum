import { IError } from './types.store';
import { ActionType } from './actionTypes';
import { Dispatch } from 'redux';
import { Action } from './actions';

export const setThrowError = (error: IError) => {
	return (dispatch: Dispatch<Action>) => {
		dispatch({
			type: ActionType.SET_THROW_ERROR,
			payload: error,
		});
	};
};

