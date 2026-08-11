import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { AuthLayout } from './AuthLayout';

const ResetPasswordPage = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);

	const requirements = [
		{ label: 'At least 6 characters', met: password.length >= 6 },
		{ label: 'Contains a number', met: /\d/.test(password) },
		{
			label: 'Passwords match',
			met: password === confirmPassword && password.length > 0,
		},
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}
		setLoading(true);
		try {
			await api.post('/auth/reset-password', { token, password });
			setDone(true);
			toast.success('Password reset successful!');
			setTimeout(() => navigate('/auth/login'), 2000);
		} catch (err) {
			toast.error(err.response?.data?.detail || 'Failed to reset password');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Reset Password — InstaMakaan</title>
				<meta
					name="description"
					content="Set a new password for your InstaMakaan account."
				/>
				<meta name="robots" content="noindex, follow" />
			</Helmet>

			<AuthLayout>
				<div className="auth-card">
					{done ? (
						<div className="auth-success">
							<div className="auth-success-icon">
								<CheckCircle2 size={26} color="#4ade80" />
							</div>
							<h2 className="auth-title" style={{ marginBottom: 8 }}>
								Password updated!
							</h2>
							<p
								style={{
									color: 'rgba(148,163,184,0.85)',
									fontSize: '0.82rem',
									marginBottom: 20,
								}}
							>
								Redirecting you to sign in…
							</p>
							<Link to="/auth/login" className="auth-link">
								Go to Sign In →
							</Link>
						</div>
					) : (
						<>
							<div className="mb-6 auth-fade-in stagger-1">
								<h1 className="auth-title">Set new password</h1>
								<p className="auth-subtitle">
									Choose a strong password for your account
								</p>
							</div>

							<form onSubmit={handleSubmit}>
								<div className="auth-field auth-fade-in stagger-2">
									<label className="auth-label">New Password</label>
									<div className="auth-input-wrap">
										<Lock size={15} className="auth-input-icon" />
										<input
											type={showPassword ? 'text' : 'password'}
											className="auth-input"
											style={{ paddingRight: '40px' }}
											placeholder="Min. 6 characters"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											autoFocus
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

								<div className="auth-field auth-fade-in stagger-3">
									<label className="auth-label">Confirm Password</label>
									<div className="auth-input-wrap">
										<Lock size={15} className="auth-input-icon" />
										<input
											type={showConfirm ? 'text' : 'password'}
											className="auth-input"
											style={{ paddingRight: '40px' }}
											placeholder="Repeat password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>
										<button
											type="button"
											className="auth-input-eye"
											onClick={() => setShowConfirm((p) => !p)}
											tabIndex={-1}
										>
											{showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
										</button>
									</div>
								</div>

								{/* Requirements */}
								{password.length > 0 && (
									<div className="flex flex-col gap-1 mb-4 auth-fade-in">
										{requirements.map((req, i) => (
											<div
												key={i}
												className={`pwd-req ${req.met ? 'met' : 'unmet'}`}
											>
												<div className="pwd-dot" />
												{req.label}
											</div>
										))}
									</div>
								)}

								<div className="auth-fade-in stagger-4">
									<button type="submit" className="auth-btn" disabled={loading}>
										<span className="auth-btn-inner">
											{loading && <Loader2 size={16} className="spin" />}
											{loading ? 'Updating…' : 'Reset Password'}
										</span>
									</button>
								</div>
							</form>

							<hr className="auth-divider" />
							<p className="auth-footer-text auth-fade-in stagger-5">
								<Link to="/auth/login" className="auth-link">
									← Back to Sign In
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

export default ResetPasswordPage;
