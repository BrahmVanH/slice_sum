import React from 'react';
// import { ErrorProvider } from './ErrorContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from './components/Header';
import Footer from './components/Footer';
import styled from 'styled-components';
import Dashboard from './pages/Dashboard';
import SliceStats from './pages/SliceStats';

import '@csstools/normalize.css';
import Home from './pages/Home';
import ToastNotif from './components/ToastNotif';

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
	return (
		<Router>
			<Provider store={store}>
				<ToastNotif>
					<ErrorBoundary fallback={<div>Something Went Wrong</div>}>
						<Header />
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/dashboard' element={<Dashboard />} />
							<Route path='/stats' element={<SliceStats />} />
						</Routes>
						<Footer />
					</ErrorBoundary>
				</ToastNotif>
			</Provider>
		</Router>
	);
}

export default App;
