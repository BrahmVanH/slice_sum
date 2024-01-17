import React, { useContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import LogRocket from 'logrocket';

import { getAllUsers } from '../utils/API';
import Leaderboard from '../components/Leaderboard';
import { createTableData } from '../utils/helpers';
import { IStatsUser, IUser } from '../types';
import { ErrorContext } from '../context/ErrorProvider';
import { ErrorContextType } from '../context/types.context';

export default function SliceStats() {
	// Handle google analytics
	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	// This will hold the data for all users in database after a fetch
	const [allUserData, setAllUserData] = useState<IUser[] | null>(null);

	// This will hold the formatted table data
	const [data, setData] = useState<IStatsUser[]>();

	// Setter function for global error state
	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	// Fetch all user data from db on component render
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getAllUsers();
				if (response?.ok) {
					const data: IUser[] = await response.json();
					setAllUserData(data);
				} else {
					console.error('there was an error while fetching data in SliceStats', response);
					saveError({
						throwError: true,
						errorMessage: {
							status: response?.status || null,
							message: 'Bad Request, try refreshing...',
						},
					});
				}
			} catch (err: any) {
				if (process.env.NODE_ENV === 'production') {
					LogRocket.captureException(err);
				} else {
					console.error('Error fetching data:', err);
				}
			}
		};

		fetchData();
	}, []);

	// When fetch returns user data, send to formatter function and save to data var
	useEffect(() => {
		if (allUserData) {
			const tableData = createTableData(allUserData);
			setData(tableData);
		}
	}, [allUserData]);

	return <div style={{ height: '100%', width: '100%', gridArea: 'app' }}>{data ? <Leaderboard data={data} /> : <></>}</div>;
}
