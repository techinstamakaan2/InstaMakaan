import React, { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	Building2, ShoppingBag, UtensilsCrossed, Film, Hotel, Wine, Sparkles,
	TrendingUp, ShieldCheck, MapPin, Phone, MessageCircle, Download, ArrowRight,
	Check, ChevronRight, ChevronLeft, X, Star, Car, Users, Award,
	Calculator, Layers, Eye, Compass, Clock, Zap, Maximize2, Shield,
	BadgeCheck, ChevronDown, CheckCircle2, Flame, RefreshCw
} from 'lucide-react';

/* ── Project Constants ── */
const PROJECT = {
	name: 'The Core Ultra Wide Tower',
	tagline: 'An Iconic G+10 Mixed-Use Commercial Destination',
	developer: 'Indumaa',
	developerTagline: 'Altruistic Better',
	rera: 'UPRERAPRJ9641',
	phone: '+919771034916',
	phoneDisplay: '+91 97710 34916',
	wa: 'https://wa.aisensy.com/aabbf5',
	brochure: '/brochures/core-ultra-wide-brochure.pdf',
	mapsLink: 'https://maps.google.com/?q=Crossing+Republik+Ghaziabad',
	address: 'Plot CC-1, Sushant Aquapolis, Opp. Crossing Republik, Near Gaur City, Ghaziabad, NCR',
};

/* ── Marquee Brands ── */
const BRANDS = [
	'ZUDIO ANCHOR RETAIL',
	'FASHIONTV (FTV) SKY LOUNGE',
	'MAD MULTIPLEX CINEMAS',
	'EXECUTIVE HOTEL SUITES',
	'GOURMET DINING TERRACE',
	'SUSHANT AQUAPOLIS TOWNSHIP',
	'UPRERA APPROVED',
];

/* ── Flagship Floor Breakdown ── */
const TOWER_LEVELS = [
	{
		level: 'Level 10',
		name: 'FashionTV (FTV) Sky Bar & Lounge',
		category: 'Rooftop Gastronomy & Nightlife',
		icon: Wine,
		color: 'from-amber-500 to-rose-500',
		badge: 'Flagship Crowning Jewel',
		specs: 'Open-sky panoramic views, signature cocktails, private VIP cabanas & curated DJ sets.',
		image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=85',
		highlight: 'Exclusive NCR Rooftop Destination',
		roi: 'High Footfall & Premium Nightly Spend',
	},
	{
		level: 'Level 04 – 09',
		name: 'Executive Studio Hotel Suites',
		category: 'Managed Hospitality & Serviced Suites',
		icon: Hotel,
		color: 'from-violet-600 to-purple-600',
		badge: '6 Dedicated Hotel Floors',
		specs: '19 designer suites per floor with ensuite marble bathrooms, pantry setups & workstation corners.',
		image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
		highlight: 'High Occupancy Business & Leisure Stay',
		roi: 'Assured Passive Monthly Rental Yield',
	},
	{
		level: 'Level 03',
		name: 'MAD Cinemas Multiplex',
		category: 'Entertainment & Blockbuster Cinema',
		icon: Film,
		color: 'from-red-500 to-amber-500',
		badge: 'VIP Recliner Auditoriums',
		specs: 'Dolby Atmos immersive audio, ultra-plush recliners, gourmet live concession counters & VIP lounge.',
		image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=85',
		highlight: 'Anchor Weekend Family Footfall',
		roi: 'Steady Multi-Screen Ticket Magnet',
	},
	{
		level: 'Level 02',
		name: 'Gourmet Dining & Culinary Terrace',
		category: 'Fine Dining & Artisan Cafés',
		icon: UtensilsCrossed,
		color: 'from-orange-500 to-amber-600',
		badge: 'Multi-Cuisine Terrace',
		specs: 'Curated specialty bistros, indoor-outdoor seating, open live kitchens & family dining banquets.',
		image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
		highlight: 'Lunch, Dinner & Weekend Dining Hub',
		roi: 'Strong F&B Revenue Sharing Models',
	},
	{
		level: 'Level 01',
		name: 'Zudio & High-Street Retail Arcade',
		category: 'Anchor Fashion & Lifestyle Boutiques',
		icon: ShoppingBag,
		color: 'from-indigo-600 to-violet-600',
		badge: 'Tier-1 Anchor Brand',
		specs: 'Double-height retail frontage, wide promenade walkways, high-speed escalators & brand flagship outlets.',
		image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85',
		highlight: 'Direct Escalator & Elevator Access',
		roi: 'High-Volume Daily Footfall',
	},
	{
		level: 'Ground Floor',
		name: 'Zudio Flagship & Main Street Retail',
		category: 'High-Visibility Frontage',
		icon: Building2,
		color: 'from-blue-600 to-cyan-600',
		badge: 'Prime Road-Facing Retail',
		specs: 'Massive pedestrian eye-level frontage, grand boulevard access, valet drop-off & direct entry plaza.',
		image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
		highlight: 'Highest Eye-Level Street Exposure',
		roi: 'Premium Capital Value & Rental Rates',
	},
];

