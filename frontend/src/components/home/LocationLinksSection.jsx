import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';

function toSlug(name) {
	return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Clean up messy sector names (e.g. "Golden-I, Techzone-4" → "Golden I")
function cleanSociety(raw) {
	return raw.split(',')[0].trim().replace(/-/g, ' ').replace(/\s+/g, ' ');
}

const PillLink = ({ to, children }) => (
	<Link
		to={to}
		className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
	>
		{children}
	</Link>
);

const SectionLabel = ({ children }) => (
	<h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
		{children}
	</h3>
);

export const LocationLinksSection = () => {
	const [data, setData] = useState(null);
	useEffect(() => {
		api.get('/properties/locations').then((res) => setData(res.data)).catch(() => {});
	}, []);

	if (!data) return null;

	const localities = (data.localities || []).filter(Boolean).sort();
	const societies  = [...new Set(
		(data.sectors || []).filter(Boolean).map(cleanSociety)
	)].sort();
	const bhkCombos    = data.locality_bhk_combos    || {};
	const budgetCombos = data.locality_budget_combos || {};

	if (localities.length === 0 && societies.length === 0) return null;

	return (
		<section className="bg-white dark:bg-[#0b1220] border-t border-gray-100 dark:border-white/5">
			<div className="container-custom px-4 py-10 space-y-8">

				<div>
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
						Explore rental properties
					</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Browse verified listings across Greater Noida, Noida Extension &amp; nearby areas
					</p>
				</div>

				{/* ── By Locality ── */}
				{localities.length > 0 && (
					<div>
						<SectionLabel>Flats for Rent by Location</SectionLabel>
						<div className="flex flex-wrap gap-2">
							{localities.map((area) => (
								<PillLink key={area} to={`/rent/flats-for-rent-in-${toSlug(area)}`}>
									Flats in {area}
								</PillLink>
							))}
						</div>
					</div>
				)}

				{/* ── By Society ── */}
				{societies.length > 0 && (
					<div>
						<SectionLabel>Popular Societies</SectionLabel>
						<div className="flex flex-wrap gap-2">
							{societies.map((s) => (
								<PillLink key={s} to={`/rent/flats-for-rent-in-${toSlug(s)}`}>
									{s}
								</PillLink>
							))}
						</div>
					</div>
				)}

				{/* ── By Budget ── */}
				{localities.some((area) => (budgetCombos[area] || []).length > 0) && (
					<div>
						<SectionLabel>Flats for Rent by Budget</SectionLabel>
						<div className="flex flex-wrap gap-2">
							{localities.flatMap((area) =>
								(budgetCombos[area] || []).map((price) => (
									<PillLink
										key={`${price}-${area}`}
										to={`/rent/flats-for-rent-in-${toSlug(area)}-below-${price}`}
									>
										Flats in {area} below ₹{(price / 1000)}K
									</PillLink>
								))
							)}
						</div>
					</div>
				)}

				{/* ── By BHK ── */}
				{localities.some((area) => (bhkCombos[area] || []).length > 0) && (
					<div>
						<SectionLabel>Flats for Rent by BHK</SectionLabel>
						<div className="flex flex-wrap gap-2">
							{localities.flatMap((area) =>
								(bhkCombos[area] || []).map((bhk) => (
									<PillLink
										key={`${bhk}-${area}`}
										to={`/rent/${bhk}-bhk-flats-for-rent-in-${toSlug(area)}`}
									>
										{bhk} BHK in {area}
									</PillLink>
								))
							)}
						</div>
					</div>
				)}

			</div>
		</section>
	);
};
