import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BtnNaked } from './Styled';

import Auth from '../utils/auth';

const NavWrapper = styled.div`
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
`;

const LinkWrapper = styled.div`
	width: 45%;
	display: flex;
	justify-content: space-between;
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
	const [isMobileView, setIsMobileView] = useState<boolean>(false);
	const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
	const [dropdownMenuDisplay, setDropdownMenuDisplay] = useState('none');

	const isMediumViewport = () => {
		return window.innerWidth < 766;
	};

	const toggleDropDown = () => {
		showDropdownMenu ? setShowDropdownMenu(false) : setShowDropdownMenu(true);
	};

	const handleLogout = () => {
		Auth.logout();
		window.location.assign('/');
	};

	useEffect(() => {
		const mobile = isMediumViewport();
		mobile ? setIsMobileView(true) : setIsMobileView(false);
	}, []);

	useEffect(() => {
		showDropdownMenu ? setDropdownMenuDisplay('flex') : setDropdownMenuDisplay('none');
	}, [showDropdownMenu]);



	return (
		<>
			<Navbar>
				<Link to={'/'}>
					<img style={{ marginLeft: '1rem' }} src='/mortys_pocket_pizza.png' height={'50px'} width={'50px'} />
				</Link>
				{isMobileView ? (
					<DropDownBtn onClick={toggleDropDown}>
						<RxHamburgerMenu size={'32px'} />
					</DropDownBtn>
				) : (
					<LinkWrapper>
						<Link style={linkStyle} to={'/'}>
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
					Dashboard
				</Link>
				<Link to={'/stats'} style={linkStyle}>
					Slice Stats
				</Link>
				{Auth.getProfile() ? (
					<Logout  role='button' onClick={() => handleLogout()}>
						Log Out
					</Logout>
				) : (
					<></>
				)}
			</DropdownMenu>
		</>
	);
}
