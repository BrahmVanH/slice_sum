import { createContext, useState, FC, useMemo, useCallback } from 'react';
import { IError, ErrorContextType, IErrorCtxProps } from './types.context';

// Create and export context instance for global error handling
export const ErrorContext = createContext<ErrorContextType | null>(null);

// This component wraps around the App router to catch updates made to error context
const ErrorProvider: FC<IErrorCtxProps> = ({ children }) => {
	// Error state var
	const [errorState, setErrorState] = useState<IError>({
		throwError: false,
		errorMessage: {
			status: null,
			message: null,
		},
	});

	// Define setter function to set global error state
	const save = (error: IError) => {
		const newError: IError = {
			throwError: error.throwError,
			errorMessage: {
				status: error.errorMessage.status,
				message: error.errorMessage.message,
			},
		};
		setErrorState(newError);
	};

  // wrap error state var in memo to prevent unneeded global re-renders
	const error = useMemo(() => errorState, []);

  // wrapper setter function in callback to prevent unneeded global re-renders
  const saveError = useCallback(() => saveError, [])

	return <ErrorContext.Provider value={{ error, saveError }}>{children}</ErrorContext.Provider>;
};

export default ErrorProvider;
