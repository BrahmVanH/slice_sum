import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { ButtonWrapper, Button } from './LoginCard';
import { createUser, login } from '../utils/API';
import { Input } from './Styled';
import { ILoginBody, ICreateBody, LoginProps } from '../types';

import { useForm, FieldValues, UseFormRegisterReturn } from 'react-hook-form';
import Auth from '../utils/auth';


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

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>();

	const [inputValue, setInputValue] = useState<FieldValues | null>(null);
	const [newUser, setNewUser] = useState<ILoginBody | null>(null);
	const [inputElWidth, setInputElWidth] = useState<string>('100%');
	const [inputElHeight, setInputElHeight] = useState<string>('3rem');

	const [test, setTest] = useState<boolean>(false);

	const handleLogin = async (userLogin: ILoginBody) => {
		try {
			if (userLogin) {
				const response = await login(userLogin);

				if (!response?.ok) {
					throw new Error('Something went wrong in creating new user');
				}

				const { token, user } = await response.json();
				if (user) {
					Auth.login(token);
					window.location.assign('/');
				}
			}
		} catch (err) {
			console.error(err);
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
						// TODO: replace with danger alert message
						console.log('User already exists with that username');
					} else {
						// TODO: Add more detailed responses
						console.error('Something went wrong in creating new user');
					}
				} else {
					const { token, user } = await response.json();
					if (token !== '') {
						Auth.login(token);
						window.location.assign('/');
					}
				}
			}

			setInputValue(null);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (test) {
			const authProfile = Auth.getProfile();
		}
	}, [test]);

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
				<Input type='text' minLength={5} maxLength={25} placeholder='username' {...register('username', { required: true })} />
				<Input type='text' minLength={5} maxLength={25} placeholder='first name' {...register('firstName', { required: true })} />
				<Input type='password' minLength={5} maxLength={25} placeholder='password' {...register('password', { required: true })} />
				<Input type='password' minLength={5} maxLength={25} placeholder='re-enter password' {...register('verifyPassword', { required: true })} />

				{errors.quantity && <p>You must fill all fields.</p>}
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
