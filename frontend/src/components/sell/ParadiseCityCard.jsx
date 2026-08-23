import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Check, Layers, Download } from 'lucide-react';

const STATS = [
	{ label: 'BSP',       value: '₹60,000/sq.yd', accent: true },
	{ label: 'Min Size',  value: '150 Sq Yd' },
	{ label: 'Sector',    value: 'Sec-138, Noida' },
	{ label: 'Type',      value: 'Plots' },
];

const CHIPS = [
	'Clear Title',
	'30\' Wide Roads',
	'Club Complex',
	'Gated Community',
];

export const ParadiseCityCard = () => {
	const navigate = useNavigate();

	const handleDownload = (e) => {
		e.stopPropagation();
		const a = document.createElement('a');
		a.href = '/brochures/paradise-city-brochure.pdf';
		a.download = 'Paradise-City-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	return (
		<div
			onClick={() => navigate('/sell-companies/paradise-city')}
			className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1810] shadow-md hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400/40 transition-all duration-300 flex flex-col md:flex-row md:h-[320px]"
		>
			{/* ── Left: Image ── */}
			<div className="relative w-full md:w-[42%] h-52 md:h-full flex-shrink-0 overflow-hidden bg-slate-900">
				<img
					src="/images/paradise-city/hero.jpg"
					alt="Paradise City Sec-138 Noida"
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src =
							'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/25" />

				<div className="absolute top-3 left-3">
					<span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
						Plotted Development
					</span>
				</div>

				<div className="absolute bottom-3 left-3">
					<span className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
						<Layers size={11} className="text-emerald-400" /> Sec-138, Noida
					</span>
				</div>

				<div className="absolute top-3 right-3">
					<span className="bg-black/60 backdrop-blur-sm text-amber-400 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-400/30">
						New Launch
					</span>
				</div>
			</div>

			{/* ── Right: Content ── */}
			<div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0">
				<div>
					<div className="flex items-start justify-between gap-3 mb-2.5">
						<div className="flex flex-col leading-tight min-w-0">
							<span className="text-[10px] font-bold tracking-[0.18em] uppercase text-emerald-700 dark:text-emerald-400">
								GRDA INFRA · Sumpri Infratech
							</span>
							<span className="text-[15px] font-black text-slate-900 dark:text-white leading-tight">
								PARADISE CITY
							</span>
							<span className="text-[10px] text-slate-400 dark:text-slate-500">
								Sector-138, Noida
							</span>
						</div>
						<span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
							Plots Available
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-3">
						<MapPin size={12} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
						<span className="truncate">
							45M Pusta Road · Near Noida–Greater Noida Expressway
						</span>
					</div>

					{/* Stats row */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
						{STATS.map(({ label, value, accent }) => (
							<div
								key={label}
								className="bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100/80 dark:border-emerald-900/40 rounded-lg p-2 text-center"
							>
								<p className="text-[10px] text-slate-400 mb-0.5 leading-tight">
									{label}
								</p>
								<p
									className={`font-bold text-xs leading-tight break-words ${
										accent
											? 'text-emerald-600 dark:text-emerald-400'
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
								className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full"
							>
								<Check size={9} className="text-emerald-500" /> {c}
							</span>
						))}
					</div>
				</div>

				{/* Bottom: CTA row */}
				<div className="flex items-center justify-between gap-3 pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800">
					<div className="text-xs text-slate-400 hidden sm:block">
						150–2000 sq yd plots · Sector-138 · Noida
					</div>
					<div className="flex items-center gap-2 ml-auto">
						<button
							onClick={handleDownload}
							className="flex items-center gap-1.5 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
						>
							<Download size={13} /> Brochure
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								navigate('/sell-companies/paradise-city');
							}}
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
