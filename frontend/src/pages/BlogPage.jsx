import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import {
	ArrowLeft,
	Search,
	Grid,
	Phone,
	X,
	Clock,
	ChevronRight,
	ChevronLeft,
	AlertCircle,
	RefreshCw,
	BookOpen,
	TrendingUp,
	Eye,
	Home,
	Users,
	Building2,
	Briefcase,
	MapPin,
	Compass,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/api';
import PageFAQSection from '@/components/home/PageFAQSection';

const BLOG_FAQS = [
	{
		question: 'What topics does the InstaMakaan blog cover?',
		answer:
			'Our blog covers a wide range of topics including renting tips, tenant rights in India, property investment advice, neighbourhood guides for Noida and Greater Noida, rental market trends, and practical move-in checklists for tenants and owners.',
	},
	{
		question: 'How can I find articles specific to my area?',
		answer:
			'Use the category filter at the top of the blog to browse by topic, or use the search bar to look for a specific locality like Greater Noida West, Techzone 4, or Sector 1. We publish area-specific guides to help you make the most informed rental decision.',
	},
	{
		question: 'How do I filter blog posts for tenants or for owners?',
		answer:
			'Select "For Tenants" from the category filter to find move-in tips, rental agreement advice, and neighbourhood guides. Select "For Owners" for listing tips, property management advice, and guidance on getting the best rent for your flat.',
	},
	{
		question: 'How often does InstaMakaan publish new blog content?',
		answer:
			'We publish new articles regularly covering the latest trends in rental properties, practical guides for tenants and owners, and real estate updates specific to Delhi NCR. Subscribe to our newsletter or follow us on social media to stay updated.',
	},
	{
		question: 'What should I read first if I am a first-time renter?',
		answer:
			'Start with our articles in the "For Tenants" category. They cover everything from what to look for when visiting a flat, how to read a rental agreement, what documents to keep handy, and how to avoid common pitfalls when renting for the first time.',
	},
	{
		question: 'Can I suggest a topic for the blog?',
		answer:
			'Absolutely! We love hearing from our community. Send your topic suggestion to support@instamakaan.com and our content team will consider it for an upcoming article. We especially welcome questions about specific localities or renting scenarios.',
	},
];

/* ─── CATEGORIES ─── */
export const categories = [
	'All Posts',
	'Real Estate',
	'For Owners',
	'For Tenants',
	'Investment',
	'Community',
	'Noida Living',
	'Corporate',
	'Vastu Tips & Guides',
];

/* ─── CATEGORY COLORS ─── */
export const categoryColors = {
	Investment: {
		bg: 'bg-amber-50 dark:bg-amber-900/30',
		text: 'text-amber-700 dark:text-amber-300',
		dot: 'bg-amber-500',
		glow: 'rgba(245,158,11,0.15)',
	},
	'For Tenants': {
		bg: 'bg-teal-50 dark:bg-teal-900/30',
		text: 'text-teal-700 dark:text-teal-300',
		dot: 'bg-teal-500',
		glow: 'rgba(20,184,166,0.15)',
	},
	'For Owners': {
		bg: 'bg-blue-50 dark:bg-blue-900/30',
		text: 'text-blue-700 dark:text-blue-300',
		dot: 'bg-blue-500',
		glow: 'rgba(59,130,246,0.15)',
	},
	'Real Estate': {
		bg: 'bg-purple-50 dark:bg-purple-900/30',
		text: 'text-purple-700 dark:text-purple-300',
		dot: 'bg-purple-500',
		glow: 'rgba(139,92,246,0.15)',
	},
	Community: {
		bg: 'bg-rose-50 dark:bg-rose-900/30',
		text: 'text-rose-700 dark:text-rose-300',
		dot: 'bg-rose-500',
		glow: 'rgba(244,63,94,0.15)',
	},
	Corporate: {
		bg: 'bg-slate-100 dark:bg-slate-800',
		text: 'text-slate-700 dark:text-slate-300',
		dot: 'bg-slate-500',
		glow: 'rgba(100,116,139,0.15)',
	},
	'Noida Living': {
		bg: 'bg-green-50 dark:bg-green-900/30',
		text: 'text-green-700 dark:text-green-300',
		dot: 'bg-green-500',
		glow: 'rgba(34,197,94,0.15)',
	},
	'Vastu Tips & Guides': {
		bg: 'bg-orange-50 dark:bg-orange-900/30',
		text: 'text-orange-700 dark:text-orange-300',
		dot: 'bg-orange-500',
		glow: 'rgba(249,115,22,0.15)',
	},
};
export const getCategoryStyle = (cat) =>
	categoryColors[cat] || {
		bg: 'bg-gray-100',
		text: 'text-gray-600',
		dot: 'bg-gray-400',
		glow: 'rgba(100,100,100,0.1)',
	};

/* ─── CATEGORY CARD IMAGERY (for the browse-by-category row) ─── */
const CATEGORY_META = {
	'All Posts':    { icon: BookOpen,  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85' },
	'Real Estate':  { icon: Building2, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85' },
	'For Owners':   { icon: Home,      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=900&q=85' },
	'For Tenants':  { icon: Users,     image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85' },
	Investment:     { icon: TrendingUp, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=85' },
	Community:      { icon: MapPin,    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85' },
	'Noida Living': { icon: MapPin,    image: 'https://images.unsplash.com/photo-1580216643062-cf460548a66a?auto=format&fit=crop&w=900&q=85' },
	Corporate:      { icon: Briefcase, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85' },
	'Vastu Tips & Guides': { icon: Compass, image: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=900&q=85' },
};
const getCategoryMeta = (cat) => CATEGORY_META[cat] || { icon: BookOpen, image: null };

/* ─── SKELETON ─── */
const SkeletonCard = ({ delay = 0 }) => (
	<div
		className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col animate-pulse"
		style={{ animationDelay: `${delay}ms` }}
	>
		<div className="aspect-[16/10] bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800" />
		<div className="p-5 flex flex-col gap-3">
			<div className="flex gap-2">
				<div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
				<div className="h-5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
			</div>
			<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
			<div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-full" />
			<div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
			<div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-full" />
		</div>
	</div>
);

const SkeletonFeatured = () => (
	<div className="mb-12 rounded-3xl overflow-hidden animate-pulse bg-gray-100 dark:bg-gray-800 h-[400px] md:h-[460px]" />
);

/* ─── ERROR STATE ─── */
const ErrorState = ({ message, onRetry }) => (
	<div className="text-center py-24">
		<div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
			<AlertCircle className="w-8 h-8 text-red-400" />
		</div>
		<p className="text-lg font-bold text-foreground mb-1">Failed to load posts</p>
		<p className="text-sm text-muted-foreground mb-6">{message}</p>
		<button
			onClick={onRetry}
			className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold transition hover:bg-teal-700 shadow-lg shadow-teal-500/20"
		>
			<RefreshCw className="w-4 h-4" /> Try again
		</button>
	</div>
);

/* ─── BLOG PAGE ─── */
const BlogPage = () => {
	const navigate = useNavigate();
	const [showCategories, setShowCategories] = useState(false);
	const [activeCategory, setActiveCategory] = useState('All Posts');
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [heroVisible, setHeroVisible] = useState(false);
	const [allPosts, setAllPosts] = useState([]);
	const [heroSlide, setHeroSlide] = useState(0);
	const catScrollRef = useRef(null);

	const scrollCategories = (dir) => {
		catScrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
	};

	useEffect(() => {
		const t = setTimeout(() => setHeroVisible(true), 50);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
		return () => clearTimeout(t);
	}, [searchQuery]);

	const fetchPosts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (activeCategory !== 'All Posts') params.category = activeCategory;
			if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
			const { data } = await api.get('/blogs', { params });
			setPosts(Array.isArray(data) ? data : data.posts || []);
		} catch (err) {
			setError(err?.response?.data?.message || err.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	}, [activeCategory, debouncedSearch]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	// Unfiltered — used for real per-category counts and the hero carousel
	useEffect(() => {
		api.get('/blogs')
			.then(({ data }) => setAllPosts(Array.isArray(data) ? data : data.posts || []))
			.catch(() => setAllPosts([]));
	}, []);

	const heroPosts = allPosts.slice(0, 3);

	useEffect(() => {
		if (heroPosts.length <= 1) return;
		const t = setInterval(() => setHeroSlide((p) => (p + 1) % heroPosts.length), 6000);
		return () => clearInterval(t);
	}, [heroPosts.length]);

	const categoryCounts = categories.map((cat) => ({
		cat,
		count: cat === 'All Posts' ? allPosts.length : allPosts.filter((p) => p.category === cat).length,
	}));

	const featured = posts[0];
	const rest = posts.slice(1);

	return (
		<Layout>
			<style>{`
				@keyframes blogFadeUp {
					from { opacity: 0; transform: translateY(28px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				@keyframes blogFadeIn {
					from { opacity: 0; }
					to   { opacity: 1; }
				}
				@keyframes blob1 {
					0%,100% { transform: translate(0,0) scale(1); }
					33%     { transform: translate(40px,-30px) scale(1.08); }
					66%     { transform: translate(-20px,20px) scale(0.95); }
				}
				@keyframes blob2 {
					0%,100% { transform: translate(0,0) scale(1); }
					33%     { transform: translate(-50px,25px) scale(1.06); }
					66%     { transform: translate(30px,-15px) scale(0.97); }
				}
				@keyframes blob3 {
					0%,100% { transform: translate(0,0) scale(1); }
					50%     { transform: translate(20px,40px) scale(1.05); }
				}
				@keyframes shimmer {
					0%   { background-position: -200% 0; }
					100% { background-position: 200% 0; }
				}
				@keyframes slideIndicator {
					from { width: 0; }
					to   { width: 100%; }
				}
				.blog-reveal {
					opacity: 0;
					animation: blogFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
				}
				.blog-card-hover {
					transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
				}
				.blog-card-hover:hover {
					transform: translateY(-6px);
					box-shadow: 0 20px 40px -10px rgba(0,0,0,0.12), 0 8px 16px -4px rgba(0,0,0,0.06);
				}
				.blog-img-zoom img {
					transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
				}
				.blog-img-zoom:hover img {
					transform: scale(1.07);
				}
				.cat-pill-active::after {
					content: '';
					position: absolute;
					bottom: -1px;
					left: 10%;
					right: 10%;
					height: 2px;
					border-radius: 2px;
					background: currentColor;
				}
				.search-glow:focus-within {
					box-shadow: 0 0 0 3px rgba(20,184,166,0.18), 0 4px 20px rgba(20,184,166,0.12);
				}
				.cat-card-hover {
					transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, outline-color 0.3s ease;
				}
				.cat-card-hover:hover {
					transform: translateY(-8px) scale(1.03);
				}
				.cat-card-img {
					transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
				}
				.cat-card-hover:hover .cat-card-img {
					transform: scale(1.12);
				}
				.cat-card-shine {
					background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.25) 40%, transparent 60%);
					background-size: 250% 250%;
					background-position: 200% 0;
					opacity: 0;
					transition: opacity 0.3s ease;
					z-index: 1;
					pointer-events: none;
				}
				.cat-card-hover:hover .cat-card-shine {
					opacity: 1;
					animation: shine 1s ease forwards;
				}
				@keyframes shine {
					from { background-position: 200% 0; }
					to   { background-position: -50% 0; }
				}
			`}</style>

			<Helmet>
				<title>Real Estate Blog | Rental Tips, Property Guide Noida & Greater Noida | InstaMakaan</title>
				<meta name="description" content="Read expert blogs on rental properties, flats, PG, property management and real estate trends in Noida, Greater Noida, Noida Extension and Ghaziabad." />
				<meta name="keywords" content="real estate blog noida, rental tips noida, property investment blog, pg guide noida, rent house tips, property management blog" />
				<link rel="canonical" href="https://instamakaan.com/blog" />
				<meta property="og:title" content="Real Estate Blog | Rental Tips & Property Guide Noida | InstaMakaan" />
				<meta property="og:description" content="Expert blogs on rental properties, flats, PG and real estate trends in Noida and Greater Noida." />
				<meta property="og:url" content="https://instamakaan.com/blog" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
			</Helmet>

			{/* ── HERO ── */}
			<section className="relative pt-20 pb-8 md:pt-24 md:pb-10 overflow-hidden -mt-14">
				{/* Animated blobs */}
				<div className="absolute inset-0 -z-10 bg-white dark:bg-[#0b1220]" />
				<div
					className="absolute -z-10 w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-20"
					style={{
						background: 'radial-gradient(circle, rgba(45,212,191,0.5) 0%, transparent 70%)',
						top: '-100px', left: '-100px',
						animation: 'blob1 12s ease-in-out infinite',
					}}
				/>
				<div
					className="absolute -z-10 w-[400px] h-[400px] rounded-full opacity-25 dark:opacity-15"
					style={{
						background: 'radial-gradient(circle, rgba(250,204,21,0.45) 0%, transparent 70%)',
						top: '50px', right: '-80px',
						animation: 'blob2 15s ease-in-out infinite',
					}}
				/>
				<div
					className="absolute -z-10 w-[300px] h-[300px] rounded-full opacity-20 dark:opacity-10"
					style={{
						background: 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)',
						bottom: '-60px', left: '40%',
						animation: 'blob3 10s ease-in-out infinite',
					}}
				/>
				{/* Noise texture overlay */}
				<div
					className="absolute inset-0 -z-10 opacity-[0.015]"
					style={{
						backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
					}}
				/>

				<div className="container-custom relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
					{/* LEFT — heading, search, stats */}
					<div className="text-center lg:text-left">
						{/* Kicker */}
						<div
							className="blog-reveal inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/50 px-3 py-1 rounded-full mb-4 tracking-widest uppercase"
							style={{ animationDelay: '0ms' }}
						>
							<BookOpen className="w-3 h-3" />
							Insights &amp; Guides
						</div>

						{/* Heading */}
						<h1
							className="blog-reveal text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-foreground mb-3 leading-tight tracking-tight"
							style={{ animationDelay: '80ms' }}
						>
							Real Estate, Guides
							<br />
							&amp;{' '}
							<span className="bg-clip-text text-transparent"
								style={{ backgroundImage: 'linear-gradient(135deg, hsl(175 65% 30%), hsl(175 70% 45%))' }}>
								Local Insights
							</span>
						</h1>

						{/* Subtitle */}
						<p
							className="blog-reveal text-sm text-muted-foreground max-w-md mx-auto lg:mx-0 mb-6 leading-relaxed"
							style={{ animationDelay: '150ms' }}
						>
							Your official guide to smarter renting, owning, and investing in
							Noida &amp; Greater Noida.
						</p>

						{/* Search */}
						<div
							className="blog-reveal max-w-md mx-auto lg:mx-0"
							style={{ animationDelay: '220ms' }}
						>
							<div className="relative search-glow rounded-2xl transition-all duration-300">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search articles, topics, guides…"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-border bg-white/90 dark:bg-white/5 backdrop-blur text-sm focus:outline-none transition placeholder:text-muted-foreground/60"
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery('')}
										className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition"
									>
										<X className="w-3.5 h-3.5" />
									</button>
								)}
							</div>
						</div>

						{/* Stats row */}
						<div
							className="blog-reveal flex items-center justify-center lg:justify-start gap-5 mt-5 text-xs text-muted-foreground"
							style={{ animationDelay: '300ms' }}
						>
							{[
								{ icon: <BookOpen className="w-3.5 h-3.5" />, label: `${allPosts.length} Article${allPosts.length === 1 ? '' : 's'}` },
								{ icon: <TrendingUp className="w-3.5 h-3.5" />, label: `${categories.length - 1} Categories` },
								{ icon: <Eye className="w-3.5 h-3.5" />, label: 'Free to Read' },
							].map(({ icon, label }) => (
								<div key={label} className="flex items-center gap-1.5">
									{icon}
									<span>{label}</span>
								</div>
							))}
						</div>
					</div>

					{/* RIGHT — featured posts carousel */}
					<div className="blog-reveal" style={{ animationDelay: '150ms' }}>
						{heroPosts.length > 0 ? (
							<div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border shadow-2xl h-44 sm:h-64 md:h-72 lg:h-[340px]">
								{heroPosts.map((post, i) => {
									const s = getCategoryStyle(post.category);
									return (
										<Link
											key={post._id || post.id}
											to={`/blog/${post.slug || post._id || post.id}`}
											className="absolute inset-0 block"
											style={{ opacity: i === heroSlide ? 1 : 0, transition: 'opacity 600ms ease', zIndex: i === heroSlide ? 1 : 0 }}
										>
											{post.image ? (
												<img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
											) : (
												<div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-sky-100 dark:from-teal-900/30 dark:to-sky-900/30 flex items-center justify-center text-6xl">📰</div>
											)}
											<div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, transparent 75%)' }} />
											<div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4">
												<span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${s.bg} ${s.text}`}>
													<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
													{post.category}
												</span>
											</div>
											<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
												<p className="text-white font-bold text-xs sm:text-base md:text-lg leading-snug line-clamp-2 mb-0.5 sm:mb-1.5">{post.title}</p>
												<p className="text-white/60 text-[10px] sm:text-xs hidden sm:block">{post.date}{post.author?.name ? ` · by ${post.author.name}` : ''}</p>
											</div>
										</Link>
									);
								})}

								{heroPosts.length > 1 && (
									<>
										<button
											onClick={(e) => { e.preventDefault(); setHeroSlide((p) => (p - 1 + heroPosts.length) % heroPosts.length); }}
											className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center z-10"
										>
											<ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										</button>
										<button
											onClick={(e) => { e.preventDefault(); setHeroSlide((p) => (p + 1) % heroPosts.length); }}
											className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center z-10"
										>
											<ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										</button>
										<div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 flex items-center gap-1.5 z-10">
											{heroPosts.map((_, i) => (
												<button
													key={i}
													onClick={(e) => { e.preventDefault(); setHeroSlide(i); }}
													className="rounded-full transition-all duration-300"
													style={{ width: i === heroSlide ? 16 : 6, height: 6, background: i === heroSlide ? '#fff' : 'rgba(255,255,255,0.4)' }}
												/>
											))}
										</div>
									</>
								)}
							</div>
						) : (
							<div className="rounded-2xl sm:rounded-3xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm h-44 sm:h-64 md:h-72 lg:h-[340px]">
								Featured articles will appear here
							</div>
						)}
					</div>
				</div>
			</section>

			{/* ── BROWSE BY CATEGORY (horizontal scroll cards) ── */}
			<section className="py-6 sm:py-10 md:py-14 border-b border-border overflow-hidden">
				<div className="container-custom">
					<h2 className="text-base sm:text-lg md:text-xl font-extrabold text-foreground mb-3 sm:mb-5">Browse by Category</h2>
					<div className="relative">
						{/* Desktop-only scroll arrows */}
						<button
							onClick={() => scrollCategories(-1)}
							aria-label="Scroll categories left"
							className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-[#0f1a2e] border border-border shadow-lg items-center justify-center hover:scale-110 transition-transform"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<button
							onClick={() => scrollCategories(1)}
							aria-label="Scroll categories right"
							className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-[#0f1a2e] border border-border shadow-lg items-center justify-center hover:scale-110 transition-transform"
						>
							<ChevronRight className="w-4 h-4" />
						</button>

						<div ref={catScrollRef} className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide scroll-smooth">
							{categoryCounts.map(({ cat, count }, i) => {
								const meta = getCategoryMeta(cat);
								const Icon = meta.icon;
								const isActive = activeCategory === cat;
								return (
									<button
										key={cat}
										onClick={() => {
											setActiveCategory(cat);
											document.getElementById('blog-posts-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
										}}
										className="blog-reveal cat-card-hover group relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-lg sm:rounded-xl overflow-hidden text-left"
										style={{
											animationDelay: `${i * 60}ms`,
											boxShadow: isActive
												? '0 12px 28px -8px rgba(20,184,166,0.45)'
												: '0 6px 16px -6px rgba(0,0,0,0.15)',
											outline: isActive ? '2px solid rgb(20,184,166)' : '2px solid transparent',
											outlineOffset: '2px',
										}}
									>
										{meta.image ? (
											<img
												src={meta.image}
												alt={cat}
												loading="lazy"
												className="absolute inset-0 w-full h-full object-cover cat-card-img"
												onError={(e) => { e.currentTarget.style.display = 'none'; }}
											/>
										) : null}
										<div className="absolute inset-0 cat-card-shine" />
										<div className="absolute inset-0" style={{ background: meta.image ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 55%, transparent 78%)' : 'linear-gradient(135deg, rgba(20,184,166,0.9), rgba(56,189,248,0.85))' }} />
										{!meta.image && (
											<Icon className="absolute top-1.5 left-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/70" />
										)}
										{isActive && (
											<span className="absolute top-1 right-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
												<span className="w-1 h-1 rounded-full bg-white" />
											</span>
										)}
										<div className="absolute bottom-0 left-0 right-0 p-1.5">
											<p className="text-white font-bold text-[9px] sm:text-[10px] leading-tight drop-shadow-sm line-clamp-2">{cat}</p>
											<p className="text-white/75 text-[7px] sm:text-[8px] font-medium hidden sm:block mt-0.5">{count > 0 ? `${count} Article${count === 1 ? '' : 's'}` : 'Coming soon'}</p>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</section>

			{/* ── POSTS ── */}
			<section id="blog-posts-section" className="py-12 md:py-16">
				<div className="container-custom">

					{/* Loading */}
					{loading && (
						<>
							<SkeletonFeatured />
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{[0, 1, 2, 3, 4, 5].map((n) => (
									<SkeletonCard key={n} delay={n * 80} />
								))}
							</div>
						</>
					)}

					{/* Error */}
					{!loading && error && <ErrorState message={error} onRetry={fetchPosts} />}

					{/* Empty */}
					{!loading && !error && posts.length === 0 && (
						<div className="text-center py-24">
							<div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5 text-4xl">
								🔍
							</div>
							<p className="text-xl font-bold text-foreground mb-2">No articles found</p>
							<p className="text-sm text-muted-foreground">
								Try a different category or search term
							</p>
						</div>
					)}

					{/* Content */}
					{!loading && !error && posts.length > 0 && (
						<>
							{/* ── FEATURED ── */}
							{featured && (
								<Link
									to={`/blog/${featured.slug || featured._id || featured.id}`}
									className="group block mb-12 blog-reveal"
									style={{ animationDelay: '0ms' }}
								>
									<div className="rounded-3xl overflow-hidden border border-border shadow-xl bg-card flex flex-col md:flex-row min-h-[340px]">

										{/* LEFT — content */}
										<div className="flex flex-col justify-between p-7 md:p-10 md:w-[52%] flex-shrink-0">
											{/* Top meta */}
											<div>
												{(() => {
													const s = getCategoryStyle(featured.category);
													return (
														<div className="flex items-center gap-2 mb-5 flex-wrap">
															<span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
																<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
																{featured.category}
															</span>
															<span className="text-[11px] font-semibold text-white bg-teal-600 px-2.5 py-1 rounded-full">
																✦ Featured
															</span>
														</div>
													);
												})()}

												<h2 className="text-xl sm:text-2xl md:text-[1.65rem] font-extrabold text-foreground leading-snug mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
													{featured.title}
												</h2>
												<p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
													{featured.excerpt}
												</p>
											</div>

											{/* Bottom */}
											<div className="mt-6 flex items-center justify-between">
												<div className="flex items-center gap-3 text-xs text-muted-foreground">
													<span>{featured.date}</span>
													<span className="opacity-40">·</span>
													<span className="flex items-center gap-1">
														<Clock className="w-3 h-3" />
														{featured.readTime}
													</span>
												</div>
												<span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full group-hover:gap-2.5 transition-all duration-200">
													Read article <ChevronRight className="w-3.5 h-3.5" />
												</span>
											</div>
										</div>

										{/* RIGHT — image, full visible */}
										<div className="relative md:w-[48%] flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800 min-h-[220px]">
											{featured.image ? (
												<img
													src={featured.image}
													alt={featured.title}
													loading="lazy"
													className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-6xl">📰</div>
											)}
											{/* subtle gradient on left edge to blend with card */}
											<div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent" />
										</div>

									</div>
								</Link>
							)}

							{/* ── GRID ── */}
							{rest.length > 0 && (
								<>
									<div className="flex items-center justify-between mb-7">
										<h2 className="text-lg font-bold text-foreground">
											{activeCategory === 'All Posts' ? 'Latest Articles' : activeCategory}
										</h2>
										<span className="text-sm text-muted-foreground">
											{rest.length} article{rest.length !== 1 ? 's' : ''}
										</span>
									</div>
									<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
										{rest.map((post, idx) => {
											const s = getCategoryStyle(post.category);
											return (
												<Link
													key={post._id || post.id}
													to={`/blog/${post.slug || post._id || post.id}`}
													className="group blog-reveal blog-card-hover bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
													style={{ animationDelay: `${idx * 70}ms` }}
												>
													{/* Image */}
													<div className="aspect-[16/10] overflow-hidden relative bg-gray-100 dark:bg-gray-800 blog-img-zoom">
														{post.image ? (
															<img
																src={post.image}
																alt={post.title}
																loading="lazy"
																className="w-full h-full object-cover"
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center text-4xl">
																📰
															</div>
														)}
														{/* Overlay on hover */}
														<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
														{/* Category badge */}
														<div className="absolute top-3 left-3">
															<span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 ${s.bg} ${s.text}`}>
																<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
																{post.category}
															</span>
														</div>
													</div>

													{/* Body */}
													<div className="p-5 flex-1 flex flex-col">
														<div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
															<span>{post.date}</span>
															<span className="opacity-40">•</span>
															<span className="flex items-center gap-1">
																<Clock className="w-3 h-3" />
																{post.readTime}
															</span>
															{post.views > 0 && (
																<>
																	<span className="opacity-40">•</span>
																	<span className="flex items-center gap-1">
																		<Eye className="w-3 h-3" />
																		{post.views}
																	</span>
																</>
															)}
														</div>

														<h3 className="text-[15px] font-bold text-foreground line-clamp-2 mb-2.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200 leading-snug">
															{post.title}
														</h3>
														<p className="text-[13px] text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
															{post.excerpt}
														</p>

														{/* Footer */}
														<div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
															<span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
																Read more
																<ChevronRight className="w-3.5 h-3.5" />
															</span>
															{post.author?.name && (
																<span className="text-[11px] text-muted-foreground/60 truncate max-w-[100px]">
																	{post.author.name}
																</span>
															)}
														</div>
													</div>
												</Link>
											);
										})}
									</div>
								</>
							)}
						</>
					)}
				</div>
			</section>

			{/* ── FAQ ── */}
			<PageFAQSection faqs={BLOG_FAQS} title="Blog & Renting Tips — FAQs" />

			{/* ── MOBILE BOTTOM BAR ── */}
			<div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
				<div className="flex justify-around items-center px-4 py-2 rounded-2xl bg-white/85 dark:bg-[#0b1220]/85 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl">
					<button
						onClick={() => navigate(-1)}
						className="flex flex-col items-center text-[11px] text-gray-500 dark:text-gray-400 active:scale-90 transition"
					>
						<ArrowLeft className="w-5 h-5 mb-1" /> Back
					</button>
					<button
						onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						className="flex flex-col items-center text-[11px] font-semibold text-teal-600 active:scale-90 transition"
					>
						<Search className="w-5 h-5 mb-1" /> Search
					</button>
					<button
						onClick={() => setShowCategories(true)}
						className="flex flex-col items-center text-[11px] text-gray-500 dark:text-gray-400 active:scale-90 transition"
					>
						<Grid className="w-5 h-5 mb-1" /> Categories
					</button>
					<button
						onClick={() => navigate('/contact')}
						className="flex flex-col items-center text-[11px] text-gray-500 dark:text-gray-400 active:scale-90 transition"
					>
						<Phone className="w-5 h-5 mb-1" /> Contact
					</button>
				</div>
			</div>

			{/* ── CATEGORY MODAL (mobile) ── */}
			{showCategories && (
				<div
					className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
					style={{ animation: 'blogFadeIn 0.2s ease forwards' }}
					onClick={() => setShowCategories(false)}
				>
					<div
						className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0f1a2e] rounded-t-3xl p-6 max-h-[75vh] overflow-y-auto"
						style={{ animation: 'blogFadeUp 0.3s cubic-bezier(0.22,1,0.36,1) forwards' }}
						onClick={(e) => e.stopPropagation()}
					>
						<div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-5" />
						<div className="flex justify-between items-center mb-5">
							<h3 className="font-extrabold text-lg">Browse Categories</h3>
							<button
								onClick={() => setShowCategories(false)}
								className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
						<div className="grid grid-cols-2 gap-2.5">
							{categories.map((cat) => {
								const s = getCategoryStyle(cat);
								return (
									<button
										key={cat}
										onClick={() => {
											setActiveCategory(cat);
											setShowCategories(false);
										}}
										className={`text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
											activeCategory === cat
												? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25'
												: `${s.bg} ${s.text} hover:opacity-80`
										}`}
									>
										<span className="flex items-center gap-2">
											<span className={`w-2 h-2 rounded-full ${s.dot}`} />
											{cat}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default BlogPage;
