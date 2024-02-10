import { useEffect, useState, FC, useContext } from 'react';

import { ToastProps } from '../types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { ErrorContext } from '../context/ErrorProvider';
import { ErrorContextType } from '../context/types.context';

// Stylesheet for Toast component from react-toastify
import 'react-toastify/dist/ReactToastify.css';

// This component acts as a wrapper to catch updates made to global state context
// and interject over any rendered view
const ToastNotif: FC<ToastProps> = ({ children }) => {
	// Local state vars for toast content
	const [body, setBody] = useState<string | null>(null);
	const [errorStatus, setErrorStatus] = useState<number | null>(null);
	const [toastFired, setToastFired] = useState<boolean>(false);

	// state and state-setter for global error context
	const { error, saveError } = useContext(ErrorContext) as ErrorContextType;

	// Reset all associated variables to remove error message
	const resetErrorState = () => {
		setBody(null);
		setErrorStatus(null);
		setToastFired(false);
		saveError({
			throwError: false,
			errorMessage: {
				status: null,
				message: null,
			},
		});
	};

	const [onCloseFireCount, setOnCloseFireCount] = useState(1);

	// In the dev server, the toast notification calls it's onClose function on first render, causing it
	// to close before viewing. This function ensures the onClose requires a second, manual click
	const handleClose = () => {
		if (process.env.NODE_ENV !== 'production' && onCloseFireCount % 2 === 0) {
			resetErrorState();
		} else if (process.env.NODE_ENV === 'production') {
			resetErrorState();
		}
		let inc = onCloseFireCount;
		inc++;
		setOnCloseFireCount(inc);
	};

	// Set Toast notif content state-vars when global error state updates
	useEffect(() => {
		if (error.throwError) {
			setBody(error.errorMessage.message);
			setErrorStatus(error.errorMessage.status);
			setToastFired(true);
		}
	}, [error]);

	// Throw toast.error if content state-vars are set
	useEffect(() => {
		if (toastFired && errorStatus && body) {
			toast.error(`${errorStatus}: ${body}`, {
				onClose: () => handleClose(),
			});
		}
	}, [toastFired, errorStatus, body]);

	return (
		<div>
			{toastFired && <ToastContainer position='bottom-right' autoClose={8000} transition={Slide} theme='light' />}
			{children}
		</div>
	);
};
export default ToastNotif;
