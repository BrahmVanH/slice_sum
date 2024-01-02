import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoPizzaOutline } from 'react-icons/io5';
import Auth from '../utils/auth';

import { FieldValues, useForm } from 'react-hook-form';
import { addSlices } from '../utils/API';
import { Input, BtnNaked as AddBtn } from './Styled';
import { AddSlicesProps } from '../types';

const AddSliceWrap = styled.div`
	grid-area: addSlices;
	padding: 1rem;
	border: 1px solid black;
	border-radius: 8px;
	margin: 1rem;
	@media (min-width: 768px) {
		height: min-content;
		justify-self: center;
	}
`;

const AddSliceSect = styled.section`
	height: 100%;
	/* display: grid; */
	grid-template-columns: [line1] 1fr [line2] 1fr [line3];
	grid-template-rows: [line1] 50px [line2] 1fr [line3];
	@media (min-width: 768px) {
		display: 'grid';
	}
`;

const HeadingCtr = styled.div`
	grid-column: 1 / 3;
	margin-top: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const AddBtns = styled.button`
	width: 159px;
	height: 64px;
	grid-column: 1 / 2;
	margin: 0.5rem;

	/* &:hover {
		transform: scale(1.1);
	} */

	&:active {
		transform: scale(0.9);
	}

	@media (max-width: 768px) {
		width: 33%;
	}
`;

const SlicesInput = styled(Input)`
	border: none;
`;

const InputWrapper = styled.div``;

export default function AddSlices(props: Readonly<AddSlicesProps>) {
	const setClicked = props?.handleSetClicked;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [currentUser, setCurrentUser] = useState<string>('');
	const [inputValue, setInputValue] = useState<number | null>(null);
	const [selectedBtnVal, setSelectedBtnVal] = useState<number | null>(null);

	// Form submission handler
	const handleRecordSlices = async (slicesNum: number) => {
		try {
			if (currentUser !== '' && slicesNum) {
				const addSlicesBundle = {
					username: currentUser,
					quantity: slicesNum,
				};

				const response = await addSlices(addSlicesBundle);

				if (response?.ok) {
					// TODO: Replace this with a positive alert
					setClicked(true);
				} else {
					console.error('bad response: ', response);
				}
			}
		} catch (err) {
			console.error('something went wrong in handling adding slices', err);
		}
	};

	// Values, icons, row numbers for add-slice buttons
	const btnValues = [
		{ icon: <IoPizzaOutline />, row: 1, value: 1 },
		{
			icon: (
				<>
					<IoPizzaOutline />
					<IoPizzaOutline />
				</>
			),
			row: 2,
			value: 2,
		},
		{
			icon: (
				<>
					<IoPizzaOutline />
					<IoPizzaOutline />
					<IoPizzaOutline />
					<IoPizzaOutline />
				</>
			),
			row: 3,
			value: 4,
		},
	];

	// Outputs grid row location for btn value parameter
	const createBtnGridRow = (value: number) => {
		return `${value} / ${value + 1}`;
	};

	// On render, fetch logged in user's username for form
	// submit use
	useEffect(() => {
		const profile = Auth.getProfile();
		if (profile?.data) {
			const username: string = profile?.data?.username;
			setCurrentUser(username);
		}
	}, []);

	useEffect(() => {
		if (inputValue) {
			handleRecordSlices(inputValue);
			setInputValue(null);
		}
	}, [inputValue]);

	return (
		<AddSliceWrap id='addSlicesWrapper'>
			<AddSliceSect>
				<HeadingCtr>
					<h2>Add Slices</h2>
				</HeadingCtr>
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<form style={{ display: 'flex', flexDirection: 'column', width: '100%' }} onSubmit={handleSubmit((data) => setInputValue(parseInt(data?.quantity)))}>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gridTemplateColumns: 1 / 3, gridTemplateRows: 2 / 3 }}>
							{btnValues.map((button) => {
								return (
									<AddBtns
										key={button.value}
										onClick={() => setInputValue(button.value)}
										type='submit'
										{...register('slicesNum')}
										value={button.value}
										style={{ gridRow: createBtnGridRow(button.row) }}
										data-value={button.value}>
										{button.icon}
									</AddBtns>
								);
							})}
						</div>
						<div style={{ display: 'flex', flexDirection: 'row', height: 'min-content', border: '1px solid black', borderRadius: '6px', width: '30%', alignSelf: 'center', marginTop: '1rem' }}>
							<SlicesInput $width='80%' {...register('quantity', { required: false })} />
							{errors.quantity && <p>A quantity is required.</p>}
							{/* <Input type='submit' /> */}
							<AddBtn type='submit'>
								<IoPizzaOutline size={'15px'} />
							</AddBtn>
						</div>
					</form>
				</div>
			</AddSliceSect>
		</AddSliceWrap>
	);
}
