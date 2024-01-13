import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BtnNaked } from './Styled';

import Auth from '../utils/auth';

const NavWrapper = styled.nav`
	display: flex;
	flex-direction: column;
	width: 100vw;
`;

const Navbar = styled.nav`
	width: 100vw;
	background-color: #903440;
	grid-area: header;
	display: flex;
	justify-content: space-between;
	align-items: center; 
	padding: 1rem 0rem;
`;

const LinkWrapper = styled.div<{ $isLoggedIn?: boolean }>`
	width: 45%;
	display: flex;
	justify-content: center;
	margin-right: 2rem;
	align-items: center;
	color: white;
`;

const Logout = styled.div`
	color: white;
	background-color: transparent;
	padding: 0.5rem;
	margin: 0.5rem;
	text-decoration: none;
	color: black;
	cursor: pointer;
`;

const DropdownMenu = styled.div<{ $display?: string }>`
	padding: 0.5rem 0rem;
	display: ${(props) => props.$display ?? 'flex'};
	align-items: center;
	flex-direction: column;
	width: 100%;
	border: 1px solid transparent;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	background-color: rgba(122, 128, 139);
	color: white;
	position: absolute;
	top: 86px;
	z-index: 800;
`;

const DropDownBtn = styled(BtnNaked)`
	margin-right: 1rem;
`;

const linkStyle = {
	padding: '0.5rem',
	margin: '0.5rem',
	textDecoration: 'none',
	color: 'black',
};

export default function Header() {
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const [isMobileView, setIsMobileView] = useState<boolean>(false);
	const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
	const [dropdownMenuDisplay, setDropdownMenuDisplay] = useState('none');

	const isMediumViewport = () => {
		return window.innerWidth < 766;
	};

	const toggleDropDown = () => {
		showDropdownMenu ? setShowDropdownMenu(false) : setShowDropdownMenu(true);
		showDropdownMenu ? setDropdownMenuDisplay('flex') : setDropdownMenuDisplay('none');
	};

	const handleLogout = () => {
		Auth.logout();
		window.location.assign('/');
	};

	const handleOffClick = (event: any) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			toggleDropDown();
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleOffClick);

		return () => {
			document.removeEventListener('click', handleOffClick);
		};
	}, []);

	useEffect(() => {
		const mobile = isMediumViewport();
		mobile ? setIsMobileView(true) : setIsMobileView(false);
	}, []);

	
	return (
		<>
			<Navbar ref={dropdownRef}>
				<Link to={'/'}>
					<img style={{ marginLeft: '1rem' }} src='/mortys_pocket_pizza.png' height={'50px'} width={'50px'} />
				</Link>
				{isMobileView ? (
					<DropDownBtn onClick={toggleDropDown}>
						<RxHamburgerMenu size={'32px'} />
					</DropDownBtn>
				) : (
					<LinkWrapper $isLoggedIn={Auth.isLoggedIn()}>
						<Link style={linkStyle} to={'/'}>
							| Home
						</Link>
						<Link style={linkStyle} to={'/dashboard'}>
							| Dashboard
						</Link>
						<Link style={linkStyle} to={'/stats'}>
							| Slice Stats
						</Link>
						{Auth.getProfile() ? (
							<Logout role='button' onClick={() => handleLogout()}>
								| Log Out
							</Logout>
						) : (
							<></>
						)}
					</LinkWrapper>
				)}
			</Navbar>
			<DropdownMenu $display={dropdownMenuDisplay}>
				<Link to={'/'} style={linkStyle}>
					Home
				</Link>
				<Link to={'/dashboard'} style={linkStyle}>
					Dashboard
				</Link>
				<Link to={'/stats'} style={linkStyle}>
					Slice Stats
				</Link>
				{Auth.getProfile() ? (
					<Logout role='button' onClick={() => handleLogout()}>
						Log Out
					</Logout>
				) : (
					<></>
				)}
			</DropdownMenu>
		</>
	);
}
