import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga';
// import reportWebVitals from './reportWebVitals';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './App';
import './index.css';

ReactGA.initialize('G-0HK3RH56G6');

// reportWebVitals((metric) => {
// 	ReactGA.send({
// 		hitType: 'event',
// 		eventCategory: 'Web Vitals',
// 		eventAction: metric.name,
// 		eventValue: Math.round(metric.value),
// 		nonInteraction: true,
// 	});
// });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// serviceWorkerRegistration.unregister();

// reportWebVitals();
