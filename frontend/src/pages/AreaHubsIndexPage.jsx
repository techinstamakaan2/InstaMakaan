import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import MobileBottomBar from '@/components/MobileBottomBar';
import { getAllAreaHubs } from '@/data/areaHubs';
import { MapPin, ChevronRight, Compass } from 'lucide-react';

const AreaHubsIndexPage = () => {
	const hubs = getAllAreaHubs();

	return (
		<Layout>
			<Helmet>
				<title>Explore Areas — Noida &amp; Greater Noida | InstaMakaan</title>
				<meta
					name="description"
					content="Explore real estate guides for Noida, Greater Noida and Greater Noida West — connectivity, key localities, and where to find current verified listings."
				/>
				<link rel="canonical" href="https://instamakaan.com/areas" />
			</Helmet>

			<section className="relative pt-28 pb-14 -mt-14 overflow-hidden">
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
						<Compass className="w-3.5 h-3.5" />
						Area Guides
					</div>
					<h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
						Explore <span className="text-teal-600 dark:text-teal-400">Noida &amp; Greater Noida</span>
					</h1>
					<p className="mt-4 text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto">
						City-by-city guides covering connectivity, key localities and where to find current verified
						listings.
					</p>
				</div>
			</section>

			<section className="py-10 bg-white dark:bg-[#0b1220] pb-16">
				<div className="container-custom grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{hubs.map((hub) => (
						<Link
							key={hub.slug}
							to={`/areas/${hub.slug}`}
							className="group flex flex-col p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-0.5 transition-all"
						>
							<div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-50 to-sky-50 dark:from-teal-900/30 dark:to-sky-900/20 flex items-center justify-center mb-4 group-hover:from-teal-100 group-hover:to-sky-100 dark:group-hover:from-teal-800/40 transition-colors">
								<MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
							</div>
							<h2 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
								{hub.title}
							</h2>
							<p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
								{hub.heroSubtitle}
							</p>
							<span className="mt-4 inline-flex items-center gap-1.5 text-sm text-teal-600 dark:text-teal-400 font-medium">
								Explore guide
								<ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
							</span>
						</Link>
					))}
				</div>
			</section>

			<MobileBottomBar
				message="Hi, I'd like to know more about property in Noida & Greater Noida"
				browsePath="/areas"
				browseLabel="Areas"
			/>
		</Layout>
	);
};

export default AreaHubsIndexPage;
