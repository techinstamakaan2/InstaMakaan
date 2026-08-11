import { Link } from 'react-router-dom';
import { filtersToSlug } from '@/utils/slugUtils';

const LOCATIONS = [
	'Noida',
	'Sector 62 Noida',
	'Sector 63 Noida',
	'Sector 137 Noida',
	'Sector 15 Noida',
	'Sector 18 Noida',
	'Greater Noida',
	'Noida Extension',
	'Greater Noida West',
	'Indirapuram',
	'Vaishali',
	'Vasundhara',
];

const BHK_LINKS = [
	{ beds: '1', location: 'Noida' },
	{ beds: '2', location: 'Noida' },
	{ beds: '3', location: 'Noida' },
	{ beds: '2', location: 'Sector 62 Noida' },
	{ beds: '2', location: 'Greater Noida' },
	{ beds: '3', location: 'Greater Noida West' },
];

export default function HomeSeoSection() {
	return (
		<section className="py-10 bg-gray-50 dark:bg-[#0b1220] border-t border-gray-100 dark:border-white/5">
			<div className="container-custom px-4">
				{/* By location */}
				<h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
					Flats for rent by location
				</h2>
				<div className="flex flex-wrap gap-2 mb-8">
					{LOCATIONS.map((loc) => (
						<Link
							key={loc}
							to={`/rent/${filtersToSlug({ location: loc })}`}
							className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors bg-white dark:bg-white/5"
						>
							Flats in {loc}
						</Link>
					))}
				</div>

				{/* By BHK */}
				<h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
					Flats for rent by BHK
				</h2>
				<div className="flex flex-wrap gap-2">
					{BHK_LINKS.map((item) => (
						<Link
							key={`${item.beds}-${item.location}`}
							to={`/rent/${filtersToSlug({ beds: item.beds, location: item.location })}`}
							className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors bg-white dark:bg-white/5"
						>
							{item.beds} BHK in {item.location}
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
