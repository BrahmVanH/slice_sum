import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import RecentEntries from '../components/RecentEntries';

export default function Home() {
	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	return <RecentEntries />;
}
