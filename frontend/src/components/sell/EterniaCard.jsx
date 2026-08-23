import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, ArrowRight, Download, Check, Award } from 'lucide-react';

const BROCHURE_PATH = '/brochures/eternia-brochure.pdf'; // Placeholder

const STATS = [
	{ label: 'Towers',   value: '6 Towers' },
	{ label: 'BSP from', value: '₹1.81 Cr*', accent: true },
	{ label: 'Sizes',    value: '1932–2625 sqft' },
	{ label: 'Type',     value: '3 & 4 BHK' },
];

const CHIPS = [
	'Supreme Court Monitored',
	'Facing 100m Green Belt',
	'Double Height Lobby',
	'25,000 sqft Clubhouse',
];

export const EterniaCard = () => {
	const navigate = useNavigate();

	const handleDownload = (e) => {
		e.stopPropagation();
		const a = document.createElement('a');
		a.href = BROCHURE_PATH;
		a.download = 'Eternia-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	return (
		<div
			onClick={() => navigate('/sell-companies/eternia')}
			className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-md hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-400/40 transition-all duration-300 flex flex-col md:flex-row md:h-[320px]"
		>
			{/* ═══ Left: Image ═══ */}
			<div className="relative w-full md:w-[42%] h-52 md:h-full flex-shrink-0 overflow-hidden bg-slate-900">
				{/* Note: Using Unsplash placeholders matching the luxury red/rose gold high-rise theme */}
				<img
					src="/images/eternia/towers-hero.jpg"
					alt="Eternia Luxury Residences"
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
				/>

				{/* gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

				{/* top badge */}
				<div className="absolute top-3 left-3">
					<span className="bg-rose-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
						Luxury Residential
					</span>
				</div>

				{/* bottom left: Supreme Court badge */}
				<div className="absolute bottom-3 left-3">
					<span className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
						<Shield size={11} /> SC Monitored
					</span>
				</div>

				{/* Iconic tower badge */}
				<div className="absolute top-3 right-3">
					<span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-rose-300 text-[10px] font-bold px-2 py-1 rounded-full border border-rose-400/30">
						G+30 Floors
					</span>
				</div>
			</div>

			{/* ═══ Right: Content ═══ */}
			<div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0">

				{/* Top: name + location */}
				<div>
					<div className="flex items-start justify-between gap-3 mb-3">
						<div className="flex items-center gap-2.5 min-w-0">
							<h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-white tracking-tight leading-none">
								Eternia
							</h3>
						</div>
						<span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700/30 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
							New Launch
						</span>
					</div>
					<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1.5">
						<MapPin size={12} className="text-rose-500 flex-shrink-0" />
						<span className="truncate">Dream Valley · Techzone-4, Greater Noida (W)</span>
					</div>
					<div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs mb-4">
						<Award size={12} className="flex-shrink-0" />
						<span>Inspired by the Anthurium · A Symbol of Timeless Grace</span>
					</div>

					{/* Stats row */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
						{STATS.map(({ label, value, accent }) => (
							<div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
								<p className="text-[10px] text-slate-400 mb-0.5 leading-tight">{label}</p>
								<p className={`font-bold text-xs leading-tight break-words ${accent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-white'}`}>
									{value}
								</p>
							</div>
						))}
					</div>

					{/* Feature chips */}
					<div className="flex flex-wrap gap-1.5">
						{CHIPS.map((c) => (
							<span key={c} className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
								<Check size={9} className="text-rose-500" /> {c}
							</span>
						))}
					</div>
				</div>

				{/* Bottom: CTA row */}
				<div className="flex items-center justify-between gap-3 pt-4 mt-1 border-t border-slate-100 dark:border-slate-800">
					<div className="text-xs text-slate-400 hidden sm:block">
						6 Acres · 6 Towers · Techzone-4 · Greater Noida West
					</div>
					<div className="flex items-center gap-2 ml-auto">
						<button
							onClick={handleDownload}
							className="flex items-center gap-1.5 border border-rose-500/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							<Download size={13} /> Brochure
						</button>
						<button
							onClick={(e) => { e.stopPropagation(); navigate('/sell-companies/eternia'); }}
							className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							View Details <ArrowRight size={13} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
