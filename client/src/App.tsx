import React from 'react';
// import { ErrorProvider } from './ErrorContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import '@csstools/normalize.css';
import Header from './components/Header';
import Footer from './components/Footer';
import styled from 'styled-components';
import Dashboard from './pages/Dashboard';
import SliceStats from './pages/SliceStats';

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
			{/* <ErrorProvider> */}
			{/* <ToastNotif> */}
			{/* <ErrorBoundary> */}
			<Header />
			<Routes>
				<Route path='/' element={<Dashboard />} />
				<Route path='/stats' element={<SliceStats />} />
			</Routes>
			<Footer />
			{/* </ErrorBoundary> */}
			{/* </ToastNotif> */}
			{/* </ErrorProvider> */}
		</Router>
	);
}

export default App;
