import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	MapPin, Check, ArrowRight, Phone, MessageCircle,
	ChevronDown, ChevronLeft, ChevronRight, X, Home, Star, Download, Shield,
	Trees, Dumbbell, Car, Zap, Droplets, Users, Award,
	Waves, Trophy, Activity, Coffee,
	Navigation2, CloudRain, Compass, Leaf, Landmark, Lightbulb, ZoomIn, Ruler,
} from 'lucide-react';

/* ── colour tokens ── */
const GOLD = '#c49a2a';
const DARK = '#0d1a0a';

/* ── project constants ── */
const PROJECT = {
	name:         'Paradise City',
	tagline:      'Own your plot. Own your dream.',
	developer:    'Sumpri Infratech Pvt Ltd',
	agent:        'GRDA INFRA PRIVATE LIMITED',
	agentTagline: 'Our Roots Your Dreams',
	rera:         'BRERAA12606/24/2024',
	phone:        '+919771034916',
	phoneDisplay: '+91 97710 34916',
	agentPhone:   '+91 95408 33833',
	wa:           'https://wa.aisensy.com/aabbf5',
	email:        'info@grdainfra.com',
	web:          'www.grdainfra.com',
	brochure:     '/brochures/paradise-city-brochure.pdf',
	mapsLink:     'https://maps.google.com/?q=Sector+138+Noida+Uttar+Pradesh',
	regnOffice:   'A/506, Kamla Niketan, S K Puri, Sahdeo Mahto Marg, Boring Road, Patna – 800001',
	corpOffice:   'Unit no UG A09, Tower T3, NX One, Greater Noida West – 201306',
};

const BANK = {
	company:  'GRDA INFRA PVT LTD',
	bank:     'ICICI Bank',
	accNo:    '04005502069',
	ifsc:     'ICIC0000404',
	branch:   'S.K. Puri, Boring Road, Patna',
};

const PLOT_SIZES = [
	{ size: '150 Sq Yd',  dim: "27' × 50'",   tag: 'POPULAR', approxPrice: '₹90 L*',    w: 27,  h: 50  },
	{ size: '200 Sq Yd',  dim: "30' × 60'",   tag: '',        approxPrice: '₹1.20 Cr*', w: 30,  h: 60  },
	{ size: '250 Sq Yd',  dim: "30' × 75'",   tag: 'PREMIUM', approxPrice: '₹1.50 Cr*', w: 30,  h: 75  },
	{ size: '1000 Sq Yd', dim: "60' × 150'",  tag: 'LARGE',   approxPrice: '₹6.00 Cr*', w: 60,  h: 150 },
	{ size: '2000 Sq Yd', dim: "120' × 150'", tag: 'CORNER',  approxPrice: '₹12 Cr*',   w: 120, h: 150 },
];

const CHARGES = [
	{ name: 'Basic Sale Price (BSP)', value: '₹60,000 / sq. yd.' },
	{ name: 'EDC Charges',            value: '₹250 / sq. yd.'    },
	{ name: 'IDC Charges',            value: '₹250 / sq. yd.'    },
	{ name: 'Corner PLC',             value: '5% of BSP'          },
	{ name: 'Club Membership',        value: '₹1,00,000/-'        },
];

const PAYMENT_PLAN = [
	{ pct: '10%', label: 'At Booking',     milestone: 'At the time of Booking'           },
	{ pct: '30%', label: 'Within 30 Days', milestone: 'Within 30 Days from Booking Date' },
	{ pct: '60%', label: 'Final Payment',  milestone: 'Within 90 Days from Booking Date' },
];

