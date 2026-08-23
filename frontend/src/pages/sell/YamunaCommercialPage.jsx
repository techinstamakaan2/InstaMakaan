import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	MapPin, Building2, Check, ArrowRight, Download,
	Star, Shield, ChevronRight, X, Home,
	Award, Phone, MessageCircle, ChevronLeft,
	ChevronDown, ArrowUp, Layers, Sparkles,
	Plane, GraduationCap, Factory, Hotel,
	ShoppingBag, Car, Dumbbell, Waves,
	Utensils, Film, Briefcase, TreePine,
	Compass, ExternalLink, Bed, Sofa,
} from 'lucide-react';

/* ─── image base ─── */
const B = '/images/codename-bento';
const I = {
	heroBg:      `${B}/master-plan.jpg`,
	masterPlan:  `${B}/master-plan.jpg`,
};

/* ─── PLACEHOLDER: High-resolution curated property renders ─── */
const PH = {
	tower:     'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
	interior:  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=85',
	pool:      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=85',
	gym:       'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85',
	lobby:     'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=85',
	spa:       'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?auto=format&fit=crop&w=1600&q=85',
	restaurant:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
	theater:   'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85',
	garden:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=85',
	township:  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600&q=85',
	night:     'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=85',
	expressway:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
	hotel:     'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
	mall:      'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1600&q=85',
	studio:    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85',
	balcony:   'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
	fpStudioA: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
	fpStudioB: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
	airport:   'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1200&q=85',
	f1track:   'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=85',
};

/* ─── PROJECT DATA ─── */
const PROJECT = {
	name:         'CodeName: Bento',
	byLine:       'by GAURS',
	tagline:      'Luxury Studio Apartments',
	location:     'Plot GH-01, Sector-19, Gaur Yamuna City, Yamuna Expressway',
	township:     'Gaur Yamuna City',
	townshipArea: '250 Acres (101 Hectares)',
	phone:        '+919771034916',
	phoneDisplay: '+91 97710 34916',
	wa:           'https://wa.aisensy.com/aabbf5',
	brochure:     '/brochures/codename-bento-brochure.pdf',
};

const STATS = [
	{ label: 'Township',       value: '250 Acres',    sub: '101 Hectares Integrated' },
	{ label: 'Towers',         value: '2',             sub: 'Iconic Glass Towers' },
	{ label: 'Storeys',        value: '40',            sub: 'Floors Each Tower' },
	{ label: 'Clubhouse',      value: '45,000 sq.ft',  sub: 'Luxury Amenities' },
	{ label: 'Parking',        value: '8,000',         sub: 'Car Parking Spaces' },
	{ label: 'Starting',       value: '₹1 Cr*',       sub: 'Onwards · Fully Furnished' },
];

const UNIT_TYPES = [
	{
		label:     'Studio Type A',
		towers:    'Tower 1 & 2 (G+40)',
		type:      'Luxury Studio — Fully Furnished',
		sqmtr:     '60.38 sq.mt',
		sqft:      650,
		bsp:       15385,
		carpet:    '~450 sq.ft',
		balcony:   '~50 sq.ft',
		builtup:   '~550 sq.ft',
		fpImg:     PH.fpStudioA,
		tag:       'POPULAR',
		gold:      false,
	},
	{
		label:     'Studio Type B',
		towers:    'Tower 1 & 2 (G+40)',
		type:      'Luxury Studio — Fully Furnished',
		sqmtr:     '62.71 sq.mt',
		sqft:      675,
		bsp:       14815,
		carpet:    '~468 sq.ft',
		balcony:   '~52 sq.ft',
		builtup:   '~572 sq.ft',
		fpImg:     PH.fpStudioB,
		tag:       'PREMIUM',
		gold:      true,
	},
];

const FLOOR_PLC = [
	{ floor: '1st – 5th',    plc: 'TBD' },
	{ floor: '6th – 10th',   plc: 'TBD' },
	{ floor: '11th – 15th',  plc: 'TBD' },
	{ floor: '16th – 20th',  plc: 'TBD' },
	{ floor: '21st – 25th',  plc: 'TBD' },
	{ floor: '26th – 30th',  plc: 'TBD' },
	{ floor: '31st – 35th',  plc: 'TBD' },
	{ floor: '36th – 40th',  plc: 'TBD' },
];

const ADD_CHARGES = [
	{ name: 'Car Parking',                val: 'TBD' },
	{ name: 'Club Membership',            val: 'TBD' },
	{ name: 'Power Backup',               val: 'TBD' },
	{ name: 'Electricity Infrastructure', val: 'TBD' },
	{ name: 'IFMS',                        val: 'TBD' },
	{ name: 'Maintenance',                val: 'TBD' },
];

const CLP = [
	{ milestone: 'On Booking',                           pct: 10  },
	{ milestone: 'Within 45 Days from Booking',          pct: 10  },
	{ milestone: 'On Start of Foundation',               pct: 10  },
	{ milestone: 'On Completion of Ground Floor',        pct: 10  },
	{ milestone: 'On Completion of 10th Floor Roof',     pct: 10  },
	{ milestone: 'On Completion of 20th Floor Roof',     pct: 10  },
	{ milestone: 'On Completion of 30th Floor Roof',     pct: 10  },
	{ milestone: 'On Completion of Top Floor',           pct: 10  },
	{ milestone: 'On Start of Finishing',                pct: 10  },
	{ milestone: 'On Offer of Possession',               pct: 10  },
];

const AMENITY_CATEGORIES = [
	{
		zone: 'Clubhouse',
		color: '#06b6d4',
		icon: Sparkles,
		items: ['Swimming Pool', 'Gymnasium', 'Spa & Salon', 'Restaurant', 'Theater', 'Office Lounge'],
	},
	{
		zone: 'Podium Landscape',
		color: '#10b981',
		icon: TreePine,
		items: ['Rolling Lawns', 'Meandering Pathways', 'Stepping Stones', 'Sculpture Court', 'Seating Pods', 'Outdoor Dining Space'],
	},
	{
		zone: 'Township Amenities',
		color: '#8b5cf6',
		icon: Building2,
		items: ['Branded Hotel', 'Luxury Mall', 'GYC Galleria Shopping Center', 'GYC Sports Park', 'Gaurs International School', 'Radha Krishna Mandir'],
	},
];

/* ─── RICH CATEGORIZED LOCATION & NEARBY HUBS ─── */
const NEARBY_HUBS = {
	'Airports & Expressways': [
		{ name: 'Noida International Airport (Jewar)', dist: '15 Mins / 15 Kms', tag: 'Global Gateway' },
		{ name: 'Yamuna Expressway (Direct Access)', dist: '0 Mins (Exit 2C)', tag: 'Main Arterial' },
		{ name: 'Eastern Peripheral Expressway (EPE)', dist: '5 Mins / 4 Kms', tag: 'Fast Transit' },
		{ name: 'Proposed Metro & Monorail Corridor', dist: 'Walking Distance', tag: 'Upcoming Metro' },
		{ name: 'IGI Airport, New Delhi', dist: '65 Kms', tag: 'International' },
	],
	'Sports & Entertainment': [
		{ name: 'Buddh International Circuit (F1 Track)', dist: 'Opposite (2 Mins)', tag: 'Motorsports' },
		{ name: 'Upcoming International Cricket Stadium', dist: '5 Mins', tag: 'Sports Hub' },
		{ name: 'Proposed 1000-Acre Film City', dist: '8 Mins / 6 Kms', tag: 'Mega Project' },
		{ name: 'Yamuna Lake Park & Recreational Area', dist: 'Inside GYC', tag: 'Township Lake' },
		{ name: 'Olympic City & Sports Complex', dist: '10 Mins', tag: 'World-Class' },
	],
	'Universities & Education': [
		{ name: 'Galgotias University', dist: '5 Mins', tag: '50,000+ Students' },
		{ name: 'Noida International University (NIU)', dist: '5 Mins', tag: 'Campus Hub' },
		{ name: 'Gautam Buddha University (GBU)', dist: '10 Mins', tag: '511 Acres Campus' },
		{ name: 'Gaurs International School', dist: 'Inside GYC', tag: 'CBSE School' },
		{ name: 'Shiv Nadar University', dist: '15 Mins', tag: 'Premier Institute' },
	],
	'Industrial Hubs & MNCs': [
		{ name: 'Vivo & Oppo Mobile Manufacturing SEZ', dist: '8 Mins', tag: 'Tech Hub' },
		{ name: 'Yamuna Expressway Data Center Parks', dist: '10 Mins', tag: 'IT & Cloud' },
		{ name: 'Patanjali Food & Herbal Park', dist: '3 Mins / Adjacent', tag: 'Industrial' },
		{ name: 'Apparel & Toy City SEZ', dist: '7 Mins', tag: 'Export Zone' },
		{ name: 'MSME & Electronics City Hub', dist: '10 Mins', tag: 'Corporate Belt' },
	],
};

