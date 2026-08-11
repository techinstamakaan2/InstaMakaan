import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import DynamicFAQ from '@/components/DynamicFAQ';
import MobileBottomBar from '@/components/MobileBottomBar';
import { getPillarGuide, getAllPillarGuides } from '@/data/pillarGuides';
import { getService } from '@/data/servicesData';
import { BookOpen, ChevronRight, CheckCircle2, ArrowRight, Briefcase } from 'lucide-react';

const PillarGuidePage = () => {
	const { slug } = useParams();
	const guide = getPillarGuide(slug);
	const otherGuides = useMemo(
		() => getAllPillarGuides().filter((g) => g.slug !== slug),
		[slug],
	);
	const relatedServices = useMemo(
		() =>
			(guide?.relatedServices || [])
				.map((serviceSlug) => {
					const data = getService(serviceSlug);
					return data ? { slug: serviceSlug, ...data } : null;
				})
				.filter(Boolean),
		[guide],
	);

	if (!guide) return <Navigate to="/guides" replace />;

	const canonicalUrl = `https://instamakaan.com/guides/${slug}`;

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://instamakaan.com/' },
			{ '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://instamakaan.com/guides' },
			{ '@type': 'ListItem', position: 3, name: guide.title, item: canonicalUrl },
		],
	};

	return (
		<Layout>
			<Helmet>
				<title>{`${guide.metaTitle} | InstaMakaan`}</title>
				<meta name="description" content={guide.metaDescription} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={guide.metaTitle} />
				<meta property="og:description" content={guide.metaDescription} />
				<script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
			</Helmet>

			{/* Hero */}
			<section className="relative pt-28 pb-14 -mt-14 overflow-hidden">
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
						<Link to="/guides" className="hover:text-teal-600 transition-colors">Guides</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						<span className="text-slate-700 dark:text-slate-200 font-medium">{guide.title}</span>
					</nav>

					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-4">
							<BookOpen className="w-3.5 h-3.5" />
							{guide.heroKicker}
						</div>
						<h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
							The Complete Guide to <span className="text-teal-600 dark:text-teal-400">{guide.title}</span>
						</h1>
						<p className="mt-4 text-slate-500 dark:text-slate-400 text-base">{guide.heroSubtitle}</p>

						<Link
							to={guide.ctaLink}
							className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
						>
							{guide.ctaLabel}
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</section>

			{/* Sections */}
			<section className="py-14 bg-white dark:bg-[#0b1220]">
				<div className="container-custom max-w-4xl space-y-14">
					{guide.sections.map((section) => (
						<div key={section.heading}>
							<h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-5">
								{section.heading}
							</h2>

							{section.points && (
								<div className="space-y-2.5">
									{section.points.map((item) => (
										<div
											key={item}
											className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5"
										>
											<CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
											<span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
												{item}
											</span>
										</div>
									))}
								</div>
							)}

							{section.steps && (
								<div className="space-y-3">
									{section.steps.map((step, i) => (
										<div key={step} className="flex items-start gap-4">
											<div className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
												{i + 1}
											</div>
											<span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
												{step}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</section>

			{/* FAQs */}
			<DynamicFAQ
				faqs={guide.faqs}
				heading={`FAQs — ${guide.title}`}
				className="bg-slate-50 dark:bg-[#080f1e] border-t border-slate-100 dark:border-white/5"
			/>

			{/* Final CTA + cross-link */}
			<section className="py-14 bg-white dark:bg-[#0b1220] border-t border-slate-100 dark:border-white/5">
				<div className="container-custom max-w-4xl">
					<div className="rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/10 border border-teal-100 dark:border-teal-800/40 p-8 text-center">
						<h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
							Ready to get started?
						</h3>
						<p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
							{guide.heroSubtitle}
						</p>
						<Link
							to={guide.ctaLink}
							className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
						>
							{guide.ctaLabel}
							<ArrowRight className="w-4 h-4" />
						</Link>
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

					{otherGuides.length > 0 && (
						<div className="mt-8 flex flex-wrap gap-3 justify-center">
							{otherGuides.map((g) => (
								<Link
									key={g.slug}
									to={`/guides/${g.slug}`}
									className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
								>
									Read: The Complete Guide to {g.title}
									<ChevronRight className="w-4 h-4" />
								</Link>
							))}
						</div>
					)}
				</div>
			</section>

			<MobileBottomBar
				message={`Hi, I read the ${guide.title} guide and want help getting started`}
				browsePath={guide.ctaLink}
				browseLabel="Browse"
			/>
		</Layout>
	);
};

export default PillarGuidePage;
