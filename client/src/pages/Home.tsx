import { useEffect } from 'react';
import ReactGA from 'react-ga';
import RecentEntries from '../components/RecentEntries';

// This is the landing page of the app, it will render the RecentEntries component 
export default function Home() {
	// Handle google analytics
	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	return <RecentEntries />;
}
