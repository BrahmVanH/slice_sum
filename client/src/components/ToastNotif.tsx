import React, { useEffect, useState, FC, ReactNode, useContext } from 'react';

import { ToastProps } from '../types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { ErrorContext } from '../context/ErrorContext';
import { ErrorContextType } from '../context/types.context';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotif: FC<ToastProps> = ({ children }) => {
	const [body, setBody] = useState<string | null>(null);
	const [errorStatus, setErrorStatus] = useState<number | null>(null);
	const [toastFired, setToastFired] = useState<boolean>(false);

	const { error, saveError } = useContext(ErrorContext) as ErrorContextType;

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


  // The toast element closes itself immediately in dev server. This prevents that from happening
  const [onCloseFireCount, setCloseFireCount] = useState(1);
  	const handleClose = () => {
			if (process.env.NODE_ENV !== 'production' && onCloseFireCount % 2 === 0) {
				resetErrorState();
			} else if (process.env.NODE_ENV === 'production') {
				resetErrorState();
			}
			let inc = onCloseFireCount;
			inc++;
			setCloseFireCount(inc);
		};

	

	useEffect(() => {
		if (error.throwError) {
      setBody(error.errorMessage.message);
			setErrorStatus(error.errorMessage.status);
			setToastFired(true);
		}
	}, [error]);

	useEffect(() => {
		if (toastFired && errorStatus && body) {
			toast.error(`${errorStatus}: ${body}`, {
				onClose: () => handleClose(),
			});
		}
	}, [toastFired]);

	return (
		<div>
			{toastFired && <ToastContainer position='bottom-right' autoClose={8000} transition={Slide} theme='light' />}
			{children}
		</div>
	);
};
export default ToastNotif;
