import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoStar, IoStarOutline } from 'react-icons/io5';

const StarRatingContainer = styled.div`
	width: 80%;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
  align-self: center;
  margin-top: 1rem;

`;
export default function StarRating() {
	const [rating, setRating] = useState<number>(0);

	const handleSetRating = (userRating: number) => {
		if (userRating === rating) {
			setRating(rating - 1);
		} else if (userRating) {
			setRating(userRating);
		}
	};

	return (
		<>
			{rating === 1 ? (
				<StarRatingContainer>
					<IoStar role='button' onClick={() => handleSetRating(1)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(2)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(3)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : rating === 2 ? (
				<StarRatingContainer>
					<IoStar role='button' onClick={() => handleSetRating(1)} />
					<IoStar role='button' onClick={() => handleSetRating(2)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(3)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : rating === 3 ? (
				<StarRatingContainer>
					<IoStar role='button' onClick={() => handleSetRating(1)} />
					<IoStar role='button' onClick={() => handleSetRating(2)} />
					<IoStar role='button' onClick={() => handleSetRating(3)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : rating === 4 ? (
				<StarRatingContainer>
					<IoStar role='button' onClick={() => handleSetRating(1)} />
					<IoStar role='button' onClick={() => handleSetRating(2)} />
					<IoStar role='button' onClick={() => handleSetRating(3)} />
					<IoStar role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : rating === 5 ? (
				<StarRatingContainer>
					<IoStar role='button' onClick={() => handleSetRating(1)} />
					<IoStar role='button' onClick={() => handleSetRating(2)} />
					<IoStar role='button' onClick={() => handleSetRating(3)} />
					<IoStar role='button' onClick={() => handleSetRating(4)} />
					<IoStar role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			) : (
				<StarRatingContainer>
					<IoStarOutline role='button' onClick={() => handleSetRating(1)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(2)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(3)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(4)} />
					<IoStarOutline role='button' onClick={() => handleSetRating(5)} />
				</StarRatingContainer>
			)}
		</>
	);
}
