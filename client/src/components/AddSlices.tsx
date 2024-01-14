import React, { useContext, useEffect, useRef, useState } from 'react';
import LogRocket from 'logrocket';
import styled, { useTheme } from 'styled-components';
import { IoPizzaOutline } from 'react-icons/io5';
import { LuImagePlus } from 'react-icons/lu';
import { Slider } from '@mui/material';
import Auth from '../utils/auth';

import { useForm } from 'react-hook-form';
import { createEntry } from '../utils/API';
import { Input, BtnNaked } from './Styled';
import { AddSlicesProps, IEntryFormInput } from '../types';
import StarRatingSelector from './StarRatingSelector';
import { ErrorContext } from '../context/ErrorContext';
import { ErrorContextType } from '../context/types.context';
import { AlertRect, AlertMessage } from './Styled';

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

const HeadingCtr = styled.div<{ $primary: string }>`
	grid-column: 1 / 3;
	margin-top: 1rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom: ${(props) => `1 px solid ${props?.$primary}`};
	margin: 0px 0px 1rem 0px;
`;
const AddBtns = styled.button`
	width: 159px;
	height: 64px;
	grid-column: 1 / 2;
	margin: 0.5rem;

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

const SliderWrapper = styled.div`
	width: 100%;

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const SliderCont = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const RatingLabels = styled.span`
	margin-bottom: 0.5rem;
	font-size: 14px;
`;

const RatingSlider = styled(Slider)(({ theme }) => ({
	color: `${theme.primary} !important`,
}));

export default function AddSlices(props: Readonly<AddSlicesProps>) {
	const theme = useTheme();
	const setClicked = props?.handleSetClicked;
	const formRef = useRef<HTMLFormElement | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const hiddenInput = useRef<HTMLInputElement | null>(null);
	const [currentUser, setCurrentUser] = useState<string>('');
	const [inputValue, setInputValue] = useState<IEntryFormInput | null>(null);
	const [userOverallRating, setUserOverallRating] = useState<number>(0);
	const [userCheeseRating, setUserCheeseRating] = useState<number>(0);
	const [userCrustRating, setUserCrustRating] = useState<number>(0);
	const [userSauceRating, setUserSauceRating] = useState<number>(0);
	const [userUploadImage, setUserUploadImage] = useState<File | undefined>(undefined);

	const handleImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (hiddenInput?.current) {
			hiddenInput.current?.click();
		}
	};
	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	const handleCrustChange = (event: Event, newValue: number | number[]) => {
		setUserCrustRating(newValue as number);
	};
	const handleCheeseChange = (event: Event, newValue: number | number[]) => {
		setUserCheeseRating(newValue as number);
	};
	const handleSauceChange = (event: Event, newValue: number | number[]) => {
		setUserSauceRating(newValue as number);
	};

	const getCreateEntryBody = (userId: string, formInput: IEntryFormInput) => {
		if (formInput && userUploadImage) {
			return {
				quantity: formInput.quantity,
				rating: { overall: userOverallRating, crust: userCrustRating, cheese: userCheeseRating, sauce: userSauceRating },
				user: userId,
				imageFile: userUploadImage,
			};
		} else if (formInput && !userUploadImage) {
			return {
				quantity: formInput.quantity,
				rating: { overall: userOverallRating, crust: userCrustRating, cheese: userCheeseRating, sauce: userSauceRating },
				user: userId,
			};
		}
	};
	// Form submission handler
	const handleRecordSlices = async (formInput: IEntryFormInput) => {
		const userId: string | undefined = Auth.getProfile()?.data?._id;

		try {
			if (userId && formInput) {
				const createEntryBody = getCreateEntryBody(userId, formInput);
				const response = await createEntry(createEntryBody);

				if (!response?.ok) {
					response?.status === 500
						? saveError({
								throwError: true,
								errorMessage: {
									status: response?.status || null,
									message: 'Internal Server Error',
								},
						  })
						: saveError({
								throwError: true,
								errorMessage: {
									status: response?.status || null,
									message: 'Network error, try refreshing...',
								},
						  });
				} else {
					formRef.current?.reset();
					setUserOverallRating(0);
					setClicked(true);
				}
			}
		} catch (err: any) {
			if (process.env.NODE_ENV === 'production') {
				LogRocket.captureException(err);
			} else {
				console.error('something went wrong in handling adding slices', err);
			}
		}
	};

	const handlePassOverallRating = (userRating: number) => {
		if (userRating) {
			setUserOverallRating(userRating);
		}
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
		<>
			{theme ? (
				<AddSliceWrap id='addSlicesWrapper'>
					<AddSliceSect>
						<HeadingCtr $primary={theme.primary}>
							<h2 style={{ marginBottom: '0.5rem' }}>ADD YOUR SLICES</h2>
						</HeadingCtr>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
							<form
								ref={formRef}
								style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}
								onSubmit={handleSubmit((data) => setInputValue({ quantity: parseInt(data?.quantity) }))}>
								<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'space-around' }}>
									<HiddenInput
										// {...register('image', { required: false })}
										ref={hiddenInput}
										type='file'
										name='image'
										onChange={(event) => {
											if (event?.target?.files) {
												setUserUploadImage(event?.target?.files[0]);
											}
										}}
									/>
									<SlicesInputWrapper>
										<SlicesInput placeholder='How Many Slices?' $width='60%' {...register('quantity', { required: false })} />
										{errors.quantity && (
											<AlertRect>
												<AlertMessage style={{ fontSize: '10px' }} role='alert'>
													You must enter an amount of slices.
												</AlertMessage>
											</AlertRect>
										)}
										{/* <Input type='submit' /> */}
										<AddBtn type='submit'>
											<IoPizzaOutline size={'22px'} />
										</AddBtn>
									</SlicesInputWrapper>
									<UploadBtn onClick={(event) => handleImageUpload(event)}>
										<LuImagePlus size={'24px'} />
									</UploadBtn>
								</div>
								{/* Crust */}
								<SliderWrapper>
									<RatingLabels>Crispy</RatingLabels>
									<SliderCont>
										<h3>Crust</h3>
										<RatingSlider aria-label='Crust Rating' value={userCrustRating} min={0} max={5} onChange={handleCrustChange} />
									</SliderCont>
									<RatingLabels>Doughy</RatingLabels>
								</SliderWrapper>
								{/* Cheese */}
								<SliderWrapper>
									<RatingLabels>Not Enough</RatingLabels>
									<SliderCont>
										<h3>Cheese</h3>
										<RatingSlider aria-label='Cheese Rating' value={userCheeseRating} min={0} max={5} onChange={handleCheeseChange} />
									</SliderCont>
									<RatingLabels>So Much</RatingLabels>
								</SliderWrapper>
								<SliderWrapper>
									{/* Sauce */}
									<RatingLabels>Not Enough</RatingLabels>
									<SliderCont>
										<h3>Sauce</h3>
										<RatingSlider aria-label='Sauce Rating' value={userSauceRating} min={0} max={5} onChange={handleSauceChange} />
									</SliderCont>
									<RatingLabels>Too Much</RatingLabels>
								</SliderWrapper>
								{/* Overall */}
								<SliderCont>
									<h3>Overall</h3>
									<StarRatingSelector handlePassRating={handlePassOverallRating} />
								</SliderCont>
							</form>
						</div>
					</AddSliceSect>
				</AddSliceWrap>
			) : (
				<></>
			)}
		</>
	);
}
