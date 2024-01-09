import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IoPizzaOutline } from 'react-icons/io5';
import { LuImagePlus } from 'react-icons/lu';

import Auth from '../utils/auth';

import { FieldValues, useForm } from 'react-hook-form';
import { addSlices, createEntry } from '../utils/API';
import { Input, BtnNaked } from './Styled';
import { AddSlicesProps, IEntryFormInput } from '../types';
import StarRating from './StarRating';

const AddSliceWrap = styled.div`
	grid-area: addSlices;
	padding: 1rem 1rem 2rem 1rem;
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
	border-bottom: 1px solid #903440;
	margin: 0px 0px 1rem 0px;
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

const HiddenInput = styled(Input)`
	display: none;
`;

const UploadBtn = styled.button`
	width: min-content;
	align-self: center;
`;

const SlicesInputWrapper = styled.div`
	display: flex;
	flex-direction: row;
	height: min-content;
	border: 1px solid black;
	border-radius: 6px;
	width: 75%;
	align-self: center;
	justify-content: flex-end;
`;

const SlicesInput = styled(Input)`
	border: none;
	text-align: right;
	width: 70%;
`;

const AddBtn = styled(BtnNaked)`
	margin-right: 0.5rem;
`;

export default function AddSlices(props: Readonly<AddSlicesProps>) {
	const setClicked = props?.handleSetClicked;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const hiddenInput = useRef<HTMLInputElement | null>(null);
	const [currentUser, setCurrentUser] = useState<string>('');
	const [inputValue, setInputValue] = useState<IEntryFormInput | null>(null);
	const [selectedBtnVal, setSelectedBtnVal] = useState<number | null>(null);
	const [userRating, setUserRating] = useState<number>(0);
	const [userUploadImage, setUserUploadImage] = useState<File | undefined>(undefined);
	const handleImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (hiddenInput?.current) {
			hiddenInput.current?.click();
		}
	};
	// Form submission handler
	const handleRecordSlices = async (formInput: IEntryFormInput) => {
		const userId: string | undefined = Auth.getProfile()?.data?._id;

		try {
			console.log('form input, userId, userRating: ', formInput, userId, userRating);
			if (userId && formInput) {
				const response = await createEntry({
					quantity: formInput.quantity,
					rating: userRating,
					user: userId,
					imageFile: userUploadImage,
				});

				console.log('userUploadImage: ', userUploadImage);

				if (response?.ok) {
					// TODO: Replace this with a positive alert
					console.log('good reponse');
					setClicked(true);
				} else {
					console.error('bad response: ', response);
				}
			}
		} catch (err) {
			console.error('something went wrong in handling adding slices', err);
		}
	};

	const handlePassRating = (userRating: number) => {
		if (userRating) {
			setUserRating(userRating);
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
			console.log('inputValue: ', inputValue);
			setInputValue(null);
		}
	}, [inputValue]);

	return (
		<AddSliceWrap id='addSlicesWrapper'>
			<AddSliceSect>
				<HeadingCtr>
					<h2 style={{ marginBottom: '0.5rem' }}>ADD YOUR SLICES</h2>
				</HeadingCtr>
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
					<form style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }} onSubmit={handleSubmit((data) => setInputValue({ quantity: parseInt(data?.quantity) }))}>
						<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'space-around' }}>
							<HiddenInput
								// {...register('image', { required: false })}
								ref={hiddenInput}
								type='file'
								name='image'
								// value={setUserUploadImage}
								onChange={(event) => {
									event?.target?.files ? setUserUploadImage(event?.target?.files[0]) : console.log('no event');
									event?.target?.files ? console.log('typeof: ', typeof event?.target?.files[0]) : console.log('no event');
								}}
							/>
							<SlicesInputWrapper>
								<SlicesInput placeholder='How Many Slices?' $width='60%' {...register('quantity', { required: false })} />
								{errors.quantity && <p>A quantity is required.</p>}
								{/* <Input type='submit' /> */}
								<AddBtn type='submit'>
									<IoPizzaOutline size={'22px'} />
								</AddBtn>
							</SlicesInputWrapper>
							<UploadBtn onClick={(event) => handleImageUpload(event)}>
								<LuImagePlus size={'24px'} />
							</UploadBtn>
						</div>
						<StarRating handlePassRating={handlePassRating} />
					</form>
				</div>
			</AddSliceSect>
		</AddSliceWrap>
	);
}
