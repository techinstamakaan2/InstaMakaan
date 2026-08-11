import React, { useEffect, useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useMode } from '@/context/ModeContext';
import { BuyCategoryTabs } from './BuyCategoryTabs';

export const PropertiesSection = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const { mode } = useMode();
	const isBuy = mode === 'buy';

	useEffect(() => {
		if (isBuy) {
			setLoading(false);
			return;
		}
		const fetchProperties = async () => {
			try {
				setLoading(true);
				const res = await api.get('/properties?limit=1000');
				setProperties(res?.data?.data || []);
			} catch (err) {
				console.error(err);
				setError('No properties found');
			} finally {
				setLoading(false);
			}
		};
		fetchProperties();
	}, [isBuy]);

	/* ── Buy mode: tabbed property categories ── */
	if (isBuy) {
		return (
			<section className="py-14 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#0b1220] dark:via-[#0c1528] dark:to-[#0b1220]">
				<div className="container-custom">

					{/* Section kicker */}
					<div data-reveal="fade" className="text-center mb-10">
						<p className="text-[11px] font-bold tracking-[0.3em] uppercase text-teal-500 dark:text-teal-400 mb-2">
							Premium Real Estate
						</p>
						<h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
							Explore by Category
						</h2>
						<div className="mx-auto mt-3 h-[2px] w-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" />
					</div>

					<BuyCategoryTabs />
				</div>
			</section>
		);
	}

	/* ── Rent mode ── */
	if (loading) {
		return (
			<section className="py-20 bg-white dark:bg-[#0b1220] text-center">
				<p className="text-slate-500 dark:text-slate-400">Loading properties...</p>
			</section>
		);
	}

	if (error || properties.length === 0) {
		return (
			<section className="py-20 bg-white dark:bg-[#0b1220] text-center">
				<p className="text-slate-500 dark:text-slate-400">No properties available</p>
			</section>
		);
	}

	return (
		<section className="py-12 md:py-20 bg-white dark:bg-[#0b1220]">
			<div className="container-custom">
				<div data-reveal="fade" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-10">
					<div>
						<h2 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">
							Recommended Properties
						</h2>
						<p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
							Properties matching your preferences
						</p>
					</div>
					<Link
						to="/all-properties"
						className="text-sm px-4 py-2 rounded-lg w-full md:w-auto text-center border transition border-teal-500/40 text-teal-700 dark:text-teal-400 hover:bg-teal-500/10"
					>
						View All Properties
					</Link>
				</div>

				<div className="flex gap-4 overflow-x-auto no-scrollbar px-4 md:px-0 snap-x snap-mandatory scroll-smooth justify-start md:justify-center">
					{properties.slice(0, 4).map((property, i) => (
						<div
							key={property.id}
							data-reveal="scale"
							data-delay={String(i * 100)}
							className="w-[280px] flex-shrink-0 snap-start"
						>
							<PropertyCard property={property} isGrid />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
