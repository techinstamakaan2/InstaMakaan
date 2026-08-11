import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	MapPin,
	Building2,
	Check,
	ArrowRight,
	Download,
	Layers,
	Star,
	Shield,
	Zap,
	Coffee,
	Briefcase,
	Users,
	Camera,
	Car,
	Sparkles,
	Wind,
	Mic,
	Baby,
	Dumbbell,
	Sofa,
	Wine,
	Volume2,
	ChevronRight,
	X,
	Droplets,
	Lock,
	Wifi,
	Flame,
	Printer,
	DoorOpen,
	LayoutGrid,
	Box,
	RotateCcw,
	UserCheck,
} from 'lucide-react';

const IMG_BASE = '/images/nx-one-ark';
const IMG = {
	logoNxOne: `${IMG_BASE}/logo-nxone.png`,
	logoArk: `${IMG_BASE}/logo-ark.png`,
	heroNight: `${IMG_BASE}/hero-tower-night.jpg`,
	towerDay: `${IMG_BASE}/tower-day.jpg`,
	towerFront: `${IMG_BASE}/tower-front.jpg`,
	entrance: `${IMG_BASE}/entrance.jpg`,
	lobby: `${IMG_BASE}/lobby.jpg`,
	clubLounge: `${IMG_BASE}/club-lounge.jpg`,
	conference: `${IMG_BASE}/conference-room.jpg`,
	auditorium: `${IMG_BASE}/auditorium.jpg`,
	creche: `${IMG_BASE}/creche.jpg`,
	cafe: `${IMG_BASE}/cafe.jpg`,
	gymnasium: `${IMG_BASE}/gymnasium.jpg`,
	pool: `${IMG_BASE}/swimming-pool.jpg`,
	leisure: `${IMG_BASE}/leisure-lounge.jpg`,
	skyBar: `${IMG_BASE}/sky-bar.jpg`,
	amphitheatre: `${IMG_BASE}/amphitheatre.jpg`,
	elevators: `${IMG_BASE}/elevators.jpg`,
	workspace: `${IMG_BASE}/workspace.jpg`,
	ecosystem: `${IMG_BASE}/ecosystem-night.jpg`,
};

const PROJECT = {
	name: 'NX ONE – ARK',
	tagline: 'Story of Growth',
	subtitle: 'Your Business. Elevated.',
	location: 'Tech Zone IV, Greater Noida (West), U.P.',
	developer: 'SP SAI IT Private Limited',
	managedBy: 'Rahul Sharma',
	cin: 'U72900DL2008PTC176808',
	rera: 'UPRERAPRJ448845/02/2025',
	bsp: 11990,
	phoneRaw: '+919718130000',
	phoneDisplay: '+91-9718130000',
	email: 'connect@nx-one.com',
	website: 'www.nx-one.com',
	bullets: [
		'BSP starts at ₹11,990 per sqft',
		'Limited Premium Floors Available',
		'G + 26 Storey Commercial Tower',
		'9 Mitsubishi High-Speed Elevators',
		'500 m from upcoming Metro Station',
	],
	stats: [
		{ label: 'Plot Area', value: '~25 Acres', sub: 'NX ONE Township' },
		{ label: 'Tower Height', value: 'G + 26', sub: 'Premium Office Floors' },
		{ label: 'Club π Amenities', value: '10+', sub: 'Luxury Lifestyle' },
		{ label: 'Starting BSP', value: '₹11,990', sub: 'per sqft' },
	],
	highlights: [
		'Premium G+26 Commercial Tower in Tech Zone IV, Greater Noida (West)',
		'Designed by SP SAI IT Pvt Ltd · RERA Approved UPRERAPRJ448845/02/2025',
		'4 unit types: 851, 859, 2094 & 3049 sqft — flexible for every business',
		'46 ft Triple-Height Italian-Marble Lobby with Concierge Reception',
		'Club π — 10+ amenities: Lounge, Auditorium, Gym, Sky Bar, Amphitheatre',
		'9 Mitsubishi High-Speed Elevators across 4 wings',
		'AQI-controlled environment, 3-tier security, EV charging stations',
		'Fully fitted offices — Kohler sanitary, Saint-Gobain façade, Italian marble',
	],
	unitTypes: [
		{ type: 'Type A', area: 859, eoi: 5, desc: 'Compact Premium Office' },
		{ type: 'Type D', area: 851, eoi: 5, desc: 'Premium Wing-D Office' },
		{ type: 'Type C', area: 2094, eoi: 10, desc: 'Large Corporate Floor' },
		{ type: 'Type B', area: 3049, eoi: 15, desc: 'Flagship Suite' },
	],
	floorPLC: [
		{ range: '1st – 4th Floor', plc: 250 },
		{ range: '5th – 8th Floor', plc: 200 },
		{ range: '9th – 12th Floor', plc: 150 },
		{ range: '13th – 16th Floor', plc: 100 },
		{ range: '17th – 20th Floor', plc: 75 },
		{ range: '21st – 24th Floor', plc: 50 },
		{ range: '25th Floor', plc: 0 },
	],
	wingPLC: [
		{ wing: 'Wing D', plc: 250 },
		{ wing: 'Wing A / B / C', plc: 50 },
	],
	otherCharges: [
		{ name: 'EDC / IDC / FFC', rate: '₹660 / sqft' },
		{ name: 'Lease Rent', rate: '₹200 / sqft' },
		{ name: 'IFMS', rate: '₹100 / sqft' },
		{ name: 'Power Backup (4 KVA)', rate: '₹25,000 / KVA' },
		{ name: 'Corner Unit Premium', rate: '10% of BSP' },
	],
	amenities: [
		{ Icon: Sofa, name: 'Club Lounge' },
		{ Icon: Users, name: 'Conference Rooms ×2' },
		{ Icon: Mic, name: 'Auditorium (50 pax)' },
		{ Icon: Briefcase, name: 'Business Centre' },
		{ Icon: Dumbbell, name: 'Gymnasium' },
		{ Icon: Coffee, name: 'Café' },
		{ Icon: Baby, name: 'Crèche' },
		{ Icon: Volume2, name: 'Leisure Lounge' },
		{ Icon: Wine, name: 'Sunset Sky Bar' },
		{ Icon: Star, name: 'Amphitheatre' },
		{ Icon: Car, name: 'Valet Parking' },
		{ Icon: Zap, name: 'EV Charging' },
		{ Icon: Sparkles, name: 'Concierge Service' },
		{ Icon: Shield, name: '3-Tier Security' },
		{ Icon: Wind, name: 'AQI Controlled' },
		{ Icon: Camera, name: 'CCTV Surveillance' },
	],
	clubPiCards: [
		{
			name: 'Club Lounge',
			img: IMG.clubLounge,
			sub: 'A grand pause in comfort',
		},
		{
			name: 'Conference Rooms',
			img: IMG.conference,
			sub: 'Decisions · Discussions · Deliverables',
		},
		{ name: 'Auditorium', img: IMG.auditorium, sub: '1,531 sqft · 50 pax' },
		{ name: 'Business Centre', img: IMG.workspace, sub: '1,105 sqft of focus' },
		{
			name: 'Gymnasium',
			img: IMG.gymnasium,
			sub: '1,452 sqft · achieve every goal',
		},
		{ name: 'Café', img: IMG.cafe, sub: '924 sqft · brew success' },
		{ name: 'Crèche', img: IMG.creche, sub: '116 sqft · family-first' },
		{ name: 'Leisure Lounge', img: IMG.leisure, sub: 'Premium downtime' },
		{ name: 'Sunset Sky Bar', img: IMG.skyBar, sub: 'Skyline lifestyle' },
		{
			name: 'Amphitheatre',
			img: IMG.amphitheatre,
			sub: 'A stage for inspiration',
		},
	],
	gallery: [
		IMG.heroNight,
		IMG.towerFront,
		IMG.entrance,
		IMG.lobby,
		IMG.clubLounge,
		IMG.elevators,
		IMG.skyBar,
		IMG.gymnasium,
		IMG.ecosystem,
		IMG.auditorium,
		IMG.cafe,
		IMG.leisure,
	],
	locationAdvantages: [
		{ time: '500 m', place: 'Upcoming Metro Station' },
		{ time: '10 min', place: 'Noida City Centre Metro' },
		{ time: '15 min', place: 'Pari Chowk' },
		{ time: '20 min', place: 'Noida Sector 18 Market' },
		{ time: '25 min', place: 'Knowledge Park Greater Noida' },
		{ time: '30 min', place: 'Yamuna Expressway' },
		{ time: '30 min', place: 'New Delhi (via DND)' },
		{ time: '45 min', place: 'IGI Airport · Delhi' },
		{ time: '60 min', place: 'Jewar International Airport' },
	],
};

