import React, { createContext, useState, FC, ReactNode} from 'react';
import { IError, ErrorContextType, IErrorCtxProps } from './types.context';

export const ErrorContext = createContext<ErrorContextType | null>(null);

const ErrorProvider: FC<IErrorCtxProps> = ({ children }) => {
	const [error, setError] = useState<IError>({
		throwError: false,
		errorMessage: {
			status: null,
			message: null,
		},
	});

	const saveError = (error: IError) => {
		const newError: IError = {
			throwError: error.throwError,
			errorMessage: {
				status: error.errorMessage.status,
				message: error.errorMessage.message
			}
		}
		setError(newError);
	}

	return (
		<ErrorContext.Provider value={{error, saveError}}>
			{children}
		</ErrorContext.Provider>
	)
};

export default ErrorProvider;