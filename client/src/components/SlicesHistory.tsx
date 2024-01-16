import React, { useContext, useEffect, useState } from 'react';
import LogRocket from 'logrocket';
import styled from 'styled-components';
import { ISliceEntry } from '../types';
import { getLastTwentyEntries } from '../utils/API';
import { ErrorContext } from '../context/ErrorContext';
import { ErrorContextType } from '../context/types.context';
import EntryCard from './EntryCard';

const EntrySect = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	min-height: 100vh;
`;


export default function SliceHistory() {
	const [entries, setEntries] = useState<ISliceEntry[] | null>(null);

	const { saveError } = useContext(ErrorContext) as ErrorContextType;
	
	const handleGetEntries = async () => {
		try {
			const response = await getLastTwentyEntries();
			if (!response?.ok) {
				saveError({
					throwError: true,
					errorMessage: {
						status: response?.status || null,
						message: 'Bad Request, try refreshing...',
					},
				});
			} else {
				const data: ISliceEntry[] = await response.json();
				setEntries(data);
			}
		} catch (err: any) {
			saveError({
				throwError: true,
				errorMessage: {
					status: null,
					message: 'Something weird happened. Try refreshing...',
				},
			});
			if (process.env.NODE_ENV === 'production') {
				LogRocket.captureException(err);
			}
		}
	};

	

	useEffect(() => {
		handleGetEntries();
	}, []);

	return (
		<>
			{entries ? (
				<EntrySect>
					{entries.map((entry, index) => {
						return (
						<EntryCard entry={entry} key={index} />
						);
					})}
				</EntrySect>
			) : (
				<></>
			)}
		</>
	);
}
