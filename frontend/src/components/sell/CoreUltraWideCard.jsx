import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Check, Building2, Download, BadgeCheck, Sparkles } from 'lucide-react';

const BROCHURE_PATH = '/brochures/core-ultra-wide-brochure.pdf';

const STATS = [
	{ label: 'Category', value: 'Commercial Hub', accent: true },
	{ label: 'Elevation', value: 'G + 10 Floors' },
	{ label: 'Location', value: 'Crossing Republik' },
	{ label: 'RERA ID', value: 'UPRERAPRJ9641' },
];

const CHIPS = [
	'Zudio Anchor Retail',
	'MAD Luxury Cinemas',
	'FashionTV Sky Lounge',
	'Studio Hotel Suites',
];

export const CoreUltraWideCard = () => {
	const navigate = useNavigate();

	const handleDownload = (e) => {
		e.stopPropagation();
		const a = document.createElement('a');
		a.href = BROCHURE_PATH;
		a.download = 'Core-Ultra-Wide-Tower-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	return (
		<div
			onClick={() => navigate('/sell-companies/core-ultra-wide')}
			className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-violet-900/40 bg-white dark:bg-[#0f0b1d] shadow-md hover:shadow-xl hover:shadow-violet-500/10 hover:border-violet-500/40 dark:hover:border-violet-500/50 transition-all duration-300 flex flex-col md:flex-row md:h-[320px]"
		>
			{/* ── Left: Pristine Architectural Image ── */}
			<div className="relative w-full md:w-[42%] h-52 md:h-full flex-shrink-0 overflow-hidden bg-slate-900">
				<img
					src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=85"
					alt="The Core Ultra Wide Tower — Crossing Republik"
					className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src =
							'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

				<div className="absolute top-3 left-3 flex items-center gap-1.5">
					<span className="bg-violet-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1">
						<Sparkles size={11} className="text-amber-300" /> Commercial Landmark
					</span>
				</div>

				<div className="absolute bottom-3 left-3">
					<span className="flex items-center gap-1 bg-black/75 backdrop-blur-md text-violet-200 text-[11px] font-bold px-2.5 py-1 rounded-full border border-violet-500/30">
						<Building2 size={11} className="text-violet-400" /> G+10 Iconic Tower
					</span>
				</div>

				<div className="absolute top-3 right-3">
					<span className="flex items-center gap-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
						<BadgeCheck size={11} /> RERA Approved
					</span>
				</div>
			</div>

			{/* ── Right: Content (Adaptive Light/Dark Mode) ── */}
			<div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0 bg-gradient-to-br from-transparent to-violet-50/40 dark:to-violet-950/20">
				<div>
					<div className="flex items-start justify-between gap-3 mb-2">
						<div className="flex flex-col leading-tight min-w-0">
							<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-violet-600 dark:text-violet-400">
								INDUMAA · ALTRUISTIC BETTER
							</span>
							<span className="text-[16px] font-black text-slate-900 dark:text-white leading-tight tracking-tight mt-0.5">
								THE CORE ULTRA WIDE TOWER
							</span>
							<span className="text-[11px] text-slate-500 dark:text-slate-400">
								Crossing Republik, Ghaziabad (Opp. Gaur City)
							</span>
						</div>
						<span className="text-[11px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
							New Launch
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-xs mb-3 font-medium">
						<MapPin size={12} className="text-violet-600 dark:text-violet-400 flex-shrink-0" />
						<span className="truncate">
							Plot CC-1, Sushant Aquapolis · Adjoining NH-24 & FNG Corridor
						</span>
					</div>

					{/* Stats row */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
						{STATS.map(({ label, value, accent }) => (
							<div
								key={label}
								className="bg-slate-50 dark:bg-violet-950/30 border border-slate-200/80 dark:border-violet-900/40 rounded-xl p-2 text-center transition-colors"
							>
								<p className="text-[10px] text-slate-400 dark:text-slate-400 mb-0.5 leading-tight font-medium">
									{label}
								</p>
								<p
									className={`font-bold text-xs leading-tight break-words ${
										accent
											? 'text-violet-700 dark:text-violet-400 font-extrabold'
											: 'text-slate-800 dark:text-white'
									}`}
								>
									{value}
								</p>
							</div>
						))}
					</div>

					{/* Feature chips */}
					<div className="flex flex-wrap gap-1.5">
						{CHIPS.map((c) => (
							<span
								key={c}
								className="flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-violet-900/30 border border-slate-200 dark:border-violet-800/40 px-2.5 py-0.5 rounded-full"
							>
								<Check size={10} className="text-violet-600 dark:text-violet-400" /> {c}
							</span>
						))}
					</div>
				</div>

				{/* Bottom: CTA row */}
				<div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80">
					<div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
						Retail · Dining · Cinema · Hotel Suites · Sky Lounge
					</div>
					<div className="flex items-center gap-2 ml-auto">
						<button
							onClick={handleDownload}
							className="flex items-center gap-1.5 border border-violet-300 dark:border-violet-600/50 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							<Download size={13} /> Brochure
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								navigate('/sell-companies/core-ultra-wide');
							}}
							className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
						>
							Explore Tower <ArrowRight size={13} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
