import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import DynamicFAQ from '@/components/DynamicFAQ';
import MobileBottomBar from '@/components/MobileBottomBar';
import api from '@/lib/api';
import { getAreaHub, getAllAreaHubs } from '@/data/areaHubs';
import { getPillarGuide } from '@/data/pillarGuides';
import { getService } from '@/data/servicesData';
import {
	MapPin,
	ChevronRight,
	CheckCircle2,
	ArrowRight,
	BadgeCheck,
	Home,
	Building2,
	BedDouble,
	Compass,
	Briefcase,
	ListChecks,
} from 'lucide-react';

function toSlug(name) {
	return (name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const AreaHubPage = () => {
	const { slug } = useParams();
	const hub = getAreaHub(slug);
	const otherHubs = useMemo(() => getAllAreaHubs().filter((h) => h.slug !== slug), [slug]);

	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!hub?.hasLiveData) {
			setLoading(false);
			return;
		}
		setLoading(true);
		api
			.get('/properties?property_type=rent&limit=500')
			.then((res) => {
				const all = res.data?.data || [];
				const inArea = all.filter((p) => (p.city || '').toLowerCase().includes('greater noida'));
				setProperties(inArea);
			})
			.catch(() => setProperties([]))
			.finally(() => setLoading(false));
	}, [hub?.hasLiveData]);

	const liveStats = useMemo(() => {
		const rents = properties
			.map((p) => Number(p.monthly_rent_amount || p.price) || 0)
			.filter((n) => n > 0);
		const avgRent = rents.length ? Math.round(rents.reduce((a, b) => a + b, 0) / rents.length) : null;
		const bhks = [...new Set(properties.map((p) => p.beds).filter(Boolean))].sort();
		return { total: properties.length, avgRent, bhks };
	}, [properties]);

	const relatedGuide = hub?.relatedGuide ? getPillarGuide(hub.relatedGuide) : null;
	const relatedServices = useMemo(
		() =>
			(hub?.relatedServices || [])
				.map((s) => {
					const data = getService(s);
					return data ? { slug: s, ...data } : null;
				})
				.filter(Boolean),
		[hub],
	);

	if (!hub) return <Navigate to="/areas" replace />;

	const canonicalUrl = `https://instamakaan.com/areas/${slug}`;

	const placeSchema = {
		'@context': 'https://schema.org',
		'@type': 'Place',
		name: hub.title,
		description: hub.metaDescription,
	};

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://instamakaan.com/' },
			{ '@type': 'ListItem', position: 2, name: 'Areas', item: 'https://instamakaan.com/areas' },
			{ '@type': 'ListItem', position: 3, name: hub.shortTitle, item: canonicalUrl },
		],
	};

	return (
		<Layout>
			<Helmet>
				<title>{hub.metaTitle}</title>
				<meta name="description" content={hub.metaDescription} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={hub.metaTitle} />
				<meta property="og:description" content={hub.metaDescription} />
				<script type="application/ld+json">{JSON.stringify(placeSchema)}</script>
				<script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
			</Helmet>

			{/* Hero */}
			<section className="relative pt-28 pb-10 -mt-14 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-sky-50 dark:from-[#0a1628] dark:via-[#0b1220] dark:to-[#0a1628]" />
				<div
					className="absolute inset-0 opacity-60"
					style={{
						background:
							'radial-gradient(ellipse at 10% 50%, rgba(45,212,191,0.15) 0%, transparent 60%), radial-gradient(ellipse at 90% 20%, rgba(56,189,248,0.12) 0%, transparent 60%)',
					}}
				/>
				<div className="relative container-custom">
					<nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
						<Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						<Link to="/areas" className="hover:text-teal-600 transition-colors">Areas</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						<span className="text-slate-700 dark:text-slate-200 font-medium">{hub.shortTitle}</span>
					</nav>

					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-4">
							<MapPin className="w-3.5 h-3.5" />
							{hub.kicker}
						</div>
						<h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
							<span className="text-teal-600 dark:text-teal-400">{hub.title}</span>{' '}
							<span className="text-amber-500 dark:text-amber-400">Real Estate Guide</span>
						</h1>
						<p className="mt-4 text-slate-500 dark:text-slate-400 text-base">{hub.heroSubtitle}</p>

						<div className="mt-6 flex flex-wrap gap-3">
							<Link
								to="/rent"
								className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
							>
								Browse Verified Rentals
								<ArrowRight className="w-4 h-4" />
							</Link>
							<Link
								to="/buy"
								className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
							>
								Explore Properties to Buy
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Live stats strip — only for areas with real, distinct inventory */}
			{hub.hasLiveData && (
				<section className="py-6 bg-white dark:bg-[#0b1220] border-b border-slate-100 dark:border-white/5">
					<div className="container-custom">
						<div className="flex flex-wrap gap-3">
							<div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
								<BadgeCheck className="w-5 h-5 text-teal-500 shrink-0" />
								<div>
									<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">Live Listings</p>
									<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
										{loading ? '…' : liveStats.total}
									</p>
								</div>
							</div>
							{liveStats.avgRent && (
								<div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
									<Home className="w-5 h-5 text-sky-500 shrink-0" />
									<div>
										<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">Avg. Rent</p>
										<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
											₹{liveStats.avgRent.toLocaleString('en-IN')}/mo
										</p>
									</div>
								</div>
							)}
							{liveStats.bhks.length > 0 && (
								<div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
									<BedDouble className="w-5 h-5 text-amber-500 shrink-0" />
									<div>
										<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">BHK Types</p>
										<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
											{liveStats.bhks.join(', ')}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Honest redirect callout for areas without distinct live data yet */}
			{!hub.hasLiveData && (
				<section className="py-6 bg-white dark:bg-[#0b1220] border-b border-slate-100 dark:border-white/5">
					<div className="container-custom">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-teal-100 dark:border-teal-800/40 bg-teal-50/50 dark:bg-teal-900/10 p-5">
							<div className="flex items-start gap-3">
								<Compass className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
								<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
									Our current verified listings are concentrated in the{' '}
									<Link to="/areas/greater-noida-west" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
										Greater Noida West corridor
									</Link>
									. We're actively expanding coverage in {hub.shortTitle} — browse what's live today or get notified.
								</p>
							</div>
							<Link
								to="/contact"
								className="shrink-0 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
							>
								Get Notified
							</Link>
						</div>
					</div>
				</section>
			)}

			{/* Overview + Why */}
			<section className="py-12 bg-white dark:bg-[#0b1220]">
				<div className="container-custom grid lg:grid-cols-3 gap-10">
					<div className="lg:col-span-2">
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Overview</h2>
						<div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
							{hub.overview.map((p) => (
								<p key={p.slice(0, 24)}>{p}</p>
							))}
						</div>

						<h2 className="text-lg font-bold text-slate-800 dark:text-white mt-8 mb-3">Connectivity</h2>
						<div className="space-y-2.5">
							{hub.connectivity.map((item) => (
								<div
									key={item}
									className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5"
								>
									<Compass className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
									<span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item}</span>
								</div>
							))}
						</div>
					</div>

					<div>
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Why {hub.shortTitle}</h2>
						<div className="space-y-2.5">
							{hub.whyPoints.map((item) => (
								<div
									key={item}
									className="flex items-start gap-3 p-3.5 rounded-xl border border-teal-100 dark:border-teal-800/30 bg-teal-50/50 dark:bg-teal-900/10"
								>
									<CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
									<span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Key localities */}
			<section className="py-4 pb-14 bg-white dark:bg-[#0b1220]">
				<div className="container-custom">
					<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
						<Building2 className="w-5 h-5 text-teal-500" /> Key Localities in {hub.shortTitle}
					</h2>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{hub.keyLocalities.map((loc) => (
							<Link
								key={loc.slug}
								to={`/rent/flats-for-rent-in-${loc.slug}`}
								className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all"
							>
								<div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/40 transition-colors">
									<MapPin className="w-4 h-4 text-teal-500" />
								</div>
								<span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-1 flex-1">
									{loc.name}
								</span>
								<ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
							</Link>
						))}
					</div>

					{hub.keySocieties && hub.keySocieties.length > 0 && (
						<>
							<h2 className="text-lg font-bold text-slate-800 dark:text-white mt-10 mb-5 flex items-center gap-2">
								<ListChecks className="w-5 h-5 text-teal-500" /> Popular Societies
							</h2>
							<div className="flex flex-wrap gap-2.5">
								{hub.keySocieties.map((soc) => (
									<Link
										key={soc}
										to={`/society-reviews/${toSlug(soc)}`}
										className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300 transition-all"
									>
										<MapPin className="w-3 h-3 text-teal-500" />
										{soc}
									</Link>
								))}
							</div>
						</>
					)}
				</div>
			</section>

			{/* FAQs */}
			<DynamicFAQ
				faqs={hub.faqs}
				heading={`FAQs — ${hub.shortTitle}`}
				className="bg-slate-50 dark:bg-[#080f1e] border-t border-slate-100 dark:border-white/5"
			/>

			{/* CTA + cross-links */}
			<section className="py-14 bg-white dark:bg-[#0b1220] border-t border-slate-100 dark:border-white/5">
				<div className="container-custom max-w-4xl">
					<div className="rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/10 border border-teal-100 dark:border-teal-800/40 p-8 text-center">
						<h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
							Looking for a home in {hub.shortTitle}?
						</h3>
						<p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
							Browse verified rental listings or explore builder-partner projects to buy.
						</p>
						<div className="flex flex-wrap gap-3 justify-center">
							<Link
								to="/rent"
								className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
							>
								Browse Verified Rentals
								<ArrowRight className="w-4 h-4" />
							</Link>
							{relatedGuide && (
								<Link
									to={`/guides/${hub.relatedGuide}`}
									className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
								>
									Read: {relatedGuide.title}
								</Link>
							)}
						</div>
					</div>

					{relatedServices.length > 0 && (
						<div className="mt-10">
							<h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-4 text-center">
								Related Services
							</h3>
							<div className="flex flex-wrap gap-3 justify-center">
								{relatedServices.map((s) => (
									<Link
										key={s.slug}
										to={`/services/${s.slug}`}
										className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 text-sm text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition-all"
									>
										<Briefcase className="w-3.5 h-3.5" />
										{s.title}
									</Link>
								))}
							</div>
						</div>
					)}

					{otherHubs.length > 0 && (
						<div className="mt-8 flex flex-wrap gap-3 justify-center">
							{otherHubs.map((h) => (
								<Link
									key={h.slug}
									to={`/areas/${h.slug}`}
									className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
								>
									Explore {h.shortTitle}
									<ChevronRight className="w-4 h-4" />
								</Link>
							))}
						</div>
					)}
				</div>
			</section>

			<MobileBottomBar
				message={`Hi, I'd like to know more about property in ${hub.shortTitle}`}
				browsePath="/rent"
				browseLabel="Rentals"
			/>
		</Layout>
	);
};

export default AreaHubPage;
