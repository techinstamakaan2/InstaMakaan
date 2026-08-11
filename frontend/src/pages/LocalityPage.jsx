import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { slugToFilters } from '@/utils/slugUtils';
import api from '@/lib/api';
import {
	MapPin,
	Home,
	ChevronRight,
	ArrowUpDown,
	BadgeCheck,
	Building2,
	BedDouble,
	SlidersHorizontal,
	ChevronDown,
} from 'lucide-react';
import DynamicFAQ, { generateLocalityFAQs } from '@/components/DynamicFAQ';

function toTitleCase(str) {
	return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

const BHK_FILTERS = ['All', '1', '2', '3', '4'];

const LocalityPage = () => {
	const { slug } = useParams();
	const filters = useMemo(() => slugToFilters(slug || ''), [slug]);

	const locationName = filters.location ? toTitleCase(filters.location) : '';
	const urlBeds = filters.beds || '';
	const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

	const priceLabel = maxPrice ? `Below ₹${Number(maxPrice).toLocaleString('en-IN')}` : '';

	const pageTitle = [
		urlBeds ? `${urlBeds} BHK` : '',
		'Flats for Rent',
		locationName ? `in ${locationName}` : '',
		priceLabel,
	].filter(Boolean).join(' ');

	const metaDesc = `Find ${urlBeds ? urlBeds + ' BHK ' : ''}verified flats for rent${locationName ? ' in ' + locationName : ''}${priceLabel ? ' ' + priceLabel : ''}. Browse InstaMakaan's curated rental listings — managed homes, owner-verified, instant move-in.`;
	const fullTitle = `${pageTitle} | Verified Listings | InstaMakaan`;
	const ogTitle = `${pageTitle} | InstaMakaan`;
	const canonicalUrl = `https://instamakaan.com/rent/${slug}`;

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://instamakaan.com/' },
			{ '@type': 'ListItem', position: 2, name: 'Rent', item: 'https://instamakaan.com/all-properties' },
			{ '@type': 'ListItem', position: 3, name: pageTitle, item: canonicalUrl },
		],
	};

	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sortBy, setSortBy] = useState('');
	const [sortOpen, setSortOpen] = useState(false);
	const [bhkFilter, setBhkFilter] = useState(urlBeds || 'All');

	useEffect(() => {
		if (!locationName && !maxPrice) return;
		setLoading(true);
		const p = new URLSearchParams();
		p.set('property_type', 'rent');
		p.set('limit', '1000');
		if (filters.location) p.set('search', filters.location);

		api
			.get(`/properties?${p.toString()}`)
			.then((res) => setProperties(res.data?.data || []))
			.catch(() => setProperties([]))
			.finally(() => setLoading(false));
	}, [slug]);

	const filtered = useMemo(() => {
		let list = properties;
		if (bhkFilter !== 'All') list = list.filter((p) => String(p.beds) === bhkFilter);
		if (maxPrice) list = list.filter((p) => {
			const rent = Number(p.monthly_rent_amount) || Number(p.price) || 0;
			return rent > 0 && rent <= maxPrice;
		});
		return list;
	}, [properties, bhkFilter, maxPrice]);

	const sorted = useMemo(() => {
		const list = [...filtered];
		const val = (p) => Number(p.monthly_rent_amount) || Number(p.price) || 0;
		if (sortBy === 'price_low') list.sort((a, b) => val(a) - val(b));
		if (sortBy === 'price_high') list.sort((a, b) => val(b) - val(a));
		return list;
	}, [filtered, sortBy]);

	// Stats from data
	const stats = useMemo(() => {
		const managed = properties.filter((p) => p.is_managed).length;
		const furnished = properties.filter(
			(p) => p.furnishing?.toLowerCase().includes('furnished'),
		).length;
		const bhks = [...new Set(properties.map((p) => p.beds).filter(Boolean))].sort();
		return { managed, furnished, bhks };
	}, [properties]);

	const NEARBY = [
		'Noida Extension',
		'Greater Noida West',
		'Gaur City',
		'Techzone 4',
		'Sector 150 Noida',
		'Crossing Republik',
		'Sector 62 Noida',
		'Sector 137 Noida',
	].filter((a) => a.toLowerCase() !== locationName.toLowerCase());

	if (!locationName && !maxPrice) {
		return (
			<Layout>
				<div className="min-h-[60vh] flex items-center justify-center">
					<p className="text-slate-500">Invalid page URL.</p>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<Helmet>
				<title>{fullTitle}</title>
				<meta name="description" content={metaDesc} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={ogTitle} />
				<meta property="og:description" content={metaDesc} />
				<script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
			</Helmet>

			{/* ── Hero ── */}
			<section className="relative pt-28 pb-14 -mt-14 overflow-hidden">
				{/* Background layers */}
				<div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-sky-50 dark:from-[#0a1628] dark:via-[#0b1220] dark:to-[#0a1628]" />
				<div
					className="absolute inset-0 opacity-60"
					style={{
						background:
							'radial-gradient(ellipse at 10% 50%, rgba(45,212,191,0.15) 0%, transparent 60%), radial-gradient(ellipse at 90% 20%, rgba(56,189,248,0.12) 0%, transparent 60%)',
					}}
				/>
				{/* Decorative grid */}
				<div
					className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
					style={{
						backgroundImage:
							'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
						backgroundSize: '40px 40px',
					}}
				/>

				<div className="relative container-custom">
					{/* Breadcrumb */}
					<nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
						<Link to="/" className="hover:text-teal-600 transition-colors">
							Home
						</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						<Link
							to="/all-properties"
							className="hover:text-teal-600 transition-colors"
						>
							Rent
						</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						{urlBeds && (
							<>
								<span>{urlBeds} BHK</span>
								<ChevronRight className="w-3 h-3 shrink-0" />
							</>
						)}
						<span className="text-slate-700 dark:text-slate-200 font-medium">
							{locationName}
						</span>
					</nav>

					<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
						<div className="max-w-2xl">
							{/* Location pill */}
							<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-4">
								<MapPin className="w-3.5 h-3.5" />
								{locationName}
							</div>

							<h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
								{urlBeds ? (
									<>
										<span className="text-teal-600 dark:text-teal-400">
											{urlBeds} BHK
										</span>{' '}
										Flats for Rent
										<br />
										<span className="text-2xl md:text-4xl font-semibold text-slate-700 dark:text-slate-300">
											in {locationName}
										</span>
									</>
								) : (
									<>
										Flats for Rent in{' '}
										<span className="text-teal-600 dark:text-teal-400">
											{locationName}
										</span>
									</>
								)}
							</h1>

							<p className="mt-3 text-slate-500 dark:text-slate-400 text-base">
								{loading
									? 'Fetching verified listings…'
									: `${properties.length} verified rental propert${properties.length === 1 ? 'y' : 'ies'} available`}
							</p>
						</div>

						{/* Stat cards */}
						{!loading && properties.length > 0 && (
							<div className="flex gap-3 flex-wrap lg:flex-nowrap">
								<div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
									<BadgeCheck className="w-5 h-5 text-teal-500 shrink-0" />
									<div>
										<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">
											Verified
										</p>
										<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
											{properties.length}
										</p>
									</div>
								</div>
								{stats.managed > 0 && (
									<div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
										<Building2 className="w-5 h-5 text-purple-500 shrink-0" />
										<div>
											<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">
												Managed
											</p>
											<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
												{stats.managed}
											</p>
										</div>
									</div>
								)}
								{stats.bhks.length > 0 && (
									<div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
										<BedDouble className="w-5 h-5 text-amber-500 shrink-0" />
										<div>
											<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">
												BHK Types
											</p>
											<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
												{stats.bhks.join(', ')}
											</p>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ── Filter + Sort bar ── */}
			<div className="sticky top-16 md:top-20 z-30 bg-white/90 dark:bg-[#0b1220]/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5 shadow-sm">
				<div className="container-custom py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
					{/* BHK chips */}
					<div className="flex items-center gap-1.5 shrink-0">
						<SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
						{BHK_FILTERS.map((b) => (
							<button
								key={b}
								onClick={() => setBhkFilter(b)}
								className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
									bhkFilter === b
										? 'bg-teal-600 text-white shadow-sm shadow-teal-500/30'
										: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
								}`}
							>
								{b === 'All' ? 'All BHK' : `${b} BHK`}
							</button>
						))}
					</div>

					{/* Spacer */}
					<div className="flex-1" />

					{/* Count + Sort */}
					<div className="flex items-center gap-3 shrink-0">
						<span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
							{sorted.length} properties
						</span>

						<div className="relative">
							<button
								onClick={() => setSortOpen((p) => !p)}
								className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 hover:border-teal-400 transition-colors"
							>
								<ArrowUpDown className="w-3 h-3" />
								{sortBy === 'price_low'
									? 'Low → High'
									: sortBy === 'price_high'
									? 'High → Low'
									: 'Sort'}
								<ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
							</button>
							{sortOpen && (
								<div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
									{[
										{ value: '', label: 'Default' },
										{ value: 'price_low', label: 'Price: Low → High' },
										{ value: 'price_high', label: 'Price: High → Low' },
									].map((opt) => (
										<button
											key={opt.value}
											onClick={() => {
												setSortBy(opt.value);
												setSortOpen(false);
											}}
											className={`w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
												sortBy === opt.value
													? 'text-teal-600 dark:text-teal-400 font-semibold'
													: 'text-slate-700 dark:text-slate-300'
											}`}
										>
											{opt.label}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* ── Properties Grid ── */}
			<section className="py-10 bg-white dark:bg-[#0b1220]">
				<div className="container-custom">
					{/* Loading skeleton */}
					{loading && (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[...Array(8)].map((_, i) => (
								<div
									key={i}
									className="rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5"
								>
									<div className="h-48 bg-slate-100 dark:bg-white/5 animate-pulse" />
									<div className="p-4 space-y-3">
										<div className="h-4 bg-slate-100 dark:bg-white/5 rounded animate-pulse w-3/4" />
										<div className="h-3 bg-slate-100 dark:bg-white/5 rounded animate-pulse w-1/2" />
										<div className="h-8 bg-slate-100 dark:bg-white/5 rounded animate-pulse w-1/3 mt-2" />
									</div>
								</div>
							))}
						</div>
					)}

					{/* Results */}
					{!loading && sorted.length > 0 && (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{sorted.map((property, i) => (
								<div
									key={property.id || property._id}
									style={{ animationDelay: `${i * 50}ms` }}
									className="animate-fadeUp"
								>
									<PropertyCard property={property} isGrid />
								</div>
							))}
						</div>
					)}

					{/* Empty state */}
					{!loading && sorted.length === 0 && (
						<div className="text-center py-24 max-w-md mx-auto">
							<div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-100 to-sky-100 dark:from-teal-900/30 dark:to-sky-900/30 flex items-center justify-center mx-auto mb-6 shadow-inner">
								<Home className="w-9 h-9 text-teal-500" />
							</div>
							<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
								{bhkFilter !== 'All'
									? `No ${bhkFilter} BHK listings yet`
									: `No listings yet in ${locationName}`}
							</h2>
							<p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
								{bhkFilter !== 'All'
									? `Try a different BHK type or view all properties in ${locationName}.`
									: `We're actively adding verified properties here. Want to be notified when new homes become available?`}
							</p>
							<div className="flex gap-3 justify-center flex-wrap">
								{bhkFilter !== 'All' ? (
									<button
										onClick={() => setBhkFilter('All')}
										className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors"
									>
										Show All BHK
									</button>
								) : (
									<Link
										to="/contact"
										className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors"
									>
										Get Notified
									</Link>
								)}
								<Link
									to="/all-properties"
									className="px-6 py-2.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
								>
									All Properties
								</Link>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* ── SEO + Nearby ── */}
			{!loading && (
				<section className="py-14 bg-slate-50 dark:bg-[#080f1e] border-t border-slate-100 dark:border-white/5">
					<div className="container-custom">
						<div className="grid lg:grid-cols-2 gap-12">
							{/* About section */}
							<div>
								<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
									Renting in {locationName}
								</h2>
								<div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
									<p>
										{locationName} is one of the most sought-after rental
										destinations in the Greater Noida and Noida region.
										Whether you're looking for{' '}
										{urlBeds ? `a ${urlBeds} BHK flat` : 'a 1, 2, or 3 BHK flat'}{' '}
										in {locationName}, InstaMakaan offers verified, managed
										rental homes with complete transparency on pricing.
									</p>
									<p>
										All properties on InstaMakaan go through owner
										verification and a quality check before listing. You
										get complete details including rent, security deposit,
										furnishing, and amenities upfront.
									</p>
									<p>
										Looking for something specific?{' '}
										<Link
											to="/contact"
											className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
										>
											Use our concierge service
										</Link>{' '}
										and our team will shortlist properties in {locationName}{' '}
										based on your budget and requirements.
									</p>
									<p>
										New to renting?{' '}
										<Link
											to="/guides/renting-a-property-in-noida"
											className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
										>
											Read our complete renting guide
										</Link>{' '}
										for the full process, documents needed, and tips.
									</p>
								</div>

								{/* Trust badges */}
								<div className="mt-6 flex flex-wrap gap-2">
									{[
										'Owner Verified',
										'Transparent Pricing',
										'Managed Homes',
										'Instant Move-in',
									].map((badge) => (
										<span
											key={badge}
											className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800/50"
										>
											<BadgeCheck className="w-3 h-3" />
											{badge}
										</span>
									))}
								</div>

								<Link
									to={`/society-reviews/${locationName.toLowerCase().replace(/\s+/g, '-')}`}
									className="mt-4 inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
								>
									Read the {locationName} review — pros, cons &amp; overview
									<ChevronRight className="w-4 h-4" />
								</Link>
							</div>

							{/* Nearby areas */}
							<div>
								<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
									Explore Nearby Areas
								</h2>
								<div className="grid grid-cols-2 gap-2">
									{NEARBY.slice(0, 8).map((area) => (
										<Link
											key={area}
											to={`/rent/flats-for-rent-in-${area
												.toLowerCase()
												.replace(/\s+/g, '-')}`}
											className="group flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all"
										>
											<MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-colors shrink-0" />
											<span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-1">
												{area}
											</span>
										</Link>
									))}
								</div>

								<Link
									to="/all-properties"
									className="mt-4 flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
								>
									View all properties across Noida & Greater Noida
									<ChevronRight className="w-4 h-4" />
								</Link>

								<Link
									to="/areas/greater-noida-west"
									className="mt-2 flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
								>
									Explore the Greater Noida West area guide
									<ChevronRight className="w-4 h-4" />
								</Link>
							</div>
						</div>
					</div>
				</section>
			)}

			{/* ── Dynamic FAQ ── */}
			{!loading && (
				<DynamicFAQ
					faqs={generateLocalityFAQs(locationName, properties)}
					heading={`FAQs — Renting in ${locationName}`}
					className="border-t border-slate-100 dark:border-white/5"
				/>
			)}

			<style>{`
				@keyframes fadeUp {
					from { opacity: 0; transform: translateY(16px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				.animate-fadeUp {
					animation: fadeUp 0.4s ease-out both;
				}
			`}</style>
		</Layout>
	);
};

export default LocalityPage;
