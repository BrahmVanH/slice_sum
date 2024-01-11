import React, { useEffect, useState, FC, ReactNode } from 'react';

import { ErrorProp, ToastProps } from '../types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../store/store';
import { Reducer } from '../store/reducer';

const ToastNotif: FC<ToastProps> = ({ children }) => {
	const [body, setBody] = useState<string | null>(null);
	const [errorStatus, setErrorStatus] = useState<number | null>(null);
	const [toastFired, setToastFired] = useState<boolean>(false);

	const dispatch = useDispatch();
	const { setThrowError } = bindActionCreators(actionCreators, dispatch);
	const error = useSelector((state: Reducer) => state);
	const createErrorMessage = (error: ErrorProp) => {
		// 400 - cannot find uer
	};

	const handleErrorProp = (error: ErrorProp) => {
		if (error?.message && error?.status) {
			setBody(error.message);
			setErrorStatus(error.status);
			setToastFired(true);
		} else if (error?.message && !error?.status) {
			setBody(error.message);
			setToastFired(true);
		} else if (error?.status && !error?.message) {
			setErrorStatus(error.status);
		}
	};

	const resetErrorState = () => {
		setBody(null);
		setErrorStatus(null);
		setToastFired(false);
		setThrowError({
			throwError: false,
			errorMessage: {
				status: null,
				message: null,
			},
		});
	};

	const handleClose = () => {
		resetErrorState();
	};

	// useEffect(() => {
	// 	if (error) {
	// 		handleErrorProp(error);
	// 	}
	// }, [error]);

  useEffect(() => {
		if (error) {
			console.log('recieved error message: ', error);
			// setBody(errorMessage.message);
			// setErrorCode(errorMessage.code);
			// setToastFired(true);
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
			{toastFired && <ToastContainer position='bottom-right' autoClose={false} transition={Slide} theme='light' />}
			{children}
		</div>
	);
};
export default ToastNotif;

