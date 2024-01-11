import { ActionType } from './actionTypes';
import { Action, IError } from './actions';
import { combineReducers } from 'redux';

const initialState: IError = {
	throwError: false,
	errorMessage: {
		status: null,
		message: null,
	},
};

const reducer = (state: IError = initialState, action: Action) => {
	console.log("using reducer: state, action", state, action );
	if (action.type === ActionType.SET_THROW_ERROR) {
		return [state, action?.payload];
	} else {
		return initialState;
	}
};

const reducers = combineReducers({
	error: reducer,
})

export default reducers;

export type Reducer = ReturnType<typeof reducer>;
