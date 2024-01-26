import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SliceStats from './pages/SliceStats';
import NotFound from './pages/404';

import Home from './pages/Home';
import ToastNotif from './components/ToastNotif';
import ErrorProvider from './context/ErrorProvider';
import { ThemeProvider } from 'styled-components';

import '@csstools/normalize.css';
import ErrorFallback from './components/ErrFallback';

function App() {
	const theme = {
		primary: '#903440',
		secondary: '#7A808B',
		base: '#000000',
	};
	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	return (
		<Router>
			<ErrorProvider>
				<ToastNotif>
					<ErrorBoundary fallback={<ErrorFallback />}>
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
