import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IoPizzaOutline } from 'react-icons/io5';
import { LuImagePlus } from 'react-icons/lu';

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
	const formRef = useRef<HTMLFormElement | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const hiddenInput = useRef<HTMLInputElement | null>(null);
	const [currentUser, setCurrentUser] = useState<string>('');
	const [inputValue, setInputValue] = useState<IEntryFormInput | null>(null);
	const [userRating, setUserRating] = useState<number>(0);
	const [userUploadImage, setUserUploadImage] = useState<File | undefined>(undefined);

	const handleImageUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (hiddenInput?.current) {
			hiddenInput.current?.click();
		}
	};
	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	const getCreateEntryBody = (userId: string, formInput: IEntryFormInput) => {
		if (formInput && userUploadImage) {
			return {
				quantity: formInput.quantity,
				rating: userRating,
				user: userId,
				imageFile: userUploadImage,
			};
		} else if (formInput && !userUploadImage) {
			return {
				quantity: formInput.quantity,
				rating: userRating,
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
					console.log("good response", response);
					formRef.current?.reset();
					setClicked(true);
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
						<StarRatingSelector handlePassRating={handlePassRating} />
					</form>
				</div>
			</AddSliceSect>
		</AddSliceWrap>
	);
}