const TOWNSHIP_PROJECTS = [
	{ name: 'Gaurs Runway Suites',     type: 'Commercial Studio Apartments' },
	{ name: '16th Parkview',           type: '2/3/4 BHK Apartments' },
	{ name: '7th Parkview',            type: 'Luxury By Nature' },
	{ name: '32nd Parkview',           type: 'Plots & Villas' },
	{ name: '2nd Parkview',            type: 'Plots & Villas' },
	{ name: 'Gaur Lakeshore Villas',   type: '1st-A Parkview' },
	{ name: 'Gaur Waterfront Plots',   type: '1st B Parkview' },
	{ name: 'Gaur Aero Suites',        type: 'For The Chosen Few' },
	{ name: 'AeroCity Yamuna',          type: 'Mixed Use Development' },
	{ name: 'GYC Galleria',            type: 'Convenient Shopping Center' },
	{ name: 'Victorian Villas',        type: 'Heritage Style Homes' },
	{ name: 'Krishna Vilas',           type: 'Luxury Villas' },
	{ name: 'Yamuna Lake Park',        type: 'Recreational Zone' },
	{ name: 'GYC Sports Park',         type: 'Sports & Recreation' },
	{ name: 'Gaurs International School', type: 'Education' },
];

const STUDIO_SPECS = [
	{
		room: 'Living & Bedroom Studio Space',
		icon: Bed,
		specs: [
			{ label: 'Flooring', value: 'Premium Imported / Vitrified Tiles with Wooden Finish Accents' },
			{ label: 'Walls & Ceiling', value: 'Low VOC Acrylic Emulsion Paint with Designer Accent Wall' },
			{ label: 'Furnishing', value: 'King Bed with Mattress, Wardrobe, Sofa Set, Coffee Table & LED Smart TV Unit' },
			{ label: 'Doors & Windows', value: 'UPVC / Heavy-Duty Aluminium Toughened Glass Sliding Windows' },
		],
	},
	{
		room: 'Kitchenette / Pantry',
		icon: Utensils,
		specs: [
			{ label: 'Cooking Counter', value: 'Polished Granite / Quartz Stone Platform' },
			{ label: 'Sink & Fitting', value: 'Stainless Steel Sink with Designer Chrome-Plated Tap' },
			{ label: 'Appliances / Modular', value: 'Modular Kitchen Cabinets, Induction Hob / Chimney, Refrigerator Space' },
			{ label: 'Wall Tiling', value: 'Glazed Ceramic Tiles upto 2 Ft. above working counter' },
		],
	},
	{
		room: 'Luxury Bathroom',
		icon: Waves,
		specs: [
			{ label: 'Sanitary & CP', value: 'Kohler / Grohe / Jaguar Premium Fixtures' },
			{ label: 'Flooring & Walls', value: 'Anti-Skid Vitrified Tile Flooring & Full-Height Designer Wall Tiles' },
			{ label: 'Hot Water & Electric', value: 'Geyser Installed with Premium Exhaust Fan & Vanity Mirror' },
			{ label: 'Shower Area', value: 'Glass Partition Shower Cubicle' },
		],
	},
	{
		room: 'Balcony & Glass Façade',
		icon: TreePine,
		specs: [
			{ label: 'Balcony Flooring', value: 'Weather-Proof Anti-Skid Ceramic Deck Tiles' },
			{ label: 'Railing', value: 'Modern Toughened Glass Railing with SS Top Rails' },
			{ label: 'Façade Exterior', value: 'High-Performance Double Glazed Unit (DGU) Heat-Reflective Glass Façade' },
		],
	},
	{
		room: 'Tower Lobbies & Elevators',
		icon: Building2,
		specs: [
			{ label: 'Entrance Lobby', value: 'Double-Height Air-Conditioned Glass Atrium with Italian Marble Flooring' },
			{ label: 'High-Speed Lifts', value: 'High-Speed Automatic Passenger & Service Elevators with Power Backup' },
			{ label: 'Security & Access', value: '3-Tier 24x7 CCTV Surveillance, RFID / Biometric Access Controls' },
		],
	},
];

const GAURS_MILESTONES = [
	{ val: '3 Decades',  label: 'of Unfaltering Commitment' },
	{ val: '70+',        label: 'Successfully Delivered Projects' },
	{ val: '75,000+',    label: 'Total Delivered Units' },
	{ val: '1,00,000+',  label: 'Satisfied Customers' },
];

const THREE_WORLDS = [
	{ title: 'Branded Hotel',                img: PH.hotel,  sub: 'World-class hospitality within the township' },
	{ title: 'Luxury Mall',                  img: PH.mall,   sub: 'Premium retail & dining experiences' },
	{ title: 'Fully Furnished Studio Apts',  img: PH.studio, sub: 'Your luxurious urban address' },
];

const AMENITY_SLIDES = [
	{ img: PH.pool,       caption: 'Infinity Pool — Where Luxury Meets Leisure',         label: 'Swimming Pool' },
	{ img: PH.gym,        caption: 'State-of-the-Art Gymnasium — Peak Performance',      label: 'Gymnasium' },
	{ img: PH.spa,        caption: 'Spa & Salon — Rejuvenate Your Senses',               label: 'Spa & Salon' },
	{ img: PH.restaurant, caption: 'Fine Dining Restaurant — Curated Experiences',        label: 'Restaurant' },
	{ img: PH.theater,    caption: 'Private Theater — Cinema at Your Doorstep',           label: 'Theater' },
	{ img: PH.garden,     caption: 'Podium Gardens — Nature Elevated',                    label: 'Podium Landscape' },
	{ img: PH.balcony,    caption: 'Panoramic Views — Sky-High Living',                   label: 'Balcony Views' },
	{ img: PH.lobby,      caption: 'Grand Entrance Lobby — First Impressions Matter',     label: 'Lobby' },
];

/* ── helpers ── */
const fmtINR = (n) =>
	n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr*` : `₹${(n / 100000).toFixed(0)} L*`;

/* ══════════════════════════════════════════════
   ANIMATION & STYLE SYSTEM — Theme Adaptable
══════════════════════════════════════════════ */
const GLOBAL_CSS = `
	@keyframes ycKenburns { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
	@keyframes ycFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
	@keyframes ycFadeIn { from { opacity: 0; } to { opacity: 1; } }
	@keyframes ycZoomIn { from { opacity: 0; transform: scale(.94) translateY(12px); } to { opacity: 1; transform: none; } }
	@keyframes ycShine { 0% { left: -90%; } 60%,100% { left: 130%; } }
	@keyframes ycFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
	@keyframes ycBounce { 0%,100% { transform: translateY(0); opacity:.9; } 50% { transform: translateY(7px); opacity:.4; } }
	@keyframes ycGlow { 0%,100% { box-shadow: 0 0 15px rgba(6,182,212,.15); } 50% { box-shadow: 0 0 30px rgba(6,182,212,.35); } }
	@keyframes ycGrowBar { from { width: 0; } }

	.yc-anim { opacity: 0; animation: ycFadeUp .85s cubic-bezier(.22,1,.36,1) forwards; }
	.yc-kb   { animation: ycKenburns 22s ease-out forwards; }
	.yc-float{ animation: ycFloat 4.5s ease-in-out infinite; }
	.yc-bounce{ animation: ycBounce 2s ease-in-out infinite; }
	.yc-zoom { animation: ycZoomIn .35s cubic-bezier(.22,1,.36,1) both; }
	.yc-fade { animation: ycFadeIn .3s ease both; }
	.yc-glow { animation: ycGlow 3s ease-in-out infinite; }
	.yc-grow { animation: ycGrowBar 1s cubic-bezier(.22,1,.36,1) both; }

	.yc-shine { position: relative; overflow: hidden; }
	.yc-shine::after {
		content: ''; position: absolute; top: 0; left: -90%;
		width: 45%; height: 100%;
		background: linear-gradient(105deg, transparent, rgba(6,182,212,.25), transparent);
		transform: skewX(-20deg);
		animation: ycShine 3.4s ease-in-out infinite;
		pointer-events: none;
	}
	.yc-img { transition: transform .7s cubic-bezier(.22,1,.36,1); }
	.group:hover .yc-img { transform: scale(1.06); }
	.yc-lift { transition: transform .3s ease, box-shadow .3s ease; }
	.yc-lift:hover { transform: translateY(-5px); box-shadow: 0 18px 40px -12px rgba(6,182,212,.25); }
	.yc-sb::-webkit-scrollbar { display: none; }
	.yc-sb { -ms-overflow-style: none; scrollbar-width: none; }

	/* Light mode styles */
	.yc-glass {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(6, 182, 212, 0.2);
	}
	.yc-glass-strong {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(6, 182, 212, 0.28);
	}

	/* Dark mode styles */
	.dark .yc-glass {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(6, 182, 212, 0.12);
	}
	.dark .yc-glass-strong {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(6, 182, 212, 0.2);
	}

	section[id] { scroll-margin-top: 84px; }
	@media (max-width: 767px) { #aisensy-wa-widget { display: none !important; } }
	@media (prefers-reduced-motion: reduce) {
		.yc-anim,.yc-kb,.yc-float,.yc-bounce,.yc-zoom,.yc-fade,.yc-glow,.yc-grow { animation: none!important; opacity:1!important; transform:none!important; }
		.yc-shine::after { animation: none!important; display: none; }
	}
`;

const prefRed = () =>
	typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches;

const useInView = (t = 0.15) => {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const el = ref.current; if (!el) return;
		if (prefRed() || !window.IntersectionObserver) { setVis(true); return; }
		const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: t, rootMargin: '0px 0px -40px 0px' });
		ob.observe(el);
		return () => ob.disconnect();
	}, [t]);
	return [ref, vis];
};

const Reveal = ({ children, delay = 0, x = 0, y = 26, className = '' }) => {
	const [ref, vis] = useInView();
	return (
		<div ref={ref} className={className}
			style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : `translate(${x}px,${y}px)`, transition: `opacity .7s ease ${delay}ms, transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`, willChange: 'opacity, transform' }}>
			{children}
		</div>
	);
};

const Counter = ({ text, duration = 1500 }) => {
	const m = String(text).match(/^([^\d]*)([0-9,]+(?:\.\d+)?)(.*)$/);
	const [ref, vis] = useInView(0.4);
	const target = m ? parseFloat(m[2].replace(/,/g, '')) : 0;
	const [val, setVal] = useState(0);
	useEffect(() => {
		if (!vis || !m) return;
		if (prefRed()) { setVal(target); return; }
		let raf; const t0 = performance.now();
		const tick = t => { const p = Math.min(1, (t - t0) / duration); setVal(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [vis]); // eslint-disable-line
	if (!m) return <span>{text}</span>;
	const display = m[2].includes('.') ? val.toFixed(2) : Math.round(val).toLocaleString('en-IN');
	return <span ref={ref}>{m[1]}{display}{m[3]}</span>;
};

/* ── Sub-components ── */

const FloatingActions = () => {
	const [show, setShow] = useState(false);
	useEffect(() => {
		const f = () => setShow(window.scrollY > 600);
		f(); window.addEventListener('scroll', f, { passive: true });
		return () => window.removeEventListener('scroll', f);
	}, []);
	return (
		<div className="fixed right-4 bottom-20 md:bottom-6 z-40 flex flex-col gap-3 items-end">
			<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer"
				className="hidden md:flex yc-float w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white items-center justify-center shadow-xl shadow-green-600/30 transition" aria-label="Chat on WhatsApp">
				<MessageCircle size={22} />
			</a>
			<button onClick={() => window.scrollTo({ top: 0, behavior: prefRed() ? 'auto' : 'smooth' })} aria-label="Back to top"
				className={`w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-cyan-400/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-cyan-600 hover:text-white ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
				<ArrowUp size={17} />
			</button>
		</div>
	);
};

