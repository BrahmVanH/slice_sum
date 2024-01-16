import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { IStarRatingProps } from '../types';
const StarRatingContainer = styled.div`
	width: 80%;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	align-self: center;
	margin: 1rem 0rem;

`;
export default function StarRatingSelector(props: Readonly<IStarRatingProps>) {
	const theme = useTheme();
	const handlePassRating = props?.handlePassRating;
	const userOverallRating = props?.userOverallRating;

	const handleSetRating = (userRating: number) => {
		if (userRating === userOverallRating) {
			handlePassRating(userOverallRating - 1);
		} else if (userRating) {
			handlePassRating(userRating);
		}
	};
	return (
		<>
			{userOverallRating === 1 && theme ? (
				<StarRatingContainer>
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(1)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(2)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(3)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : userOverallRating === 2 ? (
				<StarRatingContainer>
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(1)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(2)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(3)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : userOverallRating === 3 ? (
				<StarRatingContainer>
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(1)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(2)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(3)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : userOverallRating === 4 ? (
				<StarRatingContainer>
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(1)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(2)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(3)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : userOverallRating === 5 ? (
				<StarRatingContainer>
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(1)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(2)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(3)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(4)} />
					<IoStar color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : (
				<StarRatingContainer>
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(1)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(2)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(3)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline color={theme.primary} stroke={theme.secondary} role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			)}
		</>
	);
}
