import { ErrorAction, ErrorState, IError } from '../types';
import * as actionTypes from './actionTypes';

const initialState: ErrorState = {
	error: {
		throwError: false,
		errorMessage: {
			status: null,
			message: null,
		},
	},
};

const reducer = (state: ErrorState = initialState, action: ErrorAction): ErrorState => {
	switch (action.type) {
		case actionTypes.SET_THROW_ERROR:
			const newError: IError = {
				throwError: action.throwError,
				errorMessage: action.errorMessage
      }
        return {
          ...state,
          error: newError
			};
	}
  return state;
};

export default reducer;
