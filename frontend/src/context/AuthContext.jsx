import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react';
import api, { setMemToken, clearMemToken } from '@/lib/api';

const USER_KEY    = 'instamakaan_user';
const REFRESH_KEY = 'instamakaan_rt';   // refresh token in localStorage (non-sensitive, 7-day expiry)

const AuthContext = createContext(null);

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};

const decodeJWT = (token) => {
	try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
};

export const AuthProvider = ({ children }) => {
	const [user, setUser]       = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError]     = useState(null);

	/* ── LOGOUT ── */
	const logout = useCallback(async () => {
		try { await api.post('/auth/logout'); } catch {}
		clearMemToken();
		localStorage.removeItem(USER_KEY);
		localStorage.removeItem(REFRESH_KEY);
		setUser(null);
	}, []);

	/* ── 401 INTERCEPTOR — try refresh before logging out ── */
	useEffect(() => {
		const id = api.interceptors.response.use(
			(res) => res,
			async (err) => {
				const status = err.response?.status;
				const url    = err.config?.url || '';

				// Don't retry on auth endpoints themselves to avoid loops
				if (status === 401 && !url.includes('/auth/')) {
					const refreshed = await _tryRefresh();
					if (refreshed) {
						// Retry original request with new token
						err.config.headers['Authorization'] = `Bearer ${refreshed}`;
						return api(err.config);
					}
					logout();
				}
				return Promise.reject(err);
			},
		);
		return () => api.interceptors.response.eject(id);
	}, [logout]);

	/* ── SILENT REFRESH HELPER ── */
	const _tryRefresh = async () => {
		const rt = localStorage.getItem(REFRESH_KEY);
		if (!rt) return null;
		try {
			const r = await api.post('/auth/refresh', { refresh_token: rt });
			const newAccess = r.data.access_token;
			if (newAccess) { setMemToken(newAccess); return newAccess; }
		} catch {}
		return null;
	};

	/* ── INIT — restore session on page refresh ── */
	useEffect(() => {
		const storedUser = localStorage.getItem(USER_KEY);
		if (!storedUser) { setLoading(false); return; }

		// Try /auth/me first (reads httpOnly access_token cookie)
		api.get('/auth/me')
			.then((res) => {
				setMemToken(res.data.access_token);
				const userObj = {
					email:          res.data.email,
					role:           res.data.role,
					name:           res.data.name || '',
					phone:          res.data.phone || '',
					referral_code:  res.data.referral_code || '',
					wallet_balance: res.data.wallet_balance || 0,
				};
				localStorage.setItem(USER_KEY, JSON.stringify(userObj));
				setUser(userObj);
			})
			.catch(async () => {
				// /auth/me failed (access token expired) — try refresh token
				const newAccess = await _tryRefresh();
				if (newAccess) {
					// Now call /auth/me again with fresh access token in header
					try {
						const res2 = await api.get('/auth/me', {
							headers: { Authorization: `Bearer ${newAccess}` },
						});
						setMemToken(res2.data.access_token || newAccess);
						const userObj = {
							email:          res2.data.email,
							role:           res2.data.role,
							name:           res2.data.name || '',
							phone:          res2.data.phone || '',
							referral_code:  res2.data.referral_code || '',
							wallet_balance: res2.data.wallet_balance || 0,
						};
						// Also restore from localStorage as fallback for missing fields
						const stored = JSON.parse(storedUser || '{}');
						const merged = { ...stored, ...userObj };
						localStorage.setItem(USER_KEY, JSON.stringify(merged));
						setUser(merged);
						return;
					} catch {}
				}
				// Both /auth/me and refresh failed — restore from localStorage
				// so user isn't logged out just because backend is slow / offline
				try {
					const stored = JSON.parse(storedUser);
					if (stored?.email) {
						setUser(stored); // keep showing user; next API call will re-auth
						return;
					}
				} catch {}
				// Final fallback: clear session
				localStorage.removeItem(USER_KEY);
				localStorage.removeItem(REFRESH_KEY);
				setUser(null);
			})
			.finally(() => setLoading(false));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/* ── SHARED USER STORE HELPER ── */
	const _storeSession = (userData, access_token, refresh_token) => {
		setMemToken(access_token);
		if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
		localStorage.setItem(USER_KEY, JSON.stringify(userData));
		setUser(userData);
	};

	/* ── LOGIN (password — admin/owner/agent) ── */
	const login = async (email, password) => {
		setError(null); setLoading(true);
		try {
			const isAdmin  = email === 'admin@instamakaan.com';
			const endpoint = isAdmin ? '/auth/admin/auth/login' : '/auth/login';
			const res      = await api.post(endpoint, { email, password });
			const { access_token, refresh_token, email_verified } = res.data;

			if (email_verified === false) {
				return { success: false, error: 'Please verify your email before logging in', needsVerification: true };
			}
			if (!access_token) throw new Error('Invalid login response');

			const decoded = decodeJWT(access_token);
			const userObj = {
				email, role: decoded?.role || 'USER',
				name: res.data.name || '', phone: res.data.phone || '',
				referral_code: res.data.referral_code || '', wallet_balance: res.data.wallet_balance || 0,
			};
			_storeSession(userObj, access_token, refresh_token);
			return { success: true, user: userObj };
		} catch (err) {
			return { success: false, error: _extractError(err, 'Invalid credentials') };
		} finally { setLoading(false); }
	};

	/* ── REQUEST LOGIN OTP ── */
	const requestLoginOtp = async (email) => {
		try { await api.post('/auth/request-login-otp', { email }); return { success: true }; }
		catch (err) { return { success: false, error: _extractError(err, 'Failed to send OTP') }; }
	};

	/* ── LOGIN WITH OTP ── */
	const loginWithOtp = async (email, otp) => {
		setError(null); setLoading(true);
		try {
			const res = await api.post('/auth/login-otp', { email, otp });
			const { access_token, refresh_token } = res.data;
			const decoded = decodeJWT(access_token);
			const userObj = {
				email, role: decoded?.role || 'USER',
				name: res.data.name || '', phone: res.data.phone || '',
				referral_code: res.data.referral_code || '', wallet_balance: res.data.wallet_balance || 0,
			};
			_storeSession(userObj, access_token, refresh_token);
			return { success: true, user: userObj };
		} catch (err) {
			return { success: false, error: _extractError(err, 'Invalid OTP') };
		} finally { setLoading(false); }
	};

	/* ── REGISTER ── */
	const register = async (name, email, password, phone = '', refCode = '') => {
		setError(null); setLoading(true);
		try {
			await api.post('/auth/register', { name, email, phone, ref_code: refCode });
			return { success: true };
		} catch (err) {
			const msg = _extractError(err, 'Registration failed');
			setError(msg);
			return { success: false, error: msg };
		} finally { setLoading(false); }
	};

	const _extractError = (err, fallback) => {
		const data = err.response?.data;
		if (!data) return fallback;
		if (typeof data.message === 'string') return data.message;
		if (typeof data.detail  === 'string') return data.detail;
		if (Array.isArray(data.detail)) return data.detail[0]?.msg || fallback;
		return fallback;
	};

	const authFetch = useCallback(async (url, options = {}) => {
		try {
			return await api({ url, method: options.method || 'GET', data: options.body || null, headers: options.headers || {} });
		} catch (err) {
			if (err.response?.status === 401) logout();
			throw err;
		}
	}, [logout]);

	return (
		<AuthContext.Provider value={{
			user, loading, error,
			isAuthenticated: !!user,
			isAdmin:  user?.role === 'ADMIN',
			isOwner:  user?.role === 'OWNER',
			isAgent:  user?.role === 'AGENT',
			isUser:   user?.role === 'USER',
			login, register, requestLoginOtp, loginWithOtp, logout, authFetch,
		}}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
