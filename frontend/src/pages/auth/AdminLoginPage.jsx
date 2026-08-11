import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from './AuthLayout';

const AdminLoginPage = () => {
	const navigate = useNavigate();
	const { login, isAuthenticated, user, loading: authLoading } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (isAuthenticated && user && !authLoading) {
			redirectByRole(user.role);
		}
	}, [isAuthenticated, authLoading]);

	const redirectByRole = (role) => {
		const map = { ADMIN: '/admin', OWNER: '/owner', AGENT: '/agent', USER: '/user/dashboard' };
		navigate(map[role] || '/admin', { replace: true });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!email || !password) {
			setError('Please enter email and password');
			return;
		}
		setLoading(true);
		const result = await login(email, password);
		if (result.success) {
			toast.success('Welcome back!');
			redirectByRole(result.user.role);
		} else {
			setError(result.error || 'Invalid credentials');
		}
		setLoading(false);
	};

	if (authLoading)
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
				<Loader2 className="w-8 h-8 animate-spin text-teal-500" />
			</div>
		);

	return (
		<>
			<Helmet>
				<title>Staff Login — InstaMakaan</title>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>

			<AuthLayout>
				<div className="auth-card">
					<div className="mb-6 auth-fade-in stagger-1">
						{/* Staff badge */}
						<div style={{
							display: 'inline-flex', alignItems: 'center', gap: 6,
							background: 'rgba(251,191,36,0.08)',
							border: '1px solid rgba(251,191,36,0.25)',
							borderRadius: 20, padding: '4px 12px', marginBottom: 16,
						}}>
							<ShieldCheck size={13} color="#fbbf24" />
							<span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700, letterSpacing: 0.5 }}>
								STAFF ACCESS
							</span>
						</div>

						<h1 className="auth-title">Staff Login</h1>
						<p className="auth-subtitle">Admin · Owner · Agent</p>
					</div>

					{error && (
						<div className="auth-error">
							<AlertCircle size={15} />
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit}>
						<div className="auth-field auth-fade-in stagger-2">
							<label className="auth-label">Email</label>
							<div className="auth-input-wrap">
								<Mail size={15} className="auth-input-icon" />
								<input
									type="email"
									className="auth-input"
									placeholder="admin@instamakaan.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									autoComplete="email"
									autoFocus
								/>
							</div>
						</div>

						<div className="auth-field auth-fade-in stagger-3">
							<label className="auth-label">Password</label>
							<div className="auth-input-wrap">
								<Lock size={15} className="auth-input-icon" />
								<input
									type={showPassword ? 'text' : 'password'}
									className="auth-input"
									style={{ paddingRight: '40px' }}
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="current-password"
								/>
								<button
									type="button"
									className="auth-input-eye"
									onClick={() => setShowPassword((p) => !p)}
									tabIndex={-1}
								>
									{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
								</button>
							</div>
						</div>

						<div className="auth-fade-in stagger-4">
							<button type="submit" className="auth-btn" disabled={loading}>
								<span className="auth-btn-inner">
									{loading && <Loader2 size={16} className="spin" />}
									{loading ? 'Signing in…' : 'Sign In'}
								</span>
							</button>
						</div>
					</form>

					<hr className="auth-divider" />
					<p className="auth-footer-text auth-fade-in stagger-5" style={{ textAlign: 'center' }}>
						Not staff?{' '}
						<a href="/auth/login" className="auth-link">User login →</a>
					</p>
				</div>
			</AuthLayout>

			<style>{`.auth-fade-in { animation: authEntrance 0.45s ease both; }`}</style>
		</>
	);
};

export default AdminLoginPage;
