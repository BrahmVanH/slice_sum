// import React, { Provider, createContext, useContext } from 'react';
// import { useErrorReducer } from './reducers';

// interface IErrMessage {
// 	code: number | null;
// 	message: string;
// }

// interface IError {
// 	throwError: boolean;
// 	errorMessage: IErrMessage;
// }
// type ErrorState = {
// 	error: IError;
// };

// type ErrorAction = {
// 	type: string;
// 	throwError: boolean;
// 	errorMessage: IErrMessage;
// };
// const ErrorContext = createContext<{ state: ErrorState; dispatch: React.Dispatch<ErrorAction> } | null>(null);
// const { Provider } = ErrorContext;

// const ErrorProvider: React.FC = ({ value = [], ...props }) => {
// 	const [state, dispatch] = useErrorReducer({
// 		error: {
// 			throwError: false,
// 			errorMessage: {
// 				code: null,
// 				message: null,
// 			},
// 		},
// 	});

// 	return <Provider value={[state, dispatch]} {...props} />;
// };

export {};
