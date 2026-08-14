import axios from 'axios';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'https://instamakaan-website.onrender.com/api',
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});
api.defaults.baseURL = api.defaults.baseURL.replace(/\/$/, '');

// In-memory token — NOT in localStorage so XSS cannot read it via localStorage.getItem()
// Cleared automatically on page refresh (unlike localStorage which persists)
let _memToken = null;
export const setMemToken = (t) => { _memToken = t; };
export const clearMemToken = () => { _memToken = null; };

api.interceptors.request.use(
	(config) => {
		if (_memToken) {
			config.headers.Authorization = `Bearer ${_memToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

export default api;
