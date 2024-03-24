import { useCallback, useContext, useEffect, useState } from 'react';
import ReactGA from 'react-ga';

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
	const fetchData = useCallback(async () => {
		try {
			const response = await getAllUsers();
			if (response?.ok) {
				const users = await response.json();

				setAllUserData(users);
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
			console.error('Error fetching data:', err);
		}
	}, [saveError]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// When fetch returns user data, send to formatter function and save to data var
	useEffect(() => {
		if (allUserData) {
			const tableData = createTableData(allUserData);
			if (tableData === null) {
				return;
			}
			setData(tableData);
		}
	}, [allUserData]);

	return <div style={{ height: '100%', width: '100%', gridArea: 'app' }}>{data ? <Leaderboard data={data} /> : <></>}</div>;
}
