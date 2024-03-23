import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryLabel, VictoryTheme } from 'victory';
import { Button, ButtonGroup } from '@mui/material';
import { getSingleUser } from '../utils/API';
import { IUser, ISliceHistChartData, SliceHistProps } from '../types';

import { getSliceHistChartData } from '../utils/helpers';
import { ErrorContext } from '../context/ErrorProvider';
import { ErrorContextType } from '../context/types.context';

// Styled components for local use
const SliceHistWrapper = styled.div`
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
	// State var passed in from parent that is set by this component's sibling
	// causing a rerender when db is updated
	const clicked = props?.clicked;

	// Increment vars for chart
	const lastWeekIncr = 'week';
	const lastMonthIncr = 'month';
	const lastYearIncr = 'year';

	// Local state vars
	const [userData, setUserData] = useState<IUser | null>(null);
	const [selectedIncr, setSelectedIncr] = useState<string>('week');
	const [chartData, setChartData] = useState<ISliceHistChartData[] | null>(null);
	const [xChartLabel, setXChartLabel] = useState<string>('Days');

	// Setter function for global error state
	const { saveError } = useContext(ErrorContext) as ErrorContextType;

	// The victory chart used has a default functionality that
	// prevents user from scrolling page if gesture originates
	// on chart area. This function, passed to the chart,
	// allows user to scroll from wherever they want in mobile
	const handleTouchStart = (event: React.TouchEvent) => {
		event.stopPropagation();
	};

	// Sets selected increment value based on user selection
	// of button in chart container to render different
	// range of time on chart
	const handleSetIncr = (incStr: string) => {
		setSelectedIncr(incStr);
		incStr === 'week' ? setXChartLabel('Days') : setXChartLabel('Weeks');
	};

	// Fetch updated user data from db when user submits form in sibling component
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getSingleUser();
				if (!response?.ok) {
					saveError({
						throwError: true,
						errorMessage: {
							status: response?.status || null,
							message: 'Bad Request, try refreshing...',
						},
					});
					return;
				}
				const data: IUser = await response.json();
				if (data) {
					setUserData(data);
				}
			} catch (err: any) {
				saveError({
					throwError: true,
					errorMessage: {
						status: null,
						message: 'Something weird happened. Try refreshing...',
					},
				});
			}
		};

		fetchData();
	}, [clicked, saveError]);

	// When user data comes back from db, pass into formatting function to
	// create data object for chart
	useEffect(() => {
		if (!userData) {
			return;
		}
		console.log('userData', userData);
		const data: ISliceHistChartData[] | undefined = getSliceHistChartData(userData, selectedIncr);
		if (!data) {
			throw new Error('Error getting chart data');
		}

		console.log('setting chart data', data);
		setChartData(data);
	}, [userData, clicked, selectedIncr]);

	return (
		<>
			{chartData ? (
				<SliceHistWrapper>
					<SlicesHistSection>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<h2 style={{ marginRight: '1rem', textAlign: 'center', flexGrow: '1', marginTop: '0.5rem' }}>YOUR HISTORY</h2>
							<ButtonGroup style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
								<Button color='primary' onClick={() => handleSetIncr(lastWeekIncr)} style={{ borderTop: 'none', color: 'black', borderColor: '#903440', fontFamily: 'Inter' }}>
									Week
								</Button>
								<Button color='primary' onClick={() => handleSetIncr(lastMonthIncr)} style={{ borderTop: 'none', color: 'black', borderColor: '#903440', fontFamily: 'Inter' }}>
									Month
								</Button>
								<Button color='primary' onClick={() => handleSetIncr(lastYearIncr)} style={{ borderTop: 'none', color: 'black', borderColor: '#903440', fontFamily: 'Inter' }}>
									Year
								</Button>
							</ButtonGroup>
						</div>

						<ChartWrapper onTouchStart={handleTouchStart}>
							<VictoryChart domainPadding={10} theme={VictoryTheme.material}>
								<VictoryArea data={chartData} />
								<VictoryAxis
									style={{
										axisLabel: {
											fontFamily: 'inherit',
											fontWeight: 100,
											letterSpacing: '1px',
											stroke: 'black',
											fontSize: 18,
										},
									}}
									axisLabelComponent={<VictoryLabel dy={-24} />}
									label={'Number of Slices'}
									dependentAxis
								/>

								<VictoryAxis
									style={{
										axisLabel: {
											fontFamily: 'inherit',
											fontWeight: 100,
											letterSpacing: '1px',
											stroke: 'black',
											fontSize: 18,
										},
									}}
									axisLabelComponent={<VictoryLabel dy={24} />}
									label={xChartLabel}
								/>
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
