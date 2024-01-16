import React from 'react';
import { VictoryChart, VictoryArea, VictoryPolarAxis, VictoryTheme } from 'victory';
import { IRating, IRatingChartProps } from '../types';
import { useTheme } from 'styled-components';
import { capitalizeFirstLetter } from '../utils/helpers';

export default function RatingChart(props: IRatingChartProps) {
	const rating = props.rating;
	const theme = useTheme();

	
	return (
		<VictoryChart polar theme={VictoryTheme.material}>
			{Object.keys(rating).map((key, i) => {
				if (key !== '_id') {
					const formattedLabel = capitalizeFirstLetter(key);
					return <VictoryPolarAxis dependentAxis key={i} label={formattedLabel} labelPlacement='perpendicular' style={{ tickLabels: { fill: 'none' } }} axisValue={key} />;
				}
			})}
			<VictoryArea
				style={{ data: { fill: theme.primary, width: 25 } }}
				data={[
					{ x: 'overall', y: rating.overall },
					{ x: 'crust', y: rating.crust },
					{ x: 'cheese', y: rating.cheese },
					{ x: 'sauce', y: rating.sauce },
				]}
			/>
		</VictoryChart>
	);
}
