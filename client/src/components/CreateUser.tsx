import React, { FC, useContext, useEffect, useState } from 'react';
import LogRocket from 'logrocket';
import styled from 'styled-components';

import { ButtonWrapper, Button } from './LoginCard';
import { AlertRect, AlertMessage } from './Styled';

import { createUser, login } from '../utils/API';
import { Input } from './Styled';
import { ILoginBody, ICreateBody, LoginProps } from '../types';

import { useForm, FieldValues, UseFormRegisterReturn } from 'react-hook-form';
import Auth from '../utils/auth';
import { ErrorContext } from '../context/ErrorContext';
import { ErrorContextType, IError } from '../context/types.context';

const FormContainer = styled.div`
	height: 50%;
	width: 25%;
	margin: 1rem;
	padding: 1rem;
	grid-area: addSlices;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border-radius: 6px;

	@media (max-width: 1400px) {
		width: 85%;
		height: 60%;
		justify-self: center;
	}
`;

const Form = styled.form`
	margin: 0.5rem;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	border-left: 1px solid #903440;
	border-right: 1px solid #903440;
	@media (max-width: 768px) {
		width: 85%;
	}
`;

export default function CreateUser(props: Readonly<LoginProps>) {
	const handleDisplayLogin = props?.handleDisplayLogin;
	const [alert, setAlert] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>();

	const [inputValue, setInputValue] = useState<FieldValues | null>(null);
	const [newUser, setNewUser] = useState<ILoginBody | null>(null);
	const [inputElWidth, setInputElWidth] = useState<string>('100%');
	const [inputElHeight, setInputElHeight] = useState<string>('3rem');

	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	const handleLogin = async (userLogin: ILoginBody) => {
		try {
			if (userLogin) {
				const response = await login(userLogin);

				if (!response?.ok) {
					if (response?.status === 400) {
						saveError({
							throwError: true,
							errorMessage: {
								status: response?.status || null,
								message: 'We messed up, trying refreshing...',
							},
						});
					} else if (response?.status === 500) {
						saveError({
							throwError: true,
							errorMessage: {
								status: response?.status || null,
								message: 'Internal Server Error',
							},
						});
					}
				} else {
					const { token, user } = await response.json();
					if (token) {
						Auth.login(token);
						window.location.assign('/');
					}
				}
			}
		} catch (err: any) {
			saveError({
				throwError: true,
				errorMessage: {
					status: null,
					message: 'Something weird happened. Try refreshing...',
				},
			});
			if (process.env.NODE_ENV === 'production') {
				LogRocket.captureException(err);
			}
		}
	};
	const handleCreateUser = async (newUserInput: FieldValues) => {
		let newUser: ICreateBody | null;
		if (newUserInput.password !== newUserInput.verifyPassword) {
			throw new Error('Passwords do not match.');
		} else {
			newUser = {
				username: newUserInput.username,
				firstName: newUserInput.firstName,
				password: newUserInput.password,
			};
		}
		try {
			if (newUser) {
				const response = await createUser(newUser);
				if (!response?.ok) {
					if (response?.status === 403) {
						saveError({
							throwError: true,
							errorMessage: {
								status: response?.status || null,
								message: 'User already exists with that username',
							},
						});
					} else if (response?.status === 500) {
						saveError({
							throwError: true,
							errorMessage: {
								status: response?.status || null,
								message: 'Internal Server Error',
							},
						});
						console.error('Something went wrong in creating new user');
					} else {
						saveError({
							throwError: true,
							errorMessage: {
								status: response?.status || null,
								message: 'Bad request, try Refreshing...',
							},
						});
					}
				} else {
					const { token } = await response.json();
					if (token !== '') {
						Auth.login(token);
						window.location.assign('/');
					}
				}
			}

			setInputValue(null);
		} catch (err: any) {
			saveError({
				throwError: true,
				errorMessage: {
					status: null,
					message: 'Something weird happened. Try refreshing...',
				},
			});
			if (process.env.NODE_ENV === 'production') {
				LogRocket.captureException(err);
			}
		}
	};

	useEffect(() => {
		if (inputValue) {
			handleCreateUser(inputValue);
		}
	}, [inputValue]);

	useEffect(() => {
		if (newUser) {
			handleLogin(newUser);
		}
	}, [newUser]);

	return (
		<FormContainer>
			<h1 style={{ margin: '0rem' }}>Sign Up</h1>
			<Form onSubmit={handleSubmit((data) => setInputValue(data))}>
				<Input
					autoComplete='new-username'
					type='text'
					minLength={5}
					maxLength={25}
					placeholder='Username'
					{...register('username', { required: { value: true, message: 'all fields are required' } })}
				/>
				<Input
					autoComplete='new-name'
					type='text'
					minLength={5}
					maxLength={25}
					placeholder='First Name'
					{...register('firstName', { required: { value: true, message: 'all fields are required' } })}
				/>
				<Input
					autoComplete='new-password'
					type='password'
					minLength={5}
					maxLength={25}
					placeholder='New Password'
					{...register('password', { required: { value: true, message: 'all fields are required' } })}
				/>
				<Input
					autoComplete='none'
					type='password'
					minLength={5}
					maxLength={25}
					placeholder='Re-enter Password'
					{...register('verifyPassword', { required: { value: true, message: 'all fields are required' } })}
				/>

				{(errors.username && errors.username.type === 'required') ||
				(errors.firstName && errors.firstName.type === 'required') ||
				(errors.password && errors.password.type === 'required') ||
				(errors.newPassword && errors.newPassword.type === 'required') ? (
					<AlertRect>
						<AlertMessage style={{ fontSize: '10px' }} role='alert'>
							You must fill all fields.
						</AlertMessage>
					</AlertRect>
				) : (
					<></>
				)}

				<ButtonWrapper>
					<input type='submit' />
					<Button onClick={() => handleDisplayLogin()} type='button'>
						Login
					</Button>
				</ButtonWrapper>
			</Form>
		</FormContainer>
	);
}
