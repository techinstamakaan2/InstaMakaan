import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, TrendingUp, Home } from 'lucide-react';
import { useMode } from '@/context/ModeContext';

/* ══════════════════════════════════════
   SHARED ANIMATIONS
══════════════════════════════════════ */
const SectionAnimations = () => (
	<style>{`
    @keyframes phoneFloat {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-10px); }
    }
    @keyframes fadeSlideUp {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes glowPulse {
      0%,100% { box-shadow: 0 0 20px 4px rgba(20,184,166,0.2); }
      50%      { box-shadow: 0 0 40px 10px rgba(20,184,166,0.4); }
    }
    @keyframes craneSwing {
      0%,100% { transform: rotate(-4deg); }
      50%      { transform: rotate(4deg); }
    }
    @keyframes particleRise {
      0%   { opacity:0; transform:translateY(0) scale(0.5); }
      20%  { opacity:1; }
      100% { opacity:0; transform:translateY(-70px) scale(1); }
    }
    @keyframes floatCard {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-7px); }
    }

    .phone-float   { animation: phoneFloat 4s ease-in-out infinite; }
    .fade-slide-up   { animation: fadeSlideUp .7s ease-out both; }
    .fade-slide-up-1 { animation: fadeSlideUp .7s .1s ease-out both; }
    .fade-slide-up-2 { animation: fadeSlideUp .7s .2s ease-out both; }
    .fade-slide-up-3 { animation: fadeSlideUp .7s .35s ease-out both; }
    .shimmer-txt {
      background: linear-gradient(90deg,#14b8a6,#f59e0b,#14b8a6);
      background-size: 300% auto;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
      animation: shimmer 4s linear infinite;
    }
    .glow-base { animation: glowPulse 3s ease-in-out infinite; }
    .crane-arm { animation: craneSwing 2.5s ease-in-out infinite; transform-origin: bottom center; }
    .float-card { animation: floatCard 4s ease-in-out infinite; }
    .float-card-2 { animation: floatCard 5s .8s ease-in-out infinite; }
    .float-card-3 { animation: floatCard 3.5s 1.5s ease-in-out infinite; }
    .float-card-4 { animation: floatCard 4.5s .4s ease-in-out infinite; }
  `}</style>
);

/* ══════════════════════════════════════
   PROPERTY DASHBOARD (buy mode visual)
══════════════════════════════════════ */
const PropertyDashboard = ({ visible }) => {
	const [activeBar, setActiveBar] = useState(0);
	const bars = [
		{ label: 'Jan', h: 55, color: '#0d9488' },
		{ label: 'Mar', h: 68, color: '#0d9488' },
		{ label: 'May', h: 62, color: '#0d9488' },
		{ label: 'Jul', h: 80, color: '#14b8a6' },
		{ label: 'Sep', h: 72, color: '#0d9488' },
		{ label: 'Nov', h: 92, color: '#14b8a6' },
	];
	const listings = [
		{ icon: '🏢', name: 'NX One Ark',       city: 'Sector 132, Noida', price: '1.65 Cr', status: 'New Launch', up: true },
		{ icon: '🏙️', name: 'Godrej Vanantara',  city: 'Sector 150, Noida', price: '2.1 Cr',  status: 'Under Const.', up: true },
		{ icon: '🏡', name: 'ATS Homekraft',     city: 'Greater Noida West', price: '85 L',  status: 'Ready',       up: false },
	];
	useEffect(() => {
		if (!visible) return;
		const id = setInterval(() => setActiveBar(p => (p + 1) % bars.length), 900);
		return () => clearInterval(id);
	}, [visible]);

	return (
		<div className="relative w-full flex flex-col gap-3">
			{/* appreciation chart */}
			<div className={`bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-md transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
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
							<div className="w-full rounded-t-sm transition-all duration-500"
								style={{ height: visible ? `${b.h}%` : '0%', backgroundColor: i === activeBar ? '#f59e0b' : b.color, transitionDelay: `${i * 80}ms` }}
							/>
							<span className="text-[9px] text-gray-400">{b.label}</span>
						</div>
					))}
				</div>
			</div>

			{/* listings */}
			{listings.map((l, i) => (
				<div key={i} className={`bg-white dark:bg-neutral-800 rounded-xl px-3 py-2.5 shadow-sm flex items-center gap-3 transition-all duration-500`}
					style={{ transitionDelay: `${(i + 1) * 120}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
				>
					<span className="text-xl shrink-0">{l.icon}</span>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{l.name}</p>
						<p className="text-[10px] text-gray-400 truncate">{l.city}</p>
					</div>
					<div className="text-right shrink-0">
						<p className="text-xs font-bold text-gray-900 dark:text-white">₹{l.price}</p>
						<p className={`text-[10px] font-medium ${l.up ? 'text-green-500' : 'text-amber-500'}`}>{l.status}</p>
					</div>
				</div>
			))}

			{/* live dot */}
			<div className={`flex items-center gap-2 transition-all duration-500`}
				style={{ transitionDelay: '480ms', opacity: visible ? 1 : 0 }}
			>
				<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
				<p className="text-[11px] text-gray-500 dark:text-gray-400">Live Noida listings updating now</p>
			</div>
		</div>
	);
};

