import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ISliceEntry } from '../types';
import { getLastTwentyEntries } from '../utils/API';
import { formateTimeDistance } from '../utils/helpers';

export default function SliceHistory() {
	const [entries, setEntries] = useState<ISliceEntry[] | null>(null);

	const handleGetEntries = async () => {
		const response = await getLastTwentyEntries();
		if (!response?.ok) {
			console.log("bad response: ", response);
			
		} else {
			// console.log("good response: ", response.json());
			const data: ISliceEntry[] = await response.json();
			console.log("data: ", data);
			setEntries(data);
		}
	};

	useEffect(() => {
		handleGetEntries();
	}, []);

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
		<>
			{entries ? (
				<div style={{width: '75%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
					{entries.map((entry) => {
						return (
							<div style={{width: '100%', textAlign: 'center'}} key={entry.date.toString()}>
								<div>{/* <img /> */}</div>
								<div>
									<p>{entry.rating.toString()}</p>
								</div>
								<div>
									<p style={{fontSize: '10px'}}>{formateTimeDistance(entry.date)} ago</p>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<></>
			)}
		</>
	);
}
