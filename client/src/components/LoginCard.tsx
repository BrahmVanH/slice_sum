import { useState } from 'react';
import styled from 'styled-components';
import CreateUser from './CreateUser';
import Login from './Login';

// Styled components for local use
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

export default function LoginCard() {

	// State var for conditionally rendering login or create user components
	const [displayCreate, setDisplayCreate] = useState<boolean>(false);

	// This component passes this function into both of its conditionally
	// rendered children, allowing user to toggle between rendered child
	// using button present in both children
	const handleDisplayLogin = async () => {
		if (!displayCreate) {
			setDisplayCreate(true);
		} else {
			setDisplayCreate(false);
		}
	};

	return <Container id='loginContainer'>{displayCreate ? <CreateUser handleDisplayLogin={handleDisplayLogin} /> : <Login handleDisplayLogin={handleDisplayLogin} />}</Container>;
}
