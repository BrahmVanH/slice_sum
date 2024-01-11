import React, { useEffect, useState, FC, ReactNode } from 'react';

import { ErrorProp, ToastProps } from '../types';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../store/store';
import { Reducer } from '../store/reducer';
import { IError } from '../store/actions';

const ToastNotif: FC<ToastProps> = ({ children }) => {
	const [body, setBody] = useState<string | null>(null);
	const [errorStatus, setErrorStatus] = useState<number | null>(null);
	const [toastFired, setToastFired] = useState<boolean>(false);

	const dispatch = useDispatch();
	const { setThrowError } = bindActionCreators(actionCreators, dispatch);
	const throwError = useSelector((state: IError) => state.throwError);
  const errorMessage = useSelector((state: IError) => state.errorMessage);
	// const createErrorMessage = (error: ErrorProp) => {
	// 	// 400 - cannot find uer
	// };

	// const handleErrorProp = (error: ErrorProp) => {
	// 	if (error?.message && error?.status) {
	// 		setBody(error.message);
	// 		setErrorStatus(error.status);
	// 		setToastFired(true);
	// 	} else if (error?.message && !error?.status) {
	// 		setBody(error.message);
	// 		setToastFired(true);
	// 	} else if (error?.status && !error?.message) {
	// 		setErrorStatus(error.status);
	// 	}
	// };

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
		if (throwError && errorMessage) {
			console.log('recieved error message: ', errorMessage);
      console.log('recieved throw error bool: ', throwError);
			// setBody(errorMessage.message);
			// setErrorCode(errorMessage.code);
			// setToastFired(true);
		}
	}, [throwError, errorMessage]);

	// useEffect(() => {
	// 	if (toastFired && errorStatus && body) {
	// 		toast.error(`${errorStatus}: ${body}`, {
	// 			onClose: () => handleClose(),
	// 		});
	// 	}
	// }, [toastFired]);

	return (
		<div>
			{toastFired && <ToastContainer position='bottom-right' autoClose={false} transition={Slide} theme='light' />}
			{children}
		</div>
	);
};
export default ToastNotif;

