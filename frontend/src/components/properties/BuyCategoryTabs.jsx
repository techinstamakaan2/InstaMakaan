import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { NxOneArkCard } from '@/components/sell/NxOneArkCard';
import { AspireCenturianParkCard } from '@/components/sell/AspireCenturianParkCard';
import { AlpgCard } from '@/components/sell/AlpgCard';
import { ParadiseCityCard } from '@/components/sell/ParadiseCityCard';
import { ShriVillaCard } from '@/components/sell/ShriVillaCard';
import { YamunaCommercialCard } from '@/components/sell/YamunaCommercialCard';
import { EterniaCard } from '@/components/sell/EterniaCard';
import { CoreUltraWideCard } from '@/components/sell/CoreUltraWideCard';

// NX One Ark is visible in the Commercial tab
const SHOW_NX_ONE_ARK = true;
// Paradise City is hidden for now
const SHOW_PARADISE_CITY = false;

const ComingSoonCard = () => (
	<div className="w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center text-center py-16 px-6 md:h-[300px]">
		<div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4">
			<Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
		</div>
		<h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Coming Soon</h3>
		<p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
			New commercial listings are on the way. Check back soon.
		</p>
	</div>
);

const BUY_TABS = [
	{ id: 'commercial', label: 'Commercial' },
	{ id: 'plot', label: 'Plot' },
	{ id: 'residential', label: 'Residential' },
];

export const BuyCategoryTabs = () => {
	const [buyTab, setBuyTab] = useState('commercial');

	return (
		<>
			{/* Pill tab bar — centered */}
			<div data-reveal="scale" data-delay="150" className="w-full overflow-x-auto no-scrollbar py-1 flex justify-center mb-8 sm:mb-10 px-2">
				<div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner min-w-max">
					{BUY_TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setBuyTab(tab.id)}
							className={`px-5 sm:px-6 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
								buyTab === tab.id
									? 'bg-teal-600 text-white shadow-md shadow-teal-500/30'
									: 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Tab content */}
			{buyTab === 'commercial' && (
				<div className="max-w-5xl mx-auto flex flex-col gap-5">
					<YamunaCommercialCard />
					{SHOW_NX_ONE_ARK && <NxOneArkCard />}
					<CoreUltraWideCard />
				</div>
			)}

			{buyTab === 'residential' && (
				<div className="max-w-5xl mx-auto flex flex-col gap-5">
					<EterniaCard />
					<AspireCenturianParkCard />
					<AlpgCard />
				</div>
			)}

			{buyTab === 'plot' && (
				<div className="max-w-5xl mx-auto flex flex-col gap-5">
					<ShriVillaCard />
					{SHOW_PARADISE_CITY && <ParadiseCityCard />}
				</div>
			)}
		</>
	);
};
