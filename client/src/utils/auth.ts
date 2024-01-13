import LogRocket from 'logrocket';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { IPayload } from '../types';

class AuthService {
	// Returns jwt from local storage
	getToken = () => {
		return localStorage.getItem('token');
	};

	// Returns profile of user in token
	getProfile = () => {
		const token: string | null = this.getToken();
		if (token) {
			try {
				const decoded: IPayload = jwtDecode(token);
				return decoded;
			} catch (err: any) {
				if (process.env.NODE_ENV === 'production') {
					LogRocket.captureException(err);
				} else {
					console.error('Invalid token format');
				}
				return null;
			}
		}
		return null;
	};

	// Checks if token in parameter is expired
	isTokenExpired = (token: string): boolean | null => {
		try {
			const decoded = jwtDecode(token);
			if (decoded && decoded.exp) {
				return Date.now() >= decoded.exp * 1000;
			} else {
				return true;
			}
		} catch (err: any) {
			if (process.env.NODE_ENV === 'production') {
				LogRocket.captureException(err);
			} else {
				console.error('Invalid token format');
			}

			return true;
		}
	};

	// Checks if user's token is still valid and present
	isLoggedIn = () => {
		const token = this.getToken();
		return token !== null && !this.isTokenExpired(token);
	};

	// Stores signed token from login in local storage
	login = (token: string) => {
		localStorage.setItem('token', token);
	};

	// Removes user's token from local storage - functionally logging them out
	logout = () => {
		localStorage.removeItem('token');
	};
}

const Auth = new AuthService();

export default Auth;
