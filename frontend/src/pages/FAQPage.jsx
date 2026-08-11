import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	Search,
	ArrowLeft,
	LayoutGrid,
	MessageCircle,
	Loader2,
	ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

const FAQPage = () => {
	const navigate = useNavigate();
	const searchRef = React.useRef(null);
	const faqRef = React.useRef(null);

	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const fetchFAQs = async () => {
			try {
				const { data } = await api.get('/faqs');
				const cats = Array.isArray(data) ? data : [];
				setCategories(cats);
			} catch (err) {
				console.error('Failed to load FAQs:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchFAQs();
	}, []);

	const allFaqs = useMemo(() => {
		return categories.flatMap((c) => c.faqs || []);
	}, [categories]);

	const activeFaqs = useMemo(() => {
		if (activeTab === 'all') return allFaqs;
		const cat = categories.find((c) => (c._id || c.id) === activeTab);
		return cat?.faqs || [];
	}, [categories, activeTab, allFaqs]);

	const filteredFaqs = useMemo(() => {
		if (!searchQuery) return activeFaqs;
		const q = searchQuery.toLowerCase();
		return activeFaqs.filter(
			(faq) =>
				faq.question?.toLowerCase().includes(q) ||
				faq.answer?.toLowerCase().includes(q),
		);
	}, [searchQuery, activeFaqs]);

	const focusSearch = () => searchRef.current?.focus();
	const scrollToFaq = () =>
		faqRef.current?.scrollIntoView({ behavior: 'smooth' });

	const faqJsonLd = allFaqs.length
		? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: allFaqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: faq.answer,
					},
				})),
			}
		: null;

	return (
		<Layout>
			<Helmet>
				<title>FAQs - Rental Properties, PG & Flats in Noida | InstaMakaan Help</title>
				<meta name="description" content="Find answers to common questions about rental flats, PG, property management and verified listings in Noida, Greater Noida, Noida Extension and Ghaziabad." />
				<link rel="canonical" href="https://instamakaan.com/faq" />
				<meta property="og:title" content="FAQs - Rental Properties & PG in Noida | InstaMakaan" />
				<meta property="og:description" content="Common questions about rental flats, PG, property management and verified listings in Noida and Greater Noida." />
				<meta property="og:url" content="https://instamakaan.com/faq" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="FAQs - Rental Properties & PG in Noida | InstaMakaan" />
				<meta name="twitter:description" content="Common questions about rental flats, PG and property management in Noida and Greater Noida." />
				<meta name="twitter:image" content="https://instamakaan.com/images/orglogo.webp" />
				{faqJsonLd && (
					<script type="application/ld+json">
						{JSON.stringify(faqJsonLd)}
					</script>
				)}
			</Helmet>

			{/* ── HERO ── */}
			<section className="pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden -mt-14">
				<div className="absolute inset-0 -z-10 bg-white dark:bg-[#0b1220]" />
				<div
					className="absolute inset-0 -z-10"
					style={{
						background:
							'radial-gradient(circle at 20% 40%, rgba(45,212,191,0.15), transparent 50%), radial-gradient(circle at 80% 30%, rgba(250,204,21,0.13), transparent 50%), radial-gradient(circle at 50% 80%, rgba(56,189,248,0.10), transparent 55%)',
					}}
				/>

				<div className="container-custom">
					<div className="text-center max-w-2xl mx-auto">
						{/* BADGE */}
						<div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
							<span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
							Help Center
						</div>

						{/* TITLE — "help" teal, "you" yellow */}
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
							How can we help you?
						</h1>

						<p className="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-10 leading-relaxed">
							Everything you need to know about renting, buying &amp; managing
							properties with InstaMakaan.
						</p>

						{/* SEARCH */}
						<div className="relative max-w-xl mx-auto">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								ref={searchRef}
								type="text"
								placeholder='Search questions... e.g. "security deposit"'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
							/>
						</div>

						{/* STATS */}
						{!loading && categories.length > 0 && (
							<div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
								<span>
									<strong className="text-gray-800 dark:text-white">
										{allFaqs.length}
									</strong>{' '}
									questions
								</span>
								<span className="w-1 h-1 rounded-full bg-gray-300" />
								<span>
									<strong className="text-gray-800 dark:text-white">
										{categories.length}
									</strong>{' '}
									categories
								</span>
								<span className="w-1 h-1 rounded-full bg-gray-300" />
								<span>Always updated</span>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ── CATEGORY TABS — centered ── */}
			{!loading && categories.length > 0 && (
				<section className="pb-8">
					<div className="container-custom">
						<div className="flex flex-wrap justify-center gap-3">
							{/* ALL */}
							<button
								onClick={() => setActiveTab('all')}
								className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-200
									${
										activeTab === 'all'
											? 'bg-teal-600 text-white border-teal-600 shadow-md scale-[1.04]'
											: 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:border-teal-400 hover:text-teal-600'
									}`}
							>
								<span>🗂️</span>
								All
								<span
									className={`text-xs px-2 py-0.5 rounded-full font-medium ${
										activeTab === 'all'
											? 'bg-white/25 text-white'
											: 'bg-gray-100 dark:bg-neutral-800 text-gray-500'
									}`}
								>
									{allFaqs.length}
								</span>
							</button>

							{categories.map((cat) => {
								const catId = cat._id || cat.id;
								const isActive = activeTab === catId;
								return (
									<button
										key={catId}
										onClick={() => setActiveTab(catId)}
										className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-200
											${
												isActive
													? 'bg-teal-600 text-white border-teal-600 shadow-md scale-[1.04]'
													: 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:border-teal-400 hover:text-teal-600'
											}`}
									>
										{cat.icon && <span>{cat.icon}</span>}
										{cat.name}
										<span
											className={`text-xs px-2 py-0.5 rounded-full font-medium ${
												isActive
													? 'bg-white/25 text-white'
													: 'bg-gray-100 dark:bg-neutral-800 text-gray-500'
											}`}
										>
											{cat.faqs?.length || 0}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* ── FAQ LIST ── */}
			<section ref={faqRef} className="py-8 md:py-12">
				<div className="container-custom max-w-3xl">
					{loading ? (
						<div className="flex justify-center py-20">
							<Loader2 className="w-8 h-8 animate-spin text-teal-500" />
						</div>
					) : categories.length === 0 ? (
						<div className="text-center py-16 text-gray-400">
							<p>No FAQ categories found.</p>
						</div>
					) : (
						<>
							{/* RESULT COUNT */}
							<div className="flex items-center justify-between mb-6">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Showing{' '}
									<strong className="text-gray-800 dark:text-white">
										{filteredFaqs.length}
									</strong>{' '}
									{filteredFaqs.length === 1 ? 'result' : 'results'}
									{searchQuery && (
										<span>
											{' '}
											for "<em>{searchQuery}</em>"
										</span>
									)}
								</p>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery('')}
										className="text-xs text-teal-600 hover:underline font-medium"
									>
										Clear search
									</button>
								)}
							</div>

							<Accordion type="single" collapsible className="space-y-3">
								{filteredFaqs.map((faq, index) => (
									<AccordionItem
										key={faq.id || faq.question || index}
										value={`item-${index}`}
										className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden px-6 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
									>
										<AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white hover:text-teal-600 hover:no-underline py-5 text-sm sm:text-base">
											{faq.question}
										</AccordionTrigger>
										<AccordionContent className="text-gray-500 dark:text-gray-400 pb-5 leading-relaxed text-sm sm:text-base">
											{faq.answer}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>

							{filteredFaqs.length === 0 && (
								<div className="text-center py-16">
									<p className="text-4xl mb-4">🔍</p>
									<p className="text-gray-500 dark:text-gray-400 mb-4">
										No questions found matching your search.
									</p>
									<button
										onClick={() => setSearchQuery('')}
										className="text-teal-600 font-semibold text-sm hover:underline"
									>
										Clear search
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</section>

			{/* ── CTA — full width stretch ── */}
			<section className="py-16 md:py-20">
				<div className="container-custom px-4 sm:px-6 lg:px-8">
					<div
						className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
						style={{
							background:
								'linear-gradient(135deg, #0d9488 0%, #0f766e 40%, #1e3a5f 100%)',
						}}
					>
						{/* GLOW BLOBS */}
						<div
							className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20"
							style={{
								background:
									'radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)',
								transform: 'translate(-30%, -30%)',
							}}
						/>
						<div
							className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-20"
							style={{
								background:
									'radial-gradient(circle, rgba(250,204,21,0.5), transparent 70%)',
								transform: 'translate(30%, 30%)',
							}}
						/>

						<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 sm:px-12 md:px-16 py-12 md:py-14">
							{/* LEFT TEXT */}
							<div className="text-center md:text-left">
								<p className="text-teal-200 text-sm font-semibold uppercase tracking-widest mb-2">
									Still confused?
								</p>
								<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
									Can't find your answer?
								</h2>
								<p className="text-teal-100 text-sm sm:text-base max-w-md leading-relaxed">
									Our team is available{' '}
									<span className="text-yellow-300 font-semibold">24×7</span> to
									help you with any queries about renting, buying or managing
									properties.
								</p>
							</div>

							{/* RIGHT BUTTON */}
							<div className="flex-shrink-0">
								<Link
									to="/contact"
									className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 text-base"
								>
									Contact Us
									<ChevronRight className="w-5 h-5" />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── MOBILE BOTTOM BAR ── */}
			<div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
				<div className="flex justify-around items-center px-4 py-2 rounded-2xl bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl">
					<button
						onClick={() => navigate(-1)}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<ArrowLeft className="w-5 h-5 mb-1" />
						Back
					</button>
					<button
						onClick={focusSearch}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<Search className="w-5 h-5 mb-1" />
						Search
					</button>
					<button
						onClick={scrollToFaq}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<LayoutGrid className="w-5 h-5 mb-1" />
						FAQs
					</button>
					<button
						onClick={() => navigate('/contact')}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<MessageCircle className="w-5 h-5 mb-1" />
						Help
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default FAQPage;
