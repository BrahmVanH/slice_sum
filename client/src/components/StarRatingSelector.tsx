import styled, { useTheme } from 'styled-components';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { IStarRatingProps } from '../types';
import { StarRatingContainer } from './Styled';

export default function StarRatingSelector(props: Readonly<IStarRatingProps>) {
	// Create global theme instance
	const theme = useTheme();

	// This is a handler function that will send the user-selected rating 
	// back to the parent component to use in the addSlices form
	const handlePassRating = props?.handlePassRating;

	// This is used to compare the existing state of the user's 
	// selected rating to the most recent local selection 
	// for deselecting of a star value on the second click
	const userOverallRating = props?.userOverallRating;

	// Handler function for setting rating var based on star click
	// deselects star if clicked and is already selected
	const handleSetRating = (userRating: number) => {
		if (userRating === userOverallRating) {
			handlePassRating(userOverallRating - 1);
		} else if (userRating) {
			handlePassRating(userRating);
		}
	};

	// Conditionally render filled x unfilled combination of star icons based on overallRating state
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
