import React, { useState } from 'react';
import styled from 'styled-components';
import RatingChart from './RatingChart';
import { IEntryCardProps } from '../types';
import { IoPizzaOutline } from 'react-icons/io5';
import { formateTimeDistance } from '../utils/helpers';
import { LiaPizzaSliceSolid } from 'react-icons/lia';
import StarRating from './StarRating';

const Card = styled.div`
	width: 100%;
	display: flex;
  flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	text-align: center;
`;

const InnerCont = styled.div`
	width: 100%;
	height: 100%;
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

export default function EntryCard(props: IEntryCardProps) {
	const entry = props?.entry;
	const [ratingChartDisplay, setRatingChartDisplay] = useState<string>('none');

	const handleExpandCard = () => {
		if (ratingChartDisplay === 'none') {
			setRatingChartDisplay('');
		} else {
			setRatingChartDisplay('none');
		}
	};

	return (
		<Card onClick={handleExpandCard}>
			<InnerCont>
				{entry.imageKey ? <Image src={entry.imageKey} /> : <LiaPizzaSliceSolid size={'100px'} />}
				<div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row', width: '70%' }}>
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
			</InnerCont>
			<div style={{ display: ratingChartDisplay }}>
				<RatingChart rating={entry.rating} />
			</div>
		</Card>
	);
}
