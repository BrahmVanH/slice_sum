import React, { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import LogRocket from 'logrocket';
import styled, { useTheme } from 'styled-components';
import { IoPizzaOutline } from 'react-icons/io5';
import { LuImagePlus } from 'react-icons/lu';
import { Slider } from '@mui/material';
import Auth from '../utils/auth';

import { useForm } from 'react-hook-form';
import { createEntry } from '../utils/API';
import { Input, BtnNaked, AlertRect, AlertMessage } from './Styled';
import { AddSlicesProps, IEntryFormInput } from '../types';
import StarRatingSelector from './StarRatingSelector';
import { ErrorContext } from '../context/ErrorProvider';
import { ErrorContextType } from '../context/types.context';
import { fileIsImgType } from '../utils/helpers';

// Styled components
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

const LocationCont = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const RadioInputCont = styled.div`
	display: flex;
	flex-direction: row;
`;

const AddBtn = styled(BtnNaked)`
	margin-right: 0.5rem;
	cursor: pointer;
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
	// Import global theme from Theme Provider
	const theme = useTheme();

	// Function passed down from parent to set 'clicked' state. This will trigger a render in this component's sibling
	// (a chart) to reflect latest update to DB
	const setClicked = props?.handleSetClicked;

	// Capture form in a ref to clear inputs on submission
	const formRef = useRef<HTMLFormElement | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	// Local state variables
	const hiddenInput = useRef<HTMLInputElement | null>(null);
	const [inputValue, setInputValue] = useState<IEntryFormInput | null>(null);
	const [userOverallRating, setUserOverallRating] = useState<number>(0);
	const [userCheeseRating, setUserCheeseRating] = useState<number>(0);
	const [userCrustRating, setUserCrustRating] = useState<number>(0);
	const [userSauceRating, setUserSauceRating] = useState<number>(0);
	const [userUploadImage, setUserUploadImage] = useState<File | undefined>(undefined);
	const [isMediumView, setIsMediumView] = useState<boolean>(false);

	// Too many &&'s, this will check if all the user-rating parameters are set
	const areRatingParamsSet = useCallback(() => {
		if (userOverallRating !== 0 && userCheeseRating !== 0 && userCheeseRating !== 0 && userSauceRating !== 0) {
			return true;
		}
		return false;
	}, [userOverallRating, userCheeseRating, userSauceRating]);

	// This will reset all slider selectors and form input fields
	const handleFormReset = () => {
		formRef.current?.reset();
		setUserOverallRating(0);
		setUserCheeseRating(0);
		setUserCrustRating(0);
		setUserSauceRating(0);
		setUserUploadImage(undefined);
	};

	// This component has a hidden image input, represented by a visible image upload icon
	// this function acts as a handler for the hidden image input when the user interacts
	// with the visible icon
	const handleImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (hiddenInput?.current) {
			hiddenInput.current?.click();
		}
	};

	// Returns boolean based on medium viewport status
	const isMediumViewport = () => {
		return window.innerWidth < 766;
	};

	// Determine if mobile view or not
	useEffect(() => {
		const mobile = isMediumViewport();
		mobile ? setIsMediumView(true) : setIsMediumView(false);
	}, []);

	// Setter function for global error context
	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	// Handlers for slider inputs
	const handleCrustChange = (event: Event, newValue: number | number[]) => {
		setUserCrustRating(newValue as number);
	};
	const handleCheeseChange = (event: Event, newValue: number | number[]) => {
		setUserCheeseRating(newValue as number);
	};
	const handleSauceChange = (event: Event, newValue: number | number[]) => {
		setUserSauceRating(newValue as number);
	};

	// The function is needed to validate forms quantity value,
	// as it seemed simpler than attempting to use react-form-hooks validation for type
	const validateQuantity = useCallback(
		(quantity: any) => {
			if (Number.isNaN(quantity) || !/^\d+$/.test(quantity)) {
				saveError({
					throwError: true,
					errorMessage: {
						status: 400,
						message: 'You must enter a number',
					},
				});
				return false;
			} else {
				return true;
			}
		},
		[saveError]
	);

	// Format all form/user inputs into appropriately typed object - if user uploads a file that is not an image,
	// the db update will ignore that file and proceed as normal otherwise
	const getCreateEntryBody = useCallback(
		(userId: string, formInput: IEntryFormInput) => {
			if (formInput && userUploadImage && fileIsImgType(userUploadImage)) {
				return {
					quantity: formInput.quantity,
					location: formInput.location,
					rating: { overall: userOverallRating, crust: userCrustRating, cheese: userCheeseRating, sauce: userSauceRating },
					user: userId,
					imageFile: userUploadImage,
				};
			} else if ((formInput && !userUploadImage) || (formInput && userUploadImage && !fileIsImgType(userUploadImage))) {
				return {
					quantity: formInput.quantity,
					location: formInput.location,
					rating: { overall: userOverallRating, crust: userCrustRating, cheese: userCheeseRating, sauce: userSauceRating },
					user: userId,
				};
			}
		},
		[userCheeseRating, userCrustRating, userOverallRating, userSauceRating, userUploadImage]
	);

	// Form submission handler
	const handleRecordSlices = useCallback(
		async (formInput: IEntryFormInput) => {
			const userId: string | undefined = Auth.getProfile()?.data?._id;
			const isValidQuantity = validateQuantity(formInput.quantity);
			try {
				if (userId && formInput && isValidQuantity && areRatingParamsSet()) {
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
						handleFormReset();
						setClicked(true);
					}
				} else {
					throw new Error('There was an error in recording this slice entry, sorry.');
				}
			} catch (err: any) {
				// If app is in production env, log errors to logrocket, otherwise console for dev purposes
				if (process.env.NODE_ENV === 'production') {
					LogRocket.captureException(err);
				} else {
					console.error('something went wrong in handling adding slices', err);
				}
			}
		},
		[areRatingParamsSet, getCreateEntryBody, saveError, setClicked, validateQuantity]
	);

	// The overall rating selector is a separate component that receives this function
	// to set overallRating state var
	const handlePassOverallRating = (userRating: number) => {
		if (userRating) {
			setUserOverallRating(userRating);
		}
	};

	// Form submission results in inputValue state var being set - trigger entry recording
	useEffect(() => {
		if (inputValue) {
			handleRecordSlices(inputValue);
			setInputValue(null);
		}
	}, [inputValue, handleRecordSlices]);

	useEffect(() => {
		if (userUploadImage && userUploadImage?.type !== 'image/jpeg') {
			saveError({
				throwError: true,
				errorMessage: {
					status: null,
					message: 'Please only upload images of pizza. Refresh and try again.',
				},
			});
		}
	}, [userUploadImage, saveError]);

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
								onSubmit={handleSubmit((data) => setInputValue({ quantity: parseInt(data?.quantity), location: data?.location }))}>
								<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'space-around' }}>
									<HiddenInput
										ref={hiddenInput}
										type='file'
										name='image'
										onChange={(event: ChangeEvent<HTMLInputElement>) => {
											event.preventDefault();
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
									{!isMediumView ? (
										<UploadBtn onClick={(event) => handleImageUpload(event)}>
											<LuImagePlus size={'24px'} />
										</UploadBtn>
									) : (
										<></>
									)}
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
								</SliderCont>
								<StarRatingSelector userOverallRating={userOverallRating} handlePassRating={handlePassOverallRating} />
								<LocationCont>
									<RadioInputCont>
										<Input type='radio' value={'main-street-mqt'} {...register('location', { required: true })} />
										<p>Main Street - MQT</p>
									</RadioInputCont>
									<RadioInputCont>
										<Input type='radio' value={'main-street-harvey'} {...register('location', { required: true })} />
										<p>Main Street - Harvey</p>
									</RadioInputCont>
									<RadioInputCont>
										<Input type='radio' value={'LSP'} {...register('location', { required: true })} />
										<p>Lake Superior Pizza</p>
									</RadioInputCont>
								</LocationCont>
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
