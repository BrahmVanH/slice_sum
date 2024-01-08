import React, { useState } from 'react';
import AddSlices from '../components/AddSlices';
import SlicesHistory from '../components/SlicesHistory';
import styled from 'styled-components';
import Header from '../components/Header';

import Auth from '../utils/auth';
import CreateUser from '../components/CreateUser';
import Login from '../components/Login';
import LoginCard from '../components/LoginCard';
import HistoryChart from '../components/HistoryChart';

const Main = styled.main<{ $loggedIn?: boolean }>`
	grid-area: app;
	display: grid;
	grid-template-columns: 100vw;
	grid-template-areas: ${(props) => (props.$loggedIn ? "'addSlices' 'slicesHistory'" : "'addSlices' 'addSlices' 'slicesHistory'")};

	@media (min-width: 768px) {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
	}
`;

const LoginContainer = styled.div`
	grid-area: addSlices;
`;

export default function Dashboard() {
	const [displayCreate, setDisplayCreate] = useState<boolean>(false);
	const [clicked, setClicked] = useState<boolean>(false);
	const handleSetClicked = () => {
		if (!clicked) {
			setClicked(true);
		} else {
			setClicked(false);
		}
	};
	return (
		<Main $loggedIn={Auth.isLoggedIn() ? true : false}>
			<SlicesHistory />

			{/* {Auth.isLoggedIn() ? (
				<>
					<AddSlices handleSetClicked={handleSetClicked} />
					<HistoryChart clicked={clicked}/>
				</>
			) : (
				<LoginCard />
			)} */}
		</Main>
	);
}
