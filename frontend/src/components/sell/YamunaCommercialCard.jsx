import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, ArrowRight, Download, Check, Building2, Layers, Sparkles, Award } from 'lucide-react';

const STATS = [
	{ label: 'Towers',   value: '2 Iconic' },
	{ label: 'Starting', value: '₹1 Cr*', accent: true },
	{ label: 'Size',     value: '650–675 sqft' },
	{ label: 'Storeys',  value: '40 Floors' },
];

const CHIPS = [
	'Fully Furnished',
	'Modern Glass Building',
	'45,000 sqft Clubhouse',
	'250 Acre Township',
];

export const YamunaCommercialCard = () => {
	const navigate = useNavigate();

	const handleDownload = (e) => {
		e.stopPropagation();
		const a = document.createElement('a');
		a.href = '/brochures/codename-bento-brochure.pdf';
		a.download = 'CodeName-Bento-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	return (
		<div
			onClick={() => navigate('/sell-companies/codename-bento')}
			className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-md hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col md:flex-row md:h-[320px]"
		>
			{/* ── Left: Image ── */}
			<div className="relative w-full md:w-[42%] h-52 md:h-full flex-shrink-0 overflow-hidden bg-slate-900">
				<img
					src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85"
					alt="CodeName Bento — Glass Towers"
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
				/>
				{/* gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/25" />

				{/* top badge */}
				<div className="absolute top-3 left-3">
					<span className="bg-cyan-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
						Luxury Studio Apartments
					</span>
				</div>

				{/* bottom left: SC Monitored badge */}
				<div className="absolute bottom-3 left-3">
					<span className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
						<Shield size={11} /> SC Monitored
					</span>
				</div>

				{/* bottom right: GAURS logo */}
				<div className="absolute bottom-3 right-3">
					<img
						src="/images/aspire-centurian-park/logo-gaurs.png"
						alt="GAURS"
						className="h-5 w-auto object-contain drop-shadow-lg brightness-0 invert"
					/>
				</div>

				{/* top right: Glass tower badge */}
				<div className="absolute top-3 right-3">
					<span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-cyan-300 text-[10px] font-bold px-2 py-1 rounded-full border border-cyan-400/30">
						40-Floor Glass Towers
					</span>
				</div>
			</div>

			{/* ── Right: Content ── */}
			<div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0">
				{/* Top: name + location */}
				<div>
					<div className="flex items-start justify-between gap-3 mb-2.5">
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="flex flex-col leading-tight min-w-0">
								<span className="text-[10px] font-bold tracking-[0.18em] uppercase text-amber-600 dark:text-amber-400">Gaur Yamuna City</span>
								<span className="text-[15px] font-black text-slate-900 dark:text-white leading-tight">CODENAME: BENTO</span>
								<span className="text-[10px] text-slate-400 dark:text-slate-500">by GAURS</span>
							</div>
							<div className="w-px h-8 bg-cyan-200 dark:bg-cyan-800/40 flex-shrink-0" />
							<img
								src="/images/aspire-centurian-park/logo-gaurs.png"
								alt="GAURS"
								className="h-6 w-auto object-contain flex-shrink-0"
							/>
						</div>
						<span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700/30 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
							New Launch
						</span>
					</div>
					<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
						<MapPin size={12} className="text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
						<span className="truncate">Luxury Studio Apartments · Yamuna Expressway, Sector-19</span>
					</div>
					<div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs mb-3">
						<Award size={12} className="flex-shrink-0" />
						<span>Fully Furnished · Modern Glass Building · 250 Acre Township</span>
					</div>

					{/* Stats row */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
						{STATS.map(({ label, value, accent }) => (
							<div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 text-center border border-slate-100 dark:border-slate-800">
								<p className="text-[10px] text-slate-400 mb-0.5 leading-tight">{label}</p>
								<p className={`font-bold text-xs leading-tight break-words ${accent ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-800 dark:text-white'}`}>
									{value}
								</p>
							</div>
						))}
					</div>

					{/* Feature chips */}
					<div className="flex flex-wrap gap-1.5">
						{CHIPS.map((c) => (
							<span key={c} className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
								<Check size={9} className="text-cyan-500" /> {c}
							</span>
						))}
					</div>
				</div>

				{/* Bottom: CTA row */}
				<div className="flex items-center justify-between gap-3 pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800">
					<div className="text-xs text-slate-400 hidden sm:block">
						2 Towers · 40 Storeys · Gaur Yamuna City · Yamuna Expressway
					</div>
					<div className="flex items-center gap-2 ml-auto">
						<button
							onClick={handleDownload}
							className="flex items-center gap-1.5 border border-cyan-500/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							<Download size={13} /> Brochure
						</button>
						<button
							onClick={(e) => { e.stopPropagation(); navigate('/sell-companies/codename-bento'); }}
							className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							View Details <ArrowRight size={13} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
