import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Zap, TrendingUp, Bell, Building2, Star } from 'lucide-react';
import { useMode } from '@/context/ModeContext';

const CommunityAnimations = () => (
	<style>{`
    @keyframes phoneFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes glowAnim    { 0%,100%{opacity:.3} 50%{opacity:.6} }
    @keyframes cardRise    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tickerFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes barGrow     { from{width:0} to{width:var(--bar-w)} }
    @keyframes pulseDot    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.6} }

    .animate-phone   { animation: phoneFloat 4s ease-in-out infinite; }
    .animate-glow    { animation: glowAnim 6s ease-in-out infinite; }
    .card-rise-1     { animation: cardRise .5s .1s ease-out both; }
    .card-rise-2     { animation: cardRise .5s .3s ease-out both; }
    .card-rise-3     { animation: cardRise .5s .5s ease-out both; }
    .card-rise-4     { animation: cardRise .5s .7s ease-out both; }
    .ticker-1        { animation: tickerFloat 4s ease-in-out infinite; }
    .ticker-2        { animation: tickerFloat 5s .6s ease-in-out infinite; }
    .ticker-3        { animation: tickerFloat 3.5s 1.2s ease-in-out infinite; }
    .pulse-dot       { animation: pulseDot 2s ease-in-out infinite; }
  `}</style>
);