/*
 * ─────────────────────────────────────────────────────────────
 *  BACKGROUND FLOW
 *  One continuous premium descent: light cream → warm tones → deep navy.
 *  Each section's background is a slice of that overall top→bottom gradient,
 *  so they line up into a single smooth gradient down the whole page.
 *  Content colours are NOT touched here — only section backgrounds.
 * ─────────────────────────────────────────────────────────────
 */
const BG = {
	// ── Light mode: unbroken cream → warm brown descent ──────────────────────
	// each section's `from` = previous section's `to`
	// ─────────────────────────────────────────────────────────────────────────
	stats:     'bg-[#faf6ef]                                                             dark:bg-[#0b1220]',
	overview:  'bg-gradient-to-b from-[#faf6ef] via-[#f6efe2] to-[#f1e8d8]              dark:from-[#0b1220] dark:via-[#0c1322] dark:to-[#0b1426]',
	ctaDark:   'bg-gradient-to-b from-[#f1e8d8] via-[#ece0cb] to-[#e4d6bd]              dark:from-[#0b1426] dark:via-[#0c1526] dark:to-[#0b1628]',
	price:     'bg-gradient-to-b from-[#e4d6bd] via-[#ddccae] to-[#d4c19c]              dark:from-[#0b1628] dark:via-[#0b1a2c] dark:to-[#0a1a30]',
	amenities: 'bg-gradient-to-b from-[#d4c19c] via-[#c9b48b] to-[#bda57b]              dark:from-[#0a1a30] dark:via-[#0a1b32] dark:to-[#0a1c34]',
	workspace: 'bg-gradient-to-b from-[#bda57b] via-[#b49872] to-[#a98d67]              dark:from-[#0a1c34] dark:via-[#0a1d36] dark:to-[#0a1e38]',
	clubPi:    'bg-gradient-to-b from-[#a98d67] via-[#967c58] to-[#82694b]              dark:from-[#0a1e38] dark:via-[#0a1f3c] dark:to-[#0a2040]',
	floorPlan: 'bg-gradient-to-b from-[#82694b] via-[#6f5840] to-[#604b38]              dark:from-[#0a2040] dark:via-[#0a2244] dark:to-[#0a2448]',
	gallery:   'bg-gradient-to-b from-[#604b38] via-[#534031] to-[#49382b]              dark:from-[#0a2448] dark:via-[#0b2040] dark:to-[#0b1c38]',
	location:  'bg-gradient-to-b from-[#49382b] via-[#403126] to-[#3a2b22]              dark:from-[#0b1c38] dark:via-[#0b1930] dark:to-[#0b1730]',
	developer: 'bg-[#3a2b22]                                                             dark:bg-[#0b1730]',
};

const WORKSPACE_FEATURES = [
	{ Icon: Droplets,   name: 'Water Purifier',         brand: 'Aquaguard' },
	{ Icon: Coffee,     name: 'Coffee Maker',            brand: 'Morphy Richards' },
	{ Icon: Lock,       name: 'Digital Lock',            brand: 'Dorset / Ozone' },
	{ Icon: Wifi,       name: 'Wi-Fi Enabled',           brand: 'High-Speed' },
	{ Icon: Droplets,   name: 'Sink with Tap',           brand: 'Ingrained' },
	{ Icon: RotateCcw,  name: 'Integrated Dishwasher',   brand: 'Midea' },
	{ Icon: Box,        name: 'Mini Fridge',             brand: 'Godrej' },
	{ Icon: Zap,        name: 'Microwave Oven',          brand: 'LG' },
	{ Icon: Wind,       name: 'Central Air Conditioning',brand: 'Building-Wide' },
	{ Icon: LayoutGrid, name: 'Kitchen Flooring',        brand: 'Premium Finish' },
	{ Icon: Layers,     name: 'Kitchen Counter',         brand: 'Premium' },
	{ Icon: Flame,      name: 'Hot Plate',               brand: 'Philips' },
	{ Icon: Camera,     name: 'CCTV Surveillance',       brand: 'CP Plus' },
	{ Icon: Printer,    name: 'Printer',                 brand: 'Canon' },
	{ Icon: Sparkles,   name: 'Air Purifier',            brand: 'Philips' },
	{ Icon: DoorOpen,   name: 'Glass Door Panel',        brand: 'Premium' },
];

/*
 * ─────────────────────────────────────────────────────────────
 *  FLOOR PLANS
 *  3 images per unit type:
 *    img2d      → technical 2D drawing (with dimensions)
 *    img3d      → 3D render WITH measurements
 *    imgRender  → 3D render WITHOUT measurements (clean view)
 *  Upload images to: /public/images/nx-one-ark/
 *  Measurements are read from the official brochure drawings.
 * ─────────────────────────────────────────────────────────────
 */
