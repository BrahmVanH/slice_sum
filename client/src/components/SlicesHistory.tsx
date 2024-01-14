import React, { useContext, useEffect, useState } from 'react';
import LogRocket from 'logrocket';
import styled from 'styled-components';
import { ISliceEntry } from '../types';
import { getLastTwentyEntries } from '../utils/API';
import { formateTimeDistance } from '../utils/helpers';
import { LiaPizzaSliceSolid } from 'react-icons/lia';
import StarRating from './StarRating';
import { IoPizzaOutline } from 'react-icons/io5';
import { ErrorContext } from '../context/ErrorContext';
import { ErrorContextType } from '../context/types.context';
import RatingChart from './RatingChart';

const EntrySect = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	min-height: 100vh;
`;

const EntryCard = styled.div`
	width: 100%;
	height: 100px;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	text-align: center;
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
	const [ratingChartDisplay, setRatingChartDisplay] = useState<string>('none');

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
							<>
								<EntryCard key={index}>
									{entry.imageKey ? <Image src={entry.imageKey} /> : <LiaPizzaSliceSolid size={'48px'} />}
									<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '70%' }}>
										<div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
											<span style={{ fontSize: '16px' }}>{entry.user.username}</span>
											<span style={{ fontSize: '10px' }}>{formateTimeDistance(entry.date)} ago</span>
										</div>
										<div>
											<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1rem' }}>
												<span style={{ marginRight: '1rem' }}>{entry.quantity.toString()}</span>
												<IoPizzaOutline size='24px' />
											</div>
											<StarRating overallRating={entry.rating.overall} />
										</div>
									</div>
								</EntryCard>
								<div style={{display: ratingChartDisplay}}>
									<RatingChart rating={entry.rating} />
								</div>
							</>
						);
					})}
				</EntrySect>
			) : (
				<></>
			)}
		</>
	);
}
