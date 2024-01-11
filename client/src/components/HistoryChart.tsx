import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryContainer, VictoryTheme } from 'victory';
import { Button, ButtonGroup, createTheme } from '@mui/material';
import { getSingleUser } from '../utils/API';
import { IStatsUser, IUser, ISliceHistChartData, SliceHistProps, ErrorProp, ToastProps } from '../types';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../store/store';
import { Reducer } from '../store/reducer';

import { getSliceHistChartData } from '../utils/helpers';


const SliceHistWrapper = styled.div`
	height: 80%;
	grid-area: slicesHistory;
	border: 1px solid black;
	border-radius: 8px;
	margin: 1rem;
	padding: 1rem;

	@media (min-width: 1440px) {
		width: 30%;
		height: 70%;
		justify-self: center;
	}

	@media (min-width: 776px) and (max-width: 1440px) {
		height: 50%;
	}
`;

const SlicesHistSection = styled.section`
	display: grid;
	grid-template-columns: [line1] 1fr [line2];
	grid-template-rows: [line1] 50px [line2] 1fr [line3];
`;

const ChartWrapper = styled.div`
	grid-row: 2 / 3;
	grid-column: 1 / 2;
`;

export default function HistoryChart(props: Readonly<SliceHistProps>) {
	// const dispatch = Dispatch<any> = useDispatch();
	const clicked = props?.clicked;
	const lastWeekIncr = 'week';
	const lastMonthIncr = 'month';
	const lastYearIncr = 'year';
	const [userData, setUserData] = useState<IUser | null>(null);
	const [selectedIncr, setSelectedIncr] = useState<string>('week');
	const [chartData, setChartData] = useState<ISliceHistChartData[] | null>(null);

	const [showToast, setShowToast] = useState<boolean>(false);
	const [toastError, setToastError] = useState<ErrorProp | null>(null);
	// const [error, setError] = useState<ErrorProp | null>(null);

	const dispatch = useDispatch();
	const { setThrowError } = bindActionCreators(actionCreators, dispatch);

	const handleTouchStart = (event: React.TouchEvent) => {
		event.stopPropagation();
	};

	// const [chartWidth, setChartWidth] = useState()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getSingleUser();
				if (!response?.ok) {
					// setToastError({ message: 'There was an error fetching your slice history. Try refreshing the page or logging out and back in.', status: response?.status });
					// setShowToast(true);
					setThrowError({
						throwError: true,
						errorMessage: {
							status: response?.status || null,
							message: "there was an error"
						}
					})
				} else {
					const data: IUser = await response.json();
					if (data) {
						setUserData(data);
					}
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [clicked]);

	useEffect(() => {
		if (userData) {
			const data = getSliceHistChartData(userData, selectedIncr);

			if (data) {
				setChartData(data);
			}
		}
	}, [userData]);

	useEffect(() => {
		if (userData) {
			const data = getSliceHistChartData(userData, selectedIncr);
			if (data) {
				setChartData(data);
			}
		}
	}, [selectedIncr, clicked]);

	return (
		<>
			{/* <ToastNotif  error={toastError}/> */}
			{chartData ? (
				<SliceHistWrapper>
					<SlicesHistSection>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<h3 style={{ marginRight: '1rem', textAlign: 'center', flexGrow: '1', marginTop: '0.5rem' }}>YOUR STATS</h3>
							<ButtonGroup style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
								<Button color='primary' onClick={() => setSelectedIncr(lastWeekIncr)} style={{ borderTop: 'none', color: 'black', borderColor: '#903440', fontFamily: 'Inter' }}>
									Week
								</Button>
								<Button color='primary' onClick={() => setSelectedIncr(lastMonthIncr)} style={{ borderTop: 'none', color: 'black', borderColor: '#903440', fontFamily: 'Inter' }}>
									Month
								</Button>
								<Button color='primary' onClick={() => setSelectedIncr(lastYearIncr)} style={{ borderTop: 'none', color: 'black', borderColor: '#903440', fontFamily: 'Inter' }}>
									Year
								</Button>
							</ButtonGroup>
						</div>

						<ChartWrapper onTouchStart={handleTouchStart}>
							<VictoryChart theme={VictoryTheme.material}>
								<VictoryArea data={chartData} />
								<VictoryAxis dependentAxis />
								<VictoryAxis />
							</VictoryChart>
						</ChartWrapper>
					</SlicesHistSection>
				</SliceHistWrapper>
			) : (
				<></>
			)}
		</>
	);
}
