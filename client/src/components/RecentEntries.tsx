import { useCallback, useContext, useEffect, useState } from 'react';
import LogRocket from 'logrocket';
import styled from 'styled-components';
import { ISliceEntry } from '../types';
import { getLastTwentyEntries } from '../utils/API';
import { ErrorContext } from '../context/ErrorProvider';
import { ErrorContextType } from '../context/types.context';
import EntryCard from './EntryCard';

// Styled components for local use
const EntrySect = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	min-height: 100vh;
`;

export default function RecentEntries() {
	// Local state var used for holding entries fetched from db
	const [entries, setEntries] = useState<ISliceEntry[] | null>(null);

	// Setter function for global error context
	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	// Fetch most recent 20 slice entries from database
	const handleGetEntries = useCallback(async () => {
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
			// Log error with logrocket if in production
			if (process.env.NODE_ENV === 'production') {
				LogRocket.captureException(err);
			}
		}
	}, [getLastTwentyEntries]);

	// Call fetch last twenty entries function on component render
	useEffect(() => {
		handleGetEntries();
	}, []);

	return (
		<>
			{entries ? (
				<EntrySect>
					{entries.map((entry, index) => {
						return <EntryCard entry={entry} key={index} />;
					})}
				</EntrySect>
			) : (
				<></>
			)}
		</>
	);
}
