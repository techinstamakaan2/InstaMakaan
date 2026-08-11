import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import MobileBottomBar from '@/components/MobileBottomBar';
import api from '@/lib/api';
import { getSocietyInsights } from '@/data/societyInsights';
import {
	MapPin,
	ChevronRight,
	CheckCircle2,
	AlertTriangle,
	MessageSquarePlus,
	Home,
	FileText,
	ListChecks,
	Building2,
	Users,
	Sparkles,
	BadgeCheck,
} from 'lucide-react';

function toSlug(name) {
	return (name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function toTitleCase(str) {
	return (str || '').replace(/\b\w/g, (c) => c.toUpperCase());
}

const ScoreBar = ({ label, value }) => (
	<div>
		<div className="flex items-center justify-between mb-1.5">
			<span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
			<span className="text-sm font-semibold text-slate-800 dark:text-white">{value.toFixed(1)}/5</span>
		</div>
		<div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
			<div
				className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-500"
				style={{ width: `${(value / 5) * 100}%` }}
			/>
		</div>
	</div>
);

const SocietyReviewPage = () => {
	const { slug } = useParams();
	const [areas, setAreas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [properties, setProperties] = useState([]);
	const [propsLoading, setPropsLoading] = useState(true);

	useEffect(() => {
		api
			.get('/properties/locations')
			.then((res) => {
				const list = [...(res.data?.localities || []), ...(res.data?.sectors || [])].filter(Boolean);
				setAreas(list);
			})
			.catch(() => setAreas([]))
			.finally(() => setLoading(false));
	}, []);

	const societyName = useMemo(() => {
		const match = areas.find((a) => toSlug(a) === slug);
		return match || toTitleCase((slug || '').replace(/-/g, ' '));
	}, [areas, slug]);

	// Real, live data — not placeholder — pulled from actual listings for this area
	useEffect(() => {
		if (!societyName) return;
		setPropsLoading(true);
		api
			.get(`/properties?search=${encodeURIComponent(societyName)}&limit=200`)
			.then((res) => setProperties(res.data?.data || []))
			.catch(() => setProperties([]))
			.finally(() => setPropsLoading(false));
	}, [societyName]);

	const liveStats = useMemo(() => {
		const rentals = properties.filter((p) => p.property_type === 'rent');
		const rents = rentals
			.map((p) => Number(p.monthly_rent_amount) || 0)
			.filter((n) => n > 0);
		const avgRent = rents.length ? Math.round(rents.reduce((a, b) => a + b, 0) / rents.length) : null;
		const bhks = [...new Set(properties.map((p) => p.beds).filter(Boolean))].sort();
		return {
			total: properties.length,
			rentals: rentals.length,
			avgRent,
			bhks,
		};
	}, [properties]);

	const insights = useMemo(() => getSocietyInsights(societyName), [societyName]);
	const rentSlug = toSlug(societyName);
	const pageTitle = `${societyName} Review — Overview, Pros & Cons | InstaMakaan`;
	const metaDesc = `${societyName} overview — connectivity, amenities, things to know before you rent or buy, and what to consider. Independent overview by InstaMakaan.`;
	const canonicalUrl = `https://instamakaan.com/society-reviews/${rentSlug}`;

	const otherSocieties = useMemo(
		() => areas.filter((a) => a !== societyName).slice(0, 6),
		[areas, societyName],
	);

	const articleSchema = useMemo(
		() => ({
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: `${societyName} Review — Overview, Pros & Cons`,
			author: { '@type': 'Organization', name: 'InstaMakaan' },
			publisher: { '@type': 'Organization', name: 'InstaMakaan' },
			about: societyName,
			mainEntityOfPage: canonicalUrl,
		}),
		[societyName, canonicalUrl],
	);

	const breadcrumbJsonLd = useMemo(
		() => ({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://instamakaan.com/' },
				{ '@type': 'ListItem', position: 2, name: 'Society Reviews', item: 'https://instamakaan.com/society-reviews' },
				{ '@type': 'ListItem', position: 3, name: societyName, item: canonicalUrl },
			],
		}),
		[societyName, canonicalUrl],
	);

	if (!loading && !societyName) {
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
				<title>{pageTitle}</title>
				<meta name="description" content={metaDesc} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={metaDesc} />
				<script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
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
				<div
					className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
					style={{
						backgroundImage:
							'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
						backgroundSize: '40px 40px',
					}}
				/>

				<div className="relative container-custom">
					<nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
						<Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						<Link to="/society-reviews" className="hover:text-teal-600 transition-colors">Society Reviews</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						<span className="text-slate-700 dark:text-slate-200 font-medium">{societyName}</span>
					</nav>

					<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
						<div className="max-w-2xl">
							<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-4">
								<MapPin className="w-3.5 h-3.5" />
								{societyName}
							</div>
							<h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
								{societyName} <span className="text-teal-600 dark:text-teal-400">Review</span>
							</h1>
							<p className="mt-3 text-slate-500 dark:text-slate-400 text-base">
								An independent overview to help you decide — connectivity, amenities, and things to know
								before you rent or buy in {societyName}.
							</p>

							{/* Best for tags */}
							<div className="mt-4 flex flex-wrap gap-2">
								{insights.bestFor.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
									>
										<Users className="w-3 h-3 text-teal-500" />
										Best for {tag}
									</span>
								))}
							</div>
						</div>

						{/* Overall score badge */}
						<div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm shrink-0">
							<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center shrink-0">
								<span className="text-white font-bold text-base">{insights.overallScore.toFixed(1)}</span>
							</div>
							<div>
								<p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Editorial Score</p>
								<p className="text-[11px] text-slate-400 dark:text-slate-500">InstaMakaan assessment</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Quick facts — real data from live listings */}
			<section className="py-6 bg-white dark:bg-[#0b1220] border-b border-slate-100 dark:border-white/5">
				<div className="container-custom">
					<div className="flex flex-wrap gap-3">
						<div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
							<BadgeCheck className="w-5 h-5 text-teal-500 shrink-0" />
							<div>
								<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">Live Listings</p>
								<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
									{propsLoading ? '…' : liveStats.total}
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
								<Building2 className="w-5 h-5 text-amber-500 shrink-0" />
								<div>
									<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">BHK Types</p>
									<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
										{liveStats.bhks.join(', ')}
									</p>
								</div>
							</div>
						)}
						<div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
							<CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
							<div>
								<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">Highlights</p>
								<p className="text-base font-bold text-slate-900 dark:text-white leading-none">
									{insights.highlights.length}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Overview + Editorial Scores */}
			<section className="py-12 bg-white dark:bg-[#0b1220]">
				<div className="container-custom grid lg:grid-cols-3 gap-10">
					<div className="lg:col-span-2">
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-teal-500" /> Overview
						</h2>
						<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{insights.overview}</p>

						<div className="mt-6 rounded-2xl border border-teal-100 dark:border-teal-800/30 bg-teal-50/50 dark:bg-teal-900/10 p-5">
							<h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Our Verdict</h3>
							<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{insights.verdict}</p>
						</div>
					</div>

					<div>
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Editorial Ratings</h2>
						<div className="space-y-4 p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5">
							{insights.scores.map((s) => (
								<ScoreBar key={s.key} label={s.label} value={s.value} />
							))}
						</div>
						<p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
							Scores reflect InstaMakaan's general editorial assessment based on locality and amenity
							factors — not a survey of individual residents.
						</p>
					</div>
				</div>
			</section>

			{/* Highlights / Considerations */}
			<section className="py-4 pb-12 bg-white dark:bg-[#0b1220]">
				<div className="container-custom grid lg:grid-cols-2 gap-8">
					<div>
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
							<CheckCircle2 className="w-5 h-5 text-teal-500" /> Highlights
						</h2>
						<div className="space-y-2.5">
							{insights.highlights.map((item) => (
								<div
									key={item}
									className="flex items-start gap-3 p-3.5 rounded-xl border border-teal-100 dark:border-teal-800/30 bg-teal-50/50 dark:bg-teal-900/10"
								>
									<CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
									<span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
								</div>
							))}
						</div>
					</div>
					<div>
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-amber-500" /> Things to Consider
						</h2>
						<div className="space-y-2.5">
							{insights.considerations.map((item) => (
								<div
									key={item}
									className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-100 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10"
								>
									<AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
									<span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Share your review CTA — replaces fake testimonials until real ones exist */}
				<div className="container-custom mt-10">
					<div className="rounded-2xl border border-teal-100 dark:border-teal-800/40 bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex items-start gap-3">
							<div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
								<MessageSquarePlus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
							</div>
							<div>
								<h3 className="font-semibold text-slate-800 dark:text-white">Lived in {societyName}?</h3>
								<p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
									Share your experience and help future residents make an informed decision.
								</p>
							</div>
						</div>
						<Link
							to="/contact"
							className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
						>
							Share Your Review
						</Link>
					</div>
				</div>

				{/* Cross-link to live listings */}
				<div className="container-custom mt-8 flex flex-wrap gap-x-6 gap-y-2">
					<Link
						to={`/rent/flats-for-rent-in-${rentSlug}`}
						className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
					>
						<Home className="w-4 h-4" />
						View {liveStats.total > 0 ? `${liveStats.total} ` : ''}
						{liveStats.total === 1 ? 'flat' : 'flats'} for rent in {societyName}
						<ChevronRight className="w-4 h-4" />
					</Link>
					<Link
						to="/services/tenant-verification-greater-noida-west"
						className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
					>
						Renting here? Get tenant verification done
						<ChevronRight className="w-4 h-4" />
					</Link>
					<Link
						to="/services/property-management-greater-noida"
						className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
					>
						Own property here? Explore management services
						<ChevronRight className="w-4 h-4" />
					</Link>
				</div>
			</section>

			{/* Other societies */}
			{otherSocieties.length > 0 && (
				<section className="py-14 bg-slate-50 dark:bg-[#080f1e] border-t border-slate-100 dark:border-white/5">
					<div className="container-custom">
						<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
							<ListChecks className="w-5 h-5 text-teal-500" /> Explore Other Societies
						</h2>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{otherSocieties.map((area) => (
								<Link
									key={area}
									to={`/society-reviews/${toSlug(area)}`}
									className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all"
								>
									<div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/40 transition-colors">
										<Building2 className="w-4 h-4 text-teal-500" />
									</div>
									<span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-1 flex-1">
										{area}
									</span>
									<ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
								</Link>
							))}
						</div>
						<Link
							to="/society-reviews"
							className="mt-6 inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
						>
							View all society reviews
							<ChevronRight className="w-4 h-4" />
						</Link>
					</div>
				</section>
			)}

			<MobileBottomBar
				message={`Hi, I'd like to know more about renting/buying in ${societyName}`}
				browsePath={`/rent/flats-for-rent-in-${rentSlug}`}
				browseLabel="Listings"
			/>
		</Layout>
	);
};

export default SocietyReviewPage;