const CyanDivider = ({ center = true }) => (
	<div className={`flex items-center gap-3 my-4 ${center ? 'justify-center' : ''}`}>
		<div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500" />
		<div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
		<div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500" />
	</div>
);

const SectionHeading = ({ kicker, title, sub, center = true, light = false }) => (
	<Reveal>
		<div className={`mb-8 md:mb-12 ${center ? 'text-center' : ''}`}>
			{kicker && <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-2 text-cyan-600 dark:text-cyan-400">{kicker}</p>}
			<h2 className={`text-2xl md:text-3xl font-bold ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</h2>
			<CyanDivider center={center} />
			{sub && <p className={`text-sm leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-slate-600 dark:text-slate-400'}`}>{sub}</p>}
		</div>
	</Reveal>
);

/* ── Interactive Floor Plan Viewer ── */
const FloorPlanViewer = ({ units }) => {
	const [sel, setSel] = useState(0);
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [panning, setPanning] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });
	const pinchRef = useRef(null);
	const containerRef = useRef(null);

	const reset = (i) => { setSel(i); setZoom(1); setPan({ x: 0, y: 0 }); };
	const onDown = (e) => { if (zoom <= 1) return; setPanning(true); dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }; };
	const onMove = (e) => {
		if (!panning) return;
		const el = containerRef.current;
		const maxX = el ? (el.offsetWidth  * (zoom - 1)) / 2 : 999;
		const maxY = el ? (el.offsetHeight * (zoom - 1)) / 2 : 999;
		setPan({
			x: Math.max(-maxX, Math.min(maxX, e.clientX - dragStart.current.x)),
			y: Math.max(-maxY, Math.min(maxY, e.clientY - dragStart.current.y)),
		});
	};
	const onUp = () => setPanning(false);

	const onTouchStart = (e) => {
		if (e.touches.length === 1 && zoom > 1) {
			setPanning(true);
			dragStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
		} else if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			pinchRef.current = { dist: Math.hypot(dx, dy), zoom };
		}
	};
	const onTouchMove = (e) => {
		e.preventDefault();
		if (e.touches.length === 1 && panning) {
			const el = containerRef.current;
			const maxX = el ? (el.offsetWidth * (zoom - 1)) / 2 : 999;
			const maxY = el ? (el.offsetHeight * (zoom - 1)) / 2 : 999;
			setPan({
				x: Math.max(-maxX, Math.min(maxX, e.touches[0].clientX - dragStart.current.x)),
				y: Math.max(-maxY, Math.min(maxY, e.touches[0].clientY - dragStart.current.y)),
			});
		} else if (e.touches.length === 2 && pinchRef.current) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const dist = Math.hypot(dx, dy);
			setZoom(Math.max(1, Math.min(3, +(pinchRef.current.zoom * dist / pinchRef.current.dist).toFixed(1))));
		}
	};
	const onTouchEnd = () => { setPanning(false); pinchRef.current = null; };

	const u = units[sel];

	return (
		<Reveal>
			<div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-cyan-500/20 shadow-2xl">
				{/* Tab bar */}
				<div className="bg-slate-900 px-4 py-3 flex items-center gap-2 flex-wrap border-b border-cyan-900/30">
					{units.map((unit, i) => (
						<button key={i} onClick={() => reset(i)}
							className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${sel === i ? 'bg-cyan-600 text-white shadow-md' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
							{unit.label}
							{unit.tag && <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sel === i ? 'bg-white/20 text-white' : 'bg-cyan-500/20 text-cyan-400'}`}>{unit.tag}</span>}
						</button>
					))}
					<div className="flex-1" />
					{/* zoom controls */}
					<div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
						<button onClick={() => setZoom(z => { const n = Math.max(1, +(z - 0.5).toFixed(1)); if (n === 1) setPan({ x: 0, y: 0 }); return n; })}
							disabled={zoom <= 1} className="px-3 py-1 text-white/50 hover:text-cyan-400 disabled:opacity-20 text-base font-bold leading-none">−</button>
						<span className="text-white/40 text-[11px] font-mono px-2 w-9 text-center select-none">{zoom.toFixed(1)}×</span>
						<button onClick={() => setZoom(z => Math.min(3, +(z + 0.5).toFixed(1)))}
							disabled={zoom >= 3} className="px-3 py-1 text-white/50 hover:text-cyan-400 disabled:opacity-20 text-base font-bold leading-none">+</button>
					</div>
				</div>

				{/* Floor plan image viewport */}
				<div ref={containerRef} className="relative overflow-hidden bg-slate-900/90"
					style={{ height: 'clamp(240px,45vw,400px)', cursor: zoom > 1 ? (panning ? 'grabbing' : 'grab') : 'default', touchAction: 'none' }}
					onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
					onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
					<div className="w-full h-full flex items-center justify-center p-4 select-none"
						style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: 'center', transition: panning ? 'none' : 'transform 0.25s ease' }}>
						<img key={`${sel}`} src={u.fpImg} alt={`${u.label} layout`} className="w-full h-full object-cover rounded-xl pointer-events-none opacity-85" />
					</div>
					{/* badges */}
					<div className="absolute top-3 left-3 bg-cyan-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
						{u.label} · {u.type}
					</div>
					<div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-cyan-400/40 text-cyan-400 text-[11px] font-bold px-3 py-1 rounded-full">
						{u.sqft.toLocaleString('en-IN')} sq.ft · Starting {fmtINR(u.sqft * u.bsp)}
					</div>
					{zoom > 1 && (
						<button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
							className="absolute bottom-3 left-3 bg-cyan-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">↺ Reset Zoom</button>
					)}
				</div>

				{/* Specs strip */}
				<div className="bg-slate-900 px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 border-t border-cyan-900/30">
					{[
						['Super Built-up', `${u.sqft.toLocaleString('en-IN')} sq.ft`],
						['Carpet Area', u.carpet],
						['Balcony', u.balcony],
						['Built-up', u.builtup],
						['Starting Price', fmtINR(u.sqft * u.bsp)],
					].map(([k, v]) => (
						<div key={k} className="flex items-center gap-1.5">
							<span className="text-white/40 text-[10px] uppercase tracking-wider">{k}:</span>
							<span className="text-cyan-400 text-xs md:text-sm font-bold">{v}</span>
						</div>
					))}
				</div>
			</div>
		</Reveal>
	);
};

/* ── Interactive Specifications Panel ── */
const SpecsPanel = () => {
	const [roomIdx, setRoomIdx] = useState(0);
	const cur = STUDIO_SPECS[roomIdx] || STUDIO_SPECS[0];
	const Icon = cur.icon || Home;

	return (
		<div className="yc-glass-strong rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-cyan-500/20">
			<div className="flex flex-col md:flex-row min-h-[340px] gap-6">
				{/* Room selector buttons */}
				<div className="flex md:flex-col overflow-x-auto md:overflow-visible yc-sb snap-x md:w-60 flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-cyan-500/20 pb-2 md:pb-0 pr-0 md:pr-4">
					{STUDIO_SPECS.map((r, i) => {
						const RIcon = r.icon || Home;
						const active = i === roomIdx;
						return (
							<button key={r.room} onClick={() => setRoomIdx(i)}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap md:whitespace-normal flex-shrink-0 transition-all ${
									active
										? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold border-l-4 border-cyan-500 shadow-sm'
										: 'text-slate-600 dark:text-white/50 text-xs hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
								}`}>
								<RIcon size={16} className={active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'} />
								<span className="text-xs">{r.room}</span>
							</button>
						);
					})}
				</div>

				{/* Room spec details */}
				<div className="flex-1 yc-fade">
					<div className="flex items-center gap-3 mb-5 border-b border-slate-200 dark:border-cyan-500/20 pb-3">
						<div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
							<Icon size={20} className="text-cyan-600 dark:text-cyan-400" />
						</div>
						<div>
							<p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold tracking-widest uppercase">Fully Furnished Studio Specs</p>
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">{cur.room}</h3>
						</div>
					</div>
					<div className="space-y-3">
						{cur.specs.map((s, j) => (
							<div key={j} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-2.5 border-b border-slate-100 dark:border-white/5 last:border-0">
								<span className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold sm:w-36 flex-shrink-0">{s.label}</span>
								<span className="text-slate-700 dark:text-white/80 text-xs md:text-sm leading-relaxed">{s.value}</span>
							</div>
						))}
					</div>
					<p className="text-slate-400 dark:text-white/30 text-[10px] mt-6">* Specifications indicative for Fully Furnished Studios · Subject to final agreement.</p>
				</div>
			</div>
		</div>
	);
};

