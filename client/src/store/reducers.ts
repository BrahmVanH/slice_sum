//  import { useReducer } from 'react';
//  import { SET_THROW_ERROR, SET_SHOW_LOGIN } from './actions';

//  interface IErrMessage {
//  	code: number | null;
//  	message: string | null;
//  }

//  interface IError {
//  	throwError: boolean;
//  	errorMessage: IErrMessage
//  }
//  type ErrorState = {
//  	error: IError;
//  }

//  type LoginState = {
//   showLogin: boolean;
//  }

//  type ErrorAction = {
//  	type: string;
//  	throwError: boolean;
//  	errorMessage: IErrMessage;
//  };

//  type LoginAction = {
//   type: string;
//   showLogin: boolean;
//  }


//  export const errorReducer = (state: ErrorState, action: ErrorAction) => {
//  	switch (action.type) {
//  		case SET_THROW_ERROR:
//  			return {
//  				...state,
//  				throwError: action.throwError,
//  				errorMessage: action.errorMessage,
//  			};
//  		default:
//  			return state;
//  	}
//  };

//  export function useErrorReducer(initialState: ErrorState) {
//  	return useReducer(errorReducer, initialState);
//  }

// export const loginReducer = (state: LoginState, action: LoginAction) => {
// 	switch (action.type) {
// 		case SET_SHOW_LOGIN:
// 			return {
// 				...state,
// 				showLogin: action.showLogin,
// 			};
// 		default:
// 			return state;
// 	}
// };

// export function useLoginReducer(initialState: LoginState) {
// 	return useReducer(loginReducer, initialState);
// }

export {};