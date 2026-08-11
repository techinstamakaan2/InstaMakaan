import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, ArrowRight, Download, Check, Award } from 'lucide-react';

const BROCHURE_PATH = '/brochures/alpg-brochure.pdf';

const STATS = [
	{ label: 'Towers',   value: '7 Towers' },
	{ label: 'BSP from', value: '₹13,000/sqft', accent: true },
	{ label: 'Sizes',    value: '2299–3769 sqft' },
	{ label: 'Type',     value: '3 & 4 BHK' },
];

const CHIPS = [
	'Supreme Court Monitored',
	'23,960 sqft Clubhouse',
	'33-Floor Iconic Tower',
	'Podium Style Living',
];

export const AlpgCard = () => {
	const navigate = useNavigate();

	const handleDownload = (e) => {
		e.stopPropagation();
		const a = document.createElement('a');
		a.href = BROCHURE_PATH;
		a.download = 'Aspire-Leisure-Park-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	return (
		<div
			onClick={() => navigate('/sell-companies/aspire-leisure-park')}
			className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-md hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400/40 transition-all duration-300 flex flex-col md:flex-row md:h-[300px]"
		>
			{/* ── Left: Image ── */}
			<div className="relative w-full md:w-[42%] h-52 md:h-full flex-shrink-0 overflow-hidden bg-slate-900">
				<img
					src="/images/alpg/hero-towers.jpg"
					alt="Aspire Leisure Park"
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
				/>

				{/* gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

				{/* top badge */}
				<div className="absolute top-3 left-3">
					<span className="bg-emerald-700/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
						Landmark Luxury Residences
					</span>
				</div>

				{/* bottom left: SC badge */}
				<div className="absolute bottom-3 left-3">
					<span className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
						<Shield size={11} /> SC Monitored
					</span>
				</div>

				{/* bottom right: GAURS logo */}
				<div className="absolute bottom-3 right-3">
					<img
						src="/images/alpg/logo-gaurs.png"
						alt="GAURS"
						className="h-5 w-auto object-contain drop-shadow-lg brightness-0 invert"
					/>
				</div>

				{/* top right: Iconic Tower badge */}
				<div className="absolute top-3 right-3">
					<span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full border border-yellow-400/30">
						33-Floor Iconic Tower
					</span>
				</div>
			</div>

			{/* ── Right: Content ── */}
			<div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0">

				{/* Top: name + location */}
				<div>
					<div className="flex items-start justify-between gap-3 mb-3">
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="flex flex-col leading-tight min-w-0">
								<span className="text-[10px] font-bold tracking-[0.18em] uppercase text-amber-600">Aspire</span>
								<span className="text-[15px] font-black text-slate-900 dark:text-white leading-tight">LEISURE PARK</span>
								<span className="text-[10px] text-slate-400 dark:text-slate-500">by GAURS</span>
							</div>
							<div className="w-px h-8 bg-amber-200 dark:bg-amber-700/40 flex-shrink-0" />
							<img
								src="/images/alpg/logo-gaurs.png"
								alt="GAURS"
								className="h-6 w-auto object-contain flex-shrink-0"
							/>
						</div>
						<span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
							New Launch
						</span>
					</div>
					<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1.5">
						<MapPin size={12} className="text-emerald-500 flex-shrink-0" />
						<span className="truncate">Landmark Luxury Residences · Techzone-4, Greater Noida (W)</span>
					</div>
					<div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 text-xs mb-4">
						<Award size={12} className="flex-shrink-0" />
						<span>7 Acres · Podium Style Living · Central Greens &amp; Water Bodies</span>
					</div>

					{/* Stats row */}
					<div className="grid grid-cols-4 gap-2 mb-4">
						{STATS.map(({ label, value, accent }) => (
							<div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
								<p className="text-[10px] text-slate-400 mb-0.5 leading-tight">{label}</p>
								<p className={`font-bold text-xs leading-tight ${accent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
									{value}
								</p>
							</div>
						))}
					</div>

					{/* Feature chips */}
					<div className="flex flex-wrap gap-1.5">
						{CHIPS.map((c) => (
							<span key={c} className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
								<Check size={9} className="text-emerald-500" /> {c}
							</span>
						))}
					</div>
				</div>

				{/* Bottom: CTA row */}
				<div className="flex items-center justify-between gap-3 pt-4 mt-1 border-t border-slate-100 dark:border-slate-800">
					<div className="text-xs text-slate-400 hidden sm:block">
						7 Acres · 7 Towers · Techzone-4 · Greater Noida West
					</div>
					<div className="flex items-center gap-2 ml-auto">
						<button
							onClick={handleDownload}
							className="flex items-center gap-1.5 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							<Download size={13} /> Brochure
						</button>
						<button
							onClick={(e) => { e.stopPropagation(); navigate('/sell-companies/aspire-leisure-park'); }}
							className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							View Details <ArrowRight size={13} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