/* ── Lead Form ── */
const YC_UNITS = [
	'Studio Type A — ~650 sq.ft',
	'Studio Type B — ~675 sq.ft',
];

const LeadForm = ({ dark = false, compact = false }) => {
	const [form, setForm] = useState({ name: '', phone: '', query: '' });
	const [sent, setSent] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [err, setErr] = useState('');
	const [ddOpen, setDdOpen] = useState(false);
	const ddRef = useRef(null);

	useEffect(() => {
		if (!ddOpen) return;
		const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
		document.addEventListener('mousedown', h);
		return () => document.removeEventListener('mousedown', h);
	}, [ddOpen]);

	const submit = async e => {
		e.preventDefault();
		setSubmitting(true); setErr('');
		try {
			await api.post('/inquiries/', {
				name: form.name,
				phone: form.phone,
				preferred_property_type: form.query || null,
				inquiry_type: 'SELL_ENQUIRY',
				source_page: 'codename-bento',
				whatsapp_opt_in: false,
			});
			setSent(true);
			setTimeout(() => { setSent(false); setForm({ name: '', phone: '', query: '' }); }, 4000);
		} catch {
			setErr('Something went wrong. Please try again.');
		} finally { setSubmitting(false); }
	};

	if (sent) return (
		<div className={`py-8 text-center rounded-2xl yc-zoom ${dark ? 'bg-white/5' : 'bg-cyan-50 dark:bg-cyan-900/20'}`}>
			<div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center mx-auto mb-2">
				<Check className="text-cyan-600 dark:text-cyan-400" size={22} />
			</div>
			<p className={`font-bold ${dark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Thank you!</p>
			<p className={`text-sm mt-1 ${dark ? 'text-white/60' : 'text-slate-600 dark:text-slate-400'}`}>InstaMakaan team will call you shortly.</p>
		</div>
	);

	const inp = dark
		? 'w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white placeholder-white/40 focus:border-cyan-400 focus:outline-none transition'
		: 'w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition';

	return (
		<form onSubmit={submit} className="space-y-3">
			<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Full Name" className={inp} />
			<div className={`flex items-center ${dark ? 'border-b border-white/20' : 'border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/80'}`}>
				<span className={`pl-3 pr-2 text-sm ${dark ? 'text-white/50' : 'text-slate-600 dark:text-slate-400'}`}>🇮🇳 +91</span>
				<input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number"
					className={`flex-1 px-2 py-2.5 text-sm bg-transparent focus:outline-none ${dark ? 'text-white placeholder-white/40' : 'text-slate-900 dark:text-white placeholder-slate-400'}`} />
			</div>
			{!compact && (
				<div ref={ddRef} className="relative">
					<button type="button" onClick={() => setDdOpen(o => !o)}
						className={`w-full flex items-center justify-between gap-2 cursor-pointer text-left ${dark
							? 'border-b border-white/20 px-0 py-2.5 text-sm bg-transparent text-white'
							: 'border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white'
						}`}>
						<span className={form.query ? (dark ? 'text-white' : 'text-slate-900 dark:text-white') : (dark ? 'text-white/40' : 'text-slate-400')}>
							{form.query || 'Select Unit Type'}
						</span>
						<ChevronDown size={15} className={`flex-shrink-0 transition-transform duration-200 ${ddOpen ? 'rotate-180' : ''} ${dark ? 'text-white/40' : 'text-slate-400'}`} />
					</button>
					{ddOpen && (
						<div className={`absolute z-50 top-full mt-1 left-0 right-0 rounded-xl overflow-hidden shadow-2xl border ${dark ? 'border-cyan-500/20 bg-[#0a1628]' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
							{YC_UNITS.map(u => (
								<button key={u} type="button"
									onClick={() => { setForm({ ...form, query: u }); setDdOpen(false); }}
									className={`w-full text-left px-4 py-3 text-sm transition-colors ${
										form.query === u
											? 'bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300 font-semibold'
											: 'text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5'
									}`}>
									{u}
								</button>
							))}
						</div>
					)}
				</div>
			)}
			{err && <p className="text-red-400 text-xs">{err}</p>}
			<p className={`text-[10px] leading-tight ${dark ? 'text-white/30' : 'text-slate-400 dark:text-slate-500'}`}>
				By submitting, I authorise InstaMakaan to contact me via call/SMS/WhatsApp.
			</p>
			<button type="submit" disabled={submitting}
				className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition yc-shine">
				{submitting ? 'Sending…' : <><span>Enquire via InstaMakaan</span><ArrowRight size={15} /></>}
			</button>
		</form>
	);
};

const PopupModal = ({ open, onClose }) => {
	useEffect(() => {
		if (!open) return;
		const h = e => { if (e.key === 'Escape') onClose(); };
		document.addEventListener('keydown', h);
		return () => document.removeEventListener('keydown', h);
	}, [open, onClose]);
	if (!open) return null;
	return (
		<div onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 yc-fade">
			<div onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#0a1628] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative yc-zoom border border-slate-200 dark:border-cyan-500/20">
				<button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center transition hover:rotate-90">
					<X size={18} />
				</button>
				<div className="h-44 overflow-hidden relative bg-slate-900">
					<img src={PH.tower} alt="" className="w-full h-full object-cover opacity-40" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
						<p className="text-[10px] font-bold tracking-[0.3em] text-cyan-400 uppercase mb-1">Gaur Yamuna City</p>
						<p className="text-2xl font-black text-white">CodeName: BENTO</p>
						<p className="text-xs text-cyan-300 mt-1">Luxury Studio Apartments · Yamuna Expressway</p>
					</div>
				</div>
				<div className="p-6">
					<p className="text-xs text-slate-500 dark:text-white/50 text-center mb-5">Starting ₹1 Cr* · 650–675 sq.ft · Fully Furnished</p>
					<LeadForm compact />
				</div>
			</div>
		</div>
	);
};

