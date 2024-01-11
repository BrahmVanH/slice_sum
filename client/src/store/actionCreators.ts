import { ActionType } from './actionTypes';
import { Dispatch } from 'redux';
import { Action, IError } from './actions';


export const setThrowError = (error: IError) => {
	console.log("dispatching setThrowError... error: ", error);
	return (dispatch: Dispatch<Action>) => {
		dispatch({
			type: ActionType.SET_THROW_ERROR,
			payload: error,
		});
	};
};