/* ── Visual Gallery Categories with Verified High-Res Working URLs ── */
const GALLERY_ITEMS = [
	{
		id: 1,
		title: 'Illuminated Architectural Facade',
		category: 'Architecture',
		src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
		desc: 'Signature modern glass and steel facade with pedestrian boulevard illumination.',
	},
	{
		id: 2,
		title: 'FashionTV Sky Bar & Rooftop Lounge',
		category: 'Rooftop Lounge',
		src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=85',
		desc: 'Level 10 open-air rooftop with panoramic night skyline view and VIP ambient cabanas.',
	},
	{
		id: 3,
		title: 'Luxury Hotel Studio Suite',
		category: 'Studio Suites',
		src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
		desc: 'Elegantly furnished studio suites on Levels 4 through 9 designed for business & leisure.',
	},
	{
		id: 4,
		title: 'MAD Cinemas Multiplex Lounge',
		category: 'Cinema',
		src: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=85',
		desc: 'State-of-the-art auditorium with luxury leather recliners and immersive acoustic sound.',
	},
	{
		id: 5,
		title: 'Curated Fine Dining & Bistro',
		category: 'Fine Dining',
		src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
		desc: 'Level 2 gastronomic hub featuring gourmet indoor and alfresco dining spaces.',
	},
	{
		id: 6,
		title: 'High-Street Retail Promenade',
		category: 'Retail',
		src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
		desc: 'Spacious retail floors anchored by Zudio with wide pedestrian aisles and high visibility.',
	},
	{
		id: 7,
		title: 'Executive Suite Interior Detail',
		category: 'Studio Suites',
		src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
		desc: 'Floor-to-ceiling windows providing ample natural lighting and expansive city views.',
	},
	{
		id: 8,
		title: 'Atmospheric Evening Cocktail Deck',
		category: 'Rooftop Lounge',
		src: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=85',
		fallback: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
		desc: 'Chic mood lighting and high-energy music create an unmatched evening destination.',
	},
];

/* ── Key Project USPs ── */
const HIGHLIGHT_POINTS = [
	{
		title: 'Strategic Catchment',
		value: '500,000+',
		sub: 'Affluent residents in Crossing Republik & Gaur City catchment',
		icon: Users,
	},
	{
		title: 'Asset Diversification',
		value: '5 Revenue Streams',
		sub: 'Retail, Dining, Cinema, Hotel Suites, Sky Lounge',
		icon: Layers,
	},
	{
		title: 'Anchor Magnet',
		value: 'Zudio + FTV + MAD',
		sub: 'Pre-leased and marquee brand synergy driving daily visits',
		icon: Sparkles,
	},
	{
		title: 'Direct Accessibility',
		value: 'NH-24 & FNG',
		sub: 'Immediate expressway connectivity to Delhi, Noida & Greater Noida',
		icon: Compass,
	},
];

/* ── Advanced Animated CSS Keyframes & Architectural Background Textures ── */
const ANIMATION_CSS = `
	@keyframes cuFloat {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-7px) rotate(0.4deg); }
	}
	@keyframes cuPulseGlow {
		0%, 100% { opacity: 0.35; transform: scale(1); }
		50% { opacity: 0.75; transform: scale(1.08); }
	}
	@keyframes cuShimmer {
		0% { transform: translateX(-150%) skewX(-20deg); }
		100% { transform: translateX(250%) skewX(-20deg); }
	}
	@keyframes cuMarquee {
		0% { transform: translateX(0%); }
		100% { transform: translateX(-50%); }
	}
	@keyframes cuFadeScale {
		from { opacity: 0; transform: scale(0.96) translateY(10px); }
		to { opacity: 1; transform: scale(1) translateY(0); }
	}

	.cu-float { animation: cuFloat 6s ease-in-out infinite; }
	.cu-pulse-glow { animation: cuPulseGlow 4s ease-in-out infinite; }
	.cu-fade-scale { animation: cuFadeScale 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
	.cu-marquee-track { display: flex; width: max-content; animation: cuMarquee 26s linear infinite; }
	.cu-marquee-track:hover { animation-play-state: paused; }

	.cu-shimmer-btn {
		position: relative;
		overflow: hidden;
	}
	.cu-shimmer-btn::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 60%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
		transform: translateX(-150%) skewX(-20deg);
	}
	.cu-shimmer-btn:hover::after {
		animation: cuShimmer 1.2s ease-in-out infinite;
	}

	/* ── Luxury Architectural Background Textures ── */
	.cu-bg-architectural {
		background-color: #faf8fe;
		background-image:
			radial-gradient(circle at 10% 15%, rgba(124, 58, 237, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 90% 45%, rgba(249, 115, 22, 0.06) 0%, transparent 45%),
			radial-gradient(circle at 50% 85%, rgba(99, 102, 241, 0.07) 0%, transparent 50%),
			radial-gradient(rgba(124, 58, 237, 0.12) 1.2px, transparent 1.2px),
			linear-gradient(to right, rgba(124, 58, 237, 0.03) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(124, 58, 237, 0.03) 1px, transparent 1px);
		background-size: 100% 100%, 100% 100%, 100% 100%, 28px 28px, 84px 84px, 84px 84px;
	}
	.dark .cu-bg-architectural {
		background-color: #090615;
		background-image:
			radial-gradient(circle at 10% 15%, rgba(124, 58, 237, 0.18) 0%, transparent 45%),
			radial-gradient(circle at 90% 45%, rgba(249, 115, 22, 0.10) 0%, transparent 45%),
			radial-gradient(circle at 50% 85%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
			radial-gradient(rgba(167, 139, 250, 0.09) 1.2px, transparent 1.2px),
			linear-gradient(to right, rgba(167, 139, 250, 0.03) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(167, 139, 250, 0.03) 1px, transparent 1px);
		background-size: 100% 100%, 100% 100%, 100% 100%, 28px 28px, 84px 84px, 84px 84px;
	}

	.cu-bg-mesh-soft {
		background-color: #f6f3fc;
		background-image:
			radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.09) 0%, transparent 55%),
			radial-gradient(circle at 20% 75%, rgba(234, 88, 12, 0.06) 0%, transparent 55%),
			radial-gradient(rgba(139, 92, 246, 0.10) 1px, transparent 1px);
		background-size: 100% 100%, 100% 100%, 24px 24px;
	}
	.dark .cu-bg-mesh-soft {
		background-color: #0c0919;
		background-image:
			radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 55%),
			radial-gradient(circle at 20% 75%, rgba(234, 88, 12, 0.08) 0%, transparent 55%),
			radial-gradient(rgba(167, 139, 250, 0.08) 1px, transparent 1px);
		background-size: 100% 100%, 100% 100%, 24px 24px;
	}

	@media (prefers-reduced-motion: reduce) {
		.cu-float, .cu-pulse-glow, .cu-marquee-track, .cu-fade-scale {
			animation: none !important;
		}
	}
`;

