import React from 'react';
import { Link } from 'react-router-dom';
import {
	Building2,
	ShieldCheck,
	FileText,
	Calculator,
	Star,
	Compass,
	BookOpen,
	ArrowRight,
	CheckCircle2,
	MapPin,
	Users,
} from 'lucide-react';

export const HomeEditorialSection = () => {
	return (
		<section className="py-16 md:py-24 bg-slate-50 dark:bg-[#070d18] border-t border-slate-200/80 dark:border-white/5">
			<div className="container-custom">
				{/* Section Header */}
				<div className="max-w-3xl mx-auto text-center mb-14">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
						<ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
						Delivering Rental Sukoon
					</div>
					<h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
						Your Trusted Rental &amp; Property Platform in Noida &amp; Greater Noida
					</h2>
					<p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
						InstaMakaan simplifies finding, renting, and managing homes across Noida,
						Greater Noida West (Noida Extension), and Ghaziabad with verified listings,
						transparent terms, and comprehensive support.
					</p>
				</div>

				{/* Two Column In-Depth Editorial Text */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
					<div className="bg-white dark:bg-[#0b1220] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
						<div className="flex items-center gap-3 text-teal-600 dark:text-teal-400 font-bold text-lg mb-2">
							<Building2 className="w-5 h-5 shrink-0" />
							<h3>Hassle-Free Rentals for Tenants &amp; Families</h3>
						</div>
						<p>
							Searching for a flat or PG in Delhi NCR often involves sifted through fake listings,
							inflated broker demands, and unclear rental agreements. InstaMakaan was built to solve
							these pain points by offering an authentic, verified inventory of 1 BHK, 2 BHK, 3 BHK,
							and luxury apartments across prime residential sectors. Every property on our platform
							undergoes meticulous on-ground inspection to verify amenities, furnishings, water and
							power supply, and legal tenancy criteria before it goes live.
						</p>
						<p>
							Whether you are a working professional relocating near Techzone 4 or Noida Expressway,
							or a family looking for gated societies with 24/7 security and clubhouses, we offer
							scheduled site visits, digital KYC verification, transparent fee policies, and legal
							rent agreement drafting to ensure a smooth, worry-free moving experience.
						</p>
						<div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
							<span className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40 px-2.5 py-1 rounded-md">
								✓ 100% Verified Homes
							</span>
							<span className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40 px-2.5 py-1 rounded-md">
								✓ Digital Agreement Support
							</span>
							<span className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40 px-2.5 py-1 rounded-md">
								✓ No Hidden Clauses
							</span>
						</div>
					</div>

					<div className="bg-white dark:bg-[#0b1220] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
						<div className="flex items-center gap-3 text-teal-600 dark:text-teal-400 font-bold text-lg mb-2">
							<Users className="w-5 h-5 shrink-0" />
							<h3>Trusted Property Management for Landlords &amp; NRIs</h3>
						</div>
						<p>
							For homeowners and NRI investors, managing rental assets remotely can be challenging.
							InstaMakaan acts as your dedicated local property partner. We match your property with
							qualified, background-verified tenants, coordinate viewings on your behalf, and ensure
							prompt documentation with zero administrative stress.
						</p>
						<p>
							From high-demand societies in Greater Noida to upcoming residential corridors along
							the Yamuna Expressway, our localized market intelligence helps owners price properties
							competitively to achieve minimal vacancy rates and steady rental yields. We also provide
							move-in inspection documentation and tenancy transition assistance, ensuring your asset
							remains protected throughout the lease cycle.
						</p>
						<div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
							<span className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40 px-2.5 py-1 rounded-md">
								✓ Thorough Tenant Vetting
							</span>
							<span className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40 px-2.5 py-1 rounded-md">
								✓ Minimal Vacancy Windows
							</span>
							<span className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40 px-2.5 py-1 rounded-md">
								✓ NRI Landlord Services
							</span>
						</div>
					</div>
				</div>

				{/* Internal Hub Links — Curing Orphan Pages with Contextual Anchor Text */}
				<div className="bg-white dark:bg-[#0b1220] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-sm">
					<div className="mb-8">
						<h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
							Explore Real Estate Resources &amp; Guides
						</h3>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
							Discover localized data, financial calculators, resident reviews, and neighborhood comparisons.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						{/* Society Reviews */}
						<Link
							to="/society-reviews"
							className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 dark:bg-white/[0.02]"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<Building2 className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm sm:text-base flex items-center gap-1.5">
								Society Reviews
								<ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h4>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
								Detailed reviews, maintenance ratings, and resident feedback on societies in Noida.
							</p>
						</Link>

						{/* Area Guides */}
						<Link
							to="/areas"
							className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 dark:bg-white/[0.02]"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<Compass className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm sm:text-base flex items-center gap-1.5">
								Area Guides
								<ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h4>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
								Explore connectivity, metro lines, schools, and infrastructure across key sectors.
							</p>
						</Link>

						{/* Financial Tools */}
						<Link
							to="/tools"
							className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 dark:bg-white/[0.02]"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<Calculator className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm sm:text-base flex items-center gap-1.5">
								Calculators &amp; Tools
								<ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h4>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
								Plan your budget with Rent vs Buy, Loan Affordability, and EMI Prepayment tools.
							</p>
						</Link>

						{/* Real Estate Blog */}
						<Link
							to="/blog"
							className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 dark:bg-white/[0.02]"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<BookOpen className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm sm:text-base flex items-center gap-1.5">
								Real Estate Blog
								<ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h4>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
								Read articles on tenant rights, legal lease tips, market trends, and city insights.
							</p>
						</Link>

						{/* Tenant & Buyer Guides */}
						<Link
							to="/guides"
							className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 dark:bg-white/[0.02]"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<FileText className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm sm:text-base flex items-center gap-1.5">
								Pillar Guides
								<ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h4>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
								Step-by-step master guides to renting, buying, and inspecting properties in Noida.
							</p>
						</Link>

						{/* Our Services */}
						<Link
							to="/services"
							className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 dark:bg-white/[0.02]"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<ShieldCheck className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm sm:text-base flex items-center gap-1.5">
								Rental Services
								<ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h4>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
								End-to-end rental facilitation, legal drafting, tenant verification, and move-in support.
							</p>
						</Link>

						{/* Verified Reviews */}
						<Link
							to="/reviews"
							className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 dark:bg-white/[0.02]"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<Star className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm sm:text-base flex items-center gap-1.5">
								Client Reviews
								<ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h4>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
								Read genuine testimonials and ratings from satisfied tenants and property owners.
							</p>
						</Link>

						{/* About Us */}
						<Link
							to="/about"
							className="group p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all duration-200 bg-slate-50/50 dark:bg-white/[0.02]"
						>
							<div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
								<Users className="w-5 h-5" />
							</div>
							<h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm sm:text-base flex items-center gap-1.5">
								About InstaMakaan
								<ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h4>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
								Our company background, values, leadership, and vision for ethical real estate in India.
							</p>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};
