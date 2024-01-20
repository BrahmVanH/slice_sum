import styled from 'styled-components';
import { Button } from '@mui/material';


// Styled components for global use
export const ButtonS = styled(Button)(({ theme }) => ({
	margin: '0.5rem !important',
	color: `black !important`,
	borderColor: `${theme.secondary} !important`,
}));

export const ButtonWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

export const Input = styled.input<{ $width?: string }>`
	height: 2rem;
	margin: 0.5rem;
	width: ${(props) => props.$width ?? ''};
	@media (max-width: 1400) {
		height: 3rem;
	}
`;

export const BtnNaked = styled.button`
	background-color: transparent;
	border: none;
	box-shadow: none;
`;

export const AlertRect = styled.div`
	border-radius: 6px;
	border: 1px solid red;
	background-color: #ff000081;
	padding: 0rem 0.25rem;
`;

export const AlertMessage = styled.p`
	font-family: 'Open Sans', sans-serif;
	font-size: 10px;
	margin: 0.25rem;
`;

export const StarRatingContainer = styled.div`
	width: 80%;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	align-self: center;
	margin-bottom: 0.5rem;
`;
