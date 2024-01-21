import { ISliceHistChartData, IUser, IStatsUser, ISliceHistory, ISliceEntry, ISliceHistByDay } from '../types';
import { formatDistance } from 'date-fns';
import Compressor from 'compressorjs';

export const formateTimeDistance = (date: Date) => {
	return formatDistance(new Date(), date, { includeSeconds: true });
};

export const getTimeDistanceByIncr = (sliceEntry: ISliceEntry, increment: string) => {
	const byDayIncr = 1000 * 3600 * 24;
	const byWeekIcr = 1000 * 3600 * 24 * 7;
	const byMonthIncr = 1000 * 3600 * 24 * 30;
	let incr;
	if (increment === 'day') {
		incr = byDayIncr;
	} else if (increment === 'week') {
		incr = byWeekIcr;
	} else if (increment === 'month') {
		incr = byMonthIncr;
	}
	const date = new Date(sliceEntry.date);
	const now = new Date();
	const differenceInTime = now.getTime() - date.getTime();
	const differenceInDays = differenceInTime / (1000 * 3600 * 24);
	return Math.floor(differenceInDays);
};

const removeInactiveUsers = (userData: IUser[]) => {
	let activeUserData: IUser[] = [];
	if (userData) {
		userData.forEach((user) => {
			if (user.sliceEntries.length > 0) {
				activeUserData.push(user);
			}
		});
	}

	return activeUserData;
};

export const createTableData = (userData: IUser[]) => {
	let userStats: IStatsUser[] | null = [];
	const activeUserData = removeInactiveUsers(userData);
	if (activeUserData) {
		activeUserData.forEach((user) => {
			const username = user.username;
			let sliceStats = {
				lastDay: 0,
				lastWeek: 0,
				lastMonth: 0,
				lastYear: 0,
			};
			user.sliceEntries.forEach((entry) => {
				const distance = getTimeDistanceByIncr(entry, 'day');
				if (distance === 0) {
					sliceStats.lastDay += entry.quantity;
				} else if (distance < 7) {
					sliceStats.lastWeek += entry.quantity;
				} else if (distance < 31) {
					sliceStats.lastMonth += entry.quantity;
				} else if (distance < 364) {
					sliceStats.lastYear += entry.quantity;
				}
			});
			userStats?.push({ username: username, sliceStats: sliceStats });
		});
	}
	if (userStats.length > 0) {
		return userStats;
	}
};

export const getTotalSlices = (slicesArr: ISliceHistory[]) => {
	let total: number = 0;

	slicesArr.forEach((sliceEntry) => {
		total += sliceEntry.quantity;
	});

	return total;
};

const getCutoffAndIncr = (increment: string) => {
	if (increment === 'week') {
		const cutoff = 7;
		const distanceIncr = 'day';
		return { cutoff, distanceIncr };
	} else if (increment === 'month') {
		const cutoff = 31;
		const distanceIncr = 'day';
		return { cutoff, distanceIncr };
	} else if (increment === 'year') {
		const cutoff = 52;
		const distanceIncr = 'week';
		return { cutoff, distanceIncr };
	} else {
		const cutoff = null;
		const distanceIncr = null;
		return { cutoff, distanceIncr };
	}
};

export const getSliceHistChartData = (userData: IUser, increment: string) => {
	const { cutoff, distanceIncr } = getCutoffAndIncr(increment);
	if (userData?.sliceEntries && cutoff && distanceIncr) {
		const sliceEntries = userData.sliceEntries;

		const filteredEntries: ISliceHistByDay[] = sliceEntries
			.map((entry) => {
				const distance = getTimeDistanceByIncr(entry, distanceIncr);
				if (distance < cutoff) {
					return {
						distance: distance,
						quantity: entry.quantity,
					};
				}
				return undefined;
			})
			.filter((entry): entry is ISliceHistByDay => entry !== undefined);

		const selectedInrEntries: ISliceHistChartData[] = [];
		for (let i = 0; i < cutoff; i++) {
			let day = {
				x: i + 1,
				y: 0,
			};
			filteredEntries.forEach((entry) => {
				if (entry.distance === i) {
					day.y += entry.quantity;
				}
			});
			selectedInrEntries.push(day);
		}
		return selectedInrEntries;
	}
};

export const getSlicesLastMonth = (userData: IUser) => {
	if (userData?.sliceEntries) {
		const sliceEntries = userData.sliceEntries;

		const lastMonthEntries: ISliceHistByDay[] = sliceEntries
			.map((entry) => {
				const distance = getTimeDistanceByIncr(entry, 'day');
				if (distance < 31) {
					return {
						distance: distance,
						quantity: entry.quantity,
					};
				}
				return undefined;
			})
			.filter((entry): entry is ISliceHistByDay => entry !== undefined);

		const lastMonth: ISliceHistChartData[] = [];
		for (let i = 0; i < 31; i++) {
			let day = {
				x: i + 1,
				y: 0,
			};
			lastMonthEntries.forEach((entry) => {
				if (entry.distance === i) {
					day.y += entry.quantity;
				}
			});
			lastMonth.push(day);
		}
		return lastMonth;
	}
};

// Daniel Agbay - Their code from Medium
export const compressImage = async (image: File) => {
	try {
		const compressedBlob = await new Promise((resolve, reject) => {
			new Compressor(image, {
				quality: 0.65,
				maxWidth: 200,
				maxHeight: 200,
				mimeType: 'image/jpeg',
				success(result) {
					resolve(result);
				},
				error(error) {
					reject(error);
				},
			});
		});
		return compressedBlob as File;
	} catch (error) {
		console.error(error);
	}
};

export const capitalizeFirstLetter = (word: string) => {
	if (word !== '') {
		const wordArr = word.split('');
		const capFirstLet = wordArr[0].toUpperCase();
		wordArr.splice(0, 1, capFirstLet);
		const formattedWord = wordArr.join('');
		return formattedWord;
	} else {
		return word;
	}
};

export const fileIsImgType = (file: File) => {
	if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/x-icon' || file.type === 'image/webp') {
		return true;
	}
	return false;
};

export const formDataToObject = (formData: FormData) => {
	const object: any = {};
	formData.forEach((value, key) => {
		object[key] = value;
	});
	return object;
};

export const getFormattedLocation = (location: string) => {
	switch (location) {
		case 'main-street-mqt':
			return 'Main Street - MQT';
		case 'main-street-harver':
			return 'Main Street - Harvey';
		case 'LSP':
			return 'Lake Superior Pizza';
	}
};
