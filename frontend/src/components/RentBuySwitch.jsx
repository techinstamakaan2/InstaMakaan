import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Building2 } from 'lucide-react';

// Same look as the homepage hero's Rent/Buy toggle, but this one
// actually navigates between the standalone /rent and /buy pages
// (client-side, so it still feels instant like a tab switch).
export const RentBuySwitch = ({ active, className = '' }) => {
	const navigate = useNavigate();

	return (
		<div className={`flex justify-center ${className}`}>
			<div className="inline-flex items-center bg-white/70 dark:bg-[#0b1220]/70 backdrop-blur-md border border-slate-200/60 dark:border-white/10 rounded-2xl p-1 shadow-lg gap-1">
				<button
					onClick={() => active !== 'rent' && navigate('/rent')}
					className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
						active === 'rent'
							? 'bg-teal-700 text-white shadow-md scale-[1.03]'
							: 'text-slate-500 dark:text-slate-400 hover:text-teal-600'
					}`}
				>
					<Key className="w-4 h-4" /> Rent
				</button>
				<button
					onClick={() => active !== 'buy' && navigate('/buy')}
					className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
						active === 'buy'
							? 'bg-teal-700 text-white shadow-md scale-[1.03]'
							: 'text-slate-500 dark:text-slate-400 hover:text-teal-600'
					}`}
				>
					<Building2 className="w-4 h-4" /> Buy
				</button>
			</div>
		</div>
	);
};
