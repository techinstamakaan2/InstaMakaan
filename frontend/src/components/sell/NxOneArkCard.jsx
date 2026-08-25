import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BadgeCheck, ArrowRight, Download, Check, Building2, Sparkles, UserCheck } from 'lucide-react';

const BROCHURE_PATH = '/brochures/nx-one-ark-brochure.pdf';

const STATS = [
	{ label: 'Structure', value: 'G+26 Storeys' },
	{ label: 'BSP Starting', value: '₹11,990/sqft', accent: true },
	{ label: 'Office Sizes', value: '851–3,049 sqft' },
	{ label: 'RERA Status', value: 'Approved' },
];

const CHIPS = [
	'Club π · 10+ Amenities',
	'9 Mitsubishi High-Speed Lifts',
	'AQI Filtered Air',
	'EV Charging Hubs',
];

export const NxOneArkCard = () => {
	const navigate = useNavigate();

	const handleDownload = (e) => {
		e.stopPropagation();
		const a = document.createElement('a');
		a.href = BROCHURE_PATH;
		a.download = 'NX-ONE-ARK-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	return (
		<div
			onClick={() => navigate('/sell-companies/nx-one-ark')}
			className="group cursor-pointer w-full rounded-2xl overflow-hidden border border-slate-200/90 dark:border-teal-900/40 bg-white dark:bg-[#0b141a] shadow-md hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/40 dark:hover:border-teal-500/50 transition-all duration-300 flex flex-col md:flex-row md:h-[320px]"
		>
			{/* ── Left: Video / Hero Media ── */}
			<div className="relative w-full md:w-[42%] h-52 md:h-full flex-shrink-0 overflow-hidden bg-slate-950">
				<video
					src="/videos/Entrancegate.mp4"
					poster="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85"
					autoPlay
					loop
					muted
					playsInline
					className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
				/>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

				{/* Top Left: Badge */}
				<div className="absolute top-3 left-3 flex items-center gap-1.5">
					<span className="bg-teal-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1">
						<Sparkles size={11} className="text-amber-300" /> Grade-A Commercial
					</span>
				</div>

				{/* Top Right: RERA Badge */}
				<div className="absolute top-3 right-3">
					<span className="flex items-center gap-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
						<BadgeCheck size={11} /> RERA Approved
					</span>
				</div>

				{/* Bottom Left: Structure Badge */}
				<div className="absolute bottom-3 left-3">
					<span className="flex items-center gap-1 bg-black/75 backdrop-blur-md text-teal-200 text-[11px] font-bold px-2.5 py-1 rounded-full border border-teal-500/30">
						<Building2 size={11} className="text-teal-400" /> G+26 Office Tower
					</span>
				</div>

				{/* Bottom Right: Developer Name */}
				<div className="absolute bottom-3 right-3">
					<span className="text-white/80 text-[10px] font-bold tracking-wider uppercase drop-shadow">
						SP SAI IT PVT LTD
					</span>
				</div>
			</div>

			{/* ── Right: Content (Adaptive Screen Theme) ── */}
			<div className="flex-1 flex flex-col justify-between p-5 md:p-6 min-w-0 bg-gradient-to-br from-transparent to-teal-50/40 dark:to-teal-950/20">
				{/* Top: Name + Location */}
				<div>
					<div className="flex items-start justify-between gap-3 mb-2">
						<div className="flex flex-col leading-tight min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<img
									src="/images/nx-one-ark/logo-nxone.png"
									alt="NX ONE"
									className="h-6 w-auto object-contain dark:brightness-110"
									onError={(e) => { e.target.style.display = 'none'; }}
								/>
								<span className="text-slate-300 dark:text-slate-600 text-sm font-light">–</span>
								<img
									src="/images/nx-one-ark/logo-ark.png"
									alt="ARK"
									className="h-5 w-auto object-contain dark:brightness-110"
									onError={(e) => { e.target.style.display = 'none'; }}
								/>
							</div>
							<span className="text-[16px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
								NX ONE ARK · LOCKABLE OFFICES
							</span>
							<span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
								Tech Zone IV, Greater Noida (West)
							</span>
						</div>

						<span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
							New Launch
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-xs mb-3 font-medium">
						<MapPin size={12} className="text-teal-600 dark:text-teal-400 flex-shrink-0" />
						<span className="truncate">Plot No. 17, Tech Zone IV · Direct 130M Expressway Access</span>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
						{STATS.map(({ label, value, accent }) => (
							<div
								key={label}
								className="bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-2 text-center transition-colors group-hover:border-teal-300/60 dark:group-hover:border-teal-700/50"
							>
								<p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5 leading-tight">
									{label}
								</p>
								<p
									className={`font-black text-xs leading-tight break-words ${
										accent
											? 'text-teal-700 dark:text-teal-400 font-black'
											: 'text-slate-900 dark:text-white'
									}`}
								>
									{value}
								</p>
							</div>
						))}
					</div>

					{/* Feature Chips */}
					<div className="flex flex-wrap gap-1.5">
						{CHIPS.map((c) => (
							<span
								key={c}
								className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 px-2.5 py-0.5 rounded-full shadow-2xs"
							>
								<Check size={10} className="text-teal-600 dark:text-teal-400" /> {c}
							</span>
						))}
					</div>
				</div>

				{/* Bottom: CTA Row */}
				<div className="flex items-center justify-between gap-3 pt-3.5 mt-1 border-t border-slate-100 dark:border-slate-800/90">
					<div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1 font-medium">
						<UserCheck size={13} className="text-teal-600 dark:text-teal-400" />
						<span>Direct Institutional Allotment</span>
					</div>

					<div className="flex items-center gap-2 ml-auto">
						<button
							onClick={handleDownload}
							className="flex items-center gap-1.5 border border-teal-600/40 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-bold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer hover:border-teal-500 shadow-2xs"
						>
							<Download size={13} /> Brochure
						</button>

						<button
							onClick={(e) => {
								e.stopPropagation();
								navigate('/sell-companies/nx-one-ark');
							}}
							className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-md shadow-teal-600/20 hover:shadow-teal-600/35 hover:-translate-y-0.5 active:translate-y-0"
						>
							<span>View Details</span>
							<ArrowRight size={13} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NxOneArkCard;
