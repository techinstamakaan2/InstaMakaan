import React from 'react';
import { MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AREAS = [
	{
		name: 'Sector 62',
		city: 'Noida',
		tag: 'IT Hub',
		trend: '+8%',
		accent: 'teal',
		bhk: [
			{ type: '1 BHK', rent: '₹12,000' },
			{ type: '2 BHK', rent: '₹18,000' },
			{ type: '3 BHK', rent: '₹28,000' },
		],
	},
	{
		name: 'Noida Extension',
		city: 'Gr. Noida West',
		tag: 'Family Zone',
		trend: '+12%',
		accent: 'yellow',
		bhk: [
			{ type: '1 BHK', rent: '₹8,000' },
			{ type: '2 BHK', rent: '₹12,000' },
			{ type: '3 BHK', rent: '₹18,000' },
		],
	},
	{
		name: 'Sector 137',
		city: 'Noida',
		tag: 'Metro Belt',
		trend: '+6%',
		accent: 'teal',
		bhk: [
			{ type: '1 BHK', rent: '₹10,000' },
			{ type: '2 BHK', rent: '₹15,000' },
			{ type: '3 BHK', rent: '₹22,000' },
		],
	},
	{
		name: 'Crossings Republik',
		city: 'Ghaziabad',
		tag: 'Budget Pick',
		trend: '+15%',
		accent: 'yellow',
		bhk: [
			{ type: '1 BHK', rent: '₹6,500' },
			{ type: '2 BHK', rent: '₹9,000' },
			{ type: '3 BHK', rent: '₹14,000' },
		],
	},
	{
		name: 'Indirapuram',
		city: 'Ghaziabad',
		tag: 'Premium',
		trend: '+5%',
		accent: 'teal',
		bhk: [
			{ type: '1 BHK', rent: '₹14,000' },
			{ type: '2 BHK', rent: '₹22,000' },
			{ type: '3 BHK', rent: '₹35,000' },
		],
	},
	{
		name: 'Gr. Noida West',
		city: 'Greater Noida',
		tag: 'Fast Growing',
		trend: '+18%',
		accent: 'yellow',
		bhk: [
			{ type: '1 BHK', rent: '₹7,500' },
			{ type: '2 BHK', rent: '₹11,000' },
			{ type: '3 BHK', rent: '₹16,000' },
		],
	},
];

const ACCENT = {
	teal: {
		card: 'border-teal-100 dark:border-teal-800/30 hover:border-teal-300 dark:hover:border-teal-600',
		tag: 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800/40',
		trend: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
		dot: 'bg-teal-500',
		divider: 'border-teal-50 dark:border-teal-900/30',
		rentAccent: 'text-teal-700 dark:text-teal-300',
		glow: 'from-teal-50/60 to-transparent dark:from-teal-900/10 dark:to-transparent',
	},
	yellow: {
		card: 'border-amber-100 dark:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-600',
		tag: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800/40',
		trend: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
		dot: 'bg-amber-400',
		divider: 'border-amber-50 dark:border-amber-900/30',
		rentAccent: 'text-amber-700 dark:text-amber-300',
		glow: 'from-amber-50/60 to-transparent dark:from-amber-900/10 dark:to-transparent',
	},
};

export const NeighborhoodSpotlightSection = () => {
	const navigate = useNavigate();

	return (
		<section className="py-12 md:py-16 bg-white dark:bg-[#0b1220]">
			<div className="container-custom">

				{/* Header */}
				<div data-reveal="fade" className="flex items-end justify-between mb-7">
					<div>
						<p className="text-[11px] font-bold tracking-[0.3em] uppercase text-teal-500 dark:text-teal-400 mb-1">Explore Localities</p>
						<h2 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">Neighbourhood Spotlight</h2>
					</div>
					<button
						onClick={() => navigate('/all-properties')}
						className="hidden sm:flex items-center gap-1 text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline underline-offset-2 whitespace-nowrap"
					>
						View all <ArrowRight className="w-4 h-4" />
					</button>
				</div>

				{/* Cards */}
				<div
					data-reveal="left"
					className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible md:pb-0"
				>
					{AREAS.map((area) => {
						const a = ACCENT[area.accent];
						return (
							<button
								key={area.name}
								onClick={() => navigate('/all-properties')}
								className={`group flex-shrink-0 w-[195px] md:w-auto snap-start text-left bg-white dark:bg-[#111827] border ${a.card} rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-250 hover:-translate-y-1`}
							>
								{/* top gradient stripe */}
								<div className={`h-1.5 w-full bg-gradient-to-r ${area.accent === 'teal' ? 'from-teal-400 to-teal-600' : 'from-amber-300 to-amber-500'}`} />

								<div className="p-4">
									{/* tag + trend row */}
									<div className="flex items-center justify-between mb-3">
										<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.tag}`}>
											{area.tag}
										</span>
										<span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${a.trend}`}>
											<TrendingUp className="w-2.5 h-2.5" />{area.trend}
										</span>
									</div>

									{/* name + city */}
									<p className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
										{area.name}
									</p>
									<p className="text-[11px] text-slate-400 flex items-center gap-0.5 mb-4">
										<MapPin className="w-2.5 h-2.5" />{area.city}
									</p>

									{/* BHK breakdown */}
									<div className={`border-t ${a.divider} pt-3 space-y-2`}>
										{area.bhk.map((b) => (
											<div key={b.type} className="flex items-center justify-between">
												<span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{b.type}</span>
												<span className={`text-[11px] font-bold ${a.rentAccent}`}>{b.rent}</span>
											</div>
										))}
									</div>
								</div>
							</button>
						);
					})}
				</div>

				{/* Mobile view all */}
				<button
					onClick={() => navigate('/all-properties')}
					className="sm:hidden mt-4 w-full text-center text-sm text-teal-600 dark:text-teal-400 font-semibold py-2 border border-teal-200 dark:border-teal-800 rounded-xl"
				>
					View all properties →
				</button>
			</div>
		</section>
	);
};
