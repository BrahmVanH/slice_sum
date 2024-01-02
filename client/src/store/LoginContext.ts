// import React, { createContext, useContext, ReactNode } from 'react';
// import { useLoginReducer } from './reducers';

// type LoginState = {
// 	showLogin: boolean;
// };

// type LoginAction = {
// 	showLogin: boolean;
// };

// interface LoginContextProps {
// 	state: LoginState;
// 	dispatch: React.Dispatch<LoginAction>;
// }
// const LoginContext = createContext<LoginContextProps | undefined>(undefined);
// // const { Provider } = LoginContext;

// interface LoginProviderProps {
// 	children: ReactNode;
// }

// const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
// 	const [state, dispatch] = useLoginReducer({
// 		showLogin: true,
// 	});

// 	return <LoginContext.Provider value={{ state, dispatch }}>{children}</LoginContext.Provider>;
// };

// export { LoginContext, LoginProvider };
 
export {}