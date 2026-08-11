import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import DynamicFAQ from '@/components/DynamicFAQ';
import MobileBottomBar from '@/components/MobileBottomBar';
import { getService, getAllServices } from '@/data/servicesData';
import { getPillarGuide } from '@/data/pillarGuides';
import {
	Briefcase,
	ChevronRight,
	CheckCircle2,
	Users,
	ArrowRight,
	MapPin,
	BookOpen,
} from 'lucide-react';

const ServicePage = () => {
	const { slug } = useParams();
	const service = getService(slug);
	const relatedGuide = service?.relatedGuide ? getPillarGuide(service.relatedGuide) : null;
	const otherServices = useMemo(
		() => getAllServices().filter((s) => s.slug !== slug).slice(0, 3),
		[slug],
	);

	if (!service) return <Navigate to="/services" replace />;

	const canonicalUrl = `https://instamakaan.com/services/${slug}`;

	const serviceSchema = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: service.title,
		areaServed: service.location,
		provider: { '@type': 'Organization', name: 'InstaMakaan' },
		description: service.metaDescription,
	};

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://instamakaan.com/' },
			{ '@type': 'ListItem', position: 2, name: 'Services', item: 'https://instamakaan.com/services' },
			{ '@type': 'ListItem', position: 3, name: service.title, item: canonicalUrl },
		],
	};

	return (
		<Layout>
			<Helmet>
				<title>{`${service.metaTitle} | InstaMakaan`}</title>
				<meta name="description" content={service.metaDescription} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={service.metaTitle} />
				<meta property="og:description" content={service.metaDescription} />
				<script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
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
						<Link to="/services" className="hover:text-teal-600 transition-colors">Services</Link>
						<ChevronRight className="w-3 h-3 shrink-0" />
						<span className="text-slate-700 dark:text-slate-200 font-medium">{service.title}</span>
					</nav>

					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-4">
							<Briefcase className="w-3.5 h-3.5" />
							{service.location}
						</div>
						<h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
							{service.title}
						</h1>
						<p className="mt-3 text-lg text-teal-600 dark:text-teal-400 font-medium">{service.tagline}</p>
						<p className="mt-4 text-slate-500 dark:text-slate-400 text-base leading-relaxed">{service.intro}</p>

						<Link
							to="/contact"
							className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
						>
							{service.ctaLabel}
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</section>

			{/* What we offer + How it works */}
			<section className="py-14 bg-white dark:bg-[#0b1220]">
				<div className="container-custom grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
					<div>
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">What's Included</h2>
						<div className="space-y-2.5">
							{service.offers.map((item) => (
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
						<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">How It Works</h2>
						<div className="space-y-3">
							{service.steps.map((step, i) => (
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

						{service.bestFor?.length > 0 && (
							<div className="mt-6">
								<p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">
									Best For
								</p>
								<div className="flex flex-wrap gap-2">
									{service.bestFor.map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
										>
											<Users className="w-3 h-3 text-teal-500" />
											{tag}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* FAQs */}
			<DynamicFAQ
				faqs={service.faqs}
				heading={`FAQs — ${service.title}`}
				className="bg-slate-50 dark:bg-[#080f1e] border-t border-slate-100 dark:border-white/5"
			/>

			{/* CTA + related services */}
			<section className="py-14 bg-white dark:bg-[#0b1220] border-t border-slate-100 dark:border-white/5">
				<div className="container-custom max-w-4xl">
					<div className="rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-900/20 dark:to-sky-900/10 border border-teal-100 dark:border-teal-800/40 p-8 text-center">
						<h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
							Interested in this service?
						</h3>
						<p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
							Reach out and our team will get back to you with next steps.
						</p>
						<Link
							to="/contact"
							className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
						>
							{service.ctaLabel}
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>

					{relatedGuide && (
						<div className="mt-8 flex justify-center">
							<Link
								to={`/guides/${service.relatedGuide}`}
								className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
							>
								<BookOpen className="w-4 h-4" />
								Read: The Complete Guide to {relatedGuide.title}
								<ChevronRight className="w-4 h-4" />
							</Link>
						</div>
					)}

					{otherServices.length > 0 && (
						<div className="mt-10">
							<h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-4 text-center">
								Other Services
							</h3>
							<div className="grid sm:grid-cols-3 gap-3">
								{otherServices.map((s) => (
									<Link
										key={s.slug}
										to={`/services/${s.slug}`}
										className="group flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 transition-all"
									>
										<MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 transition-colors shrink-0" />
										<span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-1">
											{s.title}
										</span>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</section>

			<MobileBottomBar
				message={`Hi, I'm interested in ${service.title}`}
				browsePath="/services"
				browseLabel="Services"
			/>
		</Layout>
	);
};

export default ServicePage;