/* ── Lead Capture Form Component ── */
const LeadForm = ({ selectedCategory = '', onSuccess }) => {
	const [form, setForm] = useState({ name: '', phone: '', interest: selectedCategory || 'Studio Hotel Suite' });
	const [status, setStatus] = useState({ loading: false, success: false, error: '' });

	useEffect(() => {
		if (selectedCategory) {
			setForm((prev) => ({ ...prev, interest: selectedCategory }));
		}
	}, [selectedCategory]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus({ loading: true, success: false, error: '' });
		try {
			await api.post('/inquiries/', {
				name: form.name,
				phone: form.phone,
				preferred_property_type: form.interest || null,
				inquiry_type: 'SELL_ENQUIRY',
				source_page: 'core-ultra-wide',
				whatsapp_opt_in: false,
			});
			setStatus({ loading: false, success: true, error: '' });
			if (onSuccess) onSuccess();
			setTimeout(() => {
				setStatus({ loading: false, success: false, error: '' });
				setForm({ name: '', phone: '', interest: 'Studio Hotel Suite' });
			}, 4000);
		} catch (err) {
			setStatus({ loading: false, success: false, error: 'Unable to submit enquiry. Please call us directly.' });
		}
	};

	if (status.success) {
		return (
			<div className="p-6 text-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 cu-fade-scale">
				<div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-3 text-emerald-600 dark:text-emerald-400">
					<Check size={24} />
				</div>
				<h4 className="text-base font-bold text-slate-900 dark:text-white">Enquiry Received</h4>
				<p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
					Our Commercial Investment Advisor will contact you within 15 minutes.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-3.5">
			<div>
				<label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Full Name</label>
				<input
					type="text"
					required
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					placeholder="Enter your name"
					className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all shadow-inner"
				/>
			</div>

			<div>
				<label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Phone Number</label>
				<div className="flex items-center rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700 overflow-hidden focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-600 shadow-inner transition-all">
					<span className="px-3 text-xs font-extrabold text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60">
						🇮🇳 +91
					</span>
					<input
						type="tel"
						required
						value={form.phone}
						onChange={(e) => setForm({ ...form, phone: e.target.value })}
						placeholder="98765 43210"
						className="w-full px-3 py-2.5 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
					/>
				</div>
			</div>

			<div>
				<label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Asset Interest</label>
				<select
					value={form.interest}
					onChange={(e) => setForm({ ...form, interest: e.target.value })}
					className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-600 transition-all shadow-inner font-medium"
				>
					<option value="Studio Hotel Suite">Executive Studio Hotel Suite (Levels 4-9)</option>
					<option value="Ground/1st Retail">Zudio & High-Street Retail (G & 1st Floor)</option>
					<option value="Fine Dining Space">Fine Dining & Restaurant Space (Level 2)</option>
					<option value="Cinema Multiplex">MAD Cinemas Entertainment (Level 3)</option>
					<option value="FashionTV Sky Lounge">FashionTV Sky Bar & Lounge (Level 10)</option>
					<option value="Full Floor Investment">Full Floor / Institutional Investment</option>
				</select>
			</div>

			{status.error && (
				<p className="text-xs text-rose-500 font-medium">{status.error}</p>
			)}

			<p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
				By submitting, you agree to receive project pricing, inventory sheet & calls via InstaMakaan.
			</p>

			<button
				type="submit"
				disabled={status.loading}
				className="cu-shimmer-btn w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
			>
				{status.loading ? 'Submitting Details...' : (
					<>
						<span>Request Priority Consultation</span>
						<ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
					</>
				)}
			</button>
		</form>
	);
};

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════════ */
export default function CoreUltraWidePage() {
	const [activeLevelIndex, setActiveLevelIndex] = useState(1); // Default to Studio Suites (Level 4-9)
	const [galleryFilter, setGalleryFilter] = useState('All');
	const [lightboxImage, setLightboxImage] = useState(null);
	const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
	const [modalCategory, setModalCategory] = useState('');

	// Commercial Yield Calculator State
	const [investmentAmount, setInvestmentAmount] = useState(45); // in Lakhs (₹45 Lakhs)
	const [expectedYieldRate, setExpectedYieldRate] = useState(8.5); // 8.5% p.a.

	const monthlyRental = useMemo(() => {
		return Math.round((investmentAmount * 100000 * (expectedYieldRate / 100)) / 12);
	}, [investmentAmount, expectedYieldRate]);

	const fiveYearReturn = useMemo(() => {
		const annualRental = monthlyRental * 12;
		const capitalAppreciation = investmentAmount * 100000 * 0.45; // Projected ~45% 5-yr growth
		return Math.round(annualRental * 5 + capitalAppreciation);
	}, [investmentAmount, monthlyRental]);

	const filteredGallery = useMemo(() => {
		if (galleryFilter === 'All') return GALLERY_ITEMS;
		return GALLERY_ITEMS.filter((item) => item.category === galleryFilter);
	}, [galleryFilter]);

	const openModalWithCategory = (category) => {
		setModalCategory(category);
		setEnquiryModalOpen(true);
	};

	const handleDownloadBrochure = () => {
		const a = document.createElement('a');
		a.href = PROJECT.brochure;
		a.download = 'Core-Ultra-Wide-Tower-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	const activeLevel = TOWER_LEVELS[activeLevelIndex];

	return (
		<Layout noPadding>
			<style>{ANIMATION_CSS}</style>
			{/* Slim Ambient Top Glow Strip directly beneath Header */}
			<div className="fixed top-14 inset-x-0 h-[2px] z-[9998] bg-gradient-to-r from-transparent via-violet-500/80 dark:via-violet-400/90 to-transparent pointer-events-none shadow-[0_0_15px_rgba(124,58,237,0.7)]" />
			<Helmet>
				<title>The Core Ultra Wide Tower | Crossing Republik Ghaziabad | Indumaa</title>
				<meta
					name="description"
					content="The Core Ultra Wide Tower by Indumaa at Crossing Republik, Ghaziabad. G+10 Commercial destination featuring Zudio, MAD Cinemas, Fine Dining, Studio Hotel Suites & FashionTV Sky Lounge."
				/>
				<link rel="canonical" href="https://instamakaan.com/sell-companies/core-ultra-wide" />
				<meta property="og:title" content="The Core Ultra Wide Tower | Premium Commercial Landmark" />
				<meta property="og:description" content="G+10 Iconic Commercial Tower in Crossing Republik. Retail, Multiplex, Hotel Suites & Rooftop Lounge." />
				<meta property="og:image" content="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85" />
			</Helmet>

			{/* ══════════════════════════════════════════════
			    HERO SECTION — Seamlessly Under Header
			══════════════════════════════════════════════ */}
			<section className="relative overflow-hidden pt-20 pb-14 md:pt-24 md:pb-20 cu-bg-architectural border-b border-slate-200/90 dark:border-violet-900/30">
				{/* Ambient Dynamic Glow Orbs */}
				<div className="absolute top-6 left-1/4 w-[480px] h-[480px] bg-violet-400/25 dark:bg-violet-600/20 rounded-full blur-[110px] pointer-events-none cu-pulse-glow" />
				<div className="absolute bottom-6 right-10 w-[480px] h-[480px] bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-[110px] pointer-events-none cu-pulse-glow" style={{ animationDelay: '2s' }} />

				{/* Decorative Blueprint Accent Lines */}
				<div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-violet-300/30 dark:via-violet-600/20 to-transparent pointer-events-none hidden lg:block" />
				<div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-300/20 dark:via-violet-600/15 to-transparent pointer-events-none hidden lg:block" />

				<div className="container-custom relative z-10">
					{/* Top Trust Badges */}
					<div className="flex flex-wrap items-center gap-2.5 mb-6">
						<span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300 border border-violet-200/90 dark:border-violet-800/60 shadow-[0_2px_14px_rgba(124,58,237,0.10)] cu-float">
							<Sparkles size={12} className="text-violet-600 dark:text-violet-400" />
							INDUMAA · ALTRUISTIC BETTER
						</span>
						<span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50/95 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
							<BadgeCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
							RERA: {PROJECT.rera}
						</span>
						<span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 shadow-sm">
							<MapPin size={12} className="text-rose-500" />
							Crossing Republik (Opp. Gaur City)
						</span>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
						{/* Left: Headline & Key Proposition */}
						<div className="lg:col-span-7 space-y-6">
							<div>
								<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/90 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 text-xs font-black tracking-widest uppercase mb-3 border border-violet-200/90 dark:border-violet-800/50 shadow-sm">
									<Flame size={13} className="text-orange-500 animate-pulse" />
									FLAGSHIP G+10 COMMERCIAL DESTINATION
								</div>
								<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-900 dark:text-white leading-[1.10] tracking-tight">
									THE CORE <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">ULTRA WIDE</span> TOWER
								</h1>
								<p className="mt-4 text-base md:text-lg text-slate-700 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
									A landmark 10-storey mixed-use masterpiece uniting <strong className="text-slate-900 dark:text-white font-extrabold">Zudio Anchor Retail</strong>, <strong className="text-slate-900 dark:text-white font-extrabold">MAD Multiplex Cinemas</strong>, <strong className="text-slate-900 dark:text-white font-extrabold">Fine Dining Terraces</strong>, <strong className="text-slate-900 dark:text-white font-extrabold">Executive Hotel Suites</strong>, and a glamorous <strong className="text-slate-900 dark:text-white font-extrabold">FashionTV Rooftop Sky Lounge</strong>.
								</p>
							</div>

							{/* Hero Highlights Grid with Translucent Glass */}
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
								{HIGHLIGHT_POINTS.map((item, i) => {
									const IconComp = item.icon;
									return (
										<div
											key={i}
											className="group p-4 rounded-2xl bg-white/90 dark:bg-slate-900/75 backdrop-blur-md border border-slate-200/90 dark:border-violet-900/40 shadow-[0_4px_25px_rgba(109,40,217,0.05)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] hover:border-violet-400 dark:hover:border-violet-600 hover:-translate-y-1 transition-all duration-300 cursor-default"
										>
											<div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300 border border-violet-100 dark:border-violet-900">
												<IconComp size={16} />
											</div>
											<p className="text-base font-black text-slate-900 dark:text-white leading-tight">
												{item.value}
											</p>
											<p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-snug mt-1">
												{item.title}
											</p>
										</div>
									);
								})}
							</div>

							{/* CTA Action Buttons */}
							<div className="flex flex-wrap items-center gap-3.5 pt-2">
								<button
									onClick={() => openModalWithCategory('General Inquiry')}
									className="cu-shimmer-btn px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/45 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer group"
								>
									<span>Schedule Site Visit</span>
									<ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
								</button>

								<button
									onClick={handleDownloadBrochure}
									className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white/95 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-violet-400 dark:hover:border-violet-600 shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
								>
									<Download size={16} className="text-violet-700 dark:text-violet-400" />
									<span>Download Brochure</span>
								</button>

								<a
									href={`tel:${PROJECT.phone}`}
									className="px-5 py-3.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white/95 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all flex items-center gap-2"
								>
									<Phone size={15} className="text-emerald-600 dark:text-emerald-400" />
									<span>{PROJECT.phoneDisplay}</span>
								</a>
							</div>
						</div>

						{/* Right: Lead Capture Form Card with Frosted Translucency */}
						<div className="lg:col-span-5">
							<div className="relative rounded-3xl p-6 sm:p-7 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-violet-200/80 dark:border-violet-900/50 shadow-[0_20px_60px_rgba(109,40,217,0.12)] hover:border-violet-500/50 transition-all duration-500">
								<div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
									<div>
										<h3 className="text-base font-extrabold text-slate-900 dark:text-white">
											Priority Investor Access
										</h3>
										<p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
											Pre-launch pricing & floor plan inventory
										</p>
									</div>
									<span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
										Official Partner
									</span>
								</div>

								<LeadForm />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════════
			    LIVE MARQUEE BRAND TICKER
			══════════════════════════════════════════════ */}
			<div className="w-full overflow-hidden bg-violet-900/5 dark:bg-violet-950/40 border-y border-violet-200/70 dark:border-violet-900/30 py-3">
				<div className="cu-marquee-track">
					{[...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => (
						<div key={idx} className="flex items-center gap-6 px-6 whitespace-nowrap">
							<span className="text-xs font-black tracking-widest text-violet-800 dark:text-violet-300 uppercase">
								{brand}
							</span>
							<span className="w-1.5 h-1.5 rounded-full bg-violet-400 dark:bg-violet-600" />
						</div>
					))}
				</div>
			</div>

			{/* ══════════════════════════════════════════════
			    INTERACTIVE 10-FLOOR TOWER EXPLORER
			══════════════════════════════════════════════ */}
			<section id="floors" className="py-16 md:py-24 cu-bg-mesh-soft border-b border-slate-200/90 dark:border-violet-950/60 relative">
				<div className="container-custom relative z-10">
					<div className="text-center max-w-2xl mx-auto mb-14">
						<span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800 mb-3 shadow-sm">
							<Building2 size={13} />
							VERTICAL ASSET COMPOSITION
						</span>
						<h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
							Interactive Tower Inspector
						</h2>
						<p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-2">
							Explore how each level is curated with dedicated commercial anchors to optimize footfall, dwell time, and tenant returns.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
						{/* Left: Floor Selector Stack */}
						<div className="lg:col-span-5 flex flex-col gap-2.5 justify-between">
							{TOWER_LEVELS.map((item, idx) => {
								const isSelected = idx === activeLevelIndex;
								const IconComp = item.icon;
								return (
									<button
										key={item.level}
										onClick={() => setActiveLevelIndex(idx)}
										className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
											isSelected
												? 'bg-gradient-to-r from-violet-700 to-indigo-700 text-white border-transparent shadow-xl shadow-violet-600/30 scale-[1.02]'
												: 'bg-white/90 dark:bg-slate-900/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-700/60 hover:-translate-x-0.5 hover:shadow-md'
										}`}
									>
										<div className="flex items-center gap-3.5 min-w-0">
											<div
												className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
													isSelected
														? 'bg-white/20 text-white scale-110'
														: 'bg-violet-50 dark:bg-slate-800 text-violet-700 dark:text-violet-400 shadow-sm border border-violet-100 dark:border-slate-700'
												}`}
											>
												<IconComp size={18} />
											</div>
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<span
														className={`text-xs font-black uppercase tracking-wider ${
															isSelected ? 'text-white/90' : 'text-violet-700 dark:text-violet-400'
														}`}
													>
														{item.level}
													</span>
													<span
														className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
															isSelected
																? 'bg-white/20 text-white'
																: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700'
														}`}
													>
														{item.badge}
													</span>
												</div>
												<p className="text-sm font-bold truncate leading-snug mt-0.5">
													{item.name}
												</p>
											</div>
										</div>
										<ChevronRight
											size={18}
											className={`flex-shrink-0 transition-transform duration-300 ${
												isSelected ? 'translate-x-1 text-white' : 'text-slate-400'
											}`}
										/>
									</button>
								);
							})}
						</div>

						{/* Right: Live Floor Inspector Card */}
						<div className="lg:col-span-7 flex flex-col">
							<div className="relative flex-1 rounded-3xl overflow-hidden border border-violet-200/90 dark:border-violet-900/40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl flex flex-col">
								{/* Floor Banner Image with Key Transition */}
								<div key={activeLevel.level} className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 flex-shrink-0 cu-fade-scale">
									<img
										src={activeLevel.image}
										alt={activeLevel.name}
										className="w-full h-full object-cover transition-transform duration-700 ease-out"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src = activeLevel.fallback || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85';
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

									<div className="absolute top-4 left-4">
										<span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-violet-700 text-white shadow-md flex items-center gap-1.5">
											<Sparkles size={11} className="text-amber-300" />
											{activeLevel.level} Active Showcase
										</span>
									</div>

									<div className="absolute bottom-4 left-4 right-4">
										<p className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">
											{activeLevel.category}
										</p>
										<h3 className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
											{activeLevel.name}
										</h3>
									</div>
								</div>

								{/* Floor Details Body */}
								<div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
									<div className="space-y-4">
										<div>
											<h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
												Spatial & Tenant Blueprint
											</h4>
											<p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
												{activeLevel.specs}
											</p>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
											<div className="p-3.5 rounded-xl bg-violet-50/90 dark:bg-violet-950/30 border border-violet-200/80 dark:border-violet-900/40 hover:border-violet-300 transition-colors">
												<p className="text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
													Key USP
												</p>
												<p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
													{activeLevel.highlight}
												</p>
											</div>

											<div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-300 transition-colors">
												<p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
													Commercial Return Driver
												</p>
												<p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
													{activeLevel.roi}
												</p>
											</div>
										</div>
									</div>

									<div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
										<span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
											Custom sizes & flexible floor configurations available.
										</span>
										<button
											onClick={() => openModalWithCategory(activeLevel.name)}
											className="cu-shimmer-btn px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5"
										>
											<span>Inquire About {activeLevel.level}</span>
											<ArrowRight size={13} />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════════
			    FLAGSHIP BENTO EXPERIENCE GRID with Hover Zoom
			══════════════════════════════════════════════ */}
			<section id="experiences" className="py-16 md:py-24 cu-bg-architectural border-b border-slate-200/90 dark:border-violet-950/60 relative">
				<div className="container-custom relative z-10">
					<div className="text-center max-w-2xl mx-auto mb-14">
						<span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 mb-3 shadow-sm">
							<Star size={13} className="text-amber-500" />
							5 FLAGSHIP DESTINATIONS
						</span>
						<h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
							Designed for High-Spenders & Consistent Footfall
						</h2>
						<p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-2">
							A self-sustaining commercial ecosystem where work, leisure, dining, and stay synergize seamlessly.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{/* Bento 1: FashionTV Rooftop (Span 2 cols on desktop) */}
						<div className="md:col-span-2 relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-violet-900/40 bg-slate-900 group min-h-[340px] flex flex-col justify-end p-6 sm:p-8 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-400/50 transition-all duration-500">
							<img
								src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
								alt="FashionTV Rooftop"
								className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=85';
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/20" />

							<div className="relative z-10 space-y-2">
								<span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950 inline-flex items-center gap-1 shadow-md">
									<Wine size={12} /> LEVEL 10 · CROWNING SKY BAR
								</span>
								<h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-200 transition-colors">
									FashionTV (FTV) Rooftop Sky Bar & Lounge
								</h3>
								<p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
									Ghaziabad's premier international nightlife and open-air rooftop destination featuring signature mixology, private dining lounges, and unforgettable city skyline views.
								</p>
							</div>
						</div>

						{/* Bento 2: MAD Multiplex Cinemas */}
						<div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-violet-900/40 bg-slate-900 group min-h-[340px] flex flex-col justify-end p-6 sm:p-8 hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-400/50 transition-all duration-500">
							<img
								src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=85"
								alt="MAD Cinemas"
								className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=800&q=85';
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

							<div className="relative z-10 space-y-2">
								<span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-red-600 text-white inline-flex items-center gap-1 shadow-md">
									<Film size={12} /> LEVEL 03 · CINEMA MULTIPLEX
								</span>
								<h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-red-200 transition-colors">
									MAD Cinemas
								</h3>
								<p className="text-slate-300 text-xs leading-relaxed">
									Luxury leather recliners and Dolby Atmos surround sound delivering high weekend and evening moviegoer crowds.
								</p>
							</div>
						</div>

						{/* Bento 3: Studio Suites */}
						<div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-violet-900/40 bg-slate-900 group min-h-[340px] flex flex-col justify-end p-6 sm:p-8 hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-400/50 transition-all duration-500">
							<img
								src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=85"
								alt="Studio Hotel Suites"
								className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=85';
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

							<div className="relative z-10 space-y-2">
								<span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-violet-600 text-white inline-flex items-center gap-1 shadow-md">
									<Hotel size={12} /> LEVELS 04–09 · 6 FLOORS
								</span>
								<h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-violet-200 transition-colors">
									Executive Studio Suites
								</h3>
								<p className="text-slate-300 text-xs leading-relaxed">
									19 serviced suites per floor providing consistent monthly rental yields for passive real estate investors.
								</p>
							</div>
						</div>

						{/* Bento 4: Zudio Retail (Span 2 cols on desktop) */}
						<div className="md:col-span-2 relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-violet-900/40 bg-slate-900 group min-h-[340px] flex flex-col justify-end p-6 sm:p-8 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-400/50 transition-all duration-500">
							<img
								src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85"
								alt="Zudio Retail Promenade"
								className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85';
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/20" />

							<div className="relative z-10 space-y-2">
								<span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-600 text-white inline-flex items-center gap-1 shadow-md">
									<ShoppingBag size={12} /> GROUND & 1ST FLOOR · ANCHOR RETAIL
								</span>
								<h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-indigo-200 transition-colors">
									Zudio Anchor & High-Street Retail
								</h3>
								<p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
									Double-height frontage and high visibility along the main crossing boulevard guaranteeing maximum eye-level footfall from surrounding residential townships.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════════
			    INTERACTIVE COMMERCIAL ROI CALCULATOR
			══════════════════════════════════════════════ */}
			<section className="py-16 md:py-24 cu-bg-mesh-soft border-b border-slate-200/90 dark:border-violet-950/60 relative">
				<div className="container-custom relative z-10">
					<div className="max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 bg-white/95 dark:bg-[#130d2a] backdrop-blur-xl border border-violet-200/90 dark:border-violet-900/50 shadow-[0_20px_50px_rgba(124,58,237,0.08)] hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-500">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 rounded-xl bg-violet-700 text-white flex items-center justify-center shadow-md cu-float">
								<Calculator size={20} />
							</div>
							<div>
								<h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
									Commercial Yield & Rental Return Planner
								</h3>
								<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
									Estimate your expected monthly cashflow and 5-year capital appreciation projection.
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
							{/* Sliders Area */}
							<div className="md:col-span-7 space-y-6">
								<div>
									<div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-2">
										<span>Target Investment Size:</span>
										<span className="text-violet-700 dark:text-violet-400 font-extrabold text-base bg-violet-100/90 dark:bg-violet-950/80 px-3 py-1 rounded-lg border border-violet-200 dark:border-violet-800">
											₹{investmentAmount} Lakhs
										</span>
									</div>
									<input
										type="range"
										min="25"
										max="250"
										step="5"
										value={investmentAmount}
										onChange={(e) => setInvestmentAmount(Number(e.target.value))}
										className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-700"
									/>
									<div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1.5">
										<span>₹25 L (Studio Suite)</span>
										<span>₹1 Cr (Retail)</span>
										<span>₹2.5 Cr+ (Flagship)</span>
									</div>
								</div>

								<div>
									<div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-2">
										<span>Projected Rental Yield:</span>
										<span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-base bg-emerald-100/90 dark:bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
											{expectedYieldRate}% p.a.
										</span>
									</div>
									<input
										type="range"
										min="6.0"
										max="12.0"
										step="0.5"
										value={expectedYieldRate}
										onChange={(e) => setExpectedYieldRate(Number(e.target.value))}
										className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
									/>
									<div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1.5">
										<span>6% (Standard)</span>
										<span>8.5% (Target Commercial)</span>
										<span>12% (High-Demand F&B)</span>
									</div>
								</div>

								<p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
									*Projections are indicative based on prevailing NCR Grade-A commercial lease structures and standard capital growth models.
								</p>
							</div>

							{/* Output Display Card */}
							<div className="md:col-span-5 rounded-2xl p-6 bg-slate-50/90 dark:bg-slate-900/95 border border-violet-200/80 dark:border-violet-900/60 shadow-xl space-y-4">
								<div>
									<p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
										Estimated Monthly Rental
									</p>
									<p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
										₹{monthlyRental.toLocaleString('en-IN')}{' '}
										<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ month</span>
									</p>
								</div>

								<div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
									<p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
										5-Year Projected Total Value
									</p>
									<p className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
										₹{(fiveYearReturn / 100000).toFixed(2)} Lakhs*
									</p>
									<p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
										Includes accumulated rentals + ~45% capital value growth.
									</p>
								</div>

								<button
									onClick={() => openModalWithCategory(`Investment Size ₹${investmentAmount}L`)}
									className="cu-shimmer-btn w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
								>
									<span>Request Custom Payment Plan</span>
									<ArrowRight size={13} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════════
			    FILTERABLE VISUAL GALLERY (Clean Photography + Smooth Lightbox)
			══════════════════════════════════════════════ */}
			<section id="gallery" className="py-16 md:py-24 cu-bg-architectural border-b border-slate-200/90 dark:border-violet-950/60 relative">
				<div className="container-custom relative z-10">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
						<div>
							<span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800 mb-3 shadow-sm">
								<Eye size={13} />
								VISUAL EXPERIENCE TOUR
							</span>
							<h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
								Architectural & Interior Showcase
							</h2>
						</div>

						{/* Category Filter Pills */}
						<div className="w-full md:w-auto overflow-x-auto no-scrollbar py-1 self-start">
							<div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex-nowrap sm:flex-wrap min-w-max shadow-sm">
								{['All', 'Rooftop Lounge', 'Studio Suites', 'Cinema', 'Fine Dining', 'Retail'].map((cat) => (
									<button
										key={cat}
										onClick={() => setGalleryFilter(cat)}
										className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
											galleryFilter === cat
												? 'bg-violet-700 text-white shadow-md scale-105'
												: 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
										}`}
									>
										{cat}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Gallery Grid with Hover Interactions */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
						{filteredGallery.map((item) => (
							<div
								key={item.id}
								onClick={() => setLightboxImage(item)}
								className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-violet-900/40 cursor-pointer aspect-[4/3] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-violet-500/20 hover:border-violet-500 hover:-translate-y-1.5 transition-all duration-300"
							>
								<img
									src={item.src}
									alt={item.title}
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = item.fallback || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85';
									}}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
									<span className="text-[10px] font-extrabold uppercase text-amber-300">
										{item.category}
									</span>
									<p className="text-sm font-bold text-white leading-tight mt-0.5">
										{item.title}
									</p>
									<span className="inline-flex items-center gap-1 text-[11px] text-violet-300 font-semibold mt-2">
										<Maximize2 size={11} /> Click to expand
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════════
			    LOCATION & CATCHMENT ECOSYSTEM
			══════════════════════════════════════════════ */}
			<section id="location" className="py-16 md:py-24 cu-bg-mesh-soft border-b border-slate-200/90 dark:border-violet-950/60 relative">
				<div className="container-custom relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
						<div className="lg:col-span-6 space-y-6">
							<div>
								<span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 mb-3 shadow-sm">
									<MapPin size={13} className="text-rose-600" />
									PRIME HIGH-DENSITY LOCATION
								</span>
								<h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
									Positioned at the Heart of Crossing Republik
								</h2>
								<p className="text-slate-700 dark:text-slate-300 text-sm md:text-base mt-3 leading-relaxed font-medium">
									Located at Plot CC-1, Sushant Aquapolis (Opp. Crossing Republik, near Gaur City). Directly connected via major multi-lane expressways with an immediate residential catchment of 100,000+ families.
								</p>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
								{[
									{ label: 'NH-24 (Delhi–Meerut Expressway)', time: '3 Minutes Direct' },
									{ label: 'FNG Highway Corridor', time: '5 Minutes' },
									{ label: 'Gaur City / Greater Noida (W)', time: '5 Minutes' },
									{ label: 'Sector 62 / 63 Noida IT Hub', time: '12 Minutes' },
									{ label: 'Upcoming Metro & Rapid Rail', time: 'In Close Proximity' },
									{ label: 'Delhi Border (Ghazipur)', time: '15 Minutes' },
								].map((loc, i) => (
									<div
										key={i}
										className="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between hover:border-violet-400 dark:hover:border-violet-700 transition-colors shadow-sm"
									>
										<span className="text-xs font-bold text-slate-800 dark:text-slate-200">
											{loc.label}
										</span>
										<span className="text-[11px] font-extrabold text-violet-700 dark:text-violet-400 whitespace-nowrap pl-2">
											{loc.time}
										</span>
									</div>
								))}
							</div>

							<div className="pt-2">
								<a
									href={PROJECT.mapsLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 hover:shadow-lg transition-all"
								>
									<Compass size={14} className="text-amber-400" />
									<span>Open Location in Google Maps</span>
								</a>
							</div>
						</div>

						{/* Right: Connectivity Showcase Card */}
						<div className="lg:col-span-6">
							<div className="rounded-3xl p-8 bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 text-white shadow-2xl relative overflow-hidden group">
								<div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/15 rounded-full blur-2xl pointer-events-none cu-pulse-glow" />

								<span className="text-xs font-extrabold tracking-widest text-amber-300 uppercase">
									HIGH FOOTFALL GUARANTEE
								</span>
								<h3 className="text-2xl sm:text-3xl font-black mt-1 leading-tight">
									Surrounded by 40+ High-Rise Societies
								</h3>
								<p className="text-white/85 text-sm mt-3 leading-relaxed">
									Crossing Republik and adjoining Noida Extension house the dense upper-middle-class families looking for high-end retail, weekend multiplex entertainment, and gourmet dining destinations.
								</p>

								<div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
									<div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10">
										<p className="text-2xl font-black text-white">500K+</p>
										<p className="text-xs text-white/80 font-semibold">Catchment Population</p>
									</div>
									<div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10">
										<p className="text-2xl font-black text-white">100%</p>
										<p className="text-xs text-white/80 font-semibold">Paved Road Frontage</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════════
			    BOTTOM VIP CONSULTATION & FOOTER STRIP
			══════════════════════════════════════════════ */}
			<section className="py-16 md:py-20 cu-bg-architectural relative">
				<div className="container-custom max-w-4xl relative z-10">
					<div className="text-center space-y-3 mb-10">
						<h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
							Book Your Exclusive Developer Inventory Session
						</h2>
						<p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto font-medium">
							Direct institutional allotments, transparent BSP schedules, and official channel partner benefits via InstaMakaan.
						</p>
					</div>

					<div className="rounded-3xl p-6 sm:p-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-violet-200/90 dark:border-violet-900/40 shadow-[0_20px_50px_rgba(124,58,237,0.08)]">
						<LeadForm selectedCategory={modalCategory} />
					</div>

					<div className="text-center mt-12 space-y-2">
						<p className="text-[11px] text-slate-500 dark:text-slate-400">
							RERA Registration: <strong>{PROJECT.rera}</strong> · Developer: <strong>Indumaa</strong> (Altruistic Better)
						</p>
						<p className="text-[10px] text-slate-500 dark:text-slate-600 max-w-2xl mx-auto leading-relaxed">
							Disclaimer: All architectural renders, brand affiliations, and specifications are representative. All final commitments are governed by the formal Builder-Buyer Agreement and RERA guidelines.
						</p>
					</div>
				</div>
			</section>

			{/* ══════════════════════════════════════════════
			    LIGHTBOX MODAL
			══════════════════════════════════════════════ */}
			{lightboxImage && (
				<div
					onClick={() => setLightboxImage(null)}
					className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cu-fade-scale"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl"
					>
						<button
							onClick={() => setLightboxImage(null)}
							className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
						>
							<X size={18} />
						</button>
						<img
							src={lightboxImage.src}
							alt={lightboxImage.title}
							className="w-full max-h-[75vh] object-contain bg-black"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = lightboxImage.fallback || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85';
							}}
						/>
						<div className="p-5 bg-slate-900 text-white">
							<span className="text-[10px] font-extrabold uppercase text-amber-400">
								{lightboxImage.category}
							</span>
							<h4 className="text-lg font-bold mt-0.5">{lightboxImage.title}</h4>
							<p className="text-xs text-slate-400 mt-1">{lightboxImage.desc}</p>
						</div>
					</div>
				</div>
			)}

			{/* ══════════════════════════════════════════════
			    INQUIRY POPUP MODAL
			══════════════════════════════════════════════ */}
			{enquiryModalOpen && (
				<div
					onClick={() => setEnquiryModalOpen(false)}
					className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cu-fade-scale"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="relative max-w-md w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-violet-900/60 shadow-2xl p-6 sm:p-7"
					>
						<button
							onClick={() => setEnquiryModalOpen(false)}
							className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
						>
							<X size={16} />
						</button>

						<div className="mb-4">
							<h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
								{modalCategory ? `Inquire for ${modalCategory}` : 'Commercial Investment Consultation'}
							</h3>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
								Get pricing sheets, floor layouts & current availability.
							</p>
						</div>

						<LeadForm
							selectedCategory={modalCategory}
							onSuccess={() => setTimeout(() => setEnquiryModalOpen(false), 2500)}
						/>
					</div>
				</div>
			)}

			{/* ══════════════════════════════════════════════
			    MOBILE FLOATING QUICK ACTION BAR
			══════════════════════════════════════════════ */}
			<div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#0c0919]/95 backdrop-blur-lg border-t border-slate-200 dark:border-violet-950 p-2.5 flex items-center justify-between gap-2 shadow-2xl">
				<a
					href={`tel:${PROJECT.phone}`}
					className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
				>
					<Phone size={14} className="text-emerald-500" />
					<span>Call</span>
				</a>
				<a
					href={PROJECT.wa}
					target="_blank"
					rel="noopener noreferrer"
					className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
				>
					<MessageCircle size={14} />
					<span>WhatsApp</span>
				</a>
				<button
					onClick={() => openModalWithCategory('Mobile Quick Request')}
					className="flex-1 py-2.5 px-3 rounded-xl bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
				>
					<Sparkles size={13} />
					<span>Enquire</span>
				</button>
			</div>

			<div className="h-14 md:hidden" />
		</Layout>
	);
}
