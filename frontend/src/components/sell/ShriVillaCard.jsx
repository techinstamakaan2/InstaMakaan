import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Check, Compass, Trees, ShieldCheck, Download, Sparkles } from 'lucide-react';

const STATS = [
	{ label: 'Plot Sizes', value: '89 – 500 Sq Yd' },
	{ label: 'Total Land', value: '22,941 Sq Yd' },
	{ label: 'Units',      value: '50 Villa Plots' },
	{ label: 'Road Width', value: '30 Ft+ Wide', accent: true },
];

const CHIPS = [
	'Immediate Registry',
	'Bank Loan Available',
	'Gated City with CCTV',
	'Clubhouse & Pool',
];

export const ShriVillaCard = () => {
	const navigate = useNavigate();

	const handleBrochure = (e) => {
		e.stopPropagation();
		const a = document.createElement('a');
		a.href = '/brochures/shri-villa-brochure.pdf';
		a.download = 'Shri-Villa-Dehradun-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	return (
		<div
			onClick={() => navigate('/sell-companies/shri-villa')}
			className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-blue-900/50 bg-white dark:bg-[#071122] shadow-md hover:shadow-2xl hover:shadow-blue-950/20 hover:border-blue-400/50 transition-all duration-300 flex flex-col md:flex-row md:h-[320px]"
		>
			{/* ── Left: Image ── */}
			<div className="relative w-full md:w-[42%] h-56 md:h-full flex-shrink-0 overflow-hidden bg-slate-950">
				<img
					src="/images/shri-villa/hero-luxury-villa.jpg"
					alt="Shri Villa Dehradun Mountain Villa Plots"
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = '/images/shri-villa/forest-mansion.jpg';
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

				<div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
					<span className="bg-blue-700/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
						<Trees size={11} /> Hill Villa Plots
					</span>
					<span className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
						<Sparkles size={10} /> 10+ Yrs Trust
					</span>
				</div>

				<div className="absolute bottom-3 left-3">
					<span className="flex items-center gap-1 bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
						<ShieldCheck size={12} className="text-amber-400" /> Immediate Registry
					</span>
				</div>

				<div className="absolute top-3 right-3">
					<span className="bg-black/75 backdrop-blur-md text-blue-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-400/40">
						Dehradun (U.K.)
					</span>
				</div>
			</div>

			{/* ── Right: Content ── */}
			<div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0">
				<div>
					<div className="flex items-start justify-between gap-3 mb-2">
						<div className="flex flex-col min-w-0">
							<span className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-amber-600 dark:text-amber-400">
								GRDA INFRA PRIVATE LIMITED
							</span>
							<h3 className="text-2xl font-serif font-black text-slate-900 dark:text-white tracking-tight leading-tight mt-0.5">
								SHRI VILLA
							</h3>
						</div>
						<span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
							50 Premium Plots
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs mb-3">
						<MapPin size={13} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
						<span className="truncate font-medium">
							Vill- Sorna · Yamunotri Highway · Near Graphic Era &amp; Doon School, Dehradun
						</span>
					</div>

					{/* Stats row */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
						{STATS.map(({ label, value, accent }) => (
							<div
								key={label}
								className="bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-900/40 rounded-lg p-2 text-center"
							>
								<p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5 leading-tight font-medium">
									{label}
								</p>
								<p
									className={`font-bold text-xs leading-tight break-words ${
										accent
											? 'text-amber-600 dark:text-amber-400'
											: 'text-slate-900 dark:text-slate-100'
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
								className="flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 px-2.5 py-0.5 rounded-full"
							>
								<Check size={10} className="text-blue-600 dark:text-blue-400" /> {c}
							</span>
						))}
					</div>
				</div>

				{/* Bottom: CTA row */}
				<div className="flex items-center justify-between gap-3 pt-3.5 mt-2 border-t border-slate-100 dark:border-blue-900/40">
					<div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
						22,941 Sq.Yd Gated Community · Vill- Sorna, Dehradun
					</div>
					<div className="flex items-center gap-2 ml-auto">
						<button
							onClick={handleBrochure}
							className="flex items-center gap-1.5 border border-amber-500/50 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							<Download size={13} /> Brochure
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								navigate('/sell-companies/shri-villa');
							}}
							className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap"
						>
							Explore Villa Plots <ArrowRight size={13} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
