import { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import AddSlices from '../components/AddSlices';
import styled from 'styled-components';

import Auth from '../utils/auth';
import LoginCard from '../components/LoginCard';
import HistoryChart from '../components/HistoryChart';

// Styled component for local use
const Main = styled.main<{ $loggedIn?: boolean }>`
	grid-area: app;
	display: grid;
	grid-template-columns: 100vw;
	grid-template-areas: ${(props) => (props.$loggedIn ? "'addSlices'  'slicesHistory'" : "'addSlices' 'slicesHistory'")};

	@media (min-width: 768px) {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
	}
`;


export default function Dashboard() {
	// This state var keeps track of a click made to a button that exists on the 
	// login and create-user forms to toggle between visibility of the two
	const [clicked, setClicked] = useState<boolean>(false);

	// Handle google analytics
	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	// Handle click made to button on login and create user forms
	// to toggle between visibility of the two
	const handleSetClicked = () => {
		if (!clicked) {
			setClicked(true);
		} else {
			setClicked(false);
		}
	};

	// Conditionally render login/create user forms if not logged in
	return (
		<Main $loggedIn={Auth.isLoggedIn()}>
			{Auth.isLoggedIn() ? (
				<>
					<AddSlices handleSetClicked={handleSetClicked} />
					<HistoryChart clicked={clicked} />
				</>
			) : (
				<LoginCard />
			)}
		</Main>
	);
}
