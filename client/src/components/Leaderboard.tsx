import React, { useEffect, useRef, useState, useReducer, useMemo } from 'react';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import styled from 'styled-components';
import { IStatsUser, ILeaderboardProps } from '../types';

// Styled component for local use
const StatsTable = styled.table<{ $inputWidth?: string }>`
	background-color: white;
	color: black;
	margin: 1rem 0rem;
	border: 5px solid #000000;
	border-radius: 5px;
	width: ${(props) => props.$inputWidth ?? '90%'};
	height: 90%;
`;

// This component renders a table containing stats about User's recorded quantities of slices
export default function Leaderboard({ data }: Readonly<ILeaderboardProps>) {
  
	// State var to be modified by computed viewport width for responsive table
	const [widthInput, setWidthInput] = useState<string>('90%');

	// Check viewport width and update table width accordingly
	// on component render
	useEffect(() => {
		if (window) {
			const innerWidth = window.innerWidth;
			if (innerWidth > 768) {
				setWidthInput('60%');
			} else if (innerWidth > 1300) {
				setWidthInput('40%');
			} else {
				setWidthInput('90%');
			}
		}
	}, []);

	// Define table columns
	const columns = useMemo<ColumnDef<IStatsUser>[]>(
		() => [
			{
				header: '',
				cell: (row) => row.renderValue(),
				accessorKey: 'username',
			},
			{
				header: 'Last Day',
				cell: (row) => row.renderValue(),
				accessorKey: 'sliceStats.lastDay',
			},
			{
				header: 'Last Week',
				cell: (row) => row.renderValue(),
				accessorKey: 'sliceStats.lastWeek',
			},
			{
				header: 'Last Month',
				cell: (row) => row.renderValue(),
				accessorKey: 'sliceStats.lastMonth',
			},
			{
				header: 'Last Year',
				cell: (row) => row.renderValue(),
				accessorKey: 'sliceStats.lastYear',
			},
		],
		[]
	);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }} className='p-2'>
			{data ? (
				<StatsTable className='min-w-full text-center' $inputWidth={widthInput}>
					<thead className='border-b bg-gray-50'>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th key={header.id} className='px-6 py-4 text-sm font-medium text-gray-900'>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className='border-b" bg-white'>
								{row.getVisibleCells().map((cell) => (
									<td style={{ borderTop: '1px solid #903440', textAlign: 'center' }} className='whitespace-nowrap px-6 py-4 text-sm font-light text-gray-900' key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</StatsTable>
			) : (
				<></>
			)}
		</div>
	);
}
