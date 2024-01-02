import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllUsers } from '../utils/API';
import UserStatsTable from '../components/UserStatsTable';
import { createTableData } from '../utils/helpers';
import { IStatsUser, IUser } from '../types';


export default function SliceStats() {
	const [allUserData, setAllUserData] = useState<IUser[] | null>(null);
	const [userStats, setUserState] = useState<IStatsUser[] | null>(null);
	const [data, setData] = useState<IStatsUser[]>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getAllUsers();
				if (response?.ok) {
					const data: IUser[] = await response.json();
					setAllUserData(data);
				} else {
					console.error('there was an error while fetching data in SliceStats', response);
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
	return <div style={{ height: '100%', width: '100%', gridArea: 'app' }}>{data ? <UserStatsTable data={data} /> : <>Yo</>}</div>;
}
