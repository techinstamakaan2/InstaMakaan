// AuthLayout.jsx — light by default, dark mode via .dark class on <html> OR prefers-color-scheme
import React from 'react';
import { Link } from 'react-router-dom';
import CustomIcon from '@/components/CustomIcon';

export const AuthLayout = ({ children }) => (
	<>
		<div className="auth-shell">
			{/* Background layers */}
			<div className="auth-bg" />
			<div className="auth-mesh" />

			{/* Soft floating orbs */}
			<div className="orb orb-1" />
			<div className="orb orb-2" />

			{/* Card container */}
			<div className="auth-card-wrap">
				{/* Logo */}
				<div className="auth-logo">
					<Link to="/" className="auth-logo-link group">
						<div className="logo-icon-ring">
							<CustomIcon src="/images/orglogo.webp" className="h-10 w-10" alt="InstaMakaan" />
						</div>
						<div className="logo-text">
							<p className="logo-insta">Insta</p>
							<p className="logo-makaan">Makaan</p>
						</div>
					</Link>
				</div>

				{children}

				<div className="auth-back">
					<Link to="/" className="auth-back-link">← Back to Home</Link>
				</div>
			</div>
		</div>

		<style>{`
			/* ═══════════════════════════════
			   LIGHT MODE (default)
			═══════════════════════════════ */

			.auth-shell {
				position: relative;
				min-height: 100vh;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
				padding: 40px 16px;
			}

			.auth-bg {
				position: absolute; inset: 0; z-index: 0;
				background: linear-gradient(150deg, #f0fdfa 0%, #f8fafc 50%, #eff6ff 100%);
			}
			.auth-mesh {
				position: absolute; inset: 0; z-index: 0;
				background:
					radial-gradient(ellipse 65% 55% at 5% 10%,  rgba(20,184,166,0.14) 0%, transparent 60%),
					radial-gradient(ellipse 55% 45% at 95% 90%, rgba(16,185,129,0.10) 0%, transparent 55%),
					radial-gradient(ellipse 40% 50% at 80% 5%,  rgba(56,189,248,0.08) 0%, transparent 55%);
			}

			.orb {
				position: absolute;
				border-radius: 50%;
				pointer-events: none;
				z-index: 0;
				animation: orbFloat 9s ease-in-out infinite;
			}
			.orb-1 {
				width: 400px; height: 400px;
				background: radial-gradient(circle, rgba(20,184,166,0.16), transparent 70%);
				filter: blur(80px);
				top: -120px; left: -120px; opacity: 0.9;
			}
			.orb-2 {
				width: 300px; height: 300px;
				background: radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%);
				filter: blur(70px);
				bottom: -80px; right: -60px; opacity: 0.8;
				animation-delay: 4.5s;
			}
			@keyframes orbFloat {
				0%,100% { transform: translate(0,0) scale(1); }
				40%      { transform: translate(18px,-22px) scale(1.04); }
				70%      { transform: translate(-12px,12px) scale(0.97); }
			}

			/* Card wrap */
			.auth-card-wrap {
				position: relative; z-index: 10;
				width: 100%; max-width: 420px;
				animation: authEntrance 0.5s cubic-bezier(.22,.68,0,1.2) both;
			}
			@keyframes authEntrance {
				from { opacity: 0; transform: translateY(24px) scale(0.97); }
				to   { opacity: 1; transform: translateY(0) scale(1); }
			}

			/* Logo */
			.auth-logo { text-align: center; margin-bottom: 24px; }
			.auth-logo-link { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
			.logo-icon-ring {
				padding: 8px; border-radius: 14px;
				background: #fff;
				border: 1.5px solid rgba(20,184,166,0.2);
				box-shadow: 0 2px 12px rgba(20,184,166,0.10);
				transition: all 0.2s;
			}
			.group:hover .logo-icon-ring {
				border-color: rgba(20,184,166,0.5);
				box-shadow: 0 4px 20px rgba(20,184,166,0.20);
			}
			.logo-text { text-align: left; line-height: 1; }
			.logo-insta  { font-size: 1.25rem; font-weight: 900; color: #0d9488; letter-spacing: -0.02em; margin: 0; }
			.logo-makaan { font-size: 1.25rem; font-weight: 900; color: #d97706; letter-spacing: -0.02em; margin-top: -2px; }

			/* Auth card */
			.auth-card {
				background: #ffffff;
				border: 1.5px solid rgba(20,184,166,0.14);
				border-radius: 24px;
				box-shadow:
					0 2px 4px rgba(0,0,0,0.03),
					0 12px 40px rgba(0,0,0,0.07),
					0 0 0 1px rgba(20,184,166,0.04) inset;
				padding: 32px;
				color: #1e293b;
			}
			@media (max-width: 480px) {
				.auth-card { padding: 24px 20px; border-radius: 20px; }
			}

			/* Typography */
			.auth-title {
				font-size: 1.45rem; font-weight: 800;
				letter-spacing: -0.025em; color: #0f172a; line-height: 1.2;
			}
			.auth-subtitle { font-size: 0.8rem; color: #64748b; margin-top: 4px; }

			/* Fields */
			.auth-field { margin-bottom: 14px; }
			.auth-label {
				display: block; font-size: 0.7rem; font-weight: 700;
				color: #475569; text-transform: uppercase;
				letter-spacing: 0.07em; margin-bottom: 6px;
			}
			.auth-input-wrap { position: relative; }
			.auth-input-icon {
				position: absolute; left: 12px; top: 50%;
				transform: translateY(-50%); color: #94a3b8; pointer-events: none;
			}
			.auth-input {
				width: 100%;
				padding: 10px 14px 10px 38px;
				border-radius: 11px;
				background: #f8fafc;
				border: 1.5px solid #e2e8f0;
				color: #0f172a; font-size: 0.875rem;
				outline: none;
				transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
				-webkit-appearance: none;
			}
			.auth-input::placeholder { color: #94a3b8; }
			.auth-input:focus {
				border-color: #14b8a6; background: #fff;
				box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
			}
			.auth-input.no-icon { padding-left: 14px; }
			.auth-input-eye {
				position: absolute; right: 12px; top: 50%;
				transform: translateY(-50%);
				background: none; border: none; cursor: pointer;
				color: #94a3b8; transition: color 0.15s; padding: 2px;
			}
			.auth-input-eye:hover { color: #475569; }

			/* Error */
			.auth-error {
				display: flex; align-items: center; gap: 8px;
				padding: 10px 14px;
				background: #fef2f2; border: 1px solid #fecaca;
				border-radius: 11px; color: #dc2626;
				font-size: 0.8rem; margin-bottom: 14px;
				animation: authEntrance 0.3s ease both;
			}

			/* Success */
			.auth-success { text-align: center; padding: 16px 0; animation: authEntrance 0.4s ease both; }
			.auth-success-icon {
				width: 56px; height: 56px; border-radius: 50%;
				background: #f0fdf4; border: 2px solid #bbf7d0;
				display: flex; align-items: center; justify-content: center;
				margin: 0 auto 14px;
			}

			/* Button */
			.auth-btn {
				width: 100%; padding: 11px 20px; border-radius: 12px;
				background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
				color: #fff; font-weight: 700; font-size: 0.875rem;
				border: none; cursor: pointer;
				position: relative; overflow: hidden;
				transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
				box-shadow: 0 3px 16px rgba(13,148,136,0.28);
				letter-spacing: 0.01em; margin-top: 4px;
				display: block; text-decoration: none; text-align: center;
			}
			.auth-btn::after {
				content: ''; position: absolute; inset: 0;
				background: linear-gradient(135deg, rgba(255,255,255,0.14), transparent 60%);
				opacity: 0; transition: opacity 0.2s;
			}
			.auth-btn:hover:not(:disabled)::after { opacity: 1; }
			.auth-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(13,148,136,0.36); }
			.auth-btn:active:not(:disabled) { transform: translateY(0); }
			.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
			.auth-btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }

			/* Links */
			.auth-link { color: #0d9488; font-weight: 600; text-decoration: none; transition: color 0.15s; }
			.auth-link:hover { color: #0f766e; }
			.auth-divider { border: none; border-top: 1px solid #f1f5f9; margin: 18px 0 14px; }
			.auth-footer-text { font-size: 0.8rem; color: #64748b; text-align: center; }

			/* Password reqs */
			.pwd-req { display: flex; align-items: center; gap: 7px; font-size: 0.72rem; transition: color 0.2s; }
			.pwd-req.met   { color: #16a34a; }
			.pwd-req.unmet { color: #94a3b8; }
			.pwd-dot { width: 6px; height: 6px; border-radius: 50%; transition: background 0.2s, transform 0.2s; flex-shrink: 0; }
			.pwd-req.met   .pwd-dot { background: #16a34a; transform: scale(1.3); }
			.pwd-req.unmet .pwd-dot { background: #cbd5e1; }

			/* Timer badge */
			.timer-badge {
				display: inline-flex; align-items: center; gap: 6px;
				padding: 4px 12px; border-radius: 999px;
				background: #f1f5f9; border: 1px solid #e2e8f0;
				font-size: 0.74rem; font-weight: 600; color: #64748b; transition: all 0.3s;
			}
			.timer-badge.expiring { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
			.timer-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: timerPulse 1s ease-in-out infinite; }
			@keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:0.25} }

			/* Back link */
			.auth-back { text-align: center; margin-top: 18px; }
			.auth-back-link { font-size: 0.75rem; color: #94a3b8; text-decoration: none; transition: color 0.15s; }
			.auth-back-link:hover { color: #0d9488; }

			/* Spin */
			@keyframes spin { to { transform: rotate(360deg); } }
			.spin { animation: spin 0.7s linear infinite; }

			/* Stagger */
			.auth-fade-in { animation: authEntrance 0.45s ease both; }
			.stagger-1 { animation-delay: 0.05s; }
			.stagger-2 { animation-delay: 0.10s; }
			.stagger-3 { animation-delay: 0.15s; }
			.stagger-4 { animation-delay: 0.20s; }
			.stagger-5 { animation-delay: 0.25s; }


			/* ═══════════════════════════════
			   DARK MODE
			   — triggered by .dark on <html>
			   — OR system prefers-color-scheme
			═══════════════════════════════ */

			@media (prefers-color-scheme: dark) { .auth-bg { background: linear-gradient(150deg,#0f1e2e 0%,#0a1628 50%,#0d1f1a 100%); } }
			:is(.dark) .auth-bg        { background: linear-gradient(150deg,#0f1e2e 0%,#0a1628 50%,#0d1f1a 100%); }

			@media (prefers-color-scheme: dark) { .auth-mesh { background: radial-gradient(ellipse 70% 50% at 10% 20%,rgba(20,184,166,0.18) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 90% 80%,rgba(251,191,36,0.10) 0%,transparent 55%),radial-gradient(ellipse 40% 40% at 50% 50%,rgba(56,189,248,0.08) 0%,transparent 60%); } }
			:is(.dark) .auth-mesh      { background: radial-gradient(ellipse 70% 50% at 10% 20%,rgba(20,184,166,0.18) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 90% 80%,rgba(251,191,36,0.10) 0%,transparent 55%),radial-gradient(ellipse 40% 40% at 50% 50%,rgba(56,189,248,0.08) 0%,transparent 60%); }

			@media (prefers-color-scheme: dark) { .orb-1 { background: radial-gradient(circle,rgba(20,184,166,0.28),transparent 70%); } .orb-2 { background: radial-gradient(circle,rgba(251,191,36,0.16),transparent 70%); } }
			:is(.dark) .orb-1 { background: radial-gradient(circle,rgba(20,184,166,0.28),transparent 70%); }
			:is(.dark) .orb-2 { background: radial-gradient(circle,rgba(251,191,36,0.16),transparent 70%); }

			@media (prefers-color-scheme: dark) { .logo-icon-ring { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.10); box-shadow: none; } .logo-insta { color: #2dd4bf; } .logo-makaan { color: #fbbf24; } }
			:is(.dark) .logo-icon-ring { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.10); box-shadow: none; }
			:is(.dark) .logo-insta     { color: #2dd4bf; }
			:is(.dark) .logo-makaan    { color: #fbbf24; }

			@media (prefers-color-scheme: dark) { .auth-card { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.09); box-shadow: 0 32px 80px rgba(0,0,0,0.45),0 0 0 1px rgba(20,184,166,0.06) inset; color: #f1f5f9; } .auth-title { color: #f8fafc; } .auth-subtitle { color: rgba(148,163,184,0.9); } .auth-label { color: rgba(148,163,184,0.85); } }
			:is(.dark) .auth-card      { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.09); box-shadow: 0 32px 80px rgba(0,0,0,0.45),0 0 0 1px rgba(20,184,166,0.06) inset; color: #f1f5f9; }
			:is(.dark) .auth-title     { color: #f8fafc; }
			:is(.dark) .auth-subtitle  { color: rgba(148,163,184,0.9); }
			:is(.dark) .auth-label     { color: rgba(148,163,184,0.85); }

			@media (prefers-color-scheme: dark) { .auth-input { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.10); color: #f1f5f9; } .auth-input::placeholder { color: rgba(100,116,139,0.6); } .auth-input:focus { border-color: rgba(20,184,166,0.6); background: rgba(20,184,166,0.05); box-shadow: 0 0 0 3px rgba(20,184,166,0.12); } .auth-input-icon,.auth-input-eye { color: rgba(100,116,139,0.7); } .auth-input-eye:hover { color: #94a3b8; } }
			:is(.dark) .auth-input     { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.10); color: #f1f5f9; }
			:is(.dark) .auth-input::placeholder { color: rgba(100,116,139,0.6); }
			:is(.dark) .auth-input:focus { border-color: rgba(20,184,166,0.6); background: rgba(20,184,166,0.05); box-shadow: 0 0 0 3px rgba(20,184,166,0.12); }
			:is(.dark) .auth-input-icon,:is(.dark) .auth-input-eye { color: rgba(100,116,139,0.7); }
			:is(.dark) .auth-input-eye:hover { color: #94a3b8; }

			@media (prefers-color-scheme: dark) { .auth-error { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); color: #fca5a5; } .auth-success-icon { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.3); } }
			:is(.dark) .auth-error         { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); color: #fca5a5; }
			:is(.dark) .auth-success-icon  { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.3); }

			@media (prefers-color-scheme: dark) { .auth-link { color: #2dd4bf; } .auth-link:hover { color: #5eead4; } .auth-divider { border-color: rgba(255,255,255,0.07); } .auth-footer-text { color: rgba(100,116,139,0.8); } }
			:is(.dark) .auth-link          { color: #2dd4bf; }
			:is(.dark) .auth-link:hover    { color: #5eead4; }
			:is(.dark) .auth-divider       { border-color: rgba(255,255,255,0.07); }
			:is(.dark) .auth-footer-text   { color: rgba(100,116,139,0.8); }

			@media (prefers-color-scheme: dark) { .pwd-req.met { color: #4ade80; } .pwd-req.unmet { color: rgba(100,116,139,0.55); } .pwd-req.met .pwd-dot { background: #4ade80; } .pwd-req.unmet .pwd-dot { background: rgba(100,116,139,0.3); } }
			:is(.dark) .pwd-req.met        { color: #4ade80; }
			:is(.dark) .pwd-req.unmet      { color: rgba(100,116,139,0.55); }
			:is(.dark) .pwd-req.met   .pwd-dot { background: #4ade80; }
			:is(.dark) .pwd-req.unmet .pwd-dot { background: rgba(100,116,139,0.3); }

			@media (prefers-color-scheme: dark) { .timer-badge { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); color: #94a3b8; } .timer-badge.expiring { background: rgba(239,68,68,0.10); border-color: rgba(239,68,68,0.25); color: #fca5a5; } }
			:is(.dark) .timer-badge        { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); color: #94a3b8; }
			:is(.dark) .timer-badge.expiring { background: rgba(239,68,68,0.10); border-color: rgba(239,68,68,0.25); color: #fca5a5; }

			@media (prefers-color-scheme: dark) { .auth-back-link { color: rgba(148,163,184,0.6); } .auth-back-link:hover { color: #2dd4bf; } }
			:is(.dark) .auth-back-link     { color: rgba(148,163,184,0.6); }
			:is(.dark) .auth-back-link:hover { color: #2dd4bf; }
		`}</style>
	</>
);