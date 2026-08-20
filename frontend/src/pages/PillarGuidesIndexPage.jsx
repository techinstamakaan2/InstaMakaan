import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import MobileBottomBar from '@/components/MobileBottomBar';
import { getAllPillarGuides } from '@/data/pillarGuides';
import { BookOpen, ChevronRight } from 'lucide-react';

const PillarGuidesIndexPage = () => {
	const guides = getAllPillarGuides();

	return (
		<Layout>
			<Helmet>
				<title>Property Guides — Renting &amp; Buying in Noida | InstaMakaan</title>
				<meta
					name="description"
					content="Complete guides to renting and buying property in Noida & Greater Noida — process, documents, RERA, home loans and practical tips."
				/>
				<link rel="canonical" href="https://instamakaan.com/guides" />
			</Helmet>

			<section className="relative pt-28 pb-14 -mt-14 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-sky-50 dark:from-[#0a1628] dark:via-[#0b1220] dark:to-[#0a1628]" />
				<div className="relative container-custom text-center">
					<h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
						<span className="text-teal-600 dark:text-teal-400">Property</span>{' '}
						<span className="text-amber-500 dark:text-amber-400">Guides</span>
					</h1>
					<p className="mt-4 text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto">
						Complete, practical guides to renting and buying property in Noida &amp; Greater Noida.
					</p>
					<Link
						to="/areas"
						className="mt-3 inline-block text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
					>
						Explore area-by-area guides →
					</Link>
				</div>
			</section>

			<section className="py-14 bg-white dark:bg-[#0b1220]">
				<div className="container-custom max-w-3xl grid sm:grid-cols-2 gap-5">
					{guides.map((g) => (
						<Link
							key={g.slug}
							to={`/guides/${g.slug}`}
							className="group p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/40 transition-colors">
								<BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
							</div>
							<h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1.5">
								The Complete Guide to {g.title}
							</h2>
							<p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
								{g.heroSubtitle}
							</p>
							<span className="mt-4 inline-flex items-center gap-1.5 text-sm text-teal-600 dark:text-teal-400 font-medium group-hover:gap-2.5 transition-all">
								Read guide
								<ChevronRight className="w-4 h-4" />
							</span>
						</Link>
					))}
				</div>
			</section>

			<MobileBottomBar
				message="Hi, I'd like some help with renting or buying property"
				browsePath="/guides"
				browseLabel="Guides"
			/>
		</Layout>
	);
};

export default PillarGuidesIndexPage;
