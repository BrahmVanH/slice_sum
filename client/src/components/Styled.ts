import styled from 'styled-components';

export const ButtonWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

export const Button = styled.button`
	margin: 1rem;
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