const FLOOR_PLANS = [
	{
		type: 'Type A',
		area: '859 SQ.FT',
		dims: "14'-5\" × 32'-9\"",
		price: '₹1.03 Cr*',
		img2d:     `${IMG_BASE}/fp-type-c-2d.jpg`,
		img3d:     `${IMG_BASE}/fp-type-c-3d.jpg`,
		imgRender: `${IMG_BASE}/fp-type-c-render.jpg`,
		rooms: [
			{ name: 'Office Area',  size: "14'-5\" × 32'-9\"" },
			{ name: 'Pantry',       size: "—" },
		],
	},
	{
		type: 'Type B',
		area: '3,049 SQ.FT',
		dims: "43'-4\" × 39'-6\"",
		price: '₹3.66 Cr*',
		img2d:     `${IMG_BASE}/fp-type-b-2d.jpg`,
		img3d:     `${IMG_BASE}/fp-type-b-3d.jpg`,
		imgRender: `${IMG_BASE}/fp-type-b-render.jpg`,
		rooms: [
			{ name: 'Office Area',  size: "43'-4\" × 39'-6\"" },
			{ name: 'Toilet',       size: "7'-11\" × 5'-5\"" },
			{ name: 'Pantry',       size: "7'-9\" × 5'-5\"" },
		],
	},
	{
		type: 'Type C',
		area: '2,094 SQ.FT',
		dims: "28'-10\" × 39'-6\"",
		price: '₹2.51 Cr*',
		img2d:     `${IMG_BASE}/fp-type-a-2d.jpg`,
		img3d:     `${IMG_BASE}/fp-type-a-3d.jpg`,
		imgRender: `${IMG_BASE}/fp-type-a-render.jpg`,
		rooms: [
			{ name: 'Office Area',  size: "28'-10\" × 39'-6\"" },
			{ name: 'Pantry',       size: "7'-9\" × 5'-5\"" },
			{ name: 'Toilet',       size: "7'-11\" × 5'-5\"" },
		],
	},
	{
		type: 'Type D',
		area: '851 SQ.FT',
		dims: "29'-0\" × 16'-4\"",
		price: '₹1.02 Cr*',
		img2d:     `${IMG_BASE}/fp-type-d-2d.jpg`,
		img3d:     `${IMG_BASE}/fp-type-d-3d.jpg`,
		imgRender: `${IMG_BASE}/fp-type-d-render.jpg`,
		rooms: [
			{ name: 'Office Area',  size: "29'-0\" × 16'-4\"" },
			{ name: 'Pantry',       size: "—" },
		],
	},
];

const fmtINR = (n) =>
	n >= 10000000
		? `₹ ${(n / 10000000).toFixed(2)} Cr*`
		: n >= 100000
			? `₹ ${(n / 100000).toFixed(2)} L*`
			: `₹ ${n.toLocaleString('en-IN')}*`;

const SmartImg = ({ src, alt, className, style }) => {
	const [fail, setFail] = useState(false);
	if (fail) {
		return (
			<div
				className={`flex items-center justify-center bg-gradient-to-br from-amber-900/30 via-slate-800 to-amber-700/30 ${className}`}
				style={style}
			>
				<Building2 className="text-amber-400/40" size={48} />
			</div>
		);
	}
	return (
		<img
			src={src}
			alt={alt}
			loading="lazy"
			onError={() => setFail(true)}
			className={className}
			style={style}
		/>
	);
};

/* `onDark` makes the heading readable over the darker lower backgrounds. Accent stays amber. */
const SectionHeading = ({ kicker, title, center = true, onDark = false }) => (
	<div className={`mb-8 ${center ? 'text-center' : ''}`}>
		{kicker && (
			<p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-2 text-amber-600 dark:text-amber-400">
				{kicker}
			</p>
		)}
		<h2
			className={`text-2xl md:text-3xl font-bold ${onDark ? 'text-white' : 'text-slate-900 dark:text-white'}`}
		>
			{title}
		</h2>
		<div
			className={`h-[3px] w-16 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mt-3 ${center ? 'mx-auto' : ''}`}
		/>
	</div>
);

const LeadForm = ({ compact = false, dark = false, onSubmit }) => {
	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		message: '',
	});
	const [sent, setSent] = useState(false);

	const handle = (e) => {
		e.preventDefault();
		setSent(true);
		onSubmit && onSubmit(form);
		setTimeout(() => setSent(false), 4000);
		setForm({ name: '', email: '', phone: '', message: '' });
	};

	if (sent) {
		return (
			<div
				className={`flex flex-col items-center justify-center py-8 gap-2 rounded-2xl ${dark ? 'bg-white/5' : 'bg-amber-50'}`}
			>
				<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
					<Check className="text-green-600" size={22} />
				</div>
				<p
					className={`font-semibold ${dark ? 'text-white' : 'text-slate-800'}`}
				>
					Thank you!
				</p>
				<p className={`text-sm ${dark ? 'text-white/70' : 'text-slate-500'}`}>
					Our team will reach you shortly.
				</p>
			</div>
		);
	}

	const inputBase = dark
		? 'w-full bg-transparent border-b border-white/30 px-0 py-3 text-sm text-white placeholder-white/60 focus:border-amber-400 focus:outline-none transition'
		: 'w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition';

	return (
		<form onSubmit={handle} className={`space-y-${compact ? '3' : '4'}`}>
			<input
				required
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
				placeholder="Your Name"
				className={inputBase}
			/>
			<input
				required
				type="email"
				value={form.email}
				onChange={(e) => setForm({ ...form, email: e.target.value })}
				placeholder="Your Email"
				className={inputBase}
			/>
			<div
				className={`flex items-center ${dark ? 'border-b border-white/30' : 'border border-slate-200 rounded-lg bg-white'}`}
			>
				<span
					className={`px-3 text-sm font-medium ${dark ? 'text-white/80' : 'text-slate-700'}`}
				>
					🇮🇳 +91
				</span>
				<input
					required
					type="tel"
					value={form.phone}
					onChange={(e) => setForm({ ...form, phone: e.target.value })}
					placeholder="Your Phone"
					className={`flex-1 px-2 py-3 text-sm bg-transparent focus:outline-none ${dark ? 'text-white placeholder-white/60' : 'text-slate-800 placeholder-slate-400'}`}
				/>
			</div>
			{!compact && (
				<textarea
					rows={2}
					value={form.message}
					onChange={(e) => setForm({ ...form, message: e.target.value })}
					placeholder="Your Message"
					className={`${inputBase} resize-none`}
				/>
			)}
			<p
				className={`text-[10px] leading-tight ${dark ? 'text-white/50' : 'text-slate-400'}`}
			>
				I authorize NX ONE representatives to call, SMS, email or WhatsApp me
				about products and offers — overriding any DNC/NDNC registration.
			</p>
			<button
				type="submit"
				className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold py-3 rounded-lg uppercase tracking-wide text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
			>
				Submit Now <ArrowRight size={15} />
			</button>
		</form>
	);
};

