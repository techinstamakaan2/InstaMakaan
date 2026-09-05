import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import MobileBottomBar from '@/components/MobileBottomBar';
import api from '@/lib/api';
import { PROJECT_REVIEWS } from '@/data/projectReviewsData';
import { MapPin, ChevronRight, Search, Building2, Star, Layers } from 'lucide-react';

const TYPE_BADGE = {
	Commercial: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300' },
	Residential: { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300' },
	Plots: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
	'Plots / Villas': { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
	'Luxury Studios': { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300' },
	'Mixed-Use Commercial': { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
};

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

	const filteredAreas = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return areas;
		return areas.filter((a) => a.toLowerCase().includes(q));
	}, [areas, query]);

	const filteredProjects = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return PROJECT_REVIEWS;
		return PROJECT_REVIEWS.filter((p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
	}, [query]);

	return (
		<Layout>
			<Helmet>
				<title>Society &amp; Project Reviews — Noida &amp; Greater Noida | InstaMakaan</title>
				<meta
					name="description"
					content="Independent overviews of societies, projects and localities across Noida and Greater Noida — connectivity, amenities, and things to know before you rent or buy."
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
						{PROJECT_REVIEWS.length} Projects &amp; {areas.length > 0 ? areas.length : 'Many'} Societies
					</div>
					<h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
						<span className="text-[#42949C]">Society &amp; Project</span>{' '}
						<span className="text-[#F5C94D]">Reviews</span>
					</h1>
					<p className="mt-4 text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto">
						Independent overviews to help you decide — connectivity, amenities, construction quality and things to know
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
							placeholder="Search a project, society or locality…"
							className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all shadow-sm"
						/>
					</div>
				</div>
			</section>

			<section className="py-10 bg-white dark:bg-[#0b1220]">
				<div className="container-custom">
					
					{/* Featured Projects Section */}
					{filteredProjects.length > 0 && (
						<div className="mb-12">
							<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
								<Layers className="w-5 h-5 text-teal-500" /> Featured Project Reviews
							</h2>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{filteredProjects.map((project, i) => {
									const badge = TYPE_BADGE[project.type] || TYPE_BADGE.Commercial;
									return (
										<Link
											key={project.slug}
											to={`/society-reviews/${project.slug}`}
											style={{ animationDelay: `${i * 40}ms` }}
											className="group animate-fadeUp flex flex-col p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-0.5 transition-all"
										>
											<div className="flex items-center justify-between mb-3">
												<span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
													<Building2 className="w-3 h-3" />
													{project.type}
												</span>
												<div className="flex items-center gap-1">
													<Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
													<span className="text-sm font-bold text-slate-800 dark:text-white">{project.overallScore.toFixed(1)}</span>
												</div>
											</div>
											<h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-1">
												{project.name}
											</h3>
											<div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400 dark:text-slate-500">
												<MapPin className="w-3 h-3 shrink-0" />
												<span className="line-clamp-1">{project.location}</span>
											</div>
											<p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">
												by {project.developer.split('(')[0].trim()}
											</p>
											<div className="mt-3 flex flex-wrap gap-1.5">
												{project.bestFor.slice(0, 3).map((tag) => (
													<span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
														{tag}
													</span>
												))}
											</div>
											<div className="mt-auto pt-3 flex items-center gap-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 group-hover:gap-2 transition-all">
												Read project review <ChevronRight className="w-3.5 h-3.5" />
											</div>
										</Link>
									);
								})}
							</div>
						</div>
					)}

					{/* Localities Section */}
					<div>
						<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
							<MapPin className="w-5 h-5 text-teal-500" /> Locality &amp; Society Overviews
						</h2>
						{loading && (
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
								))}
							</div>
						)}
						{!loading && filteredAreas.length === 0 && (
							<p className="text-center text-slate-500 dark:text-slate-400 py-10">
								{areas.length === 0 ? 'No societies available yet.' : `No locality matches for "${query}".`}
							</p>
						)}
						{!loading && filteredAreas.length > 0 && (
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{filteredAreas.map((area, i) => (
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
