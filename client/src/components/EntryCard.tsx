import { useState } from 'react';
import styled from 'styled-components';
import RatingChart from './RatingChart';
import { IEntryCardProps } from '../types';
import { IoPizzaOutline } from 'react-icons/io5';
import { formateTimeDistance, getFormattedLocation } from '../utils/helpers';
import { LiaPizzaSliceSolid } from 'react-icons/lia';
import StarRating from './StarRating';

// Styled components used locally
const Card = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	text-align: center;
	cursor: pointer;
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

const LocationP = styled.p`
	font-size: 12px;
	margin: 0rem 0rem 0.5rem 0rem !important;
`;

export default function EntryCard(props: Readonly<IEntryCardProps>) {
	// Single slice entry object from user's SliceEntry property
	const entry = props?.entry;

	// Clicking on entry card conditionally changes the display of the slice-rating chart
	const [ratingChartDisplay, setRatingChartDisplay] = useState<string>('none');

	// Handles setting of slice-rating chart visibility
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
					<div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', marginBottom: '0.5rem' }}>
						<span style={{ fontSize: '16px', marginBottom: '0.5rem' }}>{entry.user.username}</span>
						<span style={{ fontSize: '10px' }}>{formateTimeDistance(entry.date)} ago</span>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem' }}>
							<span style={{ marginRight: '1rem' }}>{entry.quantity.toString()}</span>
							<IoPizzaOutline size='24px' />
						</div>
						<StarRating overallRating={entry.rating.overall} />
						<LocationP>{getFormattedLocation(entry.location)}</LocationP>
					</div>
				</div>
			</InnerCont>
			<div style={{ display: ratingChartDisplay }}>
				<RatingChart rating={entry.rating} />
			</div>
		</Card>
	);
}
