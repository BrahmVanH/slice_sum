// import React, { createContext, useContext } from 'react';
// import { useErrorReducer } from './reducers';

// const ErrorContext = createContext();
// const { Provider } = ErrorContext;

// const ErrorProvider = ({ value = [], ...props }) => {
// 	const [state, dispatch] = useErrorReducer({
// 		throwError: false,
// 		errorMessage: {
// 			code: null,
// 			message: null,
// 		},
// 	});
// 	return <Provider value={[state, dispatch]} {...props} />;
// };

// const useErrorContext = () => {
// 	return useContext(ErrorContext);
// };

// export { ErrorProvider, useErrorContext };
