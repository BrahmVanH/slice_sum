import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllUsers } from '../utils/API';
import UserStatsTable from '../components/UserStatsTable';
import { createTableData } from '../utils/helpers';
import { IStatsUser, IUser } from '../types';
import { ErrorContext } from '../context/ErrorContext';
import { ErrorContextType } from '../context/types.context';


export default function SliceStats() {
	const [allUserData, setAllUserData] = useState<IUser[] | null>(null);
	const [userStats, setUserState] = useState<IStatsUser[] | null>(null);
	const [data, setData] = useState<IStatsUser[]>();
	const { saveError } = useContext(ErrorContext) as ErrorContextType;

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
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (allUserData) {
			const tableData = createTableData(allUserData);
			setData(tableData);
		}
	}, [allUserData]);
	return <div style={{ height: '100%', width: '100%', gridArea: 'app' }}>{data ? <UserStatsTable data={data} /> : <></>}</div>;
}
