import { createContext, useState, FC } from 'react';
import { IError, ErrorContextType, IErrorCtxProps } from './types.context';

// Create and export context instance for global error handling
export const ErrorContext = createContext<ErrorContextType | null>(null);

// This component wraps around the App router to catch updates made to error context
const ErrorProvider: FC<IErrorCtxProps> = ({ children }) => {
	// Error state var
	const [error, setError] = useState<IError>({
		throwError: false,
		errorMessage: {
			status: null,
			message: null,
		},
	});

	// Define setter function to set global error state
	const saveError = (error: IError) => {
		const newError: IError = {
			throwError: error.throwError,
			errorMessage: {
				status: error.errorMessage.status,
				message: error.errorMessage.message,
			},
		};
		setError(newError);
	};

	return <ErrorContext.Provider value={{ error, saveError }}>{children}</ErrorContext.Provider>;
};

export default ErrorProvider;
