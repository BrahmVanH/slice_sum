import Auth from './auth';
import { ICreateBody, IEntryBody, ILoginBody } from '../types';
import { compressImage } from './helpers';
import LogRocket from 'logrocket';

const apiEndpoint = '.netlify/functions/actions';

export const getSingleUser = async () => {
	try {
		if (Auth.isLoggedIn()) {
			const token: string | null = Auth.getToken();
			return await fetch(`${apiEndpoint}/user/:id`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});
		}
	} catch (err: any) {
		if (process.env.NODE_ENV === 'production') {
			LogRocket.captureException(err);
		} else {
			console.error('there was an error querying single user: ', err);
		}
	}
};

export const getAllUsers = async () => {
	try {
		return await fetch(`${apiEndpoint}/user`, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (err: any) {
		if (process.env.NODE_ENV === 'production') {
			LogRocket.captureException(err);
		} else {
			console.error('there was an error querying single user: ', err);
		}
	}
};

export const createUser = async (newUser: ICreateBody) => {
	try {
		return await fetch(`${apiEndpoint}/user/new`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		});
	} catch (err: any) {
		if (process.env.NODE_ENV === 'production') {
			LogRocket.captureException(err);
		} else {
			console.error('there was an error in creating a new users', err);
		}
	}
};

export const login = async (newUser: ILoginBody) => {
	try {
		return await fetch(`${apiEndpoint}/user/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		});
	} catch (err: any) {
		if (process.env.NODE_ENV === 'production') {
			LogRocket.captureException(err);
		} else {
			console.error('there was an error in creating a new users', err);
		}
	}
};

export const createEntry = async (newEntryBody: IEntryBody | undefined) => {
	try {
		if (newEntryBody && newEntryBody?.imageFile) {
			const compressedImg = await compressImage(newEntryBody?.imageFile);

			const formData = new FormData();
			formData.append('quantity', String(newEntryBody?.quantity));
			formData.append('location', String(newEntryBody?.location));
			formData.append('overall', String(newEntryBody?.rating?.overall));
			formData.append('crust', String(newEntryBody?.rating?.crust));
			formData.append('cheese', String(newEntryBody?.rating?.cheese));
			formData.append('sauce', String(newEntryBody?.rating?.sauce));
			formData.append('user', newEntryBody?.user);
			if (compressedImg) {
				formData.append('imageFile', compressedImg);
			} else {
				formData.append('imageFile', newEntryBody?.imageFile);
			}
			return await fetch(`${apiEndpoint}/slices`, {
				method: 'POST',
				body: formData,
			});
		} else if (newEntryBody && !newEntryBody?.imageFile) {
			const formData = new FormData();

			formData.append('quantity', String(newEntryBody?.quantity));
			formData.append('location', String(newEntryBody?.location));
			formData.append('overall', String(newEntryBody?.rating?.overall));
			formData.append('crust', String(newEntryBody?.rating?.crust));
			formData.append('cheese', String(newEntryBody?.rating?.cheese));
			formData.append('sauce', String(newEntryBody?.rating?.sauce));
			formData.append('user', newEntryBody?.user);

			return await fetch(`${apiEndpoint}/entries`, {
				method: 'POST',
				body: formData,
			});
		}
	} catch (err: any) {
		if (process.env.NODE_ENV === 'production') {
			LogRocket.captureException(err);
		} else {
			console.error('there was an error in creating a new entry', err);
		}
	}
};

export const getAllEntries = async () => {
	try {
		return await fetch(`${apiEndpoint}/slices`, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (err: any) {
		if (process.env.NODE_ENV === 'production') {
			LogRocket.captureException(err);
		} else {
			console.error('there was an error in getting all entries', err);
		}
	}
};

export const getLastTwentyEntries = async () => {
	try {
		return await fetch(`${apiEndpoint}/slices/recent`, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (err: any) {
		if (process.env.NODE_ENV === 'production') {
			LogRocket.captureException(err);
		} else {
			console.error('there was an error in getting last twenty entries', err);
		}
	}
};

export const deleteEntry = async (_id: string) => {
	try {
		return await fetch(`${apiEndpoint}/slices/:id`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(_id),
		});
	} catch (err: any) {
		if (process.env.NODE_ENV === 'production') {
			LogRocket.captureException(err);
		} else {
			console.error('there was an error in deleting entry', err);
		}
	}
};
