import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import LogRocket from 'logrocket';

import { ButtonWrapper, Button } from './LoginCard';
import { AlertRect, AlertMessage } from './Styled';

import { login } from '../utils/API';
import { ErrorContext } from '../context/ErrorContext';
import { ErrorContextType, IError } from '../context/types.context';

import { useForm, FieldValues, UseFormRegisterReturn } from 'react-hook-form';
import Auth from '../utils/auth';
import { ILoginBody, IUserLogin, LoginProps } from '../types';

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
		width: 100%;
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

	@media (max-width: 1440px) {
		width: 85%;
	}
`;

const Input = styled.input`
	height: 2rem;
	margin: 0.5rem;

	@media (max-width: 1400) {
		height: 3rem;
	}
`;

export default function Login(props: Readonly<LoginProps>) {
	const handleDisplayLogin = props?.handleDisplayLogin;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>();

	const [inputValue, setInputValue] = useState<FieldValues | null>(null);
	const [newUser, setNewUser] = useState<ILoginBody | null>(null);
	const [inputElWidth, setInputElWidth] = useState<string>('100%');
	const [inputElHeight, setInputElHeight] = useState<string>('3rem');
	const [alert, setAlert] = useState<string | null>(null);
	const [error, setError] = useState<IError | null>(null);

	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	const handleLogin = async (newUserInput: FieldValues) => {
		const newUser: ILoginBody | null = newUserInput as ILoginBody;
		try {
			if (newUser) {
				const response = await login(newUser);

				if (!response?.ok) {
					if (response?.status === 400)  {
						saveError({
							throwError: true,
							errorMessage: {
								status: response?.status || null,
								message: 'Incorrect username/password',
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
					if (token && token !== '') {
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
			handleLogin(inputValue);
		}
	}, [inputValue]);

	return (
		<FormContainer>
			<h1 style={{ margin: '0rem' }}>Login</h1>
			<Form onSubmit={handleSubmit((data) => setInputValue(data))}>
				<Input autoComplete='username' type='text' minLength={5} maxLength={25} placeholder='username' {...register('username', { required: true })} />
				<Input autoComplete='current-password' type='password' minLength={5} maxLength={25} placeholder='password' {...register('password', { required: true })} />

				{(errors.username && errors.username.type === 'required') || (errors.password && errors.password.type === 'required') ? (
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
						Sign Up
					</Button>
				</ButtonWrapper>
			</Form>
		</FormContainer>
	);
}
