// import React, { ReactNode, useEffect, useState } from 'react';

// import { ToastContainer, toast, Slide } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// interface ToastProps {
// 	children: ReactNode;
// }

// const ToastNotif: React.FC<ToastProps> = ({ children }) => {
// 	const [body, setBody] = useState(null);
// 	const [errorCode, setErrorCode] = useState(null);
// 	const [toastFired, setToastFired] = useState(false);
// 	const [onCloseFireCount, setCloseFireCount] = useState(1);

// 	const resetErrorState = () => {
// 		setBody(null);
// 		setErrorCode(null);
// 		setToastFired(false);
// 	};

// 	const handleClose = () => {
// 		if (process.env.NODE_ENV !== 'production' && onCloseFireCount % 2 === 0) {
// 			resetErrorState();
// 		} else if (process.env.NODE_ENV === 'production') {
// 			resetErrorState();
// 		}
// 		let inc = onCloseFireCount;
// 		inc++;
// 		setCloseFireCount(inc);
// 	};

//   useEffect(() => {
// 		console.log(toastFired, new Date().getMilliseconds(new Date()));
// 	}, [toastFired]);

//   useEffect(() => {
// 		if (throwError === true && errorMessage.code !== null) {
// 			console.log('recieved error message, setting Toast state variables');
// 			setBody(errorMessage.message);
// 			setErrorCode(errorMessage.code);
// 			setToastFired(true);
// 		}
// 	}, [throwError]);

  
// 	useEffect(() => {
// 		console.log(errorCode);
// 		if (toastFired === true && errorCode !== null) {
// 			console.log('calling toast.error');
// 			toast.error(`${errorCode}: ${body}`, {
// 				onClose: () => handleClose(),
// 			});
// 		}
// 	}, [toastFired]);

//   return (
// 		<div>
// 			{toastFired && <ToastContainer position='bottom-right' autoClose={false} transition={Slide} theme='light' />}
// 			{children}
// 		</div>
// 	);
// };
 export {};