import React, { useEffect, useRef, useState, useReducer, useMemo } from 'react';
import { IUser } from '../types';

import { Table, createColumnHelper, flexRender, getCoreRowModel, useReactTable, IdentifiedColumnDef, Column } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

import { FaSearch } from 'react-icons/fa';
import { JsxElement } from 'typescript';
import styled from 'styled-components';
import { ISliceStats, IStatsUser } from '../types';

interface IUserStatsTableProps {
	data: IStatsUser[];
}

interface ITableUser {
	username: string;
	totalSlices: number;
}



const StatsTable = styled.table<{ $inputWidth?: string }>`
	background-color: white;
	color: black;
	margin: 1rem 0rem;
	border: 5px solid #000000;
	border-radius: 5px;
	width: ${(props) => props.$inputWidth ?? '90%'};
	height: 90%;
`;

export default function UserStatsTable({ data }: Readonly<IUserStatsTableProps>) {
	const [widthInput, setWidthInput] = useState<string>('90%');

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
