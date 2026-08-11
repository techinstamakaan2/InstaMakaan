import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { NxOneArkCard } from '@/components/sell/NxOneArkCard';
import { AspireCenturianParkCard } from '@/components/sell/AspireCenturianParkCard';
import { AlpgCard } from '@/components/sell/AlpgCard';
import { ParadiseCityCard } from '@/components/sell/ParadiseCityCard';

// Temporarily hidden — flip back to true to bring NX One Ark back into the Commercial tab.
const SHOW_NX_ONE_ARK = false;

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
			<div data-reveal="scale" data-delay="150" className="flex justify-center mb-10">
				<div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner">
					{BUY_TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setBuyTab(tab.id)}
							className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
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
				<div className="max-w-5xl mx-auto">
					{SHOW_NX_ONE_ARK ? <NxOneArkCard /> : <ComingSoonCard />}
				</div>
			)}

			{buyTab === 'residential' && (
				<div className="max-w-5xl mx-auto flex flex-col gap-5">
					<AspireCenturianParkCard />
					<AlpgCard />
				</div>
			)}

			{buyTab === 'plot' && (
				<div className="max-w-5xl mx-auto flex flex-col gap-5">
					<ParadiseCityCard />
				</div>
			)}
		</>
	);
};
