import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { IStarComponentProps } from '../types';
const StarRatingContainer = styled.div`
	width: 80%;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	align-self: center;
	margin-top: 1rem;
`;
export default function StarRating(props: Readonly<IStarComponentProps>) {
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
