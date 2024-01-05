// import React, { useEffect, useState, FC, ReactNode } from 'react';

// import { ErrorProp, ToastProps } from '../types';
// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ToastNotif: FC<ToastProps> = ({ error }) => {
// 	const [body, setBody] = useState<string | null>(null);
// 	const [errorStatus, setErrorStatus] = useState<number | null>(null);
// 	const [toastFired, setToastFired] = useState<boolean>(false);

// 	const createErrorMessage = (error: ErrorProp) => {
// 		// 400 - cannot find uer
// 	};

// 	const handleErrorProp = (error: ErrorProp) => {
// 		if (error?.message && error?.status) {
// 			setBody(error.message);
// 			setErrorStatus(error.status);
// 			setToastFired(true);
// 		} else if (error?.message && !error?.status) {
// 			setBody(error.message);
// 			setToastFired(true);
// 		} else if (error?.status && !error?.message) {
// 			setErrorStatus(error.status);
// 		}
// 	};

// 	const resetErrorState = () => {
// 		setBody(null);
// 		setErrorStatus(null);
// 		setToastFired(false);
// 	};

// 	const handleClose = () => {
// 		resetErrorState();
// 	};

// 	useEffect(() => {
// 		if (error) {
// 			handleErrorProp(error);
// 		}
// 	}, [error]);

// 	useEffect(() => {
// 		if (toastFired && errorStatus && body) {
// 			toast.error(`${errorStatus}: ${body}`, {
// 				onClose: () => handleClose(),
// 			});
// 		}
// 	}, [toastFired]);

// 	return (
// 		<div>
// 			{toastFired && <ToastContainer position='bottom-right' autoClose={false} transition={Slide} theme='light' />}
// 			{/* {children} */}
// 		</div>
// 	);
// };
// export default ToastNotif;

export {};