/* ══════════════════════════════════════
   ANIMATED BUILDING (unused — kept for reference)
══════════════════════════════════════ */
const TOTAL_FLOORS = 8;
const WIN_PER_FLOOR = 4;
const FLOOR_COLORS = ['#0f766e','#0d9488','#14b8a6','#0d9488','#0f766e','#134e4a','#0d9488','#14b8a6'];

const AnimatedBuilding = ({ visible }) => {
	const [builtFloors, setBuiltFloors] = useState(0);
	const [litMap, setLitMap]           = useState({});
	const [done, setDone]               = useState(false);

	useEffect(() => {
		if (!visible) return;
		setBuiltFloors(0); setLitMap({}); setDone(false);
		let f = 0;
		const timer = setInterval(() => {
			f += 1;
			setBuiltFloors(f);
			if (f >= TOTAL_FLOORS) { clearInterval(timer); setDone(true); }
		}, 280);
		return () => clearInterval(timer);
	}, [visible]);

	useEffect(() => {
		if (!done) return;
		const blink = setInterval(() => {
			const fl = Math.floor(Math.random() * TOTAL_FLOORS);
			const wn = Math.floor(Math.random() * WIN_PER_FLOOR);
			setLitMap(p => ({ ...p, [`${fl}-${wn}`]: !p[`${fl}-${wn}`] }));
		}, 220);
		return () => clearInterval(blink);
	}, [done]);

	return (
		<div className="relative flex flex-col items-center select-none">
			{/* crane */}
			<div className={`transition-all duration-700 ${done ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
				<div className="flex flex-col items-end mb-0.5">
					<div className="crane-arm flex items-end">
						<div className="w-24 h-2 bg-amber-400 rounded-l-full" />
						<div className="flex flex-col items-center ml-1">
							<div className="w-0.5 h-5 bg-amber-300" />
							<div className="w-3 h-3 rounded-full border-2 border-amber-400" />
						</div>
					</div>
					<div className="w-2 h-7 bg-amber-500 rounded-sm self-end mr-10" />
				</div>
			</div>

			{/* floors bottom→top */}
			<div className="flex flex-col-reverse gap-[3px]">
				{Array.from({ length: TOTAL_FLOORS }, (_, i) => (
					<div key={i} style={{
						opacity: i < builtFloors ? 1 : 0,
						transform: i < builtFloors ? 'translateY(0)' : 'translateY(14px)',
						transition: 'opacity 0.35s ease, transform 0.35s ease',
						backgroundColor: FLOOR_COLORS[i],
						width: i === 0 ? 160 : 144,
						height: 24,
						borderRadius: i === 0 ? '4px 4px 0 0' : 3,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-around',
						padding: '0 8px',
						marginLeft: i === 0 ? -8 : 0,
					}}>
						{Array.from({ length: WIN_PER_FLOOR }, (_, j) => {
							const lit = litMap[`${i}-${j}`] !== false;
							return (
								<div key={j} style={{
									width: 13, height: 13, borderRadius: 2,
									backgroundColor: lit ? '#fef08a' : '#065f46',
									boxShadow: lit ? '0 0 6px 2px rgba(254,240,138,0.55)' : 'none',
									transition: 'all 0.2s ease',
								}} />
							);
						})}
					</div>
				))}
			</div>

			{/* base */}
			<div style={{ width: 172, height: 9, background: '#042f2e', borderRadius: '0 0 6px 6px' }} />
			<div style={{ width: 210, height: 5, background: '#021d1c', borderRadius: '0 0 8px 8px', marginTop: 1 }} />

			{/* particles */}
			{done && [0,1,2,3,4].map(i => (
				<div key={i} style={{
					position:'absolute', bottom: 18 + i * 12, left: 22 + i * 26,
					width: 6, height: 6, borderRadius: '50%',
					background: i % 2 ? '#14b8a6' : '#a78bfa',
					animation: `particleRise ${1.5 + i * 0.4}s ease-out ${i * 0.55}s infinite`,
				}} />
			))}

			{/* glow ring */}
			<div className="glow-base absolute bottom-1 left-1/2 -translate-x-1/2 w-44 h-12 bg-teal-500/25 rounded-full blur-2xl" />
		</div>
	);
};

/* floating glass badge */
const GlassBadge = ({ icon, label, value, className = '', animClass = 'float-card' }) => (
	<div className={`${animClass} absolute flex items-center gap-2 bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-3.5 py-2 shadow-xl ${className}`}>
		<span className="text-lg">{icon}</span>
		<div>
			<p className="text-[10px] text-white/60 leading-none">{label}</p>
			<p className="text-xs font-bold text-white leading-snug mt-0.5">{value}</p>
		</div>
	</div>
);

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export const PropertyOwnerSection = () => {
	const sectionRef = useRef(null);
	const [visible, setVisible] = useState(false);
	const { mode } = useMode();
	const isBuy = mode === 'buy';

	useEffect(() => {
		if (isBuy) setVisible(false);
	}, [isBuy]);

	useEffect(() => {
		if (!isBuy) return;
		const observer = new IntersectionObserver(
			([e]) => { if (e.isIntersecting) setVisible(true); },
			{ threshold: 0.1 },
		);
		if (sectionRef.current) observer.observe(sectionRef.current);
		return () => observer.disconnect();
	}, [isBuy]);

	/* ── RENT MODE: original design unchanged ── */
	if (!isBuy) {
		const cardGradient = 'bg-gradient-to-br from-teal-50 via-white to-yellow-50 dark:from-[#0b1220]/60 dark:via-[#0b1a10]/40 dark:to-[#0b1220]/60';
		const rentPoints = [
			'Get your flat rented faster',
			'Verified tenants only',
			'Direct owner-tenant connection',
			'Direct owner-to-tenant connection',
		];
		return (
			<>
				<SectionAnimations />
				{/* MOBILE */}
				<section className="block md:hidden py-10 px-4 bg-white dark:bg-[#0b1220]">
					<div className={`rounded-3xl p-6 ${cardGradient} shadow-xl`}>
						<img
							src="/images/flat for rent.webp"
							alt="Have a Flat to Rent"
							className="w-full mb-5"
							width="581"
							height="581"
							loading="lazy"
						/>
						<h2 className="text-[23px] sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-5 leading-snug">
							Have a Flat to Rent?
						</h2>
						<p className="text-sm text-slate-700 dark:text-slate-300 mb-6">
							InstaMakaan helps you find verified tenants quickly and rent your flat without hassle.
						</p>
						<div className="space-y-3.5 mb-8">
							{rentPoints.map((p, i) => (
								<div key={i} className="flex items-start gap-2.5">
									<CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-teal-500" />
									<span className="text-sm text-slate-700 dark:text-slate-300">{p}</span>
								</div>
							))}
						</div>
						<Link to="/contact">
							<Button className="w-full flex items-center justify-center gap-2">
								Contact Us Now <ArrowRight className="w-4 h-4" />
							</Button>
						</Link>
					</div>
				</section>

				{/* DESKTOP */}
				<section className="hidden md:block py-20 bg-white dark:bg-[#0b1220]">
					<div className="container-custom flex flex-row items-center gap-14">
					<div className="w-[38%] flex items-center justify-center">
						<img
							src="/images/flat for rent.webp"
							alt="Have a Flat to Rent"
							className="w-full max-w-sm"
							width="384"
							height="384"
							loading="lazy"
						/>
					</div>
					<div className={`w-full lg:w-[62%] px-6 sm:px-10 md:px-12 py-10 md:py-12 rounded-3xl shadow-xl ${cardGradient}`}>
						<h2 className="text-4xl font-extrabold mb-6 text-slate-900 dark:text-white fade-slide-up">
							Have a Flat to Rent?
						</h2>
						<p className="mb-8 text-lg text-slate-700 dark:text-slate-300 fade-slide-up-1">
							InstaMakaan helps you find verified tenants quickly and rent your flat without hassle.
						</p>
						<div className="space-y-4 mb-10 fade-slide-up-2">
							{rentPoints.map((p, i) => (
								<div key={i} className="flex gap-3 items-start">
									<CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-teal-500" />
									<span className="text-slate-700 dark:text-slate-300">{p}</span>
								</div>
							))}
						</div>
						<div className="fade-slide-up-3">
							<Link to="/contact">
								<Button className="flex items-center gap-2">
									Contact Us Now <ArrowRight className="w-4 h-4" />
								</Button>
							</Link>
						</div>
					</div>
					</div>
				</section>
			</>
		);
	}

	/* ── BUY MODE: animated building, blends with page ── */
	const buyPoints = [
		'RERA-verified projects — no legal surprises',
		'Buy directly from the builder at listed price',
		'Expert advisors to negotiate the best deal for you',
		'Full support from site visit to registration',
	];

	return (
		<>
			<SectionAnimations />
			<section
				ref={sectionRef}
				className="py-16 md:py-24 bg-white dark:bg-[#0b1220]"
			>
				<div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

					{/* ── LEFT: property dashboard ── */}
					<div className={`w-full lg:w-[44%] transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
						<div className="bg-slate-50 dark:bg-[#0f172a] rounded-3xl p-5 shadow-xl border border-slate-100 dark:border-white/5">
							<PropertyDashboard visible={visible} />
						</div>
					</div>

					{/* ── RIGHT: content ── */}
					<div className="w-full lg:w-[56%]">
						{/* tag */}
						<div className={`inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-full px-4 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 mb-5 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
							<TrendingUp className="w-3.5 h-3.5" />
							RERA Verified · Top Builders · Noida & NCR
						</div>

						{/* headline */}
						<h2 className={`text-3xl md:text-4xl lg:text-[42px] font-extrabold text-slate-900 dark:text-white leading-tight mb-4 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
							Own a Home You'll Love
						</h2>

						{/* subtitle */}
						<p className={`text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-8 transition-all duration-700 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
							Explore curated properties from Noida's top builders. Every listing is RERA-verified, every price is upfront, and our experts are with you at every step — from visit to keys.
						</p>

						{/* bullets */}
						<ul className={`space-y-3 mb-9 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
							{buyPoints.map((point, i) => (
								<li key={i} className="flex items-start gap-3">
									<CheckCircle2 className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0 mt-0.5" />
									<span className="text-slate-700 dark:text-slate-300 text-sm md:text-base">{point}</span>
								</li>
							))}
						</ul>

						{/* stats */}
						<div className={`flex items-center gap-6 mb-9 transition-all duration-700 delay-250 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
							{[
								{ val: '1000+', label: 'Properties' },
								{ val: '50+',   label: 'Cities' },
								{ val: '100%',  label: 'RERA Verified' },
							].map(({ val, label }, i) => (
								<React.Fragment key={label}>
									{i > 0 && <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />}
									<div className="text-center">
										<p className="text-2xl font-extrabold text-slate-900 dark:text-white">{val}</p>
										<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
									</div>
								</React.Fragment>
							))}
						</div>

						{/* CTAs */}
						<div className={`flex flex-wrap gap-3 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
							<Link to="/sell-companies/nx-one-ark">
								<button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm md:text-base transition-all hover:scale-105 shadow-lg shadow-teal-500/25">
									Explore Properties <ArrowRight className="w-4 h-4" />
								</button>
							</Link>
							<Link to="/contact">
								<button className="flex items-center gap-2 border-2 border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 px-7 py-3.5 rounded-xl font-semibold text-sm md:text-base transition-all">
									Talk to Expert
								</button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
