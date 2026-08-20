import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomIcon from '@/components/CustomIcon';
import {
	Menu, User, ChevronDown, LogOut, X,
	Home, BookOpen, Star, Info, Gift, HelpCircle,
	Phone, LayoutDashboard, Settings, Shield,
	Building2, ChevronRight, Sparkles, Briefcase, MapPin, Calculator, Moon, Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const NAV_LINKS = [
	{ name: 'Home', path: '/', icon: <Home size={17} /> },
	{ name: 'Blog', path: '/blog', icon: <BookOpen size={17} /> },
	{ name: 'Reviews', path: '/reviews', icon: <Star size={17} /> },
	{ name: 'Tools', path: '/tools', icon: <Calculator size={17} /> },
];

const MORE_LINKS = [
	{ name: 'About Us', path: '/about', icon: <Info size={17} /> },
	{ name: 'Area Guides', path: '/areas', icon: <MapPin size={17} /> },
	{ name: 'Society Reviews', path: '/society-reviews', icon: <Building2 size={17} /> },
	{ name: 'Guides', path: '/guides', icon: <BookOpen size={17} /> },
	{ name: 'Services', path: '/services', icon: <Briefcase size={17} /> },
	{ name: 'Refer & Earn', path: '/refer', icon: <Gift size={17} /> },
	{ name: 'FAQ', path: '/faq', icon: <HelpCircle size={17} /> },
];

const ROLE_DASHBOARD = {
	ADMIN: { path: '/admin', label: 'Admin Dashboard', icon: <Shield size={17} /> },
	OWNER: { path: '/owner', label: 'Owner Dashboard', icon: <Building2 size={17} /> },
	AGENT: { path: '/agent', label: 'Agent Dashboard', icon: <Settings size={17} /> },
	USER: { path: '/user/dashboard', label: 'My Dashboard', icon: <LayoutDashboard size={17} /> },
};

export const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [openMore, setOpenMore] = useState(false);
	const [openProfile, setOpenProfile] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const moreRef = useRef(null);
	const profileRef = useRef(null);


	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 8);
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		const handler = (e) => {
			if (moreRef.current && !moreRef.current.contains(e.target)) setOpenMore(false);
			if (profileRef.current && !profileRef.current.contains(e.target)) setOpenProfile(false);
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	useEffect(() => {
		document.body.style.overflow = mobileOpen ? 'hidden' : '';
		return () => { document.body.style.overflow = ''; };
	}, [mobileOpen]);

	const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

	const handleLogout = () => { logout(); navigate('/', { replace: true }); };

	const closeMenu = () => setMobileOpen(false);

	const initial = (user?.name || user?.email || 'U')[0].toUpperCase();
	const dashboard = user ? (ROLE_DASHBOARD[user.role] || ROLE_DASHBOARD.USER) : null;

	return (
		<>
			<header className={cn(
				'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300',
				isScrolled
					? 'bg-white/95 dark:bg-[#0b1220]/95 backdrop-blur-xl shadow-sm border-b border-slate-100 dark:border-white/10'
					: 'bg-white/85 dark:bg-[#0b1220]/80 backdrop-blur-lg',
			)}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-14 w-full">

						{/* LOGO */}
						<Link to="/" className="flex items-center gap-2 mr-3 shrink-0">
							<CustomIcon src="/images/orglogo.webp" className="h-8 w-8" />
							<div className="leading-tight">
								<div className="text-sm font-bold text-slate-900 dark:text-teal-400">Insta</div>
								<div className="text-sm font-bold text-slate-900 dark:text-yellow-400 -mt-1">Makaan</div>
							</div>
						</Link>

						{/* DESKTOP NAV */}
						<nav className="hidden lg:flex items-center gap-8 xl:gap-10">
							{NAV_LINKS.map(link => (
								<Link key={link.path} to={link.path} className={cn(
									'text-sm font-medium transition-colors',
									isActive(link.path) ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:text-teal-600',
								)}>{link.name}</Link>
							))}
							<div className="relative" ref={moreRef}>
								<button onClick={() => setOpenMore(v => !v)}
									className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600">
									More <ChevronDown className={cn('w-4 h-4 transition-transform', openMore && 'rotate-180')} />
								</button>
								{openMore && (
									<div className="absolute top-full mt-2 w-44 rounded-xl bg-white dark:bg-[#0b1220] border shadow-xl overflow-hidden z-[99999]">
										{MORE_LINKS.map(l => (
											<Link key={l.path} to={l.path} onClick={() => setOpenMore(false)}
												className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10">
												{React.cloneElement(l.icon, { size: 14, color: '#0d9488' })}{l.name}
											</Link>
										))}
									</div>
								)}
							</div>
						</nav>

						{/* DESKTOP RIGHT */}
						<div className="hidden lg:flex items-center gap-3 lg:gap-4">
							<Button variant="teal" size="sm" asChild>
								<Link to="/contact">Contact Us</Link>
							</Button>

							<button
								type="button"
								onClick={toggleTheme}
								aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
								className="w-9 h-9 flex items-center justify-center rounded-full border dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10"
							>
								{theme === 'light' ? (
									<Moon className="w-4 h-4" />
								) : (
									<Sun className="w-4 h-4" />
								)}
							</button>

							{!user ? (
								<Link to="/auth/login"
									className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border dark:border-white/20">
									<User className="w-4 h-4" /> Login
								</Link>
							) : (
								<div className="relative" ref={profileRef}>
									<button onClick={() => setOpenProfile(v => !v)}
										className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold text-sm shadow-md hover:bg-teal-700 transition">
										{initial}
									</button>
									{openProfile && (
										<div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#0b1220] shadow-xl border dark:border-white/10 z-[99999] overflow-hidden">
											<div className="px-4 py-3 border-b dark:border-white/10 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/10">
												<div className="flex items-center gap-3">
													<div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">{initial}</div>
													<div>
														<div className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">{user?.name || 'My Account'}</div>
														<div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">{user?.email}</div>
													</div>
												</div>
											</div>
											{dashboard && (
												<Link to={dashboard.path} onClick={() => setOpenProfile(false)}
													className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200">
													{React.cloneElement(dashboard.icon, { size: 14, color: '#0d9488' })} {dashboard.label}
												</Link>
											)}
											<button onClick={() => { setOpenProfile(false); handleLogout(); }}
												className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
												<LogOut size={14} /> Logout
											</button>
										</div>
									)}
								</div>
							)}
						</div>

						{/* MOBILE HAMBURGER */}
						<div className="lg:hidden flex items-center gap-2">
							{user && (
								<div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
									{initial}
								</div>
							)}
							<button onClick={() => setMobileOpen(true)} aria-label="Open menu"
								className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur">
								<Menu className="w-5 h-5 text-slate-900 dark:text-white" />
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* ═══════════ MOBILE DRAWER ═══════════ */}
			{/* Backdrop */}
			<div
				onClick={closeMenu}
				className={cn(
					'fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
					mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
				)}
			/>

			{/* Drawer panel */}
			<div className={cn(
				'fixed top-0 right-0 h-[100dvh] z-[10001] w-[min(340px,92vw)] lg:hidden',
				'bg-white dark:bg-[#0d1117] shadow-2xl',
				'transition-transform duration-300 ease-out overflow-hidden flex flex-col',
				mobileOpen ? 'translate-x-0' : 'translate-x-full',
			)}>
				{/* ── TOP HERO ── */}
				<div style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%)', flexShrink: 0 }}>
					{/* Close button */}
					<div className="flex items-center justify-between p-4 pb-0">
						<Link to="/" onClick={closeMenu} className="flex items-center gap-2">
							<CustomIcon src="/images/orglogo.webp" className="h-8 w-8" />
							<div className="leading-tight">
								<div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff' }}>Insta</div>
								<div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fbbf24', marginTop: -2 }}>Makaan</div>
							</div>
						</Link>
						<button onClick={closeMenu} aria-label="Close menu"
							className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 border border-white/25 text-white hover:bg-white/25 transition">
							<X size={18} />
						</button>
					</div>

					{/* User card inside hero (if logged in) */}
					{user ? (
						<div className="px-5 pt-5 pb-5">
							<div className="flex items-center gap-3">
								<div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2.5px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
									{initial}
								</div>
								<div style={{ minWidth: 0 }}>
									<div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'Welcome back!'}</div>
									<div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
									<div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '3px 10px' }}>
										<Sparkles size={9} color="#fbbf24" />
										<span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#fff', letterSpacing: '0.06em' }}>PREMIUM MEMBER</span>
									</div>
								</div>
							</div>
							{dashboard && (
								<Link to={dashboard.path} onClick={closeMenu}
									style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '11px 14px', background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 14, textDecoration: 'none' }}>
									<div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										{React.cloneElement(dashboard.icon, { color: '#fff', size: 16 })}
									</div>
									<span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', flex: 1 }}>{dashboard.label}</span>
									<ChevronRight size={14} color="rgba(255,255,255,0.6)" />
								</Link>
							)}
						</div>
					) : (
						<div className="px-5 pt-4 pb-5">
							<p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', marginBottom: 12 }}>Sign in to access your dashboard, saved properties, and referral rewards.</p>
							<Link to="/auth/login" onClick={closeMenu}
								style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', background: '#fff', borderRadius: 13, textDecoration: 'none', fontWeight: 800, fontSize: '0.88rem', color: '#0d9488' }}>
								<User size={15} />Login / Sign Up
							</Link>
						</div>
					)}
				</div>

				{/* ── SCROLLABLE LINKS ── */}
				<div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
					{/* Main nav */}
					<div style={{ fontSize: '0.63rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>Navigation</div>
					{NAV_LINKS.map(link => (
						<Link key={link.path} to={link.path} onClick={closeMenu}
							className={cn(
								"flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[0.9rem] font-semibold transition-all duration-200 border-[1.5px]",
								isActive(link.path)
									? "bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white border-[#0d9488] shadow-[0_4px_12px_rgba(13,148,136,0.25)]"
									: "bg-[#f8fafc] dark:bg-white/5 text-[#334155] dark:text-white border-[#e2e8f0] dark:border-white/10"
							)}
						>
							<div className={cn(
								"w-[34px] h-[34px] rounded-xl flex items-center justify-center shrink-0",
								isActive(link.path) ? "bg-white/20" : "bg-teal-600/10 dark:bg-teal-500/20"
							)}>
								{React.cloneElement(link.icon, { color: isActive(link.path) ? '#fff' : '#0d9488', size: 16 })}
							</div>
							{link.name}
							{isActive(link.path) && <ChevronRight size={14} color="rgba(255,255,255,0.7)" className="ml-auto" />}
						</Link>
					))}

					<div style={{ fontSize: '0.63rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px 8px 4px', marginTop: 4 }}>More</div>
					{MORE_LINKS.map(link => (
						<Link key={link.path} to={link.path} onClick={closeMenu}
							className={cn(
								"flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[0.9rem] font-semibold transition-all duration-200 border-[1.5px]",
								isActive(link.path)
									? "bg-gradient-to-br from-[#0d9488] to-[#0f766e] text-white border-[#0d9488]"
									: "bg-[#f8fafc] dark:bg-white/5 text-[#334155] dark:text-white border-[#e2e8f0] dark:border-white/10"
							)}
						>
							<div className={cn(
								"w-[34px] h-[34px] rounded-xl flex items-center justify-center shrink-0",
								isActive(link.path) ? "bg-white/20" : "bg-teal-600/10 dark:bg-teal-500/20"
							)}>
								{React.cloneElement(link.icon, { color: isActive(link.path) ? '#fff' : '#0d9488', size: 16 })}
							</div>
							{link.name}
						</Link>
					))}

					{/* Divider */}
					<div className="h-px bg-slate-200 dark:bg-white/10 my-3" />

					{/* Theme Toggle */}
					<button
						type="button"
						onClick={toggleTheme}
						className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-semibold text-sm text-slate-700 dark:text-white transition-colors"
					>
						{theme === 'light' ? (
							<Moon className="w-4 h-4" />
						) : (
							<Sun className="w-4 h-4" />
						)}
						{theme === 'light' ? 'Dark Mode' : 'Light Mode'}
					</button>

					{/* Utilities */}

					<Link to="/contact" onClick={closeMenu}
						className="flex items-center gap-3 px-3.5 py-3 rounded-2xl border-[1.5px] border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[0.9rem] font-semibold text-slate-700 dark:text-white transition-colors"
					>
						<div className="w-[34px] h-[34px] rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
							<Phone size={16} className="text-blue-500" />
						</div>
						Contact Us
					</Link>
				</div>

				{/* ── BOTTOM ── */}
				{user && (
					<div className="px-4 py-3 pb-5 border-t border-slate-200 dark:border-white/10 shrink-0 bg-white dark:bg-[#0d1117]">
						<button onClick={() => { closeMenu(); handleLogout(); }}
							className="flex items-center justify-center gap-2.5 w-full p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl text-white font-extrabold text-[0.9rem] shadow-[0_4px_14px_rgba(239,68,68,0.3)] transition-transform active:scale-95"
						>
							<LogOut size={16} />Logout
						</button>
					</div>
				)}
			</div>

			<style>{`
				@media (max-width:1023px) {
					.menu-open-blur { overflow: hidden; }
				}
			`}</style>
		</>
	);
};