/* ── Buy visual: animated property price dashboard ── */
const BuyVisual = ({ visible }) => {
	const [activeBar, setActiveBar] = useState(0);
	const bars = [
		{ label: 'Jan', h: 55, color: '#0d9488' },
		{ label: 'Mar', h: 68, color: '#0d9488' },
		{ label: 'May', h: 62, color: '#0d9488' },
		{ label: 'Jul', h: 80, color: '#14b8a6' },
		{ label: 'Sep', h: 72, color: '#0d9488' },
		{ label: 'Nov', h: 92, color: '#a78bfa' },
	];

	useEffect(() => {
		if (!visible) return;
		const id = setInterval(() => setActiveBar(p => (p + 1) % bars.length), 900);
		return () => clearInterval(id);
	}, [visible]);

	const listings = [
		{ icon: '🏢', name: 'DLF The Arbour', city: 'Gurugram', price: '6.5 Cr', status: 'New Launch', up: true },
		{ icon: '🏙️', name: 'Prestige Raintree', city: 'Bangalore', price: '2.1 Cr', status: 'Under Const.', up: true },
		{ icon: '🏡', name: 'Sobha Dream Acres', city: 'Bangalore', price: '48 L', status: 'Ready', up: false },
	];

	return (
		<div className="relative w-full h-full flex flex-col gap-3 p-1">
			{/* appreciation chart */}
			<div className={`bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-md ${visible ? 'card-rise-1' : 'opacity-0'}`}>
				<div className="flex items-center justify-between mb-3">
					<div>
						<p className="text-xs text-gray-500 dark:text-gray-400">Price Appreciation</p>
						<p className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1">
							+17.6% <TrendingUp className="w-4 h-4 text-green-500" />
						</p>
					</div>
					<span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">YoY</span>
				</div>
				<div className="flex items-end gap-1.5 h-14">
					{bars.map((b, i) => (
						<div key={i} className="flex-1 flex flex-col items-center gap-0.5">
							<div
								className="w-full rounded-t-sm transition-all duration-500"
								style={{
									height: visible ? `${b.h}%` : '0%',
									backgroundColor: i === activeBar ? '#a78bfa' : b.color,
									transitionDelay: `${i * 80}ms`,
								}}
							/>
							<span className="text-[9px] text-gray-400">{b.label}</span>
						</div>
					))}
				</div>
			</div>

			{/* live listings ticker */}
			{listings.map((l, i) => (
				<div
					key={i}
					className={`bg-white dark:bg-neutral-800 rounded-xl px-3 py-2.5 shadow-sm flex items-center gap-3 ${
						i === 0 ? 'ticker-1' : i === 1 ? 'ticker-2' : 'ticker-3'
					} ${visible ? `card-rise-${i + 2}` : 'opacity-0'}`}
				>
					<span className="text-xl shrink-0">{l.icon}</span>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{l.name}</p>
						<p className="text-[10px] text-gray-400 truncate">{l.city}</p>
					</div>
					<div className="text-right shrink-0">
						<p className="text-xs font-bold text-gray-900 dark:text-white">₹{l.price}</p>
						<p className={`text-[10px] font-medium ${l.up ? 'text-green-500' : 'text-orange-500'}`}>{l.status}</p>
					</div>
				</div>
			))}

			{/* live alert dot */}
			<div className={`flex items-center gap-2 ${visible ? 'card-rise-4' : 'opacity-0'}`}>
				<div className="pulse-dot w-2 h-2 rounded-full bg-green-500" />
				<p className="text-[11px] text-gray-500 dark:text-gray-400">38 new listings added today</p>
			</div>
		</div>
	);
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export const CommunitySection = () => {
	const mobileVideoRef = useRef(null);
	const desktopVideoRef = useRef(null);
	const buyVisualRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const [buyVisible, setBuyVisible] = useState(false);
	const { mode } = useMode();
	const isBuy = mode === 'buy';

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach(e => {
					if (e.isIntersecting) { setIsVisible(true); obs.disconnect(); }
				});
			},
			{ threshold: 0.4 },
		);
		if (mobileVideoRef.current) observer.observe(mobileVideoRef.current);
		if (desktopVideoRef.current) observer.observe(desktopVideoRef.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!isBuy || !buyVisualRef.current) return;
		const observer = new IntersectionObserver(
			([e]) => { if (e.isIntersecting) setBuyVisible(true); },
			{ threshold: 0.3 },
		);
		observer.observe(buyVisualRef.current);
		return () => observer.disconnect();
	}, [isBuy]);

	/* theme */
	const glowBg   = 'from-teal-400/40 via-cyan-300/30 to-yellow-300/30';
	const cardBg   = 'from-teal-50 via-white to-yellow-50 dark:from-[#0f1f2e] dark:via-[#0b1220] dark:to-[#1a1405]';
	const primaryBtnClass = '';
	const primaryBtnVariant = 'teal';

	/* copy per mode */
	const headline    = 'Get the Insider Advantage';
	const subtext     = isBuy
		? 'Be the first to know about new launches, price drops, and investment hotspots.'
		: 'Be the first to know. Get early alerts on properties, deals, and market shifts.';
	const primaryLabel   = isBuy ? 'Join Buying Community' : 'Join Buying Community';
	const primaryDesc    = isBuy ? 'Get alerts on new launches & investment deals.' : 'Get market insights & investment deals.';
	const secondaryLabel = isBuy ? 'Get Property Alerts'   : 'Join Renter Community';
	const secondaryDesc  = isBuy ? 'Instant alerts when prices drop in your city.' : 'Get new rental alerts & local offers.';

	return (
		<section className="py-16 sm:py-20 md:py-28 bg-white dark:bg-[#0b1220] overflow-hidden">
			<CommunityAnimations />
			<div className="container-custom">

				{/* ══ MOBILE ══ */}
				<div className="block lg:hidden px-4">
					<h3 className="text-[22px] sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-5">
						{headline}
					</h3>

					{isBuy ? (
						/* Buy mobile visual */
						<div ref={buyVisualRef} className="mb-6 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 p-4 shadow-sm">
							<BuyVisual visible={buyVisible} />
						</div>
					) : (
						/* Rent mobile visual: image */
						<div className="flex justify-center mb-6">
							<img src="/images/Get the Insider Advantage.webp" alt="Get the Insider Advantage" className="w-full max-w-xs" width="560" height="560" loading="lazy" />
						</div>
					)}

					<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{subtext}</p>
					<div className="space-y-5">
						{isBuy && (
							<div>
								<Button variant={primaryBtnVariant} className={`w-full justify-center py-4 rounded-2xl ${primaryBtnClass}`}>
									<Users className="mr-2 w-5 h-5" /> {primaryLabel}
								</Button>
								<p className="text-xs sm:text-sm text-slate-500 mt-2">{primaryDesc}</p>
							</div>
						)}
						<div>
							<Button variant="yellow" className="w-full justify-center py-4 rounded-2xl">
								{isBuy ? <Bell className="mr-2 w-5 h-5" /> : <Zap className="mr-2 w-5 h-5" />}
								{secondaryLabel}
							</Button>
							<p className="text-xs sm:text-sm text-slate-500 mt-2">{secondaryDesc}</p>
						</div>
					</div>
				</div>

				{/* ══ DESKTOP ══ */}
				<div className="hidden lg:flex flex-col lg:flex-row items-center gap-14">
					{/* content card */}
					<div className={`w-full lg:w-[62%] px-6 sm:px-10 md:px-12 py-10 md:py-12 rounded-3xl bg-gradient-to-br ${cardBg} shadow-xl`}>
						<h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
							{headline}
						</h3>
						<p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
							{subtext}
						</p>
						<div className="space-y-6">
							{isBuy && (
								<div>
									<Button variant={primaryBtnVariant} className={`text-base sm:text-lg px-6 py-5 ${primaryBtnClass}`}>
										<Users className="mr-2" /> {primaryLabel}
									</Button>
									<p className="text-sm text-slate-500 mt-2">{primaryDesc}</p>
								</div>
							)}
							<div>
								<Button variant="yellow" className="text-base sm:text-lg px-6 py-5">
									{isBuy ? <Bell className="mr-2" /> : <Zap className="mr-2" />}
									{secondaryLabel}
								</Button>
								<p className="text-sm text-slate-500 mt-2">{secondaryDesc}</p>
							</div>
						</div>
					</div>

					{/* visual */}
					<div className="relative flex justify-center lg:justify-end w-full lg:w-[38%] mt-12 lg:mt-0">
						{isBuy ? (
							/* Buy desktop visual */
							<div ref={buyVisualRef} className="w-full max-w-sm rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 p-5 shadow-xl">
								<BuyVisual visible={buyVisible} />
							</div>
						) : (
							/* Rent desktop visual: image */
							<img src="/images/Get the Insider Advantage.webp" alt="Get the Insider Advantage" className="w-full max-w-sm" width="384" height="384" loading="lazy" />
						)}
					</div>
				</div>
			</div>
		</section>
	);
};
