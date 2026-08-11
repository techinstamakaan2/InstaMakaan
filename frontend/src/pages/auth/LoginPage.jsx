import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Mail, AlertCircle, Loader2, RotateCcw, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from './AuthLayout';

const OTP_LENGTH = 6;
const OTP_EXPIRY = 5 * 60;

const LoginPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { requestLoginOtp, loginWithOtp, isAuthenticated, user, loading: authLoading } = useAuth();

	const from = location.state?.from?.pathname;

	// step: 'email' | 'otp'
	const [step, setStep] = useState('email');
	const [email, setEmail] = useState('');
	const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
	const inputRefs = useRef([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [cooldown, setCooldown] = useState(0);
	const [otpExpiry, setOtpExpiry] = useState(0);

	const otp = digits.join('');

	useEffect(() => {
		if (isAuthenticated && user && !authLoading) {
			redirectByRole(user.role);
		}
	}, [isAuthenticated, authLoading]);

	// Resend cooldown countdown
	useEffect(() => {
		if (cooldown <= 0) return;
		const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
		return () => clearTimeout(t);
	}, [cooldown]);

	// OTP expiry countdown
	useEffect(() => {
		if (otpExpiry <= 0) return;
		const t = setTimeout(() => setOtpExpiry((e) => e - 1), 1000);
		return () => clearTimeout(t);
	}, [otpExpiry]);

	const redirectByRole = (role) => {
		const map = { ADMIN: '/admin', OWNER: '/owner', AGENT: '/agent', USER: '/user/dashboard' };
		navigate(map[role] || from || '/user/dashboard', { replace: true });
	};

	const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

	// ── Step 1: send OTP ──────────────────────────────────────────────────────
	const handleSendOtp = async (e) => {
		e.preventDefault();
		setError('');
		if (!email.trim()) { setError('Please enter your email'); return; }
		setLoading(true);
		const result = await requestLoginOtp(email);
		if (result.success) {
			toast.success('OTP sent! Check your inbox.');
			setStep('otp');
			setCooldown(30);
			setOtpExpiry(OTP_EXPIRY);
			setDigits(Array(OTP_LENGTH).fill(''));
			setTimeout(() => inputRefs.current[0]?.focus(), 100);
		} else {
			setError(result.error);
		}
		setLoading(false);
	};

	// ── Step 2: verify OTP ───────────────────────────────────────────────────
	const handleVerifyOtp = async () => {
		if (otp.length < OTP_LENGTH) { toast.error('Enter the full 6-digit code'); return; }
		if (otpExpiry <= 0) { toast.error('OTP expired. Please resend.'); return; }
		setLoading(true);
		setError('');
		const result = await loginWithOtp(email, otp);
		if (result.success) {
			toast.success('Welcome back!');
			redirectByRole(result.user.role);
		} else {
			setError(result.error);
			setDigits(Array(OTP_LENGTH).fill(''));
			inputRefs.current[0]?.focus();
		}
		setLoading(false);
	};

	const handleResend = async () => {
		if (cooldown > 0) return;
		setLoading(true);
		const result = await requestLoginOtp(email);
		if (result.success) {
			toast.success('New OTP sent!');
			setCooldown(30);
			setOtpExpiry(OTP_EXPIRY);
			setDigits(Array(OTP_LENGTH).fill(''));
			inputRefs.current[0]?.focus();
		} else {
			toast.error(result.error);
		}
		setLoading(false);
	};

	// ── OTP digit input handlers ──────────────────────────────────────────────
	const handleDigit = (i, value) => {
		if (value.length > 1) {
			const cleaned = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
			const newDigits = Array(OTP_LENGTH).fill('');
			cleaned.split('').forEach((c, idx) => { newDigits[idx] = c; });
			setDigits(newDigits);
			inputRefs.current[Math.min(cleaned.length, OTP_LENGTH - 1)]?.focus();
			return;
		}
		const clean = value.replace(/\D/g, '');
		const newDigits = [...digits];
		newDigits[i] = clean;
		setDigits(newDigits);
		if (clean && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
	};

	const handleKeyDown = (i, e) => {
		if (e.key === 'Backspace' && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
		if (e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1]?.focus();
		if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
		if (e.key === 'Enter' && otp.length === OTP_LENGTH) handleVerifyOtp();
	};

	if (authLoading)
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
				<Loader2 className="w-8 h-8 animate-spin text-teal-500" />
			</div>
		);

	const isExpired = otpExpiry <= 0 && step === 'otp';
	const isExpiring = otpExpiry > 0 && otpExpiry < 60;

	return (
		<>
			<Helmet>
				<title>Sign In — InstaMakaan</title>
				<meta name="description" content="Sign in to your InstaMakaan account." />
				<meta name="robots" content="noindex, follow" />
			</Helmet>

			<AuthLayout>
				<div className="auth-card">

					{/* ── Step 1: Email ── */}
					{step === 'email' && (
						<>
							<div className="mb-6 auth-fade-in stagger-1">
								<h1 className="auth-title">Welcome back</h1>
								<p className="auth-subtitle">Enter your email to receive a sign-in code</p>
							</div>

							{error && (
								<div className="auth-error">
									<AlertCircle size={15} />
									{error}
								</div>
							)}

							<form onSubmit={handleSendOtp}>
								<div className="auth-field auth-fade-in stagger-2">
									<label className="auth-label">Email</label>
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
											{loading ? 'Sending code…' : 'Send Sign-In Code'}
										</span>
									</button>
								</div>
							</form>

							<hr className="auth-divider" />
							<p className="auth-footer-text auth-fade-in stagger-5">
								Don't have an account?{' '}
								<Link to="/auth/register" className="auth-link">Sign up free</Link>
							</p>
						</>
					)}

					{/* ── Step 2: OTP ── */}
					{step === 'otp' && (
						<>
							<div className="flex flex-col items-center mb-6 auth-fade-in stagger-1">
								<h1 className="auth-title">Check your email</h1>
								<p className="auth-subtitle" style={{ textAlign: 'center', marginTop: 4 }}>
									We sent a 6-digit code to
									<br />
									<strong style={{ color: '#f1f5f9' }}>{email}</strong>
								</p>
							</div>

							{error && (
								<div className="auth-error">
									<AlertCircle size={15} />
									{error}
								</div>
							)}

							{/* OTP boxes */}
							<div className="otp-boxes auth-fade-in stagger-2">
								{digits.map((d, i) => (
									<input
										key={i}
										ref={(el) => (inputRefs.current[i] = el)}
										type="text"
										inputMode="numeric"
										pattern="[0-9]*"
										maxLength={OTP_LENGTH}
										className={`otp-box ${d ? 'filled' : ''}`}
										value={d}
										onChange={(e) => handleDigit(i, e.target.value)}
										onKeyDown={(e) => handleKeyDown(i, e)}
										onFocus={(e) => e.target.select()}
										disabled={loading}
									/>
								))}
							</div>

							{/* Timer */}
							<div className="flex justify-center mt-4 mb-5 auth-fade-in stagger-3">
								{isExpired ? (
									<span className="timer-badge expiring">Code expired</span>
								) : (
									<span className={`timer-badge ${isExpiring ? 'expiring' : ''}`}>
										<span className="timer-dot" />
										Expires in {formatTime(otpExpiry)}
									</span>
								)}
							</div>

							<div className="auth-fade-in stagger-3">
								<button
									className="auth-btn"
									onClick={handleVerifyOtp}
									disabled={loading || isExpired || otp.length < OTP_LENGTH}
								>
									<span className="auth-btn-inner">
										{loading && <Loader2 size={16} className="spin" />}
										{loading ? 'Verifying…' : 'Sign In'}
									</span>
								</button>
							</div>

							{/* Resend + back */}
							<div className="text-center mt-4 auth-fade-in stagger-4" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
								{cooldown > 0 ? (
									<p style={{ fontSize: '0.78rem', color: 'rgba(100,116,139,0.7)' }}>
										Resend in <strong style={{ color: '#94a3b8' }}>{cooldown}s</strong>
									</p>
								) : (
									<button onClick={handleResend} disabled={loading} className="resend-btn">
										<RotateCcw size={13} /> Resend Code
									</button>
								)}

								<button
									onClick={() => { setStep('email'); setError(''); setDigits(Array(OTP_LENGTH).fill('')); }}
									style={{
										background: 'none', border: 'none', cursor: 'pointer',
										color: '#64748b', fontSize: '0.78rem', display: 'flex',
										alignItems: 'center', gap: 5,
									}}
								>
									<ArrowLeft size={13} /> Change email
								</button>
							</div>
						</>
					)}
				</div>
			</AuthLayout>

			<style>{`
				.auth-fade-in { animation: authEntrance 0.45s ease both; }
				.otp-boxes { display: flex; gap: 8px; justify-content: center; }
				.otp-box {
					width: 46px; height: 54px; border-radius: 12px;
					background: rgba(255,255,255,0.05);
					border: 1.5px solid rgba(255,255,255,0.10);
					color: #f1f5f9; font-size: 1.4rem; font-weight: 700;
					text-align: center; outline: none; caret-color: #2dd4bf;
					transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s;
					-webkit-appearance: none;
				}
				.otp-box:focus {
					border-color: rgba(45,212,191,0.7);
					background: rgba(45,212,191,0.06);
					box-shadow: 0 0 0 3px rgba(45,212,191,0.12);
					transform: scale(1.05);
				}
				.otp-box.filled { border-color: rgba(45,212,191,0.45); background: rgba(45,212,191,0.05); }
				.otp-box:disabled { opacity: 0.5; }
				@media (max-width: 400px) {
					.otp-box { width: 40px; height: 48px; font-size: 1.2rem; border-radius: 10px; }
					.otp-boxes { gap: 6px; }
				}
				.resend-btn {
					background: rgba(255,255,255,0.05);
					border: 1px solid rgba(255,255,255,0.10);
					border-radius: 10px; color: #2dd4bf;
					font-size: 0.8rem; font-weight: 600;
					padding: 7px 18px; cursor: pointer;
					display: flex; align-items: center; gap: 6px;
					transition: background 0.2s, border-color 0.2s;
				}
				.resend-btn:hover:not(:disabled) {
					background: rgba(45,212,191,0.08);
					border-color: rgba(45,212,191,0.3);
				}
				.resend-btn:disabled { opacity: 0.5; cursor: not-allowed; }
				.timer-badge {
					display: inline-flex; align-items: center; gap: 6px;
					background: rgba(255,255,255,0.04);
					border: 1px solid rgba(255,255,255,0.08);
					border-radius: 20px; padding: 4px 12px;
					font-size: 0.78rem; color: #94a3b8; font-weight: 500;
				}
				.timer-badge.expiring { color: #f87171; border-color: rgba(248,113,113,0.2); }
				.timer-dot {
					width: 6px; height: 6px; border-radius: 50%;
					background: #2dd4bf; animation: pulse 1.2s ease infinite;
				}
				@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
			`}</style>
		</>
	);
};

export default LoginPage;
