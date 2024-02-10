import { IoStar, IoStarOutline } from 'react-icons/io5';
import { IStarComponentProps } from '../types';
import {StarRatingContainer } from './Styled';

// Styled component for local use


export default function StarRating(props: Readonly<IStarComponentProps>) {
	// This component renders a number of filled x unfilled starts 
	// based on the value of the overallRating var passed in
	const rating = props.overallRating;


	return (
		<>
			{rating === 1 ? (
				<StarRatingContainer>
					<IoStar />
					<IoStarOutline />
					<IoStarOutline />
					<IoStarOutline />
					<IoStarOutline />
				</StarRatingContainer>
			) : rating === 2 ? (
				<StarRatingContainer>
					<IoStar />
					<IoStar />
					<IoStarOutline />
					<IoStarOutline />
					<IoStarOutline />
				</StarRatingContainer>
			) : rating === 3 ? (
				<StarRatingContainer>
					<IoStar />
					<IoStar />
					<IoStar />
					<IoStarOutline />
					<IoStarOutline />
				</StarRatingContainer>
			) : rating === 4 ? (
				<StarRatingContainer>
					<IoStar />
					<IoStar />
					<IoStar />
					<IoStar />
					<IoStarOutline />
				</StarRatingContainer>
			) : rating === 5 ? (
				<StarRatingContainer>
					<IoStar />
					<IoStar />
					<IoStar />
					<IoStar />
					<IoStar />
				</StarRatingContainer>
			) : (
				<StarRatingContainer>
					<IoStarOutline />
					<IoStarOutline />
					<IoStarOutline />
					<IoStarOutline />
					<IoStarOutline />
				</StarRatingContainer>
			)}
		</>
	);
}