/* ─── Premium logo lockup for in-page use (NX ONE + ARK) ─── */
const LogoLockup = ({ size = 'md', center = false }) => {
	const h =
		size === 'lg'
			? 'h-14 md:h-16'
			: size === 'sm'
				? 'h-8 md:h-9'
				: 'h-11 md:h-12';
	return (
		<div
			className={`flex items-center gap-4 ${center ? 'justify-center' : ''}`}
		>
			<SmartImg
				src={IMG.logoNxOne}
				alt="NX ONE"
				className={`${h} w-auto object-contain`}
			/>
			<div className="h-10 w-px bg-gradient-to-b from-transparent via-amber-500/60 to-transparent" />
			<SmartImg
				src={IMG.logoArk}
				alt="ARK — Story of Growth"
				className={`${h} w-auto object-contain max-w-[160px] md:max-w-[200px]`}
			/>
		</div>
	);
};

const PopupModal = ({ open, onClose }) => {
	if (!open) return null;
	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative"
			>
				<button
					onClick={onClose}
					className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg"
				>
					<X size={18} />
				</button>
				<div className="h-44 overflow-hidden">
					<SmartImg
						src={IMG.lobby}
						alt="NX ONE – ARK"
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="p-6 text-center">
					<div className="flex items-center justify-center gap-2 mb-1">
						<img src={IMG.logoNxOne} alt="NX ONE" className="h-7 w-auto object-contain" />
						<span className="text-slate-300 text-base font-light">–</span>
						<img src={IMG.logoArk} alt="ARK" className="h-5 w-auto object-contain" />
					</div>
					<p className="text-sm text-slate-500 mt-1 mb-4">
						Elevate your business with our expert assistance.
					</p>
					<LeadForm compact />
				</div>
			</div>
		</div>
	);
};

const Lightbox = ({ images, idx, onClose, onNav }) => {
	if (idx === null) return null;
	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
		>
			<button
				onClick={onClose}
				className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
			>
				<X size={20} />
			</button>
			<div onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full">
				<img
					src={images[idx]}
					className="w-full max-h-[80vh] object-contain rounded-xl"
				/>
				<div className="flex justify-center gap-3 mt-4">
					<button
						onClick={() => onNav((idx - 1 + images.length) % images.length)}
						className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"
					>
						← Prev
					</button>
					<span className="px-4 py-2 text-white/70 text-sm">
						{idx + 1} / {images.length}
					</span>
					<button
						onClick={() => onNav((idx + 1) % images.length)}
						className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"
					>
						Next →
					</button>
				</div>
			</div>
		</div>
	);
};

