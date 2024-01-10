import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ISliceEntry } from '../types';
import { getLastTwentyEntries } from '../utils/API';
import { formateTimeDistance } from '../utils/helpers';

const EntrySect = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const EntryCard = styled.div`
	width: 100%;
	height: 20%vh;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
`;
const Image = styled.img`
	height: 100px;
	width: 100px;
	@media (min-width: 776) {
		height: 200px;
		width: 200px;
	}
`;
export default function SliceHistory() {
	const [entries, setEntries] = useState<ISliceEntry[] | null>(null);

	const handleGetEntries = async () => {
		const response = await getLastTwentyEntries();
		if (!response?.ok) {
			console.log('bad response: ', response);
		} else {
			const data: ISliceEntry[] = await response.json();
			setEntries(data);
		}
	};

	useEffect(() => {
		handleGetEntries();
	}, []);

	return (
		<>
			{entries ? (
				<EntrySect>
					{entries.map((entry) => {
						return (
							<EntryCard style={{ width: '100%', textAlign: 'center' }} key={entry.date.toString()}>
								<>{entry.imageKey ? <Image src={entry.imageKey} /> : <></>}</>
								<div>
									<p>{entry.rating.toString()}</p>
								</div>
								<div>
									<p style={{ fontSize: '10px' }}>{formateTimeDistance(entry.date)} ago</p>
								</div>
							</EntryCard>
						);
					})}
				</EntrySect>
			) : (
				<></>
			)}
		</>
	);
}
