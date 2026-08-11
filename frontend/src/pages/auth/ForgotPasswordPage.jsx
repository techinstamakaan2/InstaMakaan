import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { AuthLayout } from './AuthLayout';

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!email) {
			setError('Please enter your email');
			return;
		}
		setLoading(true);
		try {
			await api.post('/auth/forgot-password', { email });
			setSent(true);
			toast.success('Reset link sent!');
		} catch (err) {
			setError(err.response?.data?.detail || 'Failed to send reset link');
			toast.error('Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Forgot Password — InstaMakaan</title>
				<meta
					name="description"
					content="Reset your InstaMakaan account password. Enter your email to receive a secure password reset link."
				/>
				<meta name="robots" content="noindex, follow" />
			</Helmet>

			<AuthLayout>
				<div className="auth-card">
					{sent ? (
						<div className="auth-success">
							<div className="auth-success-icon">
								<CheckCircle2 size={26} color="#4ade80" />
							</div>
							<h2 className="auth-title" style={{ marginBottom: 8 }}>
								Check your inbox
							</h2>
							<p
								style={{
									color: 'rgba(148,163,184,0.85)',
									fontSize: '0.82rem',
									marginBottom: 20,
									lineHeight: 1.6,
								}}
							>
								We've sent a password reset link to{' '}
								<strong style={{ color: '#f1f5f9' }}>{email}</strong>. Check
								your spam folder if you don't see it.
							</p>
							<Link
								to="/auth/login"
								className="auth-btn"
								style={{
									display: 'inline-block',
									textDecoration: 'none',
									textAlign: 'center',
									padding: '10px 28px',
									width: 'auto',
								}}
							>
								Back to Sign In
							</Link>
						</div>
					) : (
						<>
							<div className="mb-6 auth-fade-in stagger-1">
								<h1 className="auth-title">Forgot password?</h1>
								<p className="auth-subtitle">
									We'll send a reset link to your email
								</p>
							</div>

							{error && (
								<div className="auth-error">
									<AlertCircle size={15} />
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit}>
								<div className="auth-field auth-fade-in stagger-2">
									<label className="auth-label">Email address</label>
									<div className="auth-input-wrap">
										<Mail size={15} className="auth-input-icon" />
										<input
											type="email"
											className="auth-input"
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											autoComplete="email"
											autoFocus
										/>
									</div>
								</div>

								<div className="auth-fade-in stagger-3">
									<button type="submit" className="auth-btn" disabled={loading}>
										<span className="auth-btn-inner">
											{loading && <Loader2 size={16} className="spin" />}
											{loading ? 'Sending…' : 'Send Reset Link'}
										</span>
									</button>
								</div>
							</form>

							<hr className="auth-divider" />
							<p className="auth-footer-text auth-fade-in stagger-4">
								Remember it?{' '}
								<Link to="/auth/login" className="auth-link">
									Sign in
								</Link>
							</p>
						</>
					)}
				</div>
			</AuthLayout>

			<style>{`.auth-fade-in { animation: authEntrance 0.45s ease both; }`}</style>
		</>
	);
};

export default ForgotPasswordPage;
