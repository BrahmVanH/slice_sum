import React from 'react';
import { VictoryChart, VictoryBar, VictoryPolarAxis, VictoryTheme } from 'victory';
import { IRating, IRatingChartProps } from '../types';
import { useTheme } from 'styled-components';

export default function RatingChart(props: IRatingChartProps) {
  const rating = props.rating;
	const theme = useTheme();
	return (
		<VictoryChart polar theme={VictoryTheme.material}>
			{Object.keys(rating).map((key, i) => {
				return <VictoryPolarAxis dependentAxis key={i} label={key} labelPlacement='perpendicular' style={{ tickLabels: { fill: 'none' } }} axisValue={key} />;
			})}
			<VictoryBar
				style={{ data: { fill: theme.primary, width: 25 } }}
				data={[
					{ x: 'Overall', y: rating.overall },
					{ x: 'Crust', y: rating.crust },
					{ x: 'Cheese', y: rating.cheese },
					{ x: 'Sauce', y: rating.sauce },
				]}
			/>
		</VictoryChart>
	);
}
