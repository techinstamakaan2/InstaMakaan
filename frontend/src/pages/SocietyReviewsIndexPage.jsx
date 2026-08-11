import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import MobileBottomBar from '@/components/MobileBottomBar';
import api from '@/lib/api';
import { MapPin, ChevronRight, Search, Building2 } from 'lucide-react';

function toSlug(name) {
	return (name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const SocietyReviewsIndexPage = () => {
	const [areas, setAreas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');

	useEffect(() => {
		api
			.get('/properties/locations')
			.then((res) => {
				const list = [...new Set(
					[...(res.data?.localities || []), ...(res.data?.sectors || [])].filter(Boolean)
				)].sort();
				setAreas(list);
			})
			.catch(() => setAreas([]))
			.finally(() => setLoading(false));
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return areas;
		return areas.filter((a) => a.toLowerCase().includes(q));
	}, [areas, query]);

	return (
		<Layout>
			<Helmet>
				<title>Society &amp; Locality Reviews — Noida &amp; Greater Noida | InstaMakaan</title>
				<meta
					name="description"
					content="Independent overviews of societies and localities across Noida and Greater Noida — connectivity, amenities, and things to know before you rent or buy."
				/>
				<link rel="canonical" href="https://instamakaan.com/society-reviews" />
			</Helmet>

			<section className="relative pt-28 pb-12 -mt-14 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-sky-50 dark:from-[#0a1628] dark:via-[#0b1220] dark:to-[#0a1628]" />
				<div
					className="absolute inset-0 opacity-60"
					style={{
						background:
							'radial-gradient(ellipse at 10% 50%, rgba(45,212,191,0.15) 0%, transparent 60%), radial-gradient(ellipse at 90% 20%, rgba(56,189,248,0.12) 0%, transparent 60%)',
					}}
				/>
				<div className="relative container-custom text-center">
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-4">
						<Building2 className="w-3.5 h-3.5" />
						{areas.length > 0 ? `${areas.length} Societies Covered` : 'Society Reviews'}
					</div>
					<h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
						Society &amp; Locality <span className="text-teal-600 dark:text-teal-400">Reviews</span>
					</h1>
					<p className="mt-4 text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto">
						Independent overviews to help you decide — connectivity, amenities and things to know
						before you rent or buy.
					</p>
					<Link
						to="/areas"
						className="mt-3 inline-block text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
					>
						Explore area-by-area guides →
					</Link>

					{/* Search */}
					<div className="mt-8 max-w-md mx-auto relative">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search a society or locality…"
							className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all shadow-sm"
						/>
					</div>
				</div>
			</section>

			<section className="py-10 bg-white dark:bg-[#0b1220]">
				<div className="container-custom">
					{loading && (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{[...Array(6)].map((_, i) => (
								<div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
							))}
						</div>
					)}
					{!loading && filtered.length === 0 && (
						<p className="text-center text-slate-500 dark:text-slate-400 py-10">
							{areas.length === 0 ? 'No societies available yet.' : `No matches for "${query}".`}
						</p>
					)}
					{!loading && filtered.length > 0 && (
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{filtered.map((area, i) => (
								<Link
									key={area}
									to={`/society-reviews/${toSlug(area)}`}
									style={{ animationDelay: `${i * 30}ms` }}
									className="group animate-fadeUp flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-0.5 transition-all"
								>
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-900/30 dark:to-sky-900/20 flex items-center justify-center shrink-0 group-hover:from-teal-100 group-hover:to-sky-100 dark:group-hover:from-teal-800/40 transition-colors">
										<MapPin className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
									</div>
									<div className="flex-1 min-w-0">
										<span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-1 block">
											{area}
										</span>
										<span className="text-[11px] text-slate-400 dark:text-slate-500">View overview</span>
									</div>
									<ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
								</Link>
							))}
						</div>
					)}
				</div>
			</section>

			<style>{`
				@keyframes fadeUp {
					from { opacity: 0; transform: translateY(10px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				.animate-fadeUp {
					animation: fadeUp 0.35s ease-out both;
				}
			`}</style>

			<MobileBottomBar
				message="Hi, I'd like to know more about societies in Noida & Greater Noida"
				browsePath="/society-reviews"
				browseLabel="Societies"
			/>
		</Layout>
	);
};

export default SocietyReviewsIndexPage;