/* ─── ClubPiSlider — auto-advance only, ARK logo on left ─── */
const ClubPiSlider = ({ items }) => {
	const [idx, setIdx] = useState(0);
	const total = items.length;

	const go = useCallback((n) => setIdx((n + total) % total), [total]);
	const next = useCallback(() => go(idx + 1), [idx, go]);

	const [paused, setPaused] = useState(false);
	useEffect(() => {
		if (paused) return;
		const id = setInterval(next, 5000);
		return () => clearInterval(id);
	}, [next, paused]);

	return (
		<section
			className={`relative overflow-hidden ${BG.clubPi} py-12 md:py-20`}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
				{/* LEFT — ARK logo + dynamic amenity info */}
				<div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start">
					<SmartImg
						src={IMG.logoArk}
						alt="ARK — Story of Growth"
						className="h-20 md:h-28 w-auto object-contain mb-6"
					/>

					<p className="text-[11px] font-bold tracking-[0.25em] uppercase mb-2 text-amber-300">
						Club π · International Standard
					</p>

					<h2
						key={`title-${idx}`}
						className="text-2xl md:text-3xl font-bold text-white mb-3 transition-all duration-500 animate-fade-in"
					>
						{items[idx].name}
					</h2>
					<div className="h-[3px] w-16 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mb-4" />

					<p
						key={`sub-${idx}`}
						className="text-white/70 text-sm leading-relaxed max-w-md transition-all duration-500"
					>
						{items[idx].sub}
					</p>

					<p className="text-white/40 text-xs mt-3 leading-relaxed max-w-md">
						A curated circle of world-class amenities — designed for those who
						aim higher.
					</p>

					{/* Dots */}
					<div className="flex items-center gap-2 mt-8">
						{items.map((_, i) => (
							<button
								key={i}
								onClick={() => go(i)}
								aria-label={`Go to slide ${i + 1}`}
								className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-amber-300'}`}
							/>
						))}
					</div>

					<p className="text-xs text-white/50 mt-3 tracking-widest">
						{String(idx + 1).padStart(2, '0')} /{' '}
						{String(total).padStart(2, '0')}
					</p>
				</div>

				{/* RIGHT — Slider stage */}
				<div className="lg:col-span-7">
					<div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/15 bg-black">
						{items.map((it, i) => (
							<div
								key={i}
								className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
							>
								<SmartImg
									src={it.img}
									alt={it.name}
									className="w-full h-full object-cover"
								/>
								<div className="absolute left-0 right-0 bottom-0 p-5 md:p-7 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-left">
									<p className="text-amber-300 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-1">
										Club π · {String(i + 1).padStart(2, '0')} /{' '}
										{String(total).padStart(2, '0')}
									</p>
									<p className="text-white text-xl md:text-2xl font-bold leading-tight">
										{it.name}
									</p>
									<p className="text-white/70 text-xs md:text-sm mt-1">
										{it.sub}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

const NxOneArkDetailPage = () => {
	const navigate = useNavigate();
	const [showPopup, setShowPopup] = useState(false);

	// Hide the global AiSensy floating button on this page — we have WhatsApp in the bottom bar
	useEffect(() => {
		const hide = () => {
			const widget = document.getElementById('aisensy-wa-widget');
			if (widget) widget.style.display = 'none';
		};
		hide();
		const t = setTimeout(hide, 1500); // retry after widget lazy-loads
		return () => {
			clearTimeout(t);
			const widget = document.getElementById('aisensy-wa-widget');
			if (widget) widget.style.display = '';
		};
	}, []);
	const [lightboxIdx, setLightboxIdx] = useState(null);
	const [selectedPlan, setSelectedPlan] = useState(0);
	const [planView, setPlanView] = useState('2d');
	const [planZoom, setPlanZoom] = useState(1);
	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });
	const planContainerRef = useRef(null);

	const resetPlan = (planIdx, view = '2d') => {
		setSelectedPlan(planIdx);
		setPlanView(view);
		setPlanZoom(1);
		setPanOffset({ x: 0, y: 0 });
	};
	const onPanStart = (e) => {
		if (planZoom <= 1) return;
		setIsPanning(true);
		dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
	};
	const onPanMove = (e) => {
		if (!isPanning) return;
		const el = planContainerRef.current;
		const maxX = el ? (el.offsetWidth  * (planZoom - 1)) / 2 : 999;
		const maxY = el ? (el.offsetHeight * (planZoom - 1)) / 2 : 999;
		const rawX = e.clientX - dragStart.current.x;
		const rawY = e.clientY - dragStart.current.y;
		setPanOffset({
			x: Math.max(-maxX, Math.min(maxX, rawX)),
			y: Math.max(-maxY, Math.min(maxY, rawY)),
		});
	};
	const onPanEnd = () => setIsPanning(false);

	const handleBrochure = () => {
		const a = document.createElement('a');
		a.href = '/brochures/nx-one-ark-brochure.pdf';
		a.download = 'NX-ONE-ARK-Brochure.pdf';
		a.target = '_blank';
		a.click();
	};

	const whatsappUrl = `https://wa.me/919718130000?text=${encodeURIComponent(
		"Hi! I'm interested in NX ONE – ARK at Tech Zone IV, Greater Noida (West). Please share more details.",
	)}`;

	return (
		<Layout>
			<Helmet>
				<title>NX ONE ARK | Premium Commercial Tower · Tech Zone IV, Greater Noida</title>
				<meta name="description" content="NX ONE ARK · Story of Growth. G+26 premium commercial tower at Tech Zone IV, Greater Noida (West). BSP Rs.11,990/sqft. RERA approved." />
				<link rel="canonical" href="https://instamakaan.com/sell-companies/nx-one-ark" />
				<meta property="og:title" content="NX ONE ARK | Premium Commercial Tower · Tech Zone IV, Greater Noida" />
				<meta property="og:description" content="G+26 premium commercial tower at Tech Zone IV, Greater Noida (West). BSP Rs.11,990/sqft. RERA approved." />
				<meta property="og:url" content="https://instamakaan.com/sell-companies/nx-one-ark" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/nx-one-ark/hero-tower-night.jpg" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="NX ONE ARK | Premium Commercial Tower · Tech Zone IV, Greater Noida" />
				<meta name="twitter:description" content="G+26 premium commercial tower at Tech Zone IV, Greater Noida (West). BSP Rs.11,990/sqft." />
				<meta name="twitter:image" content="https://instamakaan.com/images/nx-one-ark/hero-tower-night.jpg" />
				<script type="application/ld+json">{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "RealEstateListing",
					"name": "NX ONE ARK — Premium Commercial Tower, Tech Zone IV Greater Noida",
					"description": "G+26 premium commercial tower at Tech Zone IV, Greater Noida West. RERA approved.",
					"url": "https://instamakaan.com/sell-companies/nx-one-ark",
					"image": "https://instamakaan.com/images/nx-one-ark/hero-tower-night.jpg",
					"address": { "@type": "PostalAddress", "streetAddress": "Tech Zone IV, NX One", "addressLocality": "Greater Noida", "addressRegion": "Uttar Pradesh", "postalCode": "201306", "addressCountry": "IN" }
				})}</script>
			</Helmet>

			{/* ═══════════ HERO ═══════════ */}
			{/* ═══ MOBILE BOTTOM BAR ═══ */}
			<div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-[#0b1220]/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/10 shadow-2xl">
				<div className="flex items-center justify-around px-2 py-2">
					<a href="#home" className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 px-2">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75a.75.75 0 01-.75-.75v-4.5h-6V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z"/></svg>
						Overview
					</a>
					<a href="#floor-plan" className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 px-2">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M3 9h18M9 3v18"/></svg>
						Floor Plan
					</a>
					<a href="#amenities" className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 px-2">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
						Amenities
					</a>
					<a href="#gallery" className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 px-2">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 21h18"/></svg>
						Gallery
					</a>
					<a
						href="https://wa.aisensy.com/aabbf5"
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-green-600 dark:text-green-400 px-2"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>
						WhatsApp
					</a>
				</div>
			</div>

			{/* ═══════════ HERO ═══════════ */}
			<section
				id="home"
				className="relative min-h-[580px] md:min-h-[700px] flex items-center overflow-hidden"
			>
				<SmartImg
					src={IMG.heroNight}
					alt="NX ONE – ARK Tower"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

				<div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 pb-20 md:pb-12">
					<div className="lg:col-span-3 text-white">
						<div className="flex flex-wrap items-center gap-3 mb-4 text-amber-400 text-sm">
							<span className="flex items-center gap-1.5"><MapPin size={16} /> {PROJECT.location}</span>
							<span className="flex items-center gap-1.5 text-teal-300 text-xs font-medium">
								<UserCheck size={14} /> Managed by {PROJECT.managedBy}
							</span>
						</div>

						<h1 className="text-3xl md:text-6xl font-bold leading-none tracking-tight mb-2">
							NX ONE <span className="text-amber-400">– ARK</span>
						</h1>
						<p className="text-base md:text-2xl font-light text-white/90 mb-3 italic">
							{PROJECT.subtitle}
						</p>
						<p className="text-sm text-amber-300 tracking-[0.25em] uppercase font-bold mb-6">
							{PROJECT.tagline}
						</p>

						<ul className="space-y-2 mb-6 max-w-xl">
							{PROJECT.bullets.map((b, i) => (
								<li
									key={i}
									className="flex items-start gap-3 text-white/90 text-xs md:text-base"
								>
									<ArrowRight
										size={18}
										className="text-amber-400 flex-shrink-0 mt-0.5"
									/>
									{b}
								</li>
							))}
						</ul>

						<div className="flex flex-wrap gap-3">
							<button
								onClick={handleBrochure}
								className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold px-7 py-3.5 rounded-lg flex items-center gap-2 shadow-xl shadow-amber-500/30 transition"
							>
								<Download size={16} /> Download Brochure
							</button>
						</div>
					</div>

					<div className="hidden lg:block lg:col-span-2 bg-black/40 backdrop-blur-md border border-white/15 rounded-2xl p-6 lg:p-7">
						<h3 className="text-white text-xl font-bold leading-tight">
							Get Early Premium
						</h3>
						<h3 className="text-amber-400 text-xl font-bold leading-tight">
							Units For The New Launch
						</h3>
						<p className="text-white/70 text-xs mt-2 mb-5">
							Limited inventory · Attractive pre-launch prices
						</p>
						<LeadForm dark />
					</div>
				</div>
			</section>

			{/* ═══════════ STATS STRIP ═══════════ */}
			<section
				className={`${BG.stats} border-b border-amber-900/10 dark:border-slate-800`}
			>
				<div className="container-custom py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
					{PROJECT.stats.map((s, i) => (
						<div
							key={i}
							className="text-center py-4 px-2 border-r last:border-r-0 border-amber-900/10 dark:border-slate-800 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r"
						>
							<p className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold mb-1">
								{s.label}
							</p>
							<p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
								{s.value}
							</p>
							<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
								{s.sub}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ═══════════ OVERVIEW / HIGHLIGHTS ═══════════ */}
			<section
				id="overview"
				className={`relative ${BG.overview} py-16 md:py-24 overflow-hidden`}
			>
				<div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />

				<div className="container-custom relative z-10">
					{/* Premium logo lockup + heading */}
					<div className="flex flex-col items-center text-center mb-12">
						<LogoLockup size="lg" center />
						<div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/70 dark:border-amber-700/30">
							<span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
							<span className="text-[11px] font-bold tracking-[0.25em] uppercase text-amber-700 dark:text-amber-300">
								{PROJECT.developer}
							</span>
						</div>
						<p className="mt-6 text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
							Designed as a benchmark for commercial developments in NCR, NX ONE
							– ARK is a G+26 storey premium office tower standing at the heart
							of a 25-acre integrated campus. Born from a decade of meticulous
							planning, it blends art with exemplary engineering — a rare
							architectural masterpiece for businesses that aim higher.
						</p>
					</div>

					<div
						id="highlight"
						className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
					>
						{/* Tower image with frame + floating stat badge */}
						<div className="relative">
							<div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber-600/20 via-transparent to-amber-400/20 blur-sm" />
							<div className="relative aspect-[4/5] rounded-[1.75rem] overflow-hidden shadow-2xl ring-1 ring-amber-200/60 dark:ring-amber-500/20">
								<SmartImg
									src={IMG.towerFront}
									alt="ARK Tower"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
							</div>
							<div className="absolute -bottom-5 left-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-5 py-3.5 flex items-center gap-3 ring-1 ring-amber-100 dark:ring-slate-700">
								<div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
									<Building2 size={18} className="text-white" />
								</div>
								<div>
									<p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
										Tower Height
									</p>
									<p className="text-lg font-bold text-slate-900 dark:text-white leading-none">
										G + 26
									</p>
								</div>
							</div>
						</div>

						{/* Highlights list */}
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 mb-3">
								Project Specifications
							</p>
							<h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
								Our Highlights
							</h3>
							<div className="h-[3px] w-16 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mb-7" />

							<ul className="space-y-3.5">
								{PROJECT.highlights.map((h, i) => (
									<li
										key={i}
										className="group flex items-start gap-3.5 rounded-xl bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm border border-amber-100/80 dark:border-slate-700/60 px-4 py-3 hover:border-amber-300 dark:hover:border-amber-600/50 hover:shadow-md hover:shadow-amber-500/5 transition-all"
									>
										<div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-600/10 dark:bg-amber-500/15 flex items-center justify-center mt-0.5 group-hover:bg-amber-600 transition-colors">
											<Check
												size={14}
												className="text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors"
											/>
										</div>
										<span className="text-sm md:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
											{h}
										</span>
									</li>
								))}
							</ul>

							<button
								onClick={handleBrochure}
								className="mt-8 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold px-7 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
							>
								<Download size={15} /> Download Brochure
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════ CTA BANNER (cream theme) ═══════════ */}
			<section className={`${BG.ctaDark} py-16 relative overflow-hidden`}>
				<div className="absolute inset-0 opacity-15">
					<SmartImg
						src={IMG.skyBar}
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="absolute inset-0 bg-gradient-to-r from-[#f1e8d8] via-[#f1e8d8]/90 to-[#f1e8d8]/60 dark:from-[#0b1426] dark:via-[#0b1426]/95 dark:to-[#0b1426]/70" />
				<div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
					<div className="text-slate-900 dark:text-white">
						<h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
							Book Before This Month End &amp;
							<br />
							<span className="text-amber-600 dark:text-amber-400">
								Unlock Exclusive Offers!
							</span>
						</h2>
						<p className="text-slate-600 dark:text-white/70 text-sm">
							Limited Inventory · Attractive Prices · Premium Units
						</p>
					</div>
					<div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-amber-200/60 dark:border-white/15 rounded-2xl p-6 shadow-lg shadow-amber-900/5">
						<p className="text-slate-700 dark:text-white/90 text-center text-sm font-medium mb-1">
							Interested? Enquire Now
						</p>
						<div className="h-px bg-amber-400/40 my-3" />
						<LeadForm compact />
					</div>
				</div>
			</section>

			{/* ═══════════ PRICE ═══════════ */}
			<section id="price" className={`py-16 ${BG.price}`}>
				<div className="container-custom">
					<SectionHeading
						kicker="Quality That Fits Your Business"
						title="Our Price"
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
						{PROJECT.unitTypes.map((u) => {
							const price = u.area * PROJECT.bsp;
							return (
								<div
									key={u.type}
									className="bg-white/70 dark:bg-amber-900/5 border border-amber-200/60 dark:border-amber-700/20 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all"
								>
									<div className="bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2.5">
										<p className="text-white font-bold text-sm tracking-wide flex items-center justify-between">
											{u.type}
											<span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
												Office
											</span>
										</p>
									</div>
									<div className="p-5">
										<p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
											{u.desc}
										</p>
										<div className="space-y-2.5 mb-4">
											<div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200 dark:border-slate-700">
												<span className="text-xs text-slate-500">Size</span>
												<span className="text-sm font-bold text-slate-800 dark:text-white">
													{u.area.toLocaleString('en-IN')} sqft
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-xs text-slate-500">Price</span>
												<span className="text-base font-bold text-amber-600 dark:text-amber-400">
													{fmtINR(price)}
												</span>
											</div>
										</div>
										<button
											onClick={handleBrochure}
											className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition"
										>
											View Details <ChevronRight size={13} />
										</button>
									</div>
								</div>
							);
						})}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
						<div className="bg-white/70 dark:bg-slate-800/40 rounded-2xl p-6 border border-amber-200/50 dark:border-slate-700">
							<p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
								Floor PLC
							</p>
							<table className="w-full text-sm">
								<tbody className="divide-y divide-slate-200 dark:divide-slate-700">
									{PROJECT.floorPLC.map((f) => (
										<tr key={f.range}>
											<td className="py-2 text-slate-600 dark:text-slate-300 text-xs">
												{f.range}
											</td>
											<td className="py-2 text-right font-bold text-slate-800 dark:text-white text-xs">
												{f.plc > 0 ? (
													`+₹${f.plc}`
												) : (
													<span className="text-green-600 dark:text-green-400">
														None
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="bg-white/70 dark:bg-slate-800/40 rounded-2xl p-6 border border-amber-200/50 dark:border-slate-700">
							<p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
								Wing PLC
							</p>
							<table className="w-full text-sm mb-5">
								<tbody className="divide-y divide-slate-200 dark:divide-slate-700">
									{PROJECT.wingPLC.map((w) => (
										<tr key={w.wing}>
											<td className="py-2 text-slate-600 dark:text-slate-300 text-xs">
												{w.wing}
											</td>
											<td className="py-2 text-right font-bold text-slate-800 dark:text-white text-xs">
												+₹{w.plc}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg p-3">
								<p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
									Corner Premium
								</p>
								<p className="text-lg font-bold text-amber-600 dark:text-amber-400">
									10% of BSP
								</p>
							</div>
						</div>
						<div className="bg-white/70 dark:bg-slate-800/40 rounded-2xl p-6 border border-amber-200/50 dark:border-slate-700">
							<p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
								Other Charges
							</p>
							<table className="w-full text-sm">
								<tbody className="divide-y divide-slate-200 dark:divide-slate-700">
									{PROJECT.otherCharges.map((c) => (
										<tr key={c.name}>
											<td className="py-2 text-slate-600 dark:text-slate-300 text-xs">
												{c.name}
											</td>
											<td className="py-2 text-right font-bold text-slate-800 dark:text-white text-xs">
												{c.rate}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════ AMENITIES ═══════════ */}
			<section id="amenities" className={`py-16 ${BG.amenities}`}>
				<div className="container-custom">
					<SectionHeading kicker="International Standard" title="Amenities" />

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
						{PROJECT.amenities.map(({ Icon, name }, i) => (
							<div
								key={i}
								className="bg-white/80 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-700 hover:border-amber-500 hover:shadow-lg dark:hover:shadow-amber-900/10 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all group"
							>
								<div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition">
									<Icon
										size={20}
										className="text-amber-600 dark:text-amber-400"
									/>
								</div>
								<p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">
									{name}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════ WORKSPACE FEATURES ═══════════ */}
			<section className={`py-16 ${BG.workspace}`}>
				<div className="container-custom">
					<SectionHeading
						kicker="Tech-Enhanced Spaces"
						title="What's Inside Your Workspace"
					/>
					<p className="text-center text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto -mt-4 mb-10">
						Every office unit at NX ONE – ARK comes fully fitted with premium appliances and smart-tech features — move in and start working from day one.
					</p>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
						{WORKSPACE_FEATURES.map(({ Icon, name, brand }, i) => (
							<div
								key={i}
								className="bg-white/80 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-700 hover:border-amber-500 hover:shadow-lg dark:hover:shadow-amber-900/10 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all group"
							>
								<div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition">
									<Icon size={20} className="text-amber-600 dark:text-amber-400" />
								</div>
								<p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{name}</p>
								<p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{brand}</p>
							</div>
						))}
					</div>

					<p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6">
						* All appliances and fittings are included with every unit. Specifications subject to developer confirmation.
					</p>
				</div>
			</section>

			{/* ═══════════ CLUB π SLIDER ═══════════ */}
			<ClubPiSlider items={PROJECT.clubPiCards} />

			{/* ═══════════ FLOOR PLAN ═══════════ */}
			<section id="floor-plan" className={`py-14 ${BG.floorPlan}`}>
				<div className="container-custom">
					<SectionHeading kicker="Well Constructed" title="Floor Plans" onDark />

					{/* ── Single unified card ── */}
					<div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-amber-700/20 shadow-2xl shadow-black/40">

						{/* ══ ROW 1: type tabs + view toggle + zoom — all in one bar ══ */}
						<div className="bg-[#120800] px-4 py-3 flex items-center gap-3 flex-wrap border-b border-amber-900/20">
							{/* type tabs */}
							<div className="flex gap-1 flex-wrap">
								{FLOOR_PLANS.map((fp, i) => (
									<button
										key={i}
										onClick={() => resetPlan(i)}
										className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
											selectedPlan === i
												? 'bg-amber-500 text-white shadow-md shadow-amber-900/50'
												: 'bg-white/5 text-white/45 hover:bg-white/10 hover:text-white'
										}`}
									>
										{fp.type}
										<span className={`ml-1.5 text-[9px] font-normal ${selectedPlan === i ? 'text-white/70' : 'text-white/25'}`}>{fp.area}</span>
									</button>
								))}
							</div>

							{/* spacer */}
							<div className="flex-1" />

							{/* view toggle */}
							<div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5">
								{[
									{ key: '2d',     label: '2D' },
									{ key: '3d',     label: '3D' },
									{ key: 'render', label: 'View' },
								].map(({ key, label }) => (
									<button
										key={key}
										onClick={() => { setPlanView(key); setPlanZoom(1); setPanOffset({x:0,y:0}); }}
										className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
											planView === key ? 'bg-amber-500 text-white' : 'text-white/40 hover:text-white'
										}`}
									>{label}</button>
								))}
							</div>

							{/* zoom */}
							<div className="flex items-center bg-white/5 border border-white/8 rounded-lg overflow-hidden">
								<button
									onClick={() => setPlanZoom(z => { const n = Math.max(1, Math.round((z-0.5)*10)/10); if (n===1) setPanOffset({x:0,y:0}); return n; })}
									disabled={planZoom <= 1}
									className="px-2 py-1 text-white/50 hover:text-amber-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors font-bold text-base leading-none"
								>−</button>
								<span className="text-white/40 text-[11px] font-mono px-1.5 select-none w-9 text-center">{planZoom.toFixed(1)}×</span>
								<button
									onClick={() => setPlanZoom(z => Math.min(3, Math.round((z+0.5)*10)/10))}
									disabled={planZoom >= 3}
									className="px-2 py-1 text-white/50 hover:text-amber-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors font-bold text-base leading-none"
								>+</button>
							</div>
						</div>

						{/* ══ ROW 2: floor plan image — full width, white bg ══ */}
						<div
							ref={planContainerRef}
							className="relative overflow-hidden bg-white"
							style={{ height: '340px', cursor: planZoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
							onMouseDown={onPanStart}
							onMouseMove={onPanMove}
							onMouseUp={onPanEnd}
							onMouseLeave={onPanEnd}
						>
							<div
								className="w-full h-full flex items-center justify-center select-none px-6 py-4"
								style={{
									transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${planZoom})`,
									transformOrigin: 'center',
									transition: isPanning ? 'none' : 'transform 0.25s ease',
								}}
							>
								<SmartImg
									key={`${selectedPlan}-${planView}`}
									src={
										planView === '3d'     ? FLOOR_PLANS[selectedPlan].imgRender :
										planView === 'render' ? FLOOR_PLANS[selectedPlan].img3d :
										FLOOR_PLANS[selectedPlan].img2d
									}
									alt={`${FLOOR_PLANS[selectedPlan].type} floor plan`}
									className="w-full h-full object-contain pointer-events-none"
								/>
							</div>

							{/* floating type badge */}
							<div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
								{FLOOR_PLANS[selectedPlan].type} · {FLOOR_PLANS[selectedPlan].dims}
							</div>

							{/* floating price badge */}
							<div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-amber-500/30 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
								from {FLOOR_PLANS[selectedPlan].price}
							</div>

							{planZoom > 1 && (
								<>
									<button
										onClick={() => { setPlanZoom(1); setPanOffset({x:0,y:0}); }}
										className="absolute bottom-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow"
									>↺ Reset</button>
									<span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white/60 text-[10px] px-2.5 py-1 rounded-full pointer-events-none">
										Drag to pan
									</span>
								</>
							)}
						</div>

						{/* ══ ROW 3: specs strip ══ */}
						<div className="bg-[#1a0f04] px-5 py-3 flex items-center gap-4 flex-wrap border-t border-amber-900/20">
							<div className="flex items-center gap-1.5">
								<span className="text-white/30 text-[10px] uppercase tracking-widest">Area</span>
								<span className="text-amber-400 font-bold text-sm">{FLOOR_PLANS[selectedPlan].area}</span>
							</div>
							<div className="w-px h-4 bg-amber-800/40" />
							<div className="flex items-center gap-1.5">
								<span className="text-white/30 text-[10px] uppercase tracking-widest">BSP</span>
								<span className="text-white/70 text-sm font-semibold">₹11,990/sqft</span>
							</div>
							<div className="w-px h-4 bg-amber-800/40" />
							<div className="flex items-center gap-1.5">
								<span className="text-white/30 text-[10px] uppercase tracking-widest">RERA</span>
								<span className="text-green-400 text-sm font-bold">✓ Approved</span>
							</div>
							<div className="w-px h-4 bg-amber-800/40 hidden sm:block" />
							<div className="hidden sm:flex items-center gap-1.5">
								<span className="text-white/30 text-[10px] uppercase tracking-widest">Tower</span>
								<span className="text-white/70 text-sm font-semibold">G + 26 Floors</span>
							</div>
						</div>

						{/* ══ ROW 4: room dimensions + download ══ */}
						<div className="bg-[#120800] px-5 py-3.5 flex items-center gap-3 flex-wrap border-t border-amber-900/20">
							{/* room chips */}
							<div className="flex flex-wrap gap-2 flex-1">
								{FLOOR_PLANS[selectedPlan].rooms.map((room, i) => (
									<div key={i} className="flex items-center gap-2 bg-white/5 border border-amber-700/15 rounded-lg px-3 py-1.5">
										<div className="w-1.5 h-1.5 rounded-full bg-amber-500/70 flex-shrink-0" />
										<span className="text-white/50 text-xs">{room.name}</span>
										<span className="text-amber-400 text-xs font-bold font-mono">{room.size}</span>
									</div>
								))}
							</div>
							{/* download */}
							<button
								onClick={handleBrochure}
								className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5 flex-shrink-0"
							>
								<Download size={12} /> Brochure
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════ GALLERY ═══════════ */}
			<section id="gallery" className={`py-16 ${BG.gallery}`}>
				<div className="container-custom">
					<SectionHeading
						kicker="Beautifully Designed"
						title="Gallery"
						onDark
					/>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
						<button
							onClick={() => setLightboxIdx(0)}
							className="md:col-span-2 relative overflow-hidden rounded-xl group aspect-[16/10] md:aspect-auto md:min-h-[420px]"
						>
							<SmartImg
								src={PROJECT.gallery[0]}
								alt="Featured"
								className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
							<div className="absolute bottom-4 left-4 right-4">
								<p className="text-amber-300 text-[10px] font-bold tracking-[0.25em] uppercase mb-1">
									Featured
								</p>
								<p className="text-white text-lg md:text-2xl font-bold">
									NX ONE – ARK at Dawn
								</p>
							</div>
						</button>
						<div className="grid grid-cols-2 gap-3 md:gap-4 md:[grid-template-rows:1fr_1fr]">
							{PROJECT.gallery.slice(1, 5).map((src, i) => (
								<button
									key={i + 1}
									onClick={() => setLightboxIdx(i + 1)}
									className="relative overflow-hidden rounded-xl group aspect-[4/3] md:aspect-auto"
								>
									<SmartImg
										src={src}
										alt={`Gallery ${i + 2}`}
										className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
								</button>
							))}
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
						{PROJECT.gallery.slice(5).map((src, i) => (
							<button
								key={i + 5}
								onClick={() => setLightboxIdx(i + 5)}
								className="relative overflow-hidden rounded-xl group aspect-[4/3]"
							>
								<SmartImg
									src={src}
									alt={`Gallery ${i + 6}`}
									className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							</button>
						))}
					</div>

					<div className="text-center mt-8">
						<button
							onClick={() => setLightboxIdx(0)}
							className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-amber-500 text-amber-300 hover:bg-amber-500 hover:text-white font-bold px-6 py-2.5 rounded-lg text-sm transition"
						>
							View All Photos ({PROJECT.gallery.length}){' '}
							<ArrowRight size={14} />
						</button>
					</div>
				</div>
			</section>

			{/* ═══════════ LOCATION ═══════════ */}
			<section id="location" className={`py-16 ${BG.location}`}>
				<div className="container-custom">
					<SectionHeading
						kicker="Well Connected"
						title="Location Advantages"
						onDark
					/>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="space-y-2">
							{PROJECT.locationAdvantages.map((l, i) => (
								<div
									key={i}
									className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border-l-4 border-amber-500 rounded-r-lg px-4 py-3 hover:bg-white/10 transition"
								>
									<div className="text-amber-400 font-bold text-sm w-16 flex-shrink-0">
										{l.time}
									</div>
									<div className="text-white/90 text-sm">{l.place}</div>
								</div>
							))}
						</div>
						<div className="rounded-2xl overflow-hidden border border-white/15 shadow-lg min-h-[400px] bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-8">
							<MapPin size={36} className="text-amber-400" />
							<p className="font-bold text-white text-center">
								Plot No. 17, Tech Zone IV
							</p>
							<p className="text-sm text-white/60 text-center">
								Greater Noida (West), Uttar Pradesh
							</p>
							<a
								href="https://maps.google.com/?q=Tech+Zone+IV+Greater+Noida+West"
								target="_blank"
								rel="noopener noreferrer"
								className="mt-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
							>
								Open in Google Maps <ArrowRight size={14} />
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════ DEVELOPER / ABOUT ═══════════ */}
			<section
				className={`py-16 ${BG.developer} text-white relative overflow-hidden`}
			>
				<div className="absolute inset-0 opacity-10">
					<SmartImg
						src={IMG.ecosystem}
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="container-custom relative z-10 max-w-3xl text-center">
					<p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-3">
						The Developer
					</p>
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						SP SAI IT Private Limited
					</h2>
					<div className="h-[3px] w-16 bg-amber-400 rounded-full mx-auto mb-6" />
					<p className="text-white/80 leading-relaxed mb-8">
						Born from a decade of meticulous planning and engineering
						excellence, NX ONE – ARK rises at the heart of a 25-acre integrated
						campus that hosts hundreds of companies and thousands of
						professionals. With cutting-edge design, AQI-controlled
						environments, and Mitsubishi vertical mobility, ARK is set to become
						a benchmark for commercial developments in the NCR region.
					</p>
					<div className="flex flex-wrap justify-center gap-3 text-xs text-white/60 mb-8">
						<span>RERA: {PROJECT.rera}</span>
						<span>·</span>
						<span>CIN: {PROJECT.cin}</span>
					</div>
					<button
						onClick={handleBrochure}
						className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold px-8 py-3.5 rounded-lg shadow-xl shadow-amber-500/30 transition inline-flex items-center gap-2"
					>
						Enquire Now <ArrowRight size={16} />
					</button>
				</div>
			</section>

			{/* Mobile bottom padding so fixed bar doesn't overlap last section */}
			<div className="h-16 md:hidden" />

			<PopupModal open={showPopup} onClose={() => setShowPopup(false)} />
			<Lightbox
				images={PROJECT.gallery}
				idx={lightboxIdx}
				onClose={() => setLightboxIdx(null)}
				onNav={(i) => setLightboxIdx(i)}
			/>
		</Layout>
	);
};

export default NxOneArkDetailPage;
