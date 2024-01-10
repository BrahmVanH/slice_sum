import Auth from './auth';
import { ICreateBody, IEntryBody, IPayload } from '../types';
import { compressImage } from './helpers';

interface ICredentials {
	token: string | null;
	username: string | null;
}
export const getSingleUser = async () => {
	try {
		if (Auth.isLoggedIn()) {
			const token: string | null = Auth.getToken();
			return await fetch('/api/user/user', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});
		}
	} catch (err) {
		console.log('there was an error querying single user: ', err);
	}
};

export const getAllUsers = async () => {
	try {
		return await fetch('/api/user/users', {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (err) {
		console.log('there was an error querying single user: ', err);
	}
};

export const createUser = async (newUser: ICreateBody) => {
	try {
		return await fetch('/api/user/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		});
	} catch (err) {
		console.log('there was an error in creating a new users', err);
	}
};

interface ILoginBody {
	username: string;
	password: string;
}

export const login = async (newUser: ILoginBody) => {
	try {
		return await fetch('/api/user/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		});
	} catch (err) {
		console.log('there was an error in creating a new users', err);
	}
};

interface IAddSliceBody {
	username: string;
	quantity: number;
}

export const addSlices = async (addSlicesBundle: IAddSliceBody) => {
	const token = Auth.isLoggedIn() ? Auth.getToken() : null;
	try {
		if (token) {
			return await fetch('/api/user/addSlices', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(addSlicesBundle),
			});
		} else {
			console.log('invalid token, please sign in');
		}
	} catch (err) {
		console.log('there was an error in adding slices', err);
	}
};

export const createEntry = async (newEntryBody: IEntryBody | undefined) => {
	try {
		if (newEntryBody && newEntryBody?.imageFile) {
			const compressedImg = await compressImage(newEntryBody?.imageFile);
			const formData = new FormData();
			formData.append('quantity', String(newEntryBody?.quantity));
			formData.append('rating', String(newEntryBody?.rating));
			formData.append('user', newEntryBody?.user);
			if (compressedImg) {
				formData.append('imageFile', compressedImg);
			}
			return await fetch('/api/entries/', {
				method: 'POST',
				body: formData,
			});
		} else if (newEntryBody) {
			const formData = new FormData();
			formData.append('quantity', String(newEntryBody?.quantity));
			formData.append('rating', String(newEntryBody?.rating));
			formData.append('user', newEntryBody?.user);
			return await fetch('/api/entries/', {
				method: 'POST',
				body: formData,
			});
		}
	} catch (err) {
		console.log('there was an error in creating a new entry', err);
	}
};

export const getAllEntries = async () => {
	try {
		return await fetch('/api/entries/', {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (err) {
		console.log('there was an error in getting all entries', err);
	}
};

export const getLastTwentyEntries = async () => {
	try {
		return await fetch('/api/entries/recent', {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (err) {
		console.log('there was an error in getting last twenty entries', err);
	}
};

export const deleteEntry = async (_id: string) => {
	try {
		return await fetch('/api/entries/:id', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(_id),
		});
	} catch (err) {
		console.log('there was an error in deleting entry', err);
	}
};
