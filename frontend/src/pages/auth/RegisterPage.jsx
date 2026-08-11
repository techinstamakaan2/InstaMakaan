import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Mail, User, Phone, AlertCircle, Loader2, Gift, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from './AuthLayout';
import api from '@/lib/api';

const RegisterPage = () => {
	const navigate  = useNavigate();
	const location  = useLocation();
	const { register, loading: authLoading } = useAuth();

	const [name,    setName]    = useState('');
	const [email,   setEmail]   = useState('');
	const [phone,   setPhone]   = useState('');
	const [refCode, setRefCode] = useState('');
	const [loading, setLoading] = useState(false);
	const [error,   setError]   = useState('');

	/* Referral lookup state */
	const [refStatus,   setRefStatus]   = useState('idle'); // idle | checking | valid | invalid
	const [referrerName, setReferrerName] = useState('');
	const debounceRef = useRef(null);

	/* Pre-fill from URL ?ref=CODE */
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const ref    = params.get('ref');
		if (ref) {
			const code = ref.toUpperCase();
			setRefCode(code);
			lookupCode(code);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const lookupCode = async (code) => {
		const trimmed = code.trim().toUpperCase();
		if (!trimmed) {
			setRefStatus('idle');
			setReferrerName('');
			return;
		}
		setRefStatus('checking');
		setReferrerName('');
		try {
			const r = await api.get(`/referrals/lookup?code=${encodeURIComponent(trimmed)}`);
			setReferrerName(r.data.name || '');
			setRefStatus('valid');
		} catch {
			setRefStatus('invalid');
			setReferrerName('');
		}
	};

	const handleRefCodeChange = (e) => {
		const val = e.target.value.toUpperCase();
		setRefCode(val);
		setRefStatus('idle');
		setReferrerName('');
		clearTimeout(debounceRef.current);
		if (val.trim().length >= 4) {
			debounceRef.current = setTimeout(() => lookupCode(val), 600);
		}
	};

	const clearRefCode = () => {
		setRefCode('');
		setRefStatus('idle');
		setReferrerName('');
		clearTimeout(debounceRef.current);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!name.trim() || !email.trim()) {
			setError('Please enter your name and email');
			return;
		}
		if (refCode.trim() && refStatus === 'invalid') {
			setError('The referral code you entered is invalid. Please check and try again.');
			return;
		}
		setLoading(true);
		const result = await register(name, email, '', phone, refCode.trim());
		if (result.success) {
			toast.success('Account created! Check your email for the OTP.');
			navigate('/auth/verify-email', { state: { email }, replace: true });
		} else {
			setError(result.error);
		}
		setLoading(false);
	};

	if (authLoading)
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ background: '#0a1628' }}>
				<Loader2 className="w-8 h-8 animate-spin text-teal-500" />
			</div>
		);

	const refBorderColor =
		refStatus === 'valid'   ? '#22c55e' :
		refStatus === 'invalid' ? '#ef4444' :
		'rgba(255,255,255,0.12)';

	return (
		<>
			<Helmet>
				<title>Create Account — InstaMakaan</title>
				<meta name="description" content="Create a free InstaMakaan account." />
				<meta name="robots" content="noindex, follow" />
			</Helmet>

			<AuthLayout>
				<div className="auth-card">
					<div className="mb-5 auth-fade-in stagger-1">
						<h1 className="auth-title">Create account</h1>
						<p className="auth-subtitle">We'll send a verification code to your email</p>
					</div>

					{error && (
						<div className="auth-error">
							<AlertCircle size={15} />
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit}>
						{/* Full Name */}
						<div className="auth-field auth-fade-in stagger-2">
							<label className="auth-label">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
							<div className="auth-input-wrap">
								<User size={15} className="auth-input-icon" />
								<input type="text" className="auth-input" placeholder="John Doe"
									value={name} onChange={(e) => setName(e.target.value)}
									autoComplete="name" autoFocus />
							</div>
						</div>

						{/* Email */}
						<div className="auth-field auth-fade-in stagger-2">
							<label className="auth-label">Email <span style={{ color: '#ef4444' }}>*</span></label>
							<div className="auth-input-wrap">
								<Mail size={15} className="auth-input-icon" />
								<input type="email" className="auth-input" placeholder="you@example.com"
									value={email} onChange={(e) => setEmail(e.target.value)}
									autoComplete="email" />
							</div>
						</div>

						{/* Phone */}
						<div className="auth-field auth-fade-in stagger-3">
							<label className="auth-label">
								Phone Number
								<span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: 6 }}>(optional)</span>
							</label>
							<div className="auth-input-wrap">
								<Phone size={15} className="auth-input-icon" />
								<input type="tel" className="auth-input" placeholder="+91 98765 43210"
									value={phone} onChange={(e) => setPhone(e.target.value)}
									autoComplete="tel" />
							</div>
						</div>

						{/* Referral Code */}
						<div className="auth-field auth-fade-in stagger-3">
							<label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
								<Gift size={13} color="#fbbf24" />
								Referral Code
								<span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: 2 }}>(optional)</span>
							</label>

							<div style={{ position: 'relative' }}>
								<div className="auth-input-wrap" style={{ border: `1.5px solid ${refBorderColor}`, borderRadius: 12, transition: 'border-color 0.2s' }}>
									<Gift size={15} className="auth-input-icon" color="#fbbf24" />
									<input
										type="text"
										className="auth-input"
										placeholder="Enter code e.g. ABC123"
										value={refCode}
										onChange={handleRefCodeChange}
										maxLength={12}
										style={{ letterSpacing: refCode ? '0.12em' : 0, fontWeight: refCode ? 700 : 400, textTransform: 'uppercase' }}
									/>
									{/* Status indicator */}
									<div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 6 }}>
										{refStatus === 'checking' && <Loader2 size={14} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />}
										{refStatus === 'valid'    && <CheckCircle2 size={14} color="#22c55e" />}
										{refStatus === 'invalid'  && <X size={14} color="#ef4444" />}
										{refCode && refStatus !== 'checking' && (
											<button type="button" onClick={clearRefCode}
												style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', opacity: 0.5 }}>
												<X size={12} color="#94a3b8" />
											</button>
										)}
									</div>
								</div>
							</div>

							{/* Referrer name banner */}
							{refStatus === 'valid' && referrerName && (
								<div style={{
									marginTop: 8, display: 'flex', alignItems: 'center', gap: 8,
									background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.25)',
									borderRadius: 10, padding: '9px 14px',
									animation: 'refSlideIn 0.3s ease',
								}}>
									<div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem', color: '#fff', flexShrink: 0 }}>
										{referrerName[0]}
									</div>
									<div>
										<div style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700 }}>
											{referrerName} invited you! 🎉
										</div>
										<div style={{ fontSize: '0.68rem', color: '#86efac', marginTop: 1 }}>
											You both earn rewards when you sign up
										</div>
									</div>
								</div>
							)}

							{refStatus === 'invalid' && refCode.trim() && (
								<div style={{
									marginTop: 8, display: 'flex', alignItems: 'center', gap: 7,
									background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.2)',
									borderRadius: 10, padding: '8px 14px',
								}}>
									<X size={13} color="#ef4444" />
									<span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 600 }}>
										Invalid referral code — please check and try again
									</span>
								</div>
							)}
						</div>

						<div className="auth-fade-in stagger-4">
							<button type="submit" className="auth-btn" disabled={loading}>
								<span className="auth-btn-inner">
									{loading && <Loader2 size={16} className="spin" />}
									{loading ? 'Sending OTP…' : 'Continue with Email OTP'}
								</span>
							</button>
						</div>
					</form>

					<hr className="auth-divider" />
					<p className="auth-footer-text auth-fade-in stagger-5">
						Already have an account?{' '}
						<Link to="/auth/login" className="auth-link">Sign in</Link>
					</p>
				</div>
			</AuthLayout>

			<style>{`
				.auth-fade-in { animation: authEntrance 0.45s ease both; }
				@keyframes refSlideIn {
					from { opacity: 0; transform: translateY(-6px); }
					to   { opacity: 1; transform: none; }
				}
				@keyframes spin { to { transform: rotate(360deg); } }
			`}</style>
		</>
	);
};

export default RegisterPage;
