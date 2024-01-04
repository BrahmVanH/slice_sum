import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryContainer, VictoryTheme } from 'victory';
import { Button, ButtonGroup } from '@mui/material';
import { getSingleUser } from '../utils/API';
import { IStatsUser, IUser, ISliceHistChartData, SliceHistProps } from '../types';
import { getSliceHistChartData } from '../utils/helpers';

const SliceHistWrapper = styled.div`
	height: 80%;
	grid-area: slicesHistory;
	border: 1px solid black;
	border-radius: 8px;
	margin: 1rem;
	padding: 1rem;

	@media (min-width: 776px) {
		width: 30%;
		height: 60%;
		justify-self: center;
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

export default function SlicesHistory(props: Readonly<SliceHistProps>) {
	const clicked = props?.clicked;
	const sampleData = [
		{
			x: 1,
			y: 3,
		},
		{
			x: 2,
			y: 2,
		},
		{
			x: 3,
			y: 3,
		},
		{
			x: 4,
			y: 3,
		},
		{
			x: 5,
			y: 3,
		},
	];
	const lastWeekIncr = 'week';
	const lastMonthIncr = 'month';
	const lastYearIncr = 'year';
	const [userData, setUserData] = useState<IUser | null>(null);
	const [selectedIncr, setSelectedIncr] = useState<string>('week');
	const [chartData, setChartData] = useState<ISliceHistChartData[] | null>(null);

	// const [chartWidth, setChartWidth] = useState()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getSingleUser();
				if (response?.ok) {
					const data: IUser = await response.json();
					if (data) {
						setUserData(data);
					}
				} else {
					console.error('there was an error while fetching data in SliceHistory', response);
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
			{chartData ? (
				<SliceHistWrapper>
					<SlicesHistSection>
						<ButtonGroup style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
							<Button onClick={() => setSelectedIncr(lastWeekIncr)} style={{ borderTop: 'none' }}>
								Week
							</Button>
							<Button onClick={() => setSelectedIncr(lastMonthIncr)} style={{ borderTop: 'none' }}>
								Month
							</Button>
							<Button onClick={() => setSelectedIncr(lastYearIncr)} style={{ borderTop: 'none' }}>
								Year
							</Button>
						</ButtonGroup>
						<ChartWrapper>
							<VictoryChart theme={VictoryTheme.material}>
								<VictoryArea data={chartData} />
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