const Lightbox = ({ images, idx, onClose, onNav }) => {
	const tsX = useRef(null);
	useEffect(() => {
		if (idx === null) return;
		const h = e => { if (e.key === 'Escape') onClose(); else if (e.key === 'ArrowLeft') onNav((idx - 1 + images.length) % images.length); else if (e.key === 'ArrowRight') onNav((idx + 1) % images.length); };
		document.addEventListener('keydown', h);
		return () => document.removeEventListener('keydown', h);
	}, [idx, images.length, onClose, onNav]);
	if (idx === null) return null;
	return (
		<div onClick={onClose} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 yc-fade"
			onTouchStart={e => { tsX.current = e.touches[0].clientX; }}
			onTouchEnd={e => { if (!tsX.current) return; const d = tsX.current - e.changedTouches[0].clientX; if (Math.abs(d) > 50) onNav(d > 0 ? (idx + 1) % images.length : (idx - 1 + images.length) % images.length); tsX.current = null; }}>
			<button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition hover:rotate-90"><X size={20} /></button>
			<div onClick={e => e.stopPropagation()} className="max-w-5xl w-full yc-zoom">
				<img src={images[idx]} className="w-full max-h-[82vh] object-contain rounded-xl" alt="" />
				<div className="flex justify-center gap-3 mt-4">
					<button onClick={() => onNav((idx - 1 + images.length) % images.length)} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"><ChevronLeft size={16} /></button>
					<span className="px-4 py-2 text-white/60 text-sm">{idx + 1} / {images.length}</span>
					<button onClick={() => onNav((idx + 1) % images.length)} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"><ChevronRight size={16} /></button>
				</div>
			</div>
		</div>
	);
};

