import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateUser from './CreateUser';
import Login from './Login';



const Container = styled.div`
	height: 80%;
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
		width: 80%;
		height: 100%;
		justify-self: center;
	}
`;

export const ButtonWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
`;
export const Button = styled.button`
	margin: 1rem;
`;

export const AlertRect = styled.div`
	border-radius: 6px;
	border: 1px solid red;
	background-color: #ff000081;
	padding: 0rem 0.25rem
`

export const AlertMessage = styled.p`
	font-family: 'Open Sans', sans-serif;
	font-size: 10px;
	margin: 0.25rem;
`;

export default function LoginCard() {
	const [displayCreate, setDisplayCreate] = useState<boolean>(false);

	const handleDisplayLogin = async () => {
		if (!displayCreate) {
			setDisplayCreate(true);
		} else {
			setDisplayCreate(false);
		}
	};

	return <Container id='loginContainer'>{displayCreate ? <CreateUser handleDisplayLogin={handleDisplayLogin} /> : <Login handleDisplayLogin={handleDisplayLogin} />}</Container>;
}
