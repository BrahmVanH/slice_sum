import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function SliceHistory() {
	const sampleData = [
		{
			imgUrl: 'sampleUrl',
			date: new Date(),
			rating: 3,
		},
		{
			imgUrl: 'sampleUrl',
			date: new Date(),
			rating: 3,
		},
		{
			imgUrl: 'sampleUrl',
			date: new Date(),
			rating: 3,
		},
		{
			imgUrl: 'sampleUrl',
			date: new Date(),
			rating: 3,
		},
		{
			imgUrl: 'sampleUrl',
			date: new Date(),
			rating: 3,
		},
		{
			imgUrl: 'sampleUrl',
			date: new Date(),
			rating: 3,
		},
	];
	return (
		<div>
			{sampleData.map((entry) => {
				return (
					<div>
						<div>
							<img />
						</div>
						<div>
							<p>{entry.date.toString()}</p>
						</div>
						<div>
							<p>{entry.rating.toString()}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