/* ── Amenity Slider ── */
const AmenitySlider = ({ slides }) => {
	const [idx, setIdx] = useState(0);
	const [paused, setPaused] = useState(false);
	const go = useCallback(n => setIdx((n + slides.length) % slides.length), [slides.length]);
	const next = useCallback(() => go(idx + 1), [idx, go]);
	useEffect(() => { if (paused) return; const t = setInterval(next, 4500); return () => clearInterval(t); }, [next, paused]);
	const s = slides[idx];
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-cyan-500/15"
			onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
			{/* Left: Image */}
			<div className="relative overflow-hidden" style={{ minHeight: 'clamp(220px,50vw,380px)' }}>
				{slides.map((sl, i) => (
					<div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}>
						<img src={sl.img} alt={sl.label} className="w-full h-full object-cover" />
					</div>
				))}
				<div className="absolute top-4 left-4 z-10 bg-black/55 backdrop-blur-sm border border-white/15 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
					{String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
				</div>
				<button onClick={() => go(idx - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors"><ChevronLeft size={18} /></button>
				<button onClick={() => go(idx + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors"><ChevronRight size={18} /></button>
			</div>
			{/* Right: Text */}
			<div className="flex flex-col justify-between p-8 lg:p-10 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
				<div>
					<p className="text-cyan-400 text-[9px] font-bold tracking-[0.3em] uppercase mb-4">CodeName: Bento · Amenities</p>
					<div className="h-[1px] w-12 bg-gradient-to-r from-cyan-400 to-transparent mb-6" />
					<h3 className="text-2xl lg:text-3xl font-bold text-white leading-snug mb-5">{s.caption}</h3>
					<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest">
						<span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
						{s.label}
					</span>
				</div>
				<div className="mt-8">
					<div className="flex gap-2 mb-4">
						{slides.map((_, i) => (
							<button key={i} onClick={() => go(i)}
								className="rounded-full transition-all duration-300"
								style={{ width: i === idx ? 28 : 7, height: 7, background: i === idx ? '#06b6d4' : 'rgba(255,255,255,0.15)' }} />
						))}
					</div>
					<p className="text-white/40 text-[10px]">Hover to pause · Arrows to navigate</p>
				</div>
			</div>
		</div>
	);
};


/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════ */
export default function YamunaCommercialPage() {
	const [popup, setPopup]       = useState(false);
	const [lbIdx, setLbIdx]       = useState(null);
	const [activeZone, setActiveZone] = useState(0);
	const [activeNearbyCat, setActiveNearbyCat] = useState('Airports & Expressways');
	const [payTab, setPayTab]     = useState('clp');

	const gallery = [PH.tower, PH.interior, PH.pool, PH.gym, PH.spa, PH.restaurant, PH.theater, PH.garden, PH.lobby, PH.balcony, I.masterPlan];

	useEffect(() => {
		const hide = () => { const w = document.getElementById('aisensy-wa-widget'); if (w) w.style.display = 'none'; };
		hide(); const t = setTimeout(hide, 1500);
		return () => { clearTimeout(t); const w = document.getElementById('aisensy-wa-widget'); if (w) w.style.display = ''; };
	}, []);

	const dl = () => { const a = document.createElement('a'); a.href = PROJECT.brochure; a.download = 'CodeName-Bento-Brochure.pdf'; a.target = '_blank'; a.click(); };

	return (
		<Layout noPadding>
			<style>{GLOBAL_CSS}</style>
			<div className="fixed top-14 inset-x-0 h-[1.5px] z-[9998] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
			<Helmet>
				<title>CodeName: Bento by Gaurs | Luxury Studio Apartments · Yamuna Expressway</title>
				<meta name="description" content="CodeName: Bento — Luxury Fully Furnished Studio Apartments at Gaur Yamuna City, Yamuna Expressway. 2 Iconic Glass Towers, 40 Storeys, 650-675 sq.ft. Starting ₹1 Cr*. 45,000 sq.ft Clubhouse. Part of 250-Acre Integrated Township." />
				<link rel="canonical" href="https://instamakaan.com/sell-companies/codename-bento" />
				<meta property="og:title" content="CodeName: Bento by Gaurs | Luxury Studio Apartments · Yamuna Expressway" />
				<meta property="og:description" content="Luxury Fully Furnished Studio Apartments. 2 Iconic Glass Towers, 40 Storeys. Starting ₹1 Cr*. Gaur Yamuna City, Yamuna Expressway." />
				<meta property="og:url" content="https://instamakaan.com/sell-companies/codename-bento" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
				<script type="application/ld+json">{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "RealEstateListing",
					"name": "CodeName: Bento — Luxury Studio Apartments, Yamuna Expressway",
					"description": "Luxury Fully Furnished Studio Apartments at Gaur Yamuna City. 2 Iconic Glass Towers. Starting ₹1 Cr*.",
					"url": "https://instamakaan.com/sell-companies/codename-bento",
					"address": { "@type": "PostalAddress", "streetAddress": "Yamuna Expressway, Sector-19", "addressLocality": "Greater Noida", "addressRegion": "Uttar Pradesh", "addressCountry": "IN" }
				})}</script>
			</Helmet>

			{/* ═══ MOBILE BOTTOM NAV ═══ */}
			<div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-[#070e1a]/95 backdrop-blur-lg border-t border-slate-200 dark:border-cyan-500/20 shadow-2xl">
				<div className="flex items-center justify-around px-2 py-2">
					{[
						{ href: '#overview', icon: <Home size={19} />, label: 'Overview' },
						{ href: '#floor-plans', icon: <Building2 size={19} />, label: 'Plans' },
						{ href: '#amenities', icon: <Sparkles size={19} />, label: 'Amenities' },
						{ href: '#pricing', icon: <Star size={19} />, label: 'Price' },
						{ href: '#location', icon: <MapPin size={19} />, label: 'Location' },
					].map(({ href, icon, label }) => (
						<a key={href} href={href} className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500 dark:text-white/50 px-2">
							{icon}{label}
						</a>
					))}
					<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer"
						className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-green-600 dark:text-green-400">
						<MessageCircle size={19} />WhatsApp
					</a>
				</div>
			</div>

			{/* ═══════════════════════════════════════
			    §1  HERO — Full Bleed Glass
			═══════════════════════════════════════ */}
			<section id="home" className="relative min-h-[620px] md:min-h-[780px] flex items-center overflow-hidden pt-16 md:pt-20">
				<img src={PH.tower} alt="CodeName Bento Towers" className="absolute inset-0 w-full h-full object-cover yc-kb" />
				<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
				{/* cyan top line */}
				<div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
				{/* subtle grid overlay */}
				<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

				<div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 pb-24 md:pb-14">
					<div className="lg:col-span-3 text-white">
						{/* Project badge */}
						<div className="mb-6 yc-anim" style={{ animationDelay: '0ms' }}>
							<div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-2xl px-5 py-3 shadow-xl">
								<div>
									<p className="text-cyan-400 text-[10px] font-bold tracking-[0.25em] uppercase">Gaur Yamuna City</p>
									<p className="text-white text-xl md:text-2xl font-black leading-tight">CodeName: BENTO</p>
									<p className="text-white/70 text-xs">by GAURS · Yamuna Expressway</p>
								</div>
							</div>
						</div>

						<p className="text-cyan-400 text-sm tracking-[0.2em] uppercase font-semibold mb-2 yc-anim" style={{ animationDelay: '100ms' }}>
							Luxury Fully Furnished Studio Apartments
						</p>
						<h1 className="text-3xl md:text-5xl font-black leading-tight mb-3 yc-anim" style={{ animationDelay: '150ms' }}>
							Three Worlds.<br />
							<span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">One Address.</span>
						</h1>

						{/* Trust badges */}
						<div className="flex flex-wrap gap-2 mb-5 yc-anim" style={{ animationDelay: '200ms' }}>
							<span className="flex items-center gap-1.5 bg-cyan-400/15 border border-cyan-400/30 backdrop-blur-sm text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full">
								<Building2 size={11} /> 2 Iconic Glass Towers
							</span>
							<span className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
								<Layers size={11} /> 40 Storeys Each
							</span>
							<span className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
								<Award size={11} /> 250 Acre Township
							</span>
						</div>

						<ul className="space-y-2 mb-7 max-w-xl yc-anim" style={{ animationDelay: '280ms' }}>
							{[
								'Modern Glass Building · Fully Furnished Studio Apartments',
								'650–675 sq.ft · Starting ₹1 Cr* Onwards',
								'45,000 sq.ft Luxury Clubhouse — Pool, Gym, Spa, Theater & More',
								'Branded Hotel + Luxury Mall + Studio Apartments = Three Worlds',
								'Massive Parking Space for 8,000 Cars',
								'Right on Yamuna Expressway · Near Upcoming Noida Intl. Airport',
							].map((b, i) => (
								<li key={i} className="flex items-start gap-2.5 text-white/90 text-xs md:text-sm">
									<div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center flex-shrink-0 mt-0.5">
										<Check size={9} className="text-cyan-400" />
									</div>
									{b}
								</li>
							))}
						</ul>

						<div className="flex flex-wrap gap-3 yc-anim" style={{ animationDelay: '380ms' }}>
							<button onClick={dl} className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-bold px-7 py-3.5 rounded-lg flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition">
								<Download size={15} /> Download Brochure
							</button>
							<button onClick={() => setPopup(true)} className="bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-lg flex items-center gap-2 transition">
								Enquire Now <ArrowRight size={14} />
							</button>
						</div>
					</div>

					{/* Hero lead form */}
					<div className="hidden lg:block lg:col-span-2 bg-black/55 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 shadow-2xl">
						<p className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-1">Register Your Interest</p>
						<h3 className="text-white text-lg font-bold mb-1">Get Exclusive Pre-Launch Pricing</h3>
						<p className="text-white/50 text-xs mb-4">InstaMakaan · Official Channel Partner</p>
						<LeadForm dark />
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §2  STATS STRIP
			═══════════════════════════════════════ */}
			<section className="bg-slate-100/90 dark:bg-[#070e1a] border-y border-slate-200 dark:border-cyan-500/10">
				<div className="container-custom py-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
					{STATS.map((s, i) => (
						<div key={i} className="text-center py-3 px-2 border-r last:border-r-0 border-slate-200 dark:border-cyan-500/10 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r md:[&:nth-child(2n)]:border-r">
							<p className="text-[9px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold mb-1">{s.label}</p>
							<p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight"><Counter text={s.value} /></p>
							<p className="text-[10px] text-slate-500 dark:text-white/40 mt-0.5 leading-tight">{s.sub}</p>
						</div>
					))}
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §3  THREE WORLDS. ONE ADDRESS.
			═══════════════════════════════════════ */}
			<section id="overview" className="bg-slate-50 dark:bg-[#070e1a] py-16 md:py-20 relative overflow-hidden">
				<div className="container-custom relative">
					<SectionHeading kicker="An Icon In The Making" title="Three Worlds. One Address."
						sub="A branded hotel, a luxury mall, and fully furnished studio apartments — all within one iconic 250-acre integrated township." />

					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						{THREE_WORLDS.map((w, i) => (
							<Reveal key={i} delay={i * 100}>
								<div className="group relative rounded-2xl overflow-hidden cursor-pointer yc-lift shadow-lg" style={{ minHeight: 340 }}>
									<img src={w.img} alt={w.title} className="absolute inset-0 w-full h-full object-cover yc-img" />
									<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-6">
										<div className="w-10 h-[2px] bg-cyan-400 mb-3 group-hover:w-16 transition-all duration-500" />
										<p className="text-cyan-400 text-[10px] font-bold tracking-[0.25em] uppercase mb-1">World {i + 1}</p>
										<h3 className="text-white text-xl font-bold mb-1">{w.title}</h3>
										<p className="text-white/70 text-sm">{w.sub}</p>
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §4  KEY HIGHLIGHTS
			═══════════════════════════════════════ */}
			<section className="bg-slate-100/70 dark:bg-[#0a1222] py-16 relative overflow-hidden">
				<div className="container-custom relative">
					<SectionHeading kicker="Why CodeName: Bento?" title="Key Highlights" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{[
							{ icon: Building2, title: '2 Iconic Glass Towers',    desc: '40 storeys each — modern glass façade that defines the skyline' },
							{ icon: Sparkles,  title: 'Fully Furnished Studios',   desc: '650–675 sq.ft luxury studio apartments — move-in ready' },
							{ icon: Dumbbell,   title: '45,000 sq.ft Clubhouse',    desc: 'Pool, Gym, Spa, Salon, Restaurant, Theater, Office Lounge' },
							{ icon: Hotel,      title: 'Branded Hotel',             desc: 'World-class hospitality within the township' },
							{ icon: ShoppingBag,title: 'Luxury Mall',              desc: 'Premium retail, dining & entertainment experiences' },
							{ icon: Car,        title: '8,000 Car Parking',         desc: 'Massive multi-level parking infrastructure' },
							{ icon: Plane,      title: 'Near Noida Intl. Airport',  desc: 'Upcoming Jewar Airport — a game-changer for the region' },
							{ icon: Home,       title: '250 Acre Township',         desc: 'Part of Gaur Yamuna City — 15,000+ residents' },
							{ icon: Star,       title: 'Starting ₹1 Cr*',          desc: 'Investment-grade pricing with high rental yield potential' },
						].map((h, i) => (
							<Reveal key={i} delay={i * 60}>
								<div className="yc-glass rounded-2xl p-5 hover:border-cyan-400/40 transition-all duration-300 yc-lift group shadow-sm hover:shadow-md">
									<div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 group-hover:bg-cyan-500/20 transition-colors">
										<h.icon size={18} className="text-cyan-600 dark:text-cyan-400" />
									</div>
									<h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">{h.title}</h4>
									<p className="text-slate-600 dark:text-white/50 text-xs leading-relaxed">{h.desc}</p>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §5  TOWNSHIP OVERVIEW — 250 ACRES
			═══════════════════════════════════════ */}
			<section className="bg-slate-50 dark:bg-[#070e1a] py-16 relative">
				<div className="container-custom">
					<SectionHeading kicker="Part of a 250-Acre Integrated Township" title="Gaur Yamuna City — Master Plan" />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
						{/* Master plan image */}
						<Reveal>
							<div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-cyan-500/15 cursor-zoom-in yc-glow bg-white" onClick={() => setLbIdx(gallery.length - 1)}>
								<img src={I.masterPlan} alt="Gaur Yamuna City Master Plan" className="w-full object-contain" />
							</div>
						</Reveal>

						{/* Township projects grid */}
						<Reveal delay={100}>
							<div className="space-y-4">
								<p className="text-cyan-600 dark:text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Projects Within the Township</p>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
									{TOWNSHIP_PROJECTS.map((p, i) => (
										<div key={i} className="yc-glass rounded-xl px-4 py-3 flex items-center gap-3 hover:border-cyan-400/30 transition-colors shadow-sm">
											<div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
												<span className="text-cyan-600 dark:text-cyan-400 text-[9px] font-bold">{i + 1}</span>
											</div>
											<div className="min-w-0">
												<p className="text-slate-900 dark:text-white text-xs font-semibold leading-tight truncate">{p.name}</p>
												<p className="text-slate-500 dark:text-white/35 text-[10px] leading-tight">{p.type}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</Reveal>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §6  BUILDING SHOWCASE — GLASS TOWER
			═══════════════════════════════════════ */}
			<section className="relative overflow-hidden" style={{ minHeight: 400 }}>
				<img src={PH.night} alt="Iconic Glass Tower Night View" className="absolute inset-0 w-full h-full object-cover" />
				<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
				<div className="container-custom relative z-10 py-16 md:py-24 flex items-center">
					<div className="max-w-lg text-white">
						<Reveal>
							<p className="text-cyan-400 text-xs tracking-[0.3em] uppercase font-bold mb-2">Modern Glass Architecture</p>
							<h2 className="text-4xl md:text-5xl font-black leading-tight mb-3">An Icon<br />In The Making</h2>
							<p className="text-white/70 text-sm leading-relaxed mb-6">
								Two 40-storey glass towers piercing the skyline — a symbol of modern luxury on the Yamuna Expressway. Every studio is fully furnished, move-in ready, and designed for the discerning urban investor.
							</p>
							<div className="flex flex-wrap gap-4">
								<div className="bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-xl px-5 py-3 text-center">
									<p className="text-2xl font-black text-white">40</p>
									<p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Storeys</p>
								</div>
								<div className="bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-xl px-5 py-3 text-center">
									<p className="text-2xl font-black text-white">2</p>
									<p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Towers</p>
								</div>
								<div className="bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-xl px-5 py-3 text-center">
									<p className="text-2xl font-black text-white">650+</p>
									<p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Sq.Ft</p>
								</div>
							</div>
						</Reveal>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §7  FLOOR PLANS — INTERACTIVE VIEWER
			═══════════════════════════════════════ */}
			<section id="floor-plans" className="bg-slate-50 dark:bg-[#070e1a] py-16">
				<div className="container-custom">
					<SectionHeading kicker="Designed For Modern Urban Living" title="Interactive Floor Plans"
						sub="Explore spacious studio apartment layouts with interactive zoom and pan controls." />
					<FloorPlanViewer units={UNIT_TYPES} />
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §8  SPECIFICATIONS — ROOM BY ROOM
			═══════════════════════════════════════ */}
			<section className="bg-slate-100/70 dark:bg-[#0a1222] py-16">
				<div className="container-custom">
					<SectionHeading kicker="Premium Turnkey Finishes" title="Studio Specifications"
						sub="Every studio is delivered fully furnished with turnkey interior fittings, appliances, and luxury fixtures." />
					<div className="max-w-4xl mx-auto">
						<SpecsPanel />
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §9  AMENITIES — SLIDER + ZONE GRID
			═══════════════════════════════════════ */}
			<section id="amenities" className="bg-slate-50 dark:bg-[#070e1a] py-16">
				<div className="container-custom">
					<SectionHeading kicker="45,000 Sq.Ft Luxury Clubhouse" title="World-Class Amenities"
						sub="Swimming Pool, Gymnasium, Spa & Salon, Restaurant, Theater, Office Lounge — and a stunning podium-level landscape." />

					<div className="mb-10">
						<AmenitySlider slides={AMENITY_SLIDES} />
					</div>

					{/* Zone tabs + grid */}
					<div className="flex flex-wrap justify-center gap-2 mb-6">
						{AMENITY_CATEGORIES.map((z, i) => (
							<button key={i} onClick={() => setActiveZone(i)}
								className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeZone === i ? 'text-white shadow-lg' : 'bg-white dark:bg-white/5 text-slate-700 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/8 border border-slate-200 dark:border-transparent'}`}
								style={activeZone === i ? { background: z.color } : {}}>
								<z.icon size={14} />
								{z.zone}
							</button>
						))}
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
						{AMENITY_CATEGORIES[activeZone].items.map((item, i) => (
							<div key={i} className="yc-glass rounded-xl px-3 py-3 flex items-center gap-2 transition-all hover:border-cyan-400/40 hover:shadow-md"
								style={{ animation: prefRed() ? 'none' : `ycFadeUp .4s ease ${i * 40}ms both` }}>
								<div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center" style={{ background: AMENITY_CATEGORIES[activeZone].color }}>
									<Check size={11} className="text-white" />
								</div>
								<p className="text-xs text-slate-800 dark:text-white/80 font-medium leading-tight">{item}</p>
							</div>
						))}
					</div>
					<p className="text-center text-[11px] text-slate-500 dark:text-white/30 mt-6">* Amenities as per brochure. Subject to developer confirmation.</p>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §10  STRATEGIC LOCATION & NEARBY HUBS (REDESIGNED)
			═══════════════════════════════════════ */}
			<section id="location" className="bg-slate-100/80 dark:bg-[#0a1222] py-16 md:py-20 relative overflow-hidden">
				{/* Concentric radar rings */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
					<div className="w-[500px] h-[500px] rounded-full border border-cyan-500/10 dark:border-cyan-500/5 absolute animate-pulse" />
					<div className="w-[750px] h-[750px] rounded-full border border-cyan-500/10 dark:border-cyan-500/5 absolute" />
					<div className="w-[1050px] h-[1050px] rounded-full border border-cyan-500/5 dark:border-cyan-500/3 absolute" />
				</div>

				<div className="container-custom relative z-10">
					<SectionHeading
						kicker="The Epicenter of NCR's Fastest Growing Growth Corridor"
						title="Strategic Location & Landmarks"
						sub="Situated directly on Yamuna Expressway at Exit 2C, minutes away from the upcoming Noida International Airport (Jewar), F1 Buddh International Circuit, and premier universities."
					/>

					{/* ── Address Pill & Google Maps CTA ── */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
						<div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-cyan-500/20 rounded-2xl px-6 py-3.5 shadow-md">
							<div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
								<MapPin size={20} className="text-cyan-600 dark:text-cyan-400" />
							</div>
							<div>
								<p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">Gaur Yamuna City · Sector-19</p>
								<p className="text-slate-500 dark:text-white/50 text-xs">Yamuna Expressway (Near Exit 2C), Uttar Pradesh</p>
							</div>
						</div>
						<a href="https://maps.google.com/?q=Gaur+Yamuna+City+Yamuna+Expressway" target="_blank" rel="noopener noreferrer"
							className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-bold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20">
							<span>View on Google Maps</span> <ExternalLink size={14} />
						</a>
					</div>

					{/* ── 2 Spotlight Mega-Projects Cards ── */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
						{/* Jewar Airport Spotlight */}
						<Reveal delay={0}>
							<div className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-cyan-500/20 shadow-xl bg-slate-900 text-white min-h-[260px] flex flex-col justify-end p-6 md:p-8 yc-lift">
								<img src={PH.airport} alt="Upcoming Jewar Airport" className="absolute inset-0 w-full h-full object-cover yc-img opacity-45" />
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
								<div className="relative z-10">
									<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-3">
										<Plane size={12} /> Upcoming Global Hub
									</div>
									<h3 className="text-2xl font-black text-white leading-tight mb-2">Noida International Airport (Jewar)</h3>
									<p className="text-white/70 text-xs md:text-sm leading-relaxed mb-4">
										Just 15 minutes away from CodeName Bento. Set to become Asia's largest airport, triggering massive appreciation and high rental yields for studio apartments.
									</p>
									<div className="flex items-center gap-3">
										<span className="text-cyan-400 font-bold text-sm">Distance: ~15 Kms</span>
										<span className="text-white/30">•</span>
										<span className="text-white/80 text-xs">Direct Expressway Drive</span>
									</div>
								</div>
							</div>
						</Reveal>

						{/* F1 Circuit & Sports Spotlight */}
						<Reveal delay={100}>
							<div className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-cyan-500/20 shadow-xl bg-slate-900 text-white min-h-[260px] flex flex-col justify-end p-6 md:p-8 yc-lift">
								<img src={PH.f1track} alt="Buddh International Circuit F1 Track" className="absolute inset-0 w-full h-full object-cover yc-img opacity-45" />
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
								<div className="relative z-10">
									<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-3">
										<Star size={12} /> Directly Opposite
									</div>
									<h3 className="text-2xl font-black text-white leading-tight mb-2">Buddh International F1 Circuit</h3>
									<p className="text-white/70 text-xs md:text-sm leading-relaxed mb-4">
										India's premier motor racing destination located right across the project, alongside the upcoming Olympic City and International Cricket Stadium.
									</p>
									<div className="flex items-center gap-3">
										<span className="text-amber-400 font-bold text-sm">Distance: 2 Mins</span>
										<span className="text-white/30">•</span>
										<span className="text-white/80 text-xs">Sector-19 Hub</span>
									</div>
								</div>
							</div>
						</Reveal>
					</div>

					{/* ── Categorized Nearby Grid with Tabs ── */}
					<div className="yc-glass-strong rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-cyan-500/20">
						{/* Category switcher */}
						<div className="flex flex-wrap items-center justify-center gap-2 mb-8">
							{Object.keys(NEARBY_HUBS).map((cat) => (
								<button
									key={cat}
									onClick={() => setActiveNearbyCat(cat)}
									className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
										activeNearbyCat === cat
											? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white shadow-md shadow-cyan-500/20'
											: 'bg-white dark:bg-white/5 text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 border border-slate-200 dark:border-transparent'
									}`}
								>
									{cat}
								</button>
							))}
						</div>

						{/* Hub items */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{NEARBY_HUBS[activeNearbyCat].map((item, idx) => (
								<div key={idx} className="bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-cyan-500/15 hover:border-cyan-400/40 rounded-2xl p-4 transition-all duration-200 hover:shadow-md">
									<div className="flex items-start justify-between gap-2 mb-2">
										<span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700/30 px-2 py-0.5 rounded-full">
											{item.tag}
										</span>
										<span className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap">
											{item.dist}
										</span>
									</div>
									<h4 className="text-sm font-bold text-slate-800 dark:text-white/90 leading-snug">
										{item.name}
									</h4>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §11  PRICING
			═══════════════════════════════════════ */}
			<section id="pricing" className="bg-slate-50 dark:bg-[#0a1222] py-16">
				<div className="container-custom">
					<SectionHeading kicker="Investment-Grade Pricing" title="Price Sheet" />
					<p className="text-center text-cyan-600 dark:text-cyan-400 text-sm font-bold mb-8">Starting ₹1 Cr* Onwards · Fully Furnished</p>

					{/* Unit price cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-10">
						{UNIT_TYPES.map((u, i) => (
							<Reveal key={i} delay={i * 100}>
								<div className={`rounded-2xl overflow-hidden border yc-lift shadow-md ${u.gold ? 'border-cyan-400/40 dark:border-cyan-400/40 shadow-cyan-500/10' : 'border-slate-200 dark:border-white/10'}`}>
									<div className={`px-5 py-3 ${u.gold ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white' : 'bg-slate-100 dark:bg-white/5'}`}>
										<div className="flex items-center justify-between">
											<p className={`font-bold text-sm ${u.gold ? 'text-white' : 'text-slate-900 dark:text-white/80'}`}>{u.label}</p>
											{u.tag && <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${u.gold ? 'bg-white/20 text-white' : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400'}`}>{u.tag}</span>}
										</div>
									</div>
									<div className="p-5 bg-white dark:bg-[#070e1a]">
										<p className="text-xs text-slate-500 dark:text-white/40 mb-4">{u.type} · {u.towers}</p>
										<div className="space-y-2.5 mb-5">
											{[['Area', `~${u.sqft.toLocaleString('en-IN')} sq.ft`], ['Carpet', u.carpet], ['Starting', fmtINR(u.sqft * u.bsp)]].map(([k, v]) => (
												<div key={k} className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
													<span className="text-xs text-slate-500 dark:text-white/35">{k}</span>
													<span className={`text-sm font-bold ${k === 'Starting' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'}`}>{v}</span>
												</div>
											))}
										</div>
										<button onClick={() => setPopup(true)} className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1 transition">
											Enquire <ChevronRight size={12} />
										</button>
									</div>
								</div>
							</Reveal>
						))}
					</div>

					{/* Additional charges + PLC */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto">
						<div className="yc-glass rounded-2xl p-5 shadow-sm">
							<p className="text-[11px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">Floor PLC (₹/sq.ft)</p>
							<table className="w-full">
								<tbody className="divide-y divide-slate-200 dark:divide-white/5">
									{FLOOR_PLC.map(f => (
										<tr key={f.floor}><td className="py-1.5 text-slate-700 dark:text-white/60 text-xs">{f.floor}</td><td className="py-1.5 text-right font-bold text-xs text-slate-500 dark:text-white/50">{f.plc}</td></tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="yc-glass rounded-2xl p-5 shadow-sm">
							<p className="text-[11px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">Additional Charges</p>
							<table className="w-full">
								<tbody className="divide-y divide-slate-200 dark:divide-white/5">
									{ADD_CHARGES.map(c => (
										<tr key={c.name}><td className="py-1.5 text-slate-700 dark:text-white/60 text-xs">{c.name}</td><td className="py-1.5 text-right font-bold text-xs text-slate-500 dark:text-white/50">{c.val}</td></tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<p className="text-center text-slate-400 dark:text-white/20 text-[10px] mt-6">* Prices are indicative. Subject to change. GST / Govt. charges as applicable.</p>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §12  PAYMENT PLAN
			═══════════════════════════════════════ */}
			<section className="bg-slate-100/70 dark:bg-[#070e1a] py-16">
				<div className="container-custom">
					<SectionHeading kicker="Flexible Payment Options" title="Payment Plan" />
					<div className="max-w-2xl mx-auto">
						<div className="yc-glass-strong rounded-2xl overflow-hidden shadow-md">
							<div className="bg-gradient-to-r from-cyan-600/15 to-teal-500/10 px-5 py-3 border-b border-cyan-500/15">
								<p className="text-slate-900 dark:text-white font-bold">Construction Linked Plan (CLP)</p>
								<p className="text-slate-500 dark:text-white/40 text-xs">Linked to construction milestones</p>
							</div>
							<div className="divide-y divide-slate-200 dark:divide-white/5">
								{CLP.map((step, i) => (
									<div key={i} className="px-5 py-3">
										<div className="flex items-center justify-between mb-1.5">
											<div className="flex items-center gap-3">
												<span className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-600 dark:text-cyan-400 flex-shrink-0">{i + 1}</span>
												<span className="text-slate-800 dark:text-white/80 text-sm">{step.milestone}</span>
											</div>
											<span className="text-cyan-600 dark:text-cyan-400 font-bold text-base ml-4 flex-shrink-0">{step.pct}%</span>
										</div>
										<div className="h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
											<div className="h-full bg-gradient-to-r from-cyan-600 to-teal-400 rounded-full yc-grow" style={{ width: `${step.pct}%`, animationDelay: `${i * 80}ms` }} />
										</div>
									</div>
								))}
								<div className="px-5 py-3 bg-cyan-500/10 flex justify-between">
									<span className="text-slate-900 dark:text-white font-bold text-sm">Total</span>
									<span className="text-cyan-600 dark:text-cyan-400 font-bold text-base">100%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §13  DEVELOPER — GAURS
			═══════════════════════════════════════ */}
			<section className="bg-slate-50 dark:bg-[#0a1222] py-16">
				<div className="container-custom">
					<SectionHeading kicker="The Developer" title="3 Decades of Trust & Triumphs" />
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
						{GAURS_MILESTONES.map((m, i) => (
							<Reveal key={i} delay={i * 80}>
								<div className="text-center yc-glass rounded-2xl py-5 px-3 shadow-sm">
									<p className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400"><Counter text={m.val} /></p>
									<p className="text-slate-600 dark:text-white/50 text-xs mt-1 leading-tight">{m.label}</p>
								</div>
							</Reveal>
						))}
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
						{[
							{ num: '35', label: 'Delivered Residential' },
							{ num: '30', label: 'Delivered Commercial' },
							{ num: '3', label: 'Townships' },
							{ num: '4', label: 'Schools' },
							{ num: '2', label: 'Retail Malls' },
							{ num: '2', label: 'Hotels' },
						].map((d, i) => (
							<div key={i} className="yc-glass rounded-xl p-3 text-center hover:border-cyan-400/30 transition-colors shadow-sm">
								<p className="text-slate-900 dark:text-white text-lg font-bold"><Counter text={d.num} /></p>
								<p className="text-slate-500 dark:text-white/35 text-[10px] mt-0.5">{d.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §14  ENQUIRE VIA INSTAMAKAAN
			═══════════════════════════════════════ */}
			<section className="bg-slate-100/70 dark:bg-[#070e1a] py-16 relative overflow-hidden">
				<div className="container-custom relative z-10">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-8">
							<p className="text-cyan-600 dark:text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">Official Channel Partner</p>
							<h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Enquire via InstaMakaan</h2>
							<CyanDivider />
							<p className="text-slate-600 dark:text-white/50 text-sm mt-2">For bookings, site visits, price negotiation & all property queries</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
							{/* Contact card */}
							<div className="yc-glass-strong rounded-2xl p-6 space-y-4 shadow-md">
								<div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
									<div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
										<Phone size={22} className="text-cyan-600 dark:text-cyan-400" />
									</div>
									<div>
										<p className="text-slate-500 dark:text-white/40 text-xs uppercase tracking-wider">Call / WhatsApp</p>
										<a href={`tel:${PROJECT.phone}`} className="text-xl font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition">{PROJECT.phoneDisplay}</a>
									</div>
								</div>
								<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer"
									className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition">
									<div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center flex-shrink-0">
										<MessageCircle size={22} className="text-green-600 dark:text-green-400" />
									</div>
									<div>
										<p className="text-green-700 dark:text-green-400 text-xs uppercase tracking-wider">WhatsApp</p>
										<p className="text-green-900 dark:text-green-300 font-bold">Chat with InstaMakaan</p>
									</div>
								</a>
								<div className="p-4 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
									<p className="text-cyan-600 dark:text-cyan-400 text-sm font-bold mb-2">About This Project</p>
									<div className="space-y-1.5 text-xs text-slate-600 dark:text-white/50">
										<p><span className="text-slate-900 dark:text-white/80 font-semibold">Project:</span> CodeName: Bento by GAURS</p>
										<p><span className="text-slate-900 dark:text-white/80 font-semibold">Location:</span> Gaur Yamuna City, Yamuna Expressway</p>
										<p><span className="text-slate-900 dark:text-white/80 font-semibold">Type:</span> Luxury Fully Furnished Studio Apartments</p>
										<p><span className="text-slate-900 dark:text-white/80 font-semibold">Size:</span> 650–675 sq.ft · Starting ₹1 Cr*</p>
									</div>
								</div>
								<button onClick={dl} className="w-full border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition">
									<Download size={15} /> Download Full Brochure (PDF)
								</button>
							</div>

							{/* Lead form */}
							<div className="yc-glass-strong rounded-2xl p-6 shadow-md">
								<p className="text-cyan-600 dark:text-cyan-400 font-bold mb-4">Send Enquiry</p>
								<LeadForm />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* mobile spacer */}
			<div className="h-16 md:hidden" />

			<PopupModal open={popup} onClose={() => setPopup(false)} />
			<Lightbox images={gallery} idx={lbIdx} onClose={() => setLbIdx(null)} onNav={i => setLbIdx(i)} />
			<FloatingActions />
		</Layout>
	);
}
