import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { AuthLayout } from './AuthLayout';

const OTP_EXPIRY = 5 * 60; // 5 min
const OTP_LENGTH = 6;

const VerifyEmailPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email;

	// Split OTP into individual digit inputs for UX
	const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
	const inputRefs = useRef([]);

	const [loading, setLoading] = useState(false);
	const [cooldown, setCooldown] = useState(30);
	const [canResend, setCanResend] = useState(false);
	const [otpExpiry, setOtpExpiry] = useState(OTP_EXPIRY);
	const [resending, setResending] = useState(false);

	const otp = digits.join('');

	useEffect(() => {
		if (!email) navigate('/auth/login', { replace: true });
	}, [email, navigate]);

	// Resend cooldown
	useEffect(() => {
		if (canResend || cooldown <= 0) {
			setCanResend(true);
			return;
		}
		const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
		return () => clearTimeout(t);
	}, [cooldown, canResend]);

	// OTP expiry
	useEffect(() => {
		if (otpExpiry <= 0) return;
		const t = setTimeout(() => setOtpExpiry((e) => e - 1), 1000);
		return () => clearTimeout(t);
	}, [otpExpiry]);

	const formatTime = (s) =>
		`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

	// ── Digit input handlers ──
	const handleDigit = (i, value) => {
		// Allow paste of full OTP
		if (value.length > 1) {
			const cleaned = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
			const newDigits = Array(OTP_LENGTH).fill('');
			cleaned.split('').forEach((c, idx) => {
				newDigits[idx] = c;
			});
			setDigits(newDigits);
			const nextFocus = Math.min(cleaned.length, OTP_LENGTH - 1);
			inputRefs.current[nextFocus]?.focus();
			return;
		}
		const clean = value.replace(/\D/g, '');
		const newDigits = [...digits];
		newDigits[i] = clean;
		setDigits(newDigits);
		if (clean && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
	};

	const handleKeyDown = (i, e) => {
		if (e.key === 'Backspace' && !digits[i] && i > 0) {
			inputRefs.current[i - 1]?.focus();
		}
		if (e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1]?.focus();
		if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1)
			inputRefs.current[i + 1]?.focus();
	};

	const handleVerify = async () => {
		if (otp.length < OTP_LENGTH) {
			toast.error('Enter the full 6-digit OTP');
			return;
		}
		if (otpExpiry <= 0) {
			toast.error('OTP expired. Please resend.');
			return;
		}
		setLoading(true);
		try {
			await api.post('/auth/verify-email', { email, otp });
			toast.success('Email verified! Welcome to InstaMakaan 🎉');
			navigate('/auth/login', { replace: true });
		} catch (err) {
			toast.error(err.response?.data?.detail || 'Invalid OTP');
			// Shake digits on error
			setDigits(Array(OTP_LENGTH).fill(''));
			inputRefs.current[0]?.focus();
		} finally {
			setLoading(false);
		}
	};

	const resendOtp = async () => {
		if (!canResend) return;
		setResending(true);
		try {
			await api.post('/auth/resend-otp', { email });
			toast.success('New OTP sent!');
			setCooldown(30);
			setCanResend(false);
			setOtpExpiry(OTP_EXPIRY);
			setDigits(Array(OTP_LENGTH).fill(''));
			inputRefs.current[0]?.focus();
		} catch (err) {
			toast.error(err.response?.data?.detail || 'Failed to resend OTP');
		} finally {
			setResending(false);
		}
	};

	const isExpiring = otpExpiry > 0 && otpExpiry < 60;
	const isExpired = otpExpiry <= 0;

	return (
		<>
			<Helmet>
				<title>Verify Email — InstaMakaan</title>
				<meta
					name="description"
					content="Verify your InstaMakaan account email with the OTP sent to your inbox."
				/>
				<meta name="robots" content="noindex, follow" />
			</Helmet>

			<AuthLayout>
				<div className="auth-card">
					{/* Icon header */}
					<div className="flex flex-col items-center mb-6 auth-fade-in stagger-1">
						<div className="verify-icon-ring">
							<ShieldCheck size={28} color="#2dd4bf" />
						</div>
						<h1 className="auth-title mt-4">Verify your email</h1>
						<p
							className="auth-subtitle"
							style={{ textAlign: 'center', marginTop: 4 }}
						>
							Enter the 6-digit code sent to
							<br />
							<strong style={{ color: '#f1f5f9' }}>{email}</strong>
						</p>
					</div>

					{/* OTP digit boxes */}
					<div className="otp-boxes auth-fade-in stagger-2">
						{digits.map((d, i) => (
							<input
								key={i}
								ref={(el) => (inputRefs.current[i] = el)}
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								maxLength={OTP_LENGTH} // allow paste
								className={`otp-box ${d ? 'filled' : ''}`}
								value={d}
								onChange={(e) => handleDigit(i, e.target.value)}
								onKeyDown={(e) => handleKeyDown(i, e)}
								onFocus={(e) => e.target.select()}
								autoFocus={i === 0}
								disabled={loading}
							/>
						))}
					</div>

					{/* Timer */}
					<div className="flex justify-center mt-4 mb-5 auth-fade-in stagger-3">
						{isExpired ? (
							<span className="timer-badge expiring">OTP expired</span>
						) : (
							<span className={`timer-badge ${isExpiring ? 'expiring' : ''}`}>
								<span className="timer-dot" />
								Expires in {formatTime(otpExpiry)}
							</span>
						)}
					</div>

					{/* Verify button */}
					<div className="auth-fade-in stagger-3">
						<button
							className="auth-btn"
							onClick={handleVerify}
							disabled={loading || isExpired || otp.length < OTP_LENGTH}
						>
							<span className="auth-btn-inner">
								{loading && <Loader2 size={16} className="spin" />}
								{loading ? 'Verifying…' : 'Verify Email'}
							</span>
						</button>
					</div>

					{/* Resend */}
					<div className="text-center mt-4 auth-fade-in stagger-4">
						{canResend ? (
							<button
								onClick={resendOtp}
								disabled={resending}
								className="resend-btn"
							>
								{resending ? (
									<span
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: 6,
										}}
									>
										<Loader2 size={13} className="spin" /> Sending…
									</span>
								) : (
									<span
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: 6,
										}}
									>
										<RotateCcw size={13} /> Resend OTP
									</span>
								)}
							</button>
						) : (
							<p
								style={{ fontSize: '0.78rem', color: 'rgba(100,116,139,0.7)' }}
							>
								Resend in{' '}
								<strong style={{ color: '#94a3b8' }}>{cooldown}s</strong>
							</p>
						)}
					</div>
				</div>
			</AuthLayout>

			<style>{`
				.auth-fade-in { animation: authEntrance 0.45s ease both; }

				.verify-icon-ring {
					width: 64px; height: 64px; border-radius: 20px;
					background: rgba(45,212,191,0.1);
					border: 1.5px solid rgba(45,212,191,0.25);
					display: flex; align-items: center; justify-content: center;
				}

				/* OTP boxes */
				.otp-boxes {
					display: flex; gap: 8px; justify-content: center;
				}
				.otp-box {
					width: 46px; height: 54px;
					border-radius: 12px;
					background: rgba(255,255,255,0.05);
					border: 1.5px solid rgba(255,255,255,0.10);
					color: #f1f5f9;
					font-size: 1.4rem;
					font-weight: 700;
					text-align: center;
					outline: none;
					caret-color: #2dd4bf;
					transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s;
					-webkit-appearance: none;
				}
				.otp-box:focus {
					border-color: rgba(45,212,191,0.7);
					background: rgba(45,212,191,0.06);
					box-shadow: 0 0 0 3px rgba(45,212,191,0.12);
					transform: scale(1.05);
				}
				.otp-box.filled {
					border-color: rgba(45,212,191,0.45);
					background: rgba(45,212,191,0.05);
				}
				.otp-box:disabled { opacity: 0.5; }

				@media (max-width: 400px) {
					.otp-box { width: 40px; height: 48px; font-size: 1.2rem; border-radius: 10px; }
					.otp-boxes { gap: 6px; }
				}

				.resend-btn {
					background: rgba(255,255,255,0.05);
					border: 1px solid rgba(255,255,255,0.10);
					border-radius: 10px;
					color: #2dd4bf;
					font-size: 0.8rem;
					font-weight: 600;
					padding: 7px 18px;
					cursor: pointer;
					transition: background 0.2s, border-color 0.2s;
				}
				.resend-btn:hover:not(:disabled) {
					background: rgba(45,212,191,0.08);
					border-color: rgba(45,212,191,0.3);
				}
				.resend-btn:disabled { opacity: 0.5; cursor: not-allowed; }
			`}</style>
		</>
	);
};

export default VerifyEmailPage;
