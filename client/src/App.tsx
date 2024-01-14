import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ErrorProvider } from './ErrorContext';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';
import Footer from './components/Footer';
import styled from 'styled-components';
import Dashboard from './pages/Dashboard';
import SliceStats from './pages/SliceStats';
import NotFound from './pages/404';

import '@csstools/normalize.css';
import Home from './pages/Home';
import ToastNotif from './components/ToastNotif';
import ErrorProvider from './context/ErrorContext';
import { ThemeProvider } from 'styled-components';

const AppWrapper = styled.main`
	width: 100vw;
	height: 100vh;
	display: grid;
	grid-template-areas:
		'header header header'
		'app app app'
		'footer footer footer';
`;

function App() {
	const theme = {
		primary: '#903440',
		secondary: '#7A808B',
	};
	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	return (
		<Router>
			<ErrorProvider>
				<ToastNotif>
					<ErrorBoundary fallback={<div>Something Went Wrong</div>}>
						<ThemeProvider theme={theme}>
							<Header />
							<Routes>
								<Route path='/' element={<Home />} />
								<Route path='/dashboard' element={<Dashboard />} />
								<Route path='/stats' element={<SliceStats />} />
								<Route path='/*' element={<NotFound />} />
							</Routes>
						</ThemeProvider>
					</ErrorBoundary>
				</ToastNotif>
			</ErrorProvider>
		</Router>
	);
}

export default App;
