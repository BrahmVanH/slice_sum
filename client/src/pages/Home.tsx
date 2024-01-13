import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import SliceHistory from '../components/SlicesHistory';

export default function Home() {
	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	return <SliceHistory />;
}
