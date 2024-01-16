import React, { useContext, useEffect, useState } from 'react';
import LogRocket from 'logrocket';

import styled from 'styled-components';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryLabel, VictoryTheme } from 'victory';
import { Button, ButtonGroup, createTheme } from '@mui/material';
import { getSingleUser } from '../utils/API';
import { IUser, ISliceHistChartData, SliceHistProps, ErrorProp } from '../types';

import { getSliceHistChartData } from '../utils/helpers';
import { ErrorContext } from '../context/ErrorContext';
import { ErrorContextType } from '../context/types.context';

const SliceHistWrapper = styled.div`
	/* height: 80%; */
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
	const { saveError } = useContext(ErrorContext) as ErrorContextType;
	const clicked = props?.clicked;
	const lastWeekIncr = 'week';
	const lastMonthIncr = 'month';
	const lastYearIncr = 'year';
	const [userData, setUserData] = useState<IUser | null>(null);
	const [selectedIncr, setSelectedIncr] = useState<string>('week');
	const [chartData, setChartData] = useState<ISliceHistChartData[] | null>(null);
	const [xChartLabel, setXChartLabel] = useState<string>('Days');

	const handleTouchStart = (event: React.TouchEvent) => {
		event.stopPropagation();
	};

	const handleSetIncr = (incStr: string) => {
		setSelectedIncr(incStr);
		incStr === 'week' ? setXChartLabel('Days') : setXChartLabel('Weeks');
	};

	// const [chartWidth, setChartWidth] = useState()

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
				} else {
					const data: IUser = await response.json();
					if (data) {
						setUserData(data);
					}
				}
			} catch (err: any) {
				saveError({
					throwError: true,
					errorMessage: {
						status: null,
						message: 'Something weird happened. Try refreshing...',
					},
				});
				if (process.env.NODE_ENV === 'production') {
					LogRocket.captureException(err);
				}
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