const HIGHLIGHTS = [
	{ icon: <MapPin size={14} />, title: 'Prime Location',
	  desc: "Sector-138 on 45M Pusta Road adjoining FNG Highway — Noida's finest location",
	  photo: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=85',
	  photoFb: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=85' },
	{ icon: <Car size={14} />, title: 'Grand Entrance',
	  desc: '24-meter road adjoining to 75-meter road — impressive gated entry with boom barriers',
	  photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=85',
	  photoFb: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=85' },
	{ icon: <Home size={14} />, title: 'Low-Density Living',
	  desc: 'Low-density plotted development — more open space, privacy and greenery per plot',
	  photo: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85',
	  photoFb: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=900&q=85' },
	{ icon: <Check size={14} />, title: 'Clear Title Plots',
	  desc: 'Well demarcated plots with clear titles — choice of direction and garden proximity',
	  photo: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?auto=format&fit=crop&w=900&q=85',
	  photoFb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85' },
	{ icon: <Shield size={14} />, title: 'Multi-Tier Security',
	  desc: 'CCTV, control room, boom barriers, regulated access and well-lit common areas',
	  photo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=85',
	  photoFb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85' },
	{ icon: <Trees size={14} />, title: 'Water Bodies & Parks',
	  desc: 'Acclaimed landscaping, floral beds, water features, paved green avenues and seating',
	  photo: 'https://images.unsplash.com/photo-1585208798174-6cedd4b79c55?auto=format&fit=crop&w=900&q=85',
	  photoFb: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85' },
];

const CAROUSEL_SLIDES = [
	{
		// Luxury outdoor pool inside a residential complex
		src:      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=85',
		fallback: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=85',
		tag:     'Pool Pleasure',
		caption: 'Swimming Pool · Kids Pool · Pool Side Decks · Pool Side Party Lawn',
	},
	{
		// Indoor gym with equipment — society clubhouse
		src:      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=900&q=85',
		fallback: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
		tag:     'Indoor Gym',
		caption: 'Indoor Gym · Cafeteria · Multipurpose Hall · Table Tennis · Card Table',
	},
	{
		// Indoor badminton court inside society
		src:      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=85',
		fallback: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&w=900&q=85',
		tag:     'Sports Arena',
		caption: 'Badminton Court · Basketball Area · Cricket Practice Net',
	},
	{
		// Indoor yoga studio / wellness room inside clubhouse
		src:      'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=900&q=85',
		fallback: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=900&q=85',
		tag:     'Yoga & Wellness',
		caption: 'Yoga Studio · Meditation Area · Jogging Track · Senior Citizen Area',
	},
	{
		// Colourful kids play area inside a housing society
		src:      'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=900&q=85',
		fallback: 'https://images.unsplash.com/photo-1566454419290-57a64afe4c91?auto=format&fit=crop&w=900&q=85',
		tag:     'Kids Play Zone',
		caption: "Kid's Play Area · Modern Equipment · Safe & Supervised",
	},
	{
		// Manicured landscaped garden inside gated complex
		src:      'https://images.unsplash.com/photo-1585208798174-6cedd4b79c55?auto=format&fit=crop&w=900&q=85',
		fallback: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85',
		tag:     'Landscaped Gardens',
		caption: 'Floral Beds · Water Bodies · Tree-lined Streets · Relaxing Seating Areas',
	},
];

const INFRA_FEATURES = [
	{ icon: <Navigation2 size={20} />, label: 'Well-lit wide internal roads'             },
	{ icon: <Droplets size={20} />,    label: 'Electricity & water supply for each plot' },
	{ icon: <Zap size={20} />,         label: 'Sewage line provision for each plot'      },
	{ icon: <CloudRain size={20} />,   label: 'Storm water drainage provision'           },
	{ icon: <Lightbulb size={20} />,   label: 'Power backup in all common areas'         },
	{ icon: <Trees size={20} />,       label: 'Tree-lined street roads'                  },
	{ icon: <Compass size={20} />,     label: 'Choice of plot facing direction'          },
	{ icon: <Leaf size={20} />,        label: 'Most plots with gardens nearby'           },
];

const AMENITY_ZONES = [
	{
		zone: 'The Pool Pleasure',
		icon: <Waves size={18} />,
		photo: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=85',
		photoFb: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=85',
		items: ['Swimming Pool', 'Kids Pool', 'Pool Side Decks', 'Pool Side Party Lawn'],
	},
	{
		zone: 'The Sports Arena',
		icon: <Trophy size={18} />,
		photo: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=85',
		photoFb: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&w=900&q=85',
		items: ['Badminton Court', 'Basketball Area', 'Cricket Practice Net'],
	},
	{
		zone: 'Play & Wellness',
		icon: <Activity size={18} />,
		photo: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=900&q=85',
		photoFb: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=900&q=85',
		items: ["Kid's Play Area", 'Senior Citizen Area', 'Yoga Area', 'Jogging Track', 'Meditation Area'],
	},
	{
		zone: 'Club Indulgences',
		icon: <Coffee size={18} />,
		photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=900&q=85',
		photoFb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85',
		items: ['Cafeteria', 'Indoor Gym', 'Multipurpose Hall', 'Card Table', 'Table Tennis'],
	},
];

// Layout-plan detail rows — each gets its own image (left) + its own text (right).
// `image` is a placeholder for now — replace each with a real generated/photographed
// image later (see LayoutDetailImage's placeholder fallback below).
const LAYOUT_DETAILS = [
	{
		icon: Ruler,
		title: 'Plot Sizes',
		desc: '250 sq. yd (30′×75′), 200 sq. yd (30′×60′) and 150 sq. yd (27′×50′) plots across Blocks B, C & D — other sizes as per site.',
		image: '/images/paradise-city/1.webp',
	},
	{
		icon: Landmark,
		title: 'Commercial Zone',
		desc: 'Paradise Complex — a ~4,968 sq. yd commercial plot facing the Main Road, right at the project entrance.',
		image: '/images/paradise-city/2.webp',
	},
	{
		icon: Users,
		title: 'Banquet Hall & Club',
		desc: 'Paradise Banquet/Club House spread across ~5,984 sq. yd, near the SK block on the FNG Highway side.',
		image: '/images/paradise-city/3.webp',
	},
	{
		icon: Home,
		title: 'Hospital Plot (Block SK)',
		desc: 'Block SK (SK01–SK07) fronts FNG Highway Road, including a dedicated ~5,000 sq. yd plot earmarked for Paradise Hospital.',
		image: '/images/paradise-city/4.webp',
	},
	{
		icon: Award,
		title: 'Paradise International School',
		desc: 'A dedicated school plot planned within the project, next to the retained Old House/Office.',
		image: '/images/paradise-city/5.webp',
	},
	{
		icon: Navigation2,
		title: 'Internal Road Network',
		desc: 'A planned grid of 25′, 30′ and 35′-wide internal roads, connected to a 50′-wide Main Road running through the project.',
		image: '/images/paradise-city/6.webp',
	},
	{
		icon: Compass,
		title: 'Boundary Roads',
		desc: '45 m Pusta Road (towards Greater Noida Parichowk) on the west, FNG Highway Road on the east, and the Noida–Greater Noida Expressway with service roads on the south.',
		image: '/images/paradise-city/7.webp',
	},
	{
		icon: Leaf,
		title: 'Future Expansion',
		desc: 'A reserved zone on the northern boundary of the project, marked out for future phases.',
		image: '/images/paradise-city/8.webp',
	},
	{
		icon: Trees,
		title: 'On-Site Landmarks',
		desc: 'An on-site Temple and the retained Old House/Office are marked within the residential blocks.',
		image: '/images/paradise-city/9.webp',
	},
];

const CONNECTIVITY = [
	{ category: 'Expressway', items: ['Noida–Greater Noida Expressway', 'FNG Expressway'] },
	{ category: 'Metro',      items: ['Aqua Line — Noida Sector 137', 'Aqua Line — Noida Sector 83', 'Also nearby: Sector 142 & 143'] },
	{ category: 'Railway',    items: ['Anand Vihar Railway Station', 'Hazrat Nizamuddin Railway Station'] },
	{ category: 'Airport',    items: ['Noida International Airport (~30 min)', 'IGI Airport, Delhi (~45 km via expressway)'] },
	{ category: 'Hospital',   items: ['Felix Hospital', 'Jaypee Hospital', 'Noida Medicare Centre', 'Metro Hospital & Heart Institute'] },
	{ category: 'School',     items: ['Genesis Global School', 'Shiv Nadar School', 'JBM Global School', 'Anubha Global School'] },
	{ category: 'Mall',       items: ['DLF Mall of India (short drive)', 'Shopping Complexes nearby'] },
	{ category: 'Commercial', items: ['Advant Tower', 'Eco Tower', 'Windsor IT Park'] },
];

const TC = [
	'Payment shall be made only via Cheque / Demand Draft in favour of "SUMPRI INFRATECH PVT LTD / PARADISE CITY".',
	'Prices are subject to revision at the sole discretion of the company without prior notice.',
	'GST, Stamp Duty, Registry charges and all other government levies shall be borne by the allottee/applicant.',
	'The price / payment plan applicable on the date of booking will be final and may be changed without prior notice.',
	'Layouts and specifications are indicative and may be modified by the company / architect / competent authority.',
	'Detailed terms and conditions will be provided in the Builder Buyer Agreement.',
	'The information contained in this brochure is merely informatory and for general information purposes only.',
];

/* ── Global CSS ── */
const GLOBAL_CSS = `
	@keyframes pcKenburns    { 0%{transform:scale(1)} 100%{transform:scale(1.02)} }
	@keyframes pcSlideZoom   { 0%{transform:scale(1.0)} 100%{transform:scale(1.06)} }
	@keyframes pcProgressFill{ from{width:0%} to{width:100%} }
	.pc-slide-zoom  { animation: pcSlideZoom 4.8s ease-out forwards; }
	.pc-prog-fill   { animation: pcProgressFill 4.8s linear forwards; }
@keyframes pcFadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
.pc-fade-up { animation: pcFadeUp 0.45s ease-out both; }
	@keyframes pcFadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
	@keyframes pcBounce   { 0%,100%{transform:translateY(0);opacity:.9} 50%{transform:translateY(7px);opacity:.4} }
	@keyframes pcShine    { 0%{left:-90%} 60%,100%{left:130%} }
	@keyframes pcFadeIn   { from{opacity:0} to{opacity:1} }

	.pc-kb     { animation: pcKenburns 20s ease-out forwards; }
	.pc-bounce { animation: pcBounce 2s ease-in-out infinite; }
	.pc-anim   { opacity:0; animation: pcFadeUp .8s cubic-bezier(.22,1,.36,1) forwards; }
	.pc-fade   { animation: pcFadeIn .3s ease both; }
	.pc-shine  { position:relative; overflow:hidden; }
	.pc-shine::after {
		content:''; position:absolute; top:0; left:-90%;
		width:45%; height:100%;
		background:linear-gradient(105deg,transparent,rgba(255,255,255,.28),transparent);
		transform:skewX(-20deg);
		animation:pcShine 3.6s ease-in-out infinite;
		pointer-events:none;
	}
	section[id] { scroll-margin-top:84px; }
	@media (max-width:767px) { #aisensy-wa-widget { display:none!important; } }
	@media (prefers-reduced-motion:reduce) {
		.pc-kb,.pc-bounce,.pc-anim { animation:none!important; opacity:1!important; transform:none!important; }
		.pc-shine::after { animation:none!important; display:none; }
	}
`;

const prefRed = () =>
	typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches;

const useInView = (t = 0.14) => {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const el = ref.current; if (!el) return;
		if (prefRed() || !window.IntersectionObserver) { setVis(true); return; }
		const ob = new IntersectionObserver(
			([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } },
			{ threshold: t, rootMargin: '0px 0px -40px 0px' }
		);
		ob.observe(el);
		return () => ob.disconnect();
	}, [t]);
	return [ref, vis];
};

const Reveal = ({ children, delay = 0, className = '' }) => {
	const [ref, vis] = useInView();
	return (
		<div ref={ref} className={className} style={{
			opacity: vis ? 1 : 0,
			transform: vis ? 'none' : 'translateY(22px)',
			transition: `opacity .65s ease ${delay}ms, transform .75s cubic-bezier(.22,1,.36,1) ${delay}ms`,
			willChange: 'opacity,transform',
		}}>
			{children}
		</div>
	);
};

const GoldDivider = ({ center = true }) => (
	<div className={`flex items-center gap-3 my-4 ${center ? 'justify-center' : ''}`}>
		<div className="h-px w-14 bg-gradient-to-r from-transparent to-[#c49a2a]" />
		<div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
		<div className="h-px w-14 bg-gradient-to-l from-transparent to-[#c49a2a]" />
	</div>
);

const SectionHeading = ({ kicker, title, sub, light = false, center = true }) => (
	<Reveal>
		<div className={`mb-8 md:mb-12 ${center ? 'text-center' : ''}`}>
			{kicker && <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>{kicker}</p>}
			<h2 className={`text-2xl md:text-3xl font-bold ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</h2>
			<GoldDivider center={center} />
			{sub && <p className={`text-sm leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''} text-white/60`}>{sub}</p>}
		</div>
	</Reveal>
);

/* ── Scroll Progress ── */
const ScrollProgress = () => {
	const [p, setP] = useState(0);
	useEffect(() => {
		const fn = () => { const h = document.documentElement; setP(h.scrollHeight - h.clientHeight > 0 ? h.scrollTop / (h.scrollHeight - h.clientHeight) : 0); };
		fn(); window.addEventListener('scroll', fn, { passive: true });
		return () => window.removeEventListener('scroll', fn);
	}, []);
	return <div className="fixed top-0 left-0 z-[60] h-[3px] shadow-[0_0_8px_rgba(196,154,42,.6)]"
		style={{ width: `${p * 100}%`, background: `linear-gradient(to right,${GOLD},#e8c44a)`, transition: 'width .1s linear' }} />;
};

/* ── Lead Form ── */
const PC_SIZES = [
	"150 Sq Yd (27' × 50')", "200 Sq Yd (30' × 60')", "250 Sq Yd (30' × 75')",
	"1000 Sq Yd (60' × 150')", "2000 Sq Yd (120' × 150')", 'Other / Not Sure',
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
		const h = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
		document.addEventListener('mousedown', h);
		return () => document.removeEventListener('mousedown', h);
	}, [ddOpen]);

	const submit = async (e) => {
		e.preventDefault(); setSubmitting(true); setErr('');
		try {
			await api.post('/inquiries/', { name: form.name, phone: form.phone, preferred_property_type: form.query || null, inquiry_type: 'SELL_ENQUIRY', source_page: 'paradise-city', whatsapp_opt_in: false });
			setSent(true);
			setTimeout(() => { setSent(false); setForm({ name: '', phone: '', query: '' }); }, 4000);
		} catch { setErr('Something went wrong. Please try again.'); }
		finally { setSubmitting(false); }
	};

	if (sent) return (
		<div className={`py-8 text-center rounded-2xl ${dark ? 'bg-white/5' : 'bg-amber-50'}`}>
			<div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2"><Check className="text-amber-700" size={22} /></div>
			<p className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Thank you!</p>
			<p className={`text-sm mt-1 ${dark ? 'text-white/60' : 'text-slate-600'}`}>InstaMakaan team will call you shortly.</p>
		</div>
	);

	const inp = dark
		? 'w-full bg-transparent border-b border-white/30 px-0 py-2.5 text-sm text-white placeholder-white/50 focus:border-amber-400 focus:outline-none transition'
		: 'w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition';

	return (
		<form onSubmit={submit} className="space-y-3">
			<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Full Name" className={inp} />
			<div className={`flex items-center ${dark ? 'border-b border-white/30' : 'border border-slate-200 rounded-lg bg-white'}`}>
				<span className={`pl-3 pr-2 text-sm ${dark ? 'text-white/70' : 'text-slate-600'}`}>🇮🇳 +91</span>
				<input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone Number"
					className={`flex-1 px-2 py-2.5 text-sm bg-transparent focus:outline-none ${dark ? 'text-white placeholder-white/50' : 'text-slate-900 placeholder-slate-400'}`} />
			</div>
			{!compact && (
				<div ref={ddRef} className="relative">
					<button type="button" onClick={() => setDdOpen((o) => !o)}
						className={`w-full flex items-center justify-between gap-2 cursor-pointer text-left ${dark ? 'border-b border-white/30 px-0 py-2.5 text-sm bg-transparent' : 'border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white'}`}>
						<span className={form.query ? (dark ? 'text-white' : 'text-slate-900') : (dark ? 'text-white/50' : 'text-slate-400')}>{form.query || 'Select Plot Size'}</span>
						<ChevronDown size={15} className={`flex-shrink-0 transition-transform duration-200 ${ddOpen ? 'rotate-180' : ''} ${dark ? 'text-white/50' : 'text-slate-400'}`} />
					</button>
					{ddOpen && (
						<div className={`absolute z-50 top-full mt-1 left-0 right-0 rounded-xl overflow-hidden shadow-2xl border ${dark ? 'border-white/10' : 'border-slate-200'}`} style={{ background: dark ? '#0d1a0a' : '#fff' }}>
							{PC_SIZES.map((u) => (
								<button key={u} type="button" onClick={() => { setForm({ ...form, query: u }); setDdOpen(false); }}
									className={`w-full text-left px-4 py-3 text-sm transition-colors ${form.query === u ? (dark ? 'bg-amber-900/50 text-amber-300 font-semibold' : 'bg-amber-50 text-amber-700 font-semibold') : (dark ? 'text-white/80 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
									{u}
								</button>
							))}
						</div>
					)}
				</div>
			)}
			{err && <p className="text-red-400 text-xs">{err}</p>}
			<p className={`text-[10px] leading-tight ${dark ? 'text-white/40' : 'text-slate-400'}`}>By submitting, I authorise InstaMakaan to contact me via call/SMS/WhatsApp.</p>
			<button type="submit" disabled={submitting} className="w-full pc-shine disabled:opacity-60 text-white font-bold py-3 rounded-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg transition" style={{ background: 'linear-gradient(to right, #92400e, #b45309)' }}>
				{submitting ? 'Sending…' : <><span>Enquire via InstaMakaan</span><ArrowRight size={15} /></>}
			</button>
		</form>
	);
};

/* ── Popup Modal ── */
const PopupModal = ({ open, onClose }) => {
	useEffect(() => {
		if (!open) return;
		const h = (e) => { if (e.key === 'Escape') onClose(); };
		document.addEventListener('keydown', h);
		return () => document.removeEventListener('keydown', h);
	}, [open, onClose]);
	if (!open) return null;
	return (
		<div onClick={onClose} className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 pc-fade" style={{ backdropFilter: 'blur(4px)' }}>
			<div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
				<button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white transition hover:rotate-90" style={{ background: '#92400e' }}>
					<X size={18} />
				</button>
				<div className="h-44 overflow-hidden relative" style={{ background: DARK }}>
					<img src="/images/paradise-city/site-plan.jpg" alt="Paradise City" className="w-full h-full object-cover opacity-40" onError={(e) => { e.target.style.display = 'none'; }} />
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
						<p className="text-[10px] font-bold tracking-[0.3em] text-amber-400 uppercase mb-1">GRDA INFRA</p>
						<p className="text-2xl font-black text-white">PARADISE CITY</p>
						<p className="text-xs text-amber-300 mt-1">Sector-138, Noida · Plotted Development</p>
					</div>
				</div>
				<div className="p-6">
					<p className="text-xs text-slate-500 text-center mb-5">₹60,000/sq.yd · Plots from 150 sq yd</p>
					<LeadForm compact />
				</div>
			</div>
		</div>
	);
};

/* ── Photo Carousel ── */
const PhotoCarousel = () => {
	const [cur, setCur] = useState(0);
	const n = CAROUSEL_SLIDES.length;
	const timerRef = useRef(null);

	const resetTimer = () => {
		clearInterval(timerRef.current);
		timerRef.current = setInterval(() => setCur((c) => (c + 1) % n), 4800);
	};
	const goTo = (i) => { setCur((i + n) % n); resetTimer(); };

	useEffect(() => {
		timerRef.current = setInterval(() => setCur((c) => (c + 1) % n), 4800);
		return () => clearInterval(timerRef.current);
	}, [n]);

	return (
		<div className="relative overflow-hidden shadow-2xl"
			style={{ height: 'clamp(320px,46vw,540px)', borderRadius: 24, border: `1px solid ${GOLD}30` }}>

			{/* Images — crossfade + Ken Burns */}
			{CAROUSEL_SLIDES.map((s, i) => (
				<div key={i} className="absolute inset-0"
					style={{ opacity: i === cur ? 1 : 0, zIndex: i === cur ? 1 : 0, transition: 'opacity 1.1s cubic-bezier(.4,0,.2,1)' }}>
					<img src={s.src} alt={s.tag}
						className={`w-full h-full object-cover ${i === cur ? 'pc-slide-zoom' : ''}`}
						onError={s.fallback ? (e) => { e.target.onerror = null; e.target.src = s.fallback; } : undefined}
					/>
				</div>
			))}

			{/* Gradient — rich bottom vignette */}
			<div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
				background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.32) 100%)' }} />

			{/* Animated progress bars — one fills per slide cycle */}
			<div className="absolute top-4 left-4 right-16 flex gap-1.5" style={{ zIndex: 4 }}>
				{CAROUSEL_SLIDES.map((_, i) => (
					<button key={i} onClick={() => goTo(i)}
						className="relative h-[2px] flex-1 rounded-full overflow-hidden cursor-pointer"
						style={{ background: 'rgba(255,255,255,0.18)' }}>
						{i < cur  && <div className="absolute inset-0 rounded-full" style={{ background: `${GOLD}80` }} />}
						{i === cur && <div key={`p-${cur}`} className="absolute inset-y-0 left-0 rounded-full pc-prog-fill" style={{ background: GOLD }} />}
					</button>
				))}
			</div>

			{/* Slide counter */}
			<div className="absolute top-3 right-4 flex items-baseline gap-0.5" style={{ zIndex: 4 }}>
				<span className="text-sm font-black text-white">{String(cur + 1).padStart(2, '0')}</span>
				<span className="text-[10px] text-white/30 font-medium">/{String(n).padStart(2, '0')}</span>
			</div>

			{/* Prev / Next — frosted glass circles */}
			<button onClick={() => goTo(cur - 1)}
				className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-90"
				style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.14)', zIndex: 3 }}>
				<ChevronLeft size={17} />
			</button>
			<button onClick={() => goTo(cur + 1)}
				className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-90"
				style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.14)', zIndex: 3 }}>
				<ChevronRight size={17} />
			</button>

			{/* Caption — premium glass card */}
			<div className="absolute bottom-4 left-4 right-4" style={{ zIndex: 3 }}>
				<div className="rounded-2xl px-5 py-4"
					style={{ background: 'rgba(8,18,6,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
						border: `1px solid ${GOLD}28`, boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)` }}>
					<div className="flex items-center gap-2.5 mb-1.5">
						<div className="w-0.5 h-4 rounded-full flex-shrink-0" style={{ background: GOLD }} />
						<p className="text-[9px] uppercase tracking-[0.3em] font-extrabold" style={{ color: GOLD }}>{CAROUSEL_SLIDES[cur].tag}</p>
					</div>
					<p className="text-white/75 text-[11px] font-medium leading-relaxed pl-3">{CAROUSEL_SLIDES[cur].caption}</p>
				</div>
			</div>
		</div>
	);
};

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function ParadiseCityPage() {
	const [popup, setPopup]           = useState(false);
	const [activeZone, setActiveZone] = useState(0);
	const [activeDetail, setActiveDetail] = useState(0);
	const [r1Active, setR1Active]     = useState(0);
	const [r2Active, setR2Active]     = useState(0);
	const r1TimerRef                  = useRef(null);
	const r2TimerRef                  = useRef(null);
	const detailTimerRef              = useRef(null);
	const ROW1 = HIGHLIGHTS.slice(0, 3);
	const ROW2 = HIGHLIGHTS.slice(3);
	const resetR1 = () => { clearInterval(r1TimerRef.current); r1TimerRef.current = setInterval(() => setR1Active(i => (i + 1) % 3), 4500); };
	const resetR2 = () => { clearInterval(r2TimerRef.current); r2TimerRef.current = setInterval(() => setR2Active(i => (i + 1) % 3), 4500); };
	const resetDetailTimer = () => {
		clearInterval(detailTimerRef.current);
		detailTimerRef.current = setInterval(() => setActiveDetail(i => (i + 1) % LAYOUT_DETAILS.length), 4500);
	};

	const SITE_PLAN = '/images/paradise-city/site-plan.jpg';
	const HERO_IMG  = '/images/paradise-city/hero.jpg';

	const dlBrochure = useCallback(() => {
		const a = document.createElement('a'); a.href = PROJECT.brochure;
		a.download = 'Paradise-City-Brochure.pdf'; a.target = '_blank'; a.click();
	}, []);

	useEffect(() => {
		r1TimerRef.current = setInterval(() => setR1Active(i => (i + 1) % 3), 4500);
		r2TimerRef.current = setInterval(() => setR2Active(i => (i + 1) % 3), 4500);
		detailTimerRef.current = setInterval(() => setActiveDetail(i => (i + 1) % LAYOUT_DETAILS.length), 4500);
		return () => { clearInterval(r1TimerRef.current); clearInterval(r2TimerRef.current); clearInterval(detailTimerRef.current); };
	}, []);

	useEffect(() => {
		const html = document.documentElement;
		const wasDark = html.classList.contains('dark');
		html.classList.add('dark');
		html.style.scrollBehavior = 'smooth';
		return () => {
			if (!wasDark) html.classList.remove('dark');
			html.style.scrollBehavior = '';
		};
	}, []);

	return (
		<Layout>
			<style>{GLOBAL_CSS}</style>
			<ScrollProgress />
			<Helmet>
				<title>Paradise City Sec-138 Noida | Plots ₹60,000/sq.yd | GRDA INFRA</title>
				<meta name="description" content="Paradise City by GRDA INFRA — plotted development in Sector-138, Noida. Plots from 150 sq yd at ₹60,000/sq.yd on 45M Pusta Road near Noida–Greater Noida Expressway. RERA: BRERAA12606/24/2024." />
				<link rel="canonical" href="https://instamakaan.com/sell-companies/paradise-city" />
				<meta property="og:title" content="Paradise City Sec-138 Noida | Plots ₹60,000/sq.yd | GRDA INFRA" />
				<meta property="og:description" content="Plotted development in Sector-138, Noida. Plots from 150 sq yd near Noida–Greater Noida Expressway. RERA: BRERAA12606/24/2024." />
				<meta property="og:url" content="https://instamakaan.com/sell-companies/paradise-city" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/paradise-city/hero.jpg" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Paradise City Sec-138 Noida | Plots ₹60,000/sq.yd | GRDA INFRA" />
				<meta name="twitter:description" content="Plotted development in Sector-138, Noida. Plots from 150 sq yd near Noida–Greater Noida Expressway." />
				<meta name="twitter:image" content="https://instamakaan.com/images/paradise-city/hero.jpg" />
				<script type="application/ld+json">{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "RealEstateListing",
					"name": "Paradise City — Plotted Development, Sector 138 Noida",
					"description": "Plotted development by GRDA INFRA in Sector-138, Noida. Plots from 150 sq yd at ₹60,000/sq.yd. RERA: BRERAA12606/24/2024.",
					"url": "https://instamakaan.com/sell-companies/paradise-city",
					"image": "https://instamakaan.com/images/paradise-city/hero.jpg",
					"offers": { "@type": "Offer", "priceCurrency": "INR", "price": "9000000", "availability": "https://schema.org/InStock" },
					"address": { "@type": "PostalAddress", "streetAddress": "Sector 138, 45M Pusta Road", "addressLocality": "Noida", "addressRegion": "Uttar Pradesh", "postalCode": "201305", "addressCountry": "IN" }
				})}</script>
			</Helmet>

			<PopupModal open={popup} onClose={() => setPopup(false)} />

			{/* ═══ MOBILE BOTTOM NAV ═══ */}
			<div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-amber-100 dark:border-amber-900/30 shadow-2xl">
				<div className="flex items-center justify-around px-1 py-2">
					{[
						{ href: '#overview',  icon: <Home size={18} />,        label: 'Overview'  },
						{ href: '#plots',     icon: <Star size={18} />,         label: 'Plots'     },
						{ href: '#amenities', icon: <Trees size={18} />,        label: 'Amenities' },
						{ href: '#pricing',   icon: <Star size={18} />,         label: 'Price'     },
						{ href: '#location',  icon: <MapPin size={18} />,       label: 'Location'  },
					].map(({ href, icon, label }) => (
						<a key={href} href={href} className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 px-1">{icon}{label}</a>
					))}
					<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-green-700 dark:text-green-400">
						<MessageCircle size={18} />WA
					</a>
				</div>
			</div>

			{/* ═══════════════════════════════════
			    §1  HERO
			═══════════════════════════════════ */}
			<section id="home" className="relative min-h-screen flex items-center overflow-hidden -mt-16 md:-mt-20 pt-16 md:pt-20" style={{ background: DARK }}>
				<img src={HERO_IMG} alt="Paradise City Sec-138 Noida" className="absolute inset-0 w-full h-full object-fill pc-kb"
					onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85'; }} />
				<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" />
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
				<div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

				<div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 pb-28 md:pb-14">
					<div className="lg:col-span-3 text-white">
						<div className="mb-5 pc-anim" style={{ animationDelay: '0ms' }}>
							<div className="inline-flex flex-col">
								<span className="text-[11px] font-bold tracking-[0.35em] uppercase" style={{ color: GOLD }}>GRDA INFRA · Our Roots Your Dreams</span>
								<span className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">PARADISE CITY</span>
								<span className="text-white/60 text-sm font-light mt-1 italic">Own your plot. Own your dream.</span>
							</div>
						</div>

						{/* Trust badges */}
						<div className="flex flex-wrap gap-2 mb-5 pc-anim" style={{ animationDelay: '120ms' }}>
							<span className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/40 backdrop-blur-sm text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full">
								<Shield size={11} /> RERA: {PROJECT.rera}
							</span>
							<span className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
								<MapPin size={11} /> 45M Pusta Road
							</span>
							<span className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
								<Star size={11} /> New Launch · 2026
							</span>
						</div>

						<ul className="space-y-2 mb-7 max-w-xl pc-anim" style={{ animationDelay: '240ms' }}>
							{[
								'Plots from 150 Sq Yd · Multiple sizes up to 2000 Sq Yd',
								'BSP ₹60,000 per Sq Yd · Easy 10:30:60 payment plan',
								'24M road adjoining 75M road — Grand gated entrance',
								'FNG Highway & Noida–Greater Noida Expressway nearby',
								"Clubhouse · Pool · Sports Arena · Club Indulgences",
							].map((b, i) => (
								<li key={i} className="flex items-start gap-2.5 text-white/90 text-xs md:text-sm">
									<div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}80` }}>
										<Check size={9} style={{ color: GOLD }} />
									</div>
									{b}
								</li>
							))}
						</ul>

						<div className="flex flex-wrap gap-3 pc-anim" style={{ animationDelay: '360ms' }}>
							<button onClick={() => setPopup(true)} className="pc-shine text-white font-bold px-7 py-3.5 rounded-lg flex items-center gap-2 shadow-xl transition" style={{ background: 'linear-gradient(to right, #78350f, #b45309)' }}>
								Enquire Now <ArrowRight size={15} />
							</button>
							<button onClick={dlBrochure} className="bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-lg flex items-center gap-2 transition">
								<Download size={15} /> Brochure
							</button>
							<a href={`tel:${PROJECT.phone}`} className="bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-lg flex items-center gap-2 transition">
								<Phone size={15} /> Call Now
							</a>
						</div>
					</div>

					{/* Hero lead form */}
					<div className="hidden lg:block lg:col-span-2 rounded-2xl p-6 border border-amber-700/30 backdrop-blur-md" style={{ background: 'rgba(13,26,10,0.75)' }}>
						<p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: GOLD }}>Paradise City · Sec-138, Noida</p>
						<h3 className="text-white text-lg font-bold">Register Your Interest</h3>
						<p className="text-sm font-bold mb-1" style={{ color: GOLD }}>Get Best Price on Plots</p>
						<p className="text-white/50 text-xs mb-4">InstaMakaan · Official Channel Partner</p>
						<LeadForm dark />
					</div>
				</div>

				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pc-bounce hidden md:block">
					<ChevronDown size={24} className="text-white/40" />
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §2  STATS STRIP
			═══════════════════════════════════ */}
			<section className="border-y" style={{ background: DARK, borderColor: `${GOLD}30` }}>
				<div className="container-custom py-5 grid grid-cols-2 sm:grid-cols-4 gap-0">
					{[
						{ label: 'BSP',        value: '₹60,000/sq.yd' },
						{ label: 'Plot Sizes', value: '150–2000 Sq Yd' },
						{ label: 'Location',   value: 'Sec-138, Noida' },
						{ label: 'Road',       value: '75M + FNG Hwy'  },
					].map((s, i) => (
						<div key={i} className="text-center py-3 px-2 border-r last:border-r-0" style={{ borderColor: `${GOLD}20` }}>
							<p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: GOLD }}>{s.label}</p>
							<p className="text-base md:text-lg font-bold text-white leading-tight">{s.value}</p>
						</div>
					))}
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §3  OVERVIEW
			═══════════════════════════════════ */}
			<section id="overview" style={{ background: '#071b0c' }} className="py-16 md:py-24">
				<div className="container-custom">

					{/* ── Section heading ── */}
					<Reveal>
						<div className="text-center mb-16">
							<p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>Low-Density Plotted Development &middot; Sector-138</p>
							<h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">Why Paradise City?</h2>
							<div className="flex items-center justify-center gap-3 mb-4">
								<div className="h-px w-14" style={{ background: `linear-gradient(to right,transparent,${GOLD})` }} />
								<div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
								<div className="h-px w-14" style={{ background: `linear-gradient(to left,transparent,${GOLD})` }} />
							</div>
							<p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">Everything you need in one premium gated address.</p>
						</div>
					</Reveal>

					{/* ══ ROW 1 — Image Left · Content Right ══ */}
					<Reveal>
						<div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center mb-16 md:mb-24">

							{/* Image */}
							<div className="w-full lg:w-[47%] flex-shrink-0 relative rounded-3xl overflow-hidden"
								style={{ height: 'clamp(280px,38vw,460px)' }}>
								{ROW1.map((f, i) => (
									<img key={i} src={f.photo} alt={f.title}
										className="absolute inset-0 w-full h-full object-cover"
										style={{ opacity: i === r1Active ? 1 : 0, transition: 'opacity 500ms ease', zIndex: i === r1Active ? 1 : 0 }}
										onError={(e) => { e.target.onerror = null; e.target.src = f.photoFb; }} />
								))}
								<div className="absolute inset-0 pointer-events-none rounded-3xl"
									style={{ background: 'linear-gradient(135deg,rgba(7,27,12,0.3) 0%,transparent 50%,rgba(7,27,12,0.5) 100%)', zIndex: 2 }} />
							</div>

							{/* Content */}
							<div className="w-full lg:w-[53%] flex flex-col justify-center">
								<div key={r1Active} className="pc-fade-up">
									<p className="text-[10px] font-bold tracking-[0.32em] uppercase mb-3" style={{ color: GOLD }}>Feature Highlight</p>
									<div className="flex items-end justify-between gap-4 mb-5">
										<h3 className="font-black text-white leading-tight" style={{ fontSize: 'clamp(26px,3.2vw,34px)' }}>
											{ROW1[r1Active].title}
										</h3>
										<span className="text-[12px] font-bold tabular-nums flex-shrink-0 mb-1" style={{ color: GOLD }}>
											{String(r1Active + 1).padStart(2,'0')}&thinsp;/&thinsp;{String(ROW1.length).padStart(2,'0')}
										</span>
									</div>
									<p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.8 }}>
										{ROW1[r1Active].desc}
									</p>
								</div>

								{/* Dot navigation */}
								<div className="flex items-center gap-3 mt-9">
									{ROW1.map((f, i) => (
										<button key={i}
											onClick={() => { setR1Active(i); resetR1(); }}
											aria-label={f.title}
											style={{
												height: 12,
												width: i === r1Active ? 36 : 12,
												borderRadius: i === r1Active ? 6 : '50%',
												background: i === r1Active ? GOLD : 'rgba(255,255,255,0.22)',
												border: 'none',
												padding: 0,
												cursor: 'pointer',
												transition: 'all 0.35s ease',
												outline: 'none',
											}} />
									))}
								</div>
							</div>
						</div>
					</Reveal>

					{/* ── Row divider ── */}
					<div className="h-px max-w-2xl mx-auto mb-16 md:mb-24"
						style={{ background: `linear-gradient(to right,transparent,${GOLD}30,transparent)` }} />

					{/* ══ ROW 2 — Image Right · Content Left ══ */}
					<Reveal>
						<div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-14 items-center">

							{/* Image */}
							<div className="w-full lg:w-[47%] flex-shrink-0 relative rounded-3xl overflow-hidden"
								style={{ height: 'clamp(280px,38vw,460px)' }}>
								{ROW2.map((f, i) => (
									<img key={i} src={f.photo} alt={f.title}
										className="absolute inset-0 w-full h-full object-cover"
										style={{ opacity: i === r2Active ? 1 : 0, transition: 'opacity 500ms ease', zIndex: i === r2Active ? 1 : 0 }}
										onError={(e) => { e.target.onerror = null; e.target.src = f.photoFb; }} />
								))}
								<div className="absolute inset-0 pointer-events-none rounded-3xl"
									style={{ background: 'linear-gradient(225deg,rgba(7,27,12,0.3) 0%,transparent 50%,rgba(7,27,12,0.5) 100%)', zIndex: 2 }} />
							</div>

							{/* Content */}
							<div className="w-full lg:w-[53%] flex flex-col justify-center">
								<div key={r2Active} className="pc-fade-up">
									<p className="text-[10px] font-bold tracking-[0.32em] uppercase mb-3" style={{ color: GOLD }}>Feature Highlight</p>
									<div className="flex items-end justify-between gap-4 mb-5">
										<h3 className="font-black text-white leading-tight" style={{ fontSize: 'clamp(26px,3.2vw,34px)' }}>
											{ROW2[r2Active].title}
										</h3>
										<span className="text-[12px] font-bold tabular-nums flex-shrink-0 mb-1" style={{ color: GOLD }}>
											{String(r2Active + 1).padStart(2,'0')}&thinsp;/&thinsp;{String(ROW2.length).padStart(2,'0')}
										</span>
									</div>
									<p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.8 }}>
										{ROW2[r2Active].desc}
									</p>
								</div>

								{/* Dot navigation */}
								<div className="flex items-center gap-3 mt-9">
									{ROW2.map((f, i) => (
										<button key={i}
											onClick={() => { setR2Active(i); resetR2(); }}
											aria-label={f.title}
											style={{
												height: 12,
												width: i === r2Active ? 36 : 12,
												borderRadius: i === r2Active ? 6 : '50%',
												background: i === r2Active ? GOLD : 'rgba(255,255,255,0.22)',
												border: 'none',
												padding: 0,
												cursor: 'pointer',
												transition: 'all 0.35s ease',
												outline: 'none',
											}} />
									))}
								</div>
							</div>
						</div>
					</Reveal>

				</div>
			</section>

			{/* ═══════════════════════════════════
			    §4  PLOT SIZES
			═══════════════════════════════════ */}
			<section id="plots" className="py-16 md:py-24 bg-[#091508]">
				<div className="container-custom">
					<Reveal>
						<div className="text-center mb-12">
							<p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>Available Configurations</p>
							<h2 className="text-3xl md:text-4xl font-black text-white mb-3">Choose Your Plot Size</h2>
							<div className="flex items-center justify-center gap-3 mb-4">
								<div className="h-px w-16" style={{ background: `linear-gradient(to right,transparent,${GOLD})` }} />
								<div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
								<div className="h-px w-16" style={{ background: `linear-gradient(to left,transparent,${GOLD})` }} />
							</div>
							<p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">Well demarcated plots from 102 sq.m. — facing direction of your choice, most plots near gardens.</p>
						</div>
					</Reveal>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-5xl mx-auto">
						{PLOT_SIZES.map((p, i) => {
							const isPopular = p.tag === 'POPULAR';
							const maxPx = 52;
							const sc = Math.min(maxPx / p.w, maxPx / p.h);
							const vW = Math.round(p.w * sc);
							const vH = Math.round(p.h * sc);
							return (
								<Reveal key={p.size} delay={i * 80}>
									<div className="group relative rounded-2xl border transition-all duration-300 hover:-translate-y-2 cursor-default h-full flex flex-col overflow-hidden"
										style={{
											background: isPopular ? `linear-gradient(160deg,rgba(196,154,42,0.13),#0a1808)` : 'linear-gradient(160deg,#0f2010,#0a1808)',
											borderColor: isPopular ? `${GOLD}50` : `${GOLD}18`,
											boxShadow: isPopular ? `0 0 0 1px ${GOLD}20, 0 8px 32px rgba(196,154,42,0.1)` : 'none',
										}}>

										{isPopular && <div className="h-[2px]" style={{ background: `linear-gradient(to right,transparent,${GOLD},transparent)` }} />}

										<div className="p-5 flex flex-col flex-1">
											<div className="flex justify-end mb-2 min-h-[22px]">
												{p.tag && (
													<span className="text-[8px] font-black px-2.5 py-1 rounded-full tracking-wider"
														style={{ background: isPopular ? GOLD : `${GOLD}22`, color: isPopular ? '#0d1a0a' : GOLD }}>
														{p.tag}
													</span>
												)}
											</div>

											<div className="flex justify-center items-end mb-5" style={{ height: 64 }}>
												<div className="relative transition-transform duration-300 group-hover:scale-110"
													style={{ width: vW, height: vH, background: `${GOLD}10`, border: `1.5px solid ${GOLD}40`, borderRadius: 3 }}>
													<div className="absolute top-0 left-0 w-2 h-2" style={{ borderTop: `2px solid ${GOLD}`, borderLeft: `2px solid ${GOLD}` }} />
													<div className="absolute top-0 right-0 w-2 h-2" style={{ borderTop: `2px solid ${GOLD}`, borderRight: `2px solid ${GOLD}` }} />
													<div className="absolute bottom-0 left-0 w-2 h-2" style={{ borderBottom: `2px solid ${GOLD}`, borderLeft: `2px solid ${GOLD}` }} />
													<div className="absolute bottom-0 right-0 w-2 h-2" style={{ borderBottom: `2px solid ${GOLD}`, borderRight: `2px solid ${GOLD}` }} />
												</div>
											</div>

											<div className="text-center flex-1 flex flex-col">
												<p className="text-2xl font-black text-white leading-none mb-1">{p.size}</p>
												<p className="text-white/35 text-xs font-mono tracking-wider mb-4">{p.dim}</p>
												<div className="h-px" style={{ background: `${GOLD}18` }} />
												<div className="mt-3">
													<p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Starting from</p>
													<p className="text-xl font-black" style={{ color: GOLD }}>{p.approxPrice}</p>
													<p className="text-[9px] text-white/20 mt-0.5">BSP ₹60k/sq.yd + charges</p>
												</div>
											</div>

											<button onClick={() => setPopup(true)}
												className="mt-4 w-full py-2 rounded-xl text-[11px] font-bold border opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
												style={{ background: `${GOLD}15`, color: GOLD, borderColor: `${GOLD}35` }}>
												Get Best Price →
											</button>
										</div>

										<div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
											style={{ boxShadow: `inset 0 0 60px rgba(196,154,42,0.06)` }} />
									</div>
								</Reveal>
							);
						})}
					</div>

					<Reveal delay={350}>
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto mt-8 px-1">
							<p className="text-white/30 text-xs leading-relaxed">* EDC + IDC ₹500/sq.yd, Corner PLC 5% of BSP, Club Membership ₹1L — GST, stamp duty &amp; registration extra.</p>
							<button onClick={() => setPopup(true)}
								className="flex-shrink-0 px-6 py-2.5 rounded-xl text-xs font-bold border transition-all hover:opacity-90"
								style={{ color: GOLD, borderColor: `${GOLD}35`, background: `${GOLD}10` }}>
								Enquire for Best Price →
							</button>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §5  PARADISE COMPLEX CALLOUT
			═══════════════════════════════════ */}
			<section className="relative py-14 overflow-hidden" style={{ background: DARK }}>
				<div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(196,154,42,0.07) 0%, transparent 70%)' }} />
				<div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c49a2a]/40 to-transparent" />
				<div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c49a2a]/40 to-transparent" />
				<div className="container-custom relative text-center">
					<Reveal>
						<p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>Paradise Complex · Club & Amenities</p>
						<h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Where Community</h3>
						<p className="text-2xl md:text-3xl font-bold mb-5" style={{ color: GOLD }}>Meets Comfort.</p>
						<div className="mx-auto h-[1px] w-24 bg-gradient-to-r from-transparent via-[#c49a2a] to-transparent rounded-full mb-8" />
					</Reveal>
					<Reveal delay={100}>
						<div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
							{['Swimming Pool', 'Kids Pool', 'Pool Side Lawn', 'Badminton Court', 'Basketball Area', 'Cricket Net', "Kid's Play Area", 'Senior Citizen Area', 'Yoga Area', 'Jogging Track', 'Meditation Area', 'Indoor Gym', 'Cafeteria', 'Multipurpose Hall', 'Table Tennis', 'Card Table', 'Water Bodies', 'Landscaped Gardens', 'CCTV Security', 'Boom Barriers'].map((item, i) => (
								<span key={i} className="flex items-center gap-2 border text-white/85 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-default hover:text-white"
									style={{ background: 'rgba(255,255,255,0.06)', borderColor: `${GOLD}25` }}
									onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${GOLD}60`; e.currentTarget.style.background = `${GOLD}12`; }}
									onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${GOLD}25`; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
									<span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />{item}
								</span>
							))}
						</div>
					</Reveal>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §6  AMENITIES (tabbed zones)
			═══════════════════════════════════ */}
			<section id="amenities" className="py-16 md:py-24" style={{ background: '#071b0c' }}>
				<div className="container-custom">
					<SectionHeading kicker="Lifestyle Zones" title="World-Class Amenities" sub="Four dedicated zones — every facility you need, all within Paradise City." light={true} />

					{/* ── Zone selector tabs ── */}
					<div className="flex flex-wrap justify-center gap-3 mb-10">
						{AMENITY_ZONES.map((z, i) => (
							<button key={i} onClick={() => setActiveZone(i)}
								className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-300"
								style={activeZone === i
									? { background: `${GOLD}18`, borderColor: `${GOLD}55`, color: GOLD, boxShadow: `0 0 24px ${GOLD}20` }
									: { background: 'rgba(255,255,255,0.03)', borderColor: `${GOLD}18`, color: 'rgba(255,255,255,0.42)' }}>
								<span style={{ color: activeZone === i ? GOLD : 'rgba(255,255,255,0.38)', display: 'flex' }}>{z.icon}</span>
								<span className="text-sm font-bold tracking-wide">{z.zone}</span>
							</button>
						))}
					</div>

					{/* ── Zone content: photo + items ── */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">

						{/* Photo panel */}
						<div className="relative rounded-3xl overflow-hidden flex-shrink-0"
							style={{ height: 'clamp(260px,36vw,420px)' }}>
							{AMENITY_ZONES.map((z, i) => (
								<img key={i} src={z.photo} alt={z.zone}
									className="absolute inset-0 w-full h-full object-cover"
									style={{ opacity: i === activeZone ? 1 : 0, transition: 'opacity 500ms ease', zIndex: i === activeZone ? 1 : 0 }}
									onError={(e) => { e.target.onerror = null; e.target.src = z.photoFb; }} />
							))}
							{/* Gradient overlay */}
							<div className="absolute inset-0 pointer-events-none"
								style={{ background: 'linear-gradient(to top, rgba(7,27,12,0.85) 0%, transparent 55%)', zIndex: 2 }} />
							{/* Zone label at bottom of photo */}
							<div className="absolute bottom-5 left-5 right-5" style={{ zIndex: 3 }}>
								<div key={activeZone} className="pc-fade-up flex items-center gap-3">
									<div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
										style={{ background: `${GOLD}25`, color: GOLD, backdropFilter: 'blur(8px)' }}>
										{AMENITY_ZONES[activeZone].icon}
									</div>
									<p className="text-lg font-black text-white">{AMENITY_ZONES[activeZone].zone}</p>
								</div>
							</div>
						</div>

						{/* Items list */}
						<div>
							<p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-5" style={{ color: GOLD }}>What&rsquo;s Inside</p>
							<div key={activeZone} className="pc-fade-up flex flex-col gap-3">
								{AMENITY_ZONES[activeZone].items.map((item) => (
									<div key={item}
										className="flex items-center gap-4 rounded-2xl border transition-all duration-300"
										style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${GOLD}20`, padding: '14px 18px' }}
										onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${GOLD}50`; e.currentTarget.style.background = `${GOLD}08`; }}
										onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${GOLD}20`; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
										<div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
											style={{ background: `${GOLD}18`, color: GOLD }}>
											<Check size={14} />
										</div>
										<p className="text-white/85 font-semibold text-sm">{item}</p>
									</div>
								))}
							</div>
						</div>

					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §7  INFRASTRUCTURE
			═══════════════════════════════════ */}
			<section className="py-16 md:py-24" style={{ background: DARK }}>
				<div className="container-custom">
					<SectionHeading kicker="Planned for Life" title="Infrastructure" sub="Every plot is fully serviced — all utilities planned and provisioned before handover." light />
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
						{INFRA_FEATURES.map(({ icon, label }, i) => (
							<Reveal key={label} delay={i * 45}>
								<div className="group rounded-2xl p-5 text-center border transition-all duration-300 hover:-translate-y-1.5 cursor-default"
									style={{ background: 'linear-gradient(150deg,#0f2010,#0a1a0a)', borderColor: `${GOLD}20` }}
									onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${GOLD}55`; e.currentTarget.style.boxShadow = `0 8px 28px rgba(196,154,42,0.10)`; }}
									onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${GOLD}20`; e.currentTarget.style.boxShadow = 'none'; }}>
									<div className="w-11 h-11 rounded-xl mx-auto mb-3.5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
										style={{ background: `${GOLD}18`, color: GOLD }}>
										{icon}
									</div>
									<p className="text-white/75 text-xs font-semibold leading-snug">{label}</p>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §8  PRICING + BANK DETAILS
			═══════════════════════════════════ */}
			<section id="pricing" className="py-14 md:py-20 bg-[#091508]">
				<div className="container-custom">
					<SectionHeading kicker="Transparent Pricing" title="Price List" sub="All charges clearly listed — no hidden costs." light={true} />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
						{/* Price table */}
						<Reveal>
							<div className="rounded-2xl overflow-hidden border h-full" style={{ borderColor: `${GOLD}30` }}>
								<div className="px-5 py-3 flex items-center gap-2" style={{ background: 'linear-gradient(to right, #78350f, #92400e)' }}>
									<div className="w-2 h-2 rounded-full bg-white/50" />
									<p className="text-white font-bold text-sm">Paradise City — Price List</p>
								</div>
								<table className="w-full">
									<tbody>
										{CHARGES.map(({ name, value }, i) => (
											<tr key={name} className="border-b"
												style={{ borderColor: `${GOLD}15`, background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)' }}>
												<td className="px-5 py-3.5 text-sm text-white/70">{name}</td>
												<td className="px-5 py-3.5 text-sm font-bold text-right" style={{ color: GOLD }}>{value}</td>
											</tr>
										))}
									</tbody>
								</table>
								<div className="px-5 py-4" style={{ background: `${GOLD}12` }}>
									<p className="text-[10px] text-white/50 leading-relaxed">GST, Stamp Duty, Registration and levies to be borne by allottee. Prices subject to revision without notice.</p>
								</div>
							</div>
						</Reveal>

						{/* Corner plot + bank details stacked */}
						<div className="flex flex-col gap-4">
							{/* Corner Plot */}
							<Reveal delay={80}>
								<div className="rounded-2xl border overflow-hidden" style={{ borderColor: `${GOLD}40`, background: 'linear-gradient(135deg,#1a0e00,#2d1a00)' }}>
									<div className="px-5 py-3 flex items-center gap-2" style={{ background: `rgba(196,154,42,0.18)`, borderBottom: `1px solid ${GOLD}30` }}>
										<span className="flex items-center justify-center" style={{ color: GOLD }}><Ruler size={16} /></span>
										<p className="font-bold text-sm" style={{ color: GOLD }}>Corner Plot — 5% PLC</p>
									</div>
									<div className="p-4 space-y-2">
										{['Extra road frontage on two sides', 'Better ventilation & natural light', 'More design freedom for construction', 'Higher resale & rental value'].map((b) => (
											<div key={b} className="flex items-start gap-2">
												<div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}50` }}>
													<Check size={8} style={{ color: GOLD }} />
												</div>
												<p className="text-white/65 text-xs leading-tight">{b}</p>
											</div>
										))}
									</div>
								</div>
							</Reveal>

							{/* Bank Details */}
							<Reveal delay={160}>
								<div className="rounded-2xl border overflow-hidden flex-1" style={{ borderColor: `${GOLD}25`, background: `linear-gradient(135deg,${DARK},#0a2010)` }}>
									<div className="px-5 py-3 flex items-center gap-2 border-b" style={{ borderColor: `${GOLD}20` }}>
										<span className="flex items-center justify-center" style={{ color: GOLD }}><Landmark size={16} /></span>
										<p className="font-bold text-sm" style={{ color: GOLD }}>Bank Details</p>
									</div>
									<div className="p-4 space-y-2.5">
										{[
											['Company',    BANK.company  ],
											['Bank',       BANK.bank     ],
											['Account No', BANK.accNo    ],
											['IFSC Code',  BANK.ifsc     ],
											['Branch',     BANK.branch   ],
										].map(([k, v]) => (
											<div key={k} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
												<span className="text-white/40 text-[10px] sm:w-20 flex-shrink-0">{k}</span>
												<span className="text-white/85 text-[11px] font-semibold">{v}</span>
											</div>
										))}
									</div>
								</div>
							</Reveal>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §9  PAYMENT PLAN
			═══════════════════════════════════ */}
			<section className="py-14 md:py-20" style={{ background: DARK }}>
				<div className="container-custom">
					<SectionHeading kicker="Easy Payment" title="Standard Payment Plan  10 : 30 : 60" sub="Simple and transparent payment schedule for plot booking." light />
					<div className="max-w-lg mx-auto space-y-4">
						{PAYMENT_PLAN.map(({ pct, label, milestone }, i) => (
							<Reveal key={i} delay={i * 80}>
								<div className="flex items-center gap-4 rounded-xl px-5 py-4 border transition-all"
									style={{ background: i === 0 ? `linear-gradient(135deg,${DARK},#1a2e10)` : `${GOLD}07`, borderColor: i === 0 ? `${GOLD}50` : `${GOLD}20` }}>
									<div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xl"
										style={{ background: i === 0 ? GOLD : `${GOLD}20`, color: i === 0 ? '#0d1a0a' : GOLD }}>
										{pct}
									</div>
									<div>
										<p className="text-[9px] uppercase tracking-widest font-bold mb-0.5" style={{ color: GOLD }}>{label}</p>
										<p className="text-white font-semibold text-sm leading-tight">{milestone}</p>
									</div>
								</div>
							</Reveal>
						))}
					</div>
					<Reveal delay={300}>
						<div className="max-w-lg mx-auto mt-5 rounded-xl px-5 py-4 border flex items-start gap-3" style={{ background: `${GOLD}08`, borderColor: `${GOLD}25` }}>
							<span className="flex-shrink-0 mt-0.5" style={{ color: GOLD }}><Lightbulb size={18} /></span>
							<p className="text-white/60 text-xs leading-relaxed">
								Payment via Cheque / DD in favour of <strong className="text-white/80">"SUMPRI INFRATECH PVT LTD / PARADISE CITY"</strong>. Contact us for site visit and booking assistance.
							</p>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §10  SITE PLAN (lightbox)
			═══════════════════════════════════ */}
			<section className="py-14 md:py-20 bg-[#091508]">
				<div className="container-custom">
					<SectionHeading kicker="Master Plan" title="Layout Plan — Sector-138, Noida" light={true} />

					{/* Carousel — one detail at a time, image (left) and text (right) change
					    together in the same spot. Images are placeholders for now — swap
					    each LAYOUT_DETAILS[i].image with a real photo/render later. */}
					<Reveal delay={100}>
						<div className="mt-10 max-w-6xl mx-auto">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
								{/* Image slot */}
								<div className="relative rounded-2xl overflow-hidden border bg-white" style={{ borderColor: `${GOLD}20`, height: 'clamp(300px,40vw,460px)' }}>
									{LAYOUT_DETAILS.map(({ icon: Icon, title, image }, i) => (
										<div key={title} className="absolute inset-0 bg-white" style={{ opacity: i === activeDetail ? 1 : 0, transition: 'opacity 500ms ease', zIndex: i === activeDetail ? 1 : 0 }}>
											{image ? (
												<img src={image} alt={title} className="w-full h-full object-contain p-2" />
											) : (
												<div className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed" style={{ borderColor: `${GOLD}30`, background: 'rgba(255,255,255,0.03)' }}>
													<Icon size={26} style={{ color: `${GOLD}80` }} />
													<p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: `${GOLD}80` }}>Image placeholder</p>
													<p className="text-[10px] text-white/30">Add a photo/render for "{title}"</p>
												</div>
											)}
										</div>
									))}

									{/* Prev / Next arrows */}
									<button
										onClick={() => { setActiveDetail((p) => (p - 1 + LAYOUT_DETAILS.length) % LAYOUT_DETAILS.length); resetDetailTimer(); }}
										className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
										style={{ background: 'rgba(9,21,8,0.6)', color: GOLD, zIndex: 2, backdropFilter: 'blur(4px)' }}
									>
										<ChevronLeft size={18} />
									</button>
									<button
										onClick={() => { setActiveDetail((p) => (p + 1) % LAYOUT_DETAILS.length); resetDetailTimer(); }}
										className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
										style={{ background: 'rgba(9,21,8,0.6)', color: GOLD, zIndex: 2, backdropFilter: 'blur(4px)' }}
									>
										<ChevronRight size={18} />
									</button>

									{/* Counter */}
									<div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(9,21,8,0.6)', color: GOLD, zIndex: 2 }}>
										{activeDetail + 1} / {LAYOUT_DETAILS.length}
									</div>

									{/* AI-render watermark — tiny, corner, out of the way */}
									<div className="absolute bottom-2 right-2.5 pointer-events-none" style={{ zIndex: 2 }}>
										<p className="text-[8px] text-black/30 leading-none">AI-generated visual, for illustration only</p>
									</div>
								</div>

								{/* Text slot — changes together with the image */}
								<div className="flex flex-col h-full">
									<div key={activeDetail} className="pc-fade-up">
										<div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${GOLD}18` }}>
											{React.createElement(LAYOUT_DETAILS[activeDetail].icon, { size: 20, style: { color: GOLD } })}
										</div>
										<p className="text-2xl md:text-3xl font-bold text-white mb-3">{LAYOUT_DETAILS[activeDetail].title}</p>
										<p className="text-base text-white/55 leading-relaxed">{LAYOUT_DETAILS[activeDetail].desc}</p>
									</div>

									{/* Quick-jump grid — fills the space, doubles as a topic index */}
									<div className="mt-8 pt-6 border-t" style={{ borderColor: `${GOLD}15` }}>
										<p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4" style={{ color: `${GOLD}80` }}>
											Explore All 9 Details
										</p>
										<div className="grid grid-cols-3 gap-2.5">
											{LAYOUT_DETAILS.map(({ icon: Icon, title }, i) => {
												const active = i === activeDetail;
												return (
													<button
														key={title}
														onClick={() => { setActiveDetail(i); resetDetailTimer(); }}
														className="flex flex-col items-start gap-1.5 p-2.5 rounded-xl border text-left transition-all duration-300"
														style={active
															? { background: `${GOLD}14`, borderColor: `${GOLD}55` }
															: { background: 'rgba(255,255,255,0.03)', borderColor: `${GOLD}12` }}
													>
														<Icon size={14} style={{ color: active ? GOLD : `${GOLD}60` }} />
														<span className="text-[11px] leading-tight font-medium" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)' }}>
															{title}
														</span>
													</button>
												);
											})}
										</div>
									</div>
								</div>
							</div>

							{/* Dot indicators */}
							<div className="flex items-center justify-center gap-2 mt-8">
								{LAYOUT_DETAILS.map((d, i) => (
									<button
										key={d.title}
										onClick={() => { setActiveDetail(i); resetDetailTimer(); }}
										aria-label={d.title}
										className="rounded-full transition-all duration-300"
										style={{
											width: i === activeDetail ? 22 : 7,
											height: 7,
											background: i === activeDetail ? GOLD : `${GOLD}35`,
										}}
									/>
								))}
							</div>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §11  CONNECTIVITY (detailed)
			═══════════════════════════════════ */}
			<section id="location" className="relative py-16 overflow-hidden" style={{ background: DARK }}>
				{/* Decorative rings */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
					<div className="w-[380px] h-[380px] rounded-full border absolute" style={{ borderColor: `${GOLD}20` }} />
					<div className="w-[620px] h-[620px] rounded-full border absolute" style={{ borderColor: `${GOLD}12` }} />
					<div className="w-[860px] h-[860px] rounded-full border absolute" style={{ borderColor: `${GOLD}06` }} />
				</div>

				<div className="container-custom relative">
					<SectionHeading kicker="Noida's Finest Location" title="Connectivity" sub="Sector-138 sits at the junction of Noida–Greater Noida Expressway and FNG Highway — everything is minutes away." light />

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
						{CONNECTIVITY.map(({ category, items }, i) => (
							<Reveal key={category} delay={i * 50}>
								<div className="rounded-2xl p-5 border h-full" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${GOLD}20` }}>
									<p className="text-[9px] uppercase tracking-widest font-bold mb-3" style={{ color: GOLD }}>{category}</p>
									<ul className="space-y-1.5">
										{items.map((item) => (
											<li key={item} className="flex items-start gap-2">
												<span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: GOLD }} />
												<span className="text-white/65 text-xs leading-tight">{item}</span>
											</li>
										))}
									</ul>
								</div>
							</Reveal>
						))}
					</div>

					<Reveal delay={200}>
						<div className="flex justify-center">
							<a href={PROJECT.mapsLink} target="_blank" rel="noopener noreferrer"
								className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border font-bold text-sm transition-all hover:opacity-90"
								style={{ background: GOLD, borderColor: GOLD, color: '#091508' }}>
								<MapPin size={16} /> View on Google Maps — Sector-138, Noida
							</a>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §12  DEVELOPER — GRDA INFRA
			═══════════════════════════════════ */}
			<section className="py-14 md:py-20 bg-[#091508]">
				<div className="container-custom">
					<SectionHeading kicker="Your Trusted Partner" title="About GRDA INFRA" sub="GRDA Infra Private Limited — a RERA registered real estate agent dedicated to transparent, client-first property advisory." light={true} />

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{/* Agent info */}
						<Reveal>
							<div className="rounded-2xl p-6 border h-full" style={{ background: `linear-gradient(135deg,${DARK},#0a2010)`, borderColor: `${GOLD}25` }}>
								<div className="flex items-center gap-4 mb-5">
									<div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-black border"
										style={{ background: `${GOLD}20`, borderColor: `${GOLD}40`, color: GOLD }}>G</div>
									<div>
										<p className="text-white font-black text-base leading-tight">GRDA INFRA</p>
										<p className="text-[11px] font-semibold mt-0.5" style={{ color: GOLD }}>OUR ROOTS YOUR DREAMS</p>
									</div>
								</div>

								<div className="space-y-3">
									{[
										['RERA Agent No',  PROJECT.rera      ],
										['Regd. Office',   PROJECT.regnOffice ],
										['Corp. Office',   PROJECT.corpOffice ],
										['Email',          PROJECT.email      ],
										['Website',        PROJECT.web        ],
										['Phone',          PROJECT.agentPhone ],
									].map(([k, v]) => (
										<div key={k} className="flex flex-col gap-0.5 py-2 border-b" style={{ borderColor: `${GOLD}12` }}>
											<span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: GOLD }}>{k}</span>
											<span className="text-white/75 text-xs leading-relaxed">{v}</span>
										</div>
									))}
								</div>
							</div>
						</Reveal>

						{/* RERA + Developer */}
						<div className="flex flex-col gap-4 h-full">
							<Reveal delay={80}>
								<div className="rounded-2xl p-5 border" style={{ background: `${GOLD}10`, borderColor: `${GOLD}40` }}>
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GOLD }}>
											<Shield size={18} className="text-white" />
										</div>
										<div>
											<p className="text-white font-bold text-sm">RERA Registered Agent</p>
											<p className="text-[10px]" style={{ color: GOLD }}>Real Estate Regulatory Authority, Bihar</p>
										</div>
									</div>
									<div className="rounded-lg px-4 py-2.5 border" style={{ background: 'rgba(0,0,0,0.3)', borderColor: `${GOLD}30` }}>
										<p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Agent Registration No.</p>
										<p className="text-white font-mono font-bold text-sm">{PROJECT.rera}</p>
										<p className="text-white/40 text-[9px] mt-1">Valid: 03 July 2024 – 02 July 2029</p>
									</div>
								</div>
							</Reveal>

							<Reveal delay={160} className="flex-1 flex">
								<div className="rounded-2xl p-5 border flex-1 flex flex-col justify-center" style={{ background: `linear-gradient(135deg,${DARK},#0a2010)`, borderColor: `${GOLD}20` }}>
									<div className="flex items-center gap-3 mb-3">
										<div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}20`, color: GOLD }}>
											<Award size={16} />
										</div>
										<div>
											<p className="text-white font-bold text-sm">Project Promoter</p>
											<p className="text-[10px] text-white/50">The developer of Paradise City</p>
										</div>
									</div>
									<p className="text-white/75 text-sm font-semibold">Sumpri Infratech Pvt Ltd</p>
									<p className="text-white/45 text-xs mt-1 leading-relaxed">All payments to be made in favour of "SUMPRI INFRATECH PVT LTD / PARADISE CITY" as per the Builder Buyer Agreement.</p>
								</div>
							</Reveal>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §13  CTA / CONTACT
			═══════════════════════════════════ */}
			<section className="py-14 md:py-20" style={{ background: DARK }}>
				<div className="container-custom">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl mx-auto items-start">
						<div>
							<SectionHeading kicker="Get In Touch" title="Enquire About Paradise City" sub="Fill in your details — our expert will call you with best available plots and pricing." light center={false} />
							<div className="flex flex-col gap-3 mt-2">
								<a href={`tel:${PROJECT.phone}`} className="flex items-center gap-3 rounded-xl px-5 py-4 border transition-all hover:opacity-90" style={{ background: 'linear-gradient(to right,#78350f,#92400e)', borderColor: `${GOLD}30` }}>
									<Phone size={18} className="text-white flex-shrink-0" />
									<div><p className="text-white/60 text-[10px] uppercase tracking-wider">Call Now</p><p className="text-white font-bold text-sm">{PROJECT.phoneDisplay}</p></div>
								</a>
								<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-5 py-4 border transition-all hover:opacity-90" style={{ background: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.3)' }}>
									<MessageCircle size={18} className="text-green-400 flex-shrink-0" />
									<div><p className="text-white/60 text-[10px] uppercase tracking-wider">WhatsApp</p><p className="text-green-400 font-bold text-sm">Chat with Expert</p></div>
								</a>
								<button onClick={dlBrochure} className="flex items-center gap-3 rounded-xl px-5 py-4 border transition-all hover:opacity-90" style={{ background: `${GOLD}10`, borderColor: `${GOLD}30` }}>
									<Download size={18} style={{ color: GOLD, flexShrink: 0 }} />
									<div className="text-left"><p className="text-white/60 text-[10px] uppercase tracking-wider">Download</p><p className="font-bold text-sm" style={{ color: GOLD }}>Project Brochure</p></div>
								</button>
							</div>
						</div>
						<Reveal>
							<div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${GOLD}25` }}>
								<LeadForm dark />
							</div>
						</Reveal>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════
			    §14  T&C
			═══════════════════════════════════ */}
			<section className="py-10 bg-[#091508]">
				<div className="container-custom max-w-3xl">
					<Reveal>
						<p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: GOLD }}>Terms &amp; Conditions</p>
						<ol className="space-y-2">
							{TC.map((t, i) => (
								<li key={i} className="flex items-start gap-3 text-xs text-slate-500 dark:text-white/50 leading-relaxed">
									<span className="flex-shrink-0 font-bold" style={{ color: GOLD }}>{i + 1}.</span>
									{t}
								</li>
							))}
						</ol>
						<p className="text-[10px] text-white/30 mt-6">
							Marketed by GRDA INFRA PRIVATE LIMITED · RERA Agent: {PROJECT.rera} · {PROJECT.email} · {PROJECT.web}
						</p>
					</Reveal>
				</div>
			</section>

			<div className="h-16 md:hidden" />
		</Layout>
	);
}
