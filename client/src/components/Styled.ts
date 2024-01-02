import styled from 'styled-components';

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