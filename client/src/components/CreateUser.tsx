import { useCallback, useContext, useEffect, useState } from 'react';
import LogRocket from 'logrocket';
import styled from 'styled-components';

import { AlertRect, AlertMessage, Input, ButtonWrapper, ButtonS } from './Styled';

import { createUser } from '../utils/API';
import { ICreateBody, LoginProps } from '../types';

import { useForm, FieldValues } from 'react-hook-form';
import Auth from '../utils/auth';
import { ErrorContext } from '../context/ErrorProvider';
import { ErrorContextType } from '../context/types.context';

// Styled components used locally
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
	// This is a function passed in by parent component allowing for conditional
	// rendering of either login form or create-user form
	const handleDisplayLogin = props?.handleDisplayLogin;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>();

	// Local state vars
	const [inputValue, setInputValue] = useState<FieldValues | null>(null);

	// Setter function for global error context
	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	// Format and submit create user object
	const handleCreateUser = useCallback(
		async (newUserInput: FieldValues) => {
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
						// Save token to local storage for logged-in status
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
		},
		[saveError]
	);

	// Form submission results in inputValue state var being set - trigger entry recording
	useEffect(() => {
		if (inputValue) {
			handleCreateUser(inputValue);
		}
	}, [inputValue, handleCreateUser]);

	return (
		<FormContainer>
			<h1 style={{ margin: '0rem' }}>Create Profile</h1>
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
					<ButtonS size='small' variant='outlined' type='submit'>
						Sign up
					</ButtonS>
					<ButtonS size='small' variant='outlined' onClick={() => handleDisplayLogin()} type='button'>
						Login
					</ButtonS>
				</ButtonWrapper>
			</Form>
		</FormContainer>
	);
}
