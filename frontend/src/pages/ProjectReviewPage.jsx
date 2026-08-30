import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import MobileBottomBar from '@/components/MobileBottomBar';
import { PROJECT_REVIEWS, getProjectReview } from '@/data/projectReviewsData';
import {
	MapPin,
	ChevronRight,
	CheckCircle2,
	AlertTriangle,
	MessageSquarePlus,
	Building2,
	Users,
	Sparkles,
	BadgeCheck,
	ListChecks,
	FileText,
	Star,
	ShieldCheck,
	Layers,
	IndianRupee,
	Home,
	Briefcase,
} from 'lucide-react';

const TYPE_BADGE = {
	Commercial: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300' },
	Residential: { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300' },
	Plots: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
	'Plots / Villas': { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
	'Luxury Studios': { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300' },
	'Mixed-Use Commercial': { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
};

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

const KEY_FACT_ICONS = {
	rera: ShieldCheck,
	bsp: IndianRupee,
	unitTypes: Layers,
	towerHeight: Building2,
	clubhouse: Sparkles,
	township: Home,
	elevators: Layers,
	amenities: Star,
	greenBelt: Sparkles,
	parking: Layers,
	roadFrontage: MapPin,
	entrance: MapPin,
	paymentPlan: FileText,
	totalArea: MapPin,
	roadWidth: MapPin,
	highlight: Star,
	catchment: Users,
	anchor: Briefcase,
};

const ProjectReviewPage = () => {
	const { slug } = useParams();
	const review = useMemo(() => getProjectReview(slug), [slug]);

	const otherProjects = useMemo(
		() => PROJECT_REVIEWS.filter((p) => p.slug !== slug).slice(0, 6),
		[slug],
	);

	if (!review) {
		return (
			<Layout>
				<div className="min-h-[60vh] flex items-center justify-center">
					<div className="text-center">
						<p className="text-slate-500 dark:text-slate-400 mb-4">Project not found.</p>
						<Link
							to="/society-reviews"
							className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline"
						>
							← Back to all project reviews
						</Link>
					</div>
				</div>
			</Layout>
		);
	}

	const badge = TYPE_BADGE[review.type] || TYPE_BADGE.Commercial;
	const pageTitle = `${review.name} Review — Overview, Pros & Cons | InstaMakaan`;
	const metaDesc = `${review.name} review — editorial overview of construction quality, amenities, location, value for money, and builder track record. Independent assessment by InstaMakaan.`;
	const canonicalUrl = `https://instamakaan.com/society-reviews/${slug}`;

	const articleSchema = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: `${review.name} Review — Overview, Pros & Cons`,
		author: { '@type': 'Organization', name: 'InstaMakaan' },
		publisher: { '@type': 'Organization', name: 'InstaMakaan' },
		about: review.name,
		mainEntityOfPage: canonicalUrl,
	};

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://instamakaan.com/' },
			{ '@type': 'ListItem', position: 2, name: 'Project Reviews', item: 'https://instamakaan.com/society-reviews' },
			{ '@type': 'ListItem', position: 3, name: review.name, item: canonicalUrl },
		],
	};

	return (
		<Layout>
			<Helmet>
				<title>{pageTitle}</title>
				<meta name="description" content={metaDesc} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={metaDesc} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:type" content="article" />
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
						<Link to="/society-reviews" className="hover:text-teal-600 transition-colors">Project Reviews</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						<span className="text-slate-700 dark:text-slate-200 font-medium">{review.name}</span>
					</nav>

					<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
						<div className="max-w-2xl">
							<div className="flex flex-wrap items-center gap-2 mb-4">
								<div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.bg} ${badge.text} text-xs font-semibold`}>
									<Building2 className="w-3.5 h-3.5" />
									{review.type}
								</div>
								<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-medium">
									<MapPin className="w-3.5 h-3.5" />
									{review.location}
								</div>
							</div>
							<h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
								<span className="text-teal-600 dark:text-teal-400">{review.name}</span>{' '}
								<span className="text-amber-500 dark:text-amber-400">Review</span>
							</h1>
							<p className="mt-3 text-slate-500 dark:text-slate-400 text-base">
								An independent editorial overview — construction quality, amenities, location,
								value for money, and things to know before you invest in {review.name}.
							</p>

							{/* Best for tags */}
							<div className="mt-4 flex flex-wrap gap-2">
								{review.bestFor.map((tag) => (
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
								<span className="text-white font-bold text-base">{review.overallScore.toFixed(1)}</span>
							</div>
							<div>
								<p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Editorial Score</p>
								<p className="text-[11px] text-slate-400 dark:text-slate-500">InstaMakaan assessment</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Key Facts */}
			<section className="py-6 bg-white dark:bg-[#0b1220] border-b border-slate-100 dark:border-white/5">
				<div className="container-custom">
					<div className="flex flex-wrap gap-3">
						{Object.entries(review.keyFacts).map(([key, val]) => {
							const Icon = KEY_FACT_ICONS[key] || BadgeCheck;
							const label = key
								.replace(/([A-Z])/g, ' $1')
								.replace(/^./, (s) => s.toUpperCase())
								.trim();
							return (
								<div
									key={key}
									className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
								>
									<Icon className="w-5 h-5 text-teal-500 shrink-0" />
									<div>
										<p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none mb-0.5">{label}</p>
										<p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{val}</p>
									</div>
								</div>
							);
						})}
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
						<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.overview}</p>

						<div className="mt-6 rounded-2xl border border-teal-100 dark:border-teal-800/30 bg-teal-50/50 dark:bg-teal-900/10 p-5">
							<h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Our Verdict</h3>
							<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.verdict}</p>
						</div>

						{/* Developer info */}
						<div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
							<Building2 className="w-3.5 h-3.5" />
							<span>Developer: <strong className="text-slate-700 dark:text-slate-300">{review.developer}</strong></span>
						</div>
					</div>

					<div>
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Editorial Ratings</h2>
						<div className="space-y-4 p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5">
							{review.scores.map((s) => (
								<ScoreBar key={s.key} label={s.label} value={s.value} />
							))}
						</div>
						<p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
							Scores reflect InstaMakaan's editorial assessment based on project specifications,
							developer track record, and location factors — not a survey of individual buyers.
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
							{review.highlights.map((item) => (
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
							{review.considerations.map((item) => (
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

				{/* CTA — Link to project detail page */}
				<div className="container-custom mt-10">
					<div className="rounded-2xl border border-teal-100 dark:border-teal-800/40 bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex items-start gap-3">
							<div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
								<MessageSquarePlus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
							</div>
							<div>
								<h3 className="font-semibold text-slate-800 dark:text-white">Interested in {review.name}?</h3>
								<p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
									View full project details, floor plans, pricing, and amenities on the project page.
								</p>
							</div>
						</div>
						<Link
							to={review.projectLink}
							className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
						>
							View Project Details
						</Link>
					</div>
				</div>

				{/* Cross-link to contact */}
				<div className="container-custom mt-8 flex flex-wrap gap-x-6 gap-y-2">
					<Link
						to={review.projectLink}
						className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
					>
						<FileText className="w-4 h-4" />
						Full project page with floor plans & pricing
						<ChevronRight className="w-4 h-4" />
					</Link>
					<Link
						to="/contact"
						className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
					>
						Get in touch with our team
						<ChevronRight className="w-4 h-4" />
					</Link>
				</div>
			</section>

			{/* Other projects */}
			{otherProjects.length > 0 && (
				<section className="py-14 bg-slate-50 dark:bg-[#080f1e] border-t border-slate-100 dark:border-white/5">
					<div className="container-custom">
						<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
							<ListChecks className="w-5 h-5 text-teal-500" /> Explore Other Project Reviews
						</h2>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{otherProjects.map((project) => {
								const b = TYPE_BADGE[project.type] || TYPE_BADGE.Commercial;
								return (
									<Link
										key={project.slug}
										to={`/society-reviews/${project.slug}`}
										className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all"
									>
										<div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/40 transition-colors">
											<Building2 className="w-4 h-4 text-teal-500" />
										</div>
										<div className="flex-1 min-w-0">
											<span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-1 block font-medium">
												{project.name}
											</span>
											<span className={`text-[10px] font-semibold ${b.text}`}>{project.type}</span>
										</div>
										<ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
									</Link>
								);
							})}
						</div>
						<Link
							to="/society-reviews"
							className="mt-6 inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
						>
							View all project reviews
							<ChevronRight className="w-4 h-4" />
						</Link>
					</div>
				</section>
			)}

			<MobileBottomBar
				message={`Hi, I'd like to know more about ${review.name}`}
				browsePath={review.projectLink}
				browseLabel="Details"
			/>
		</Layout>
	);
};

export default ProjectReviewPage;
