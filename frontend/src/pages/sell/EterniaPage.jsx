import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import {
	MapPin, Building2, Check, ArrowRight, Download,
	Shield, ChevronRight, X, Phone, MessageCircle,
	ChevronDown, Wind, Droplets, Layers, Sparkles,
	Clock, Car, Zap, CheckCircle2, ChevronLeft, Calculator,
	ExternalLink, Share2, Compass, Award, Trees, Eye, Lock,
	ZoomIn, ZoomOut, RotateCcw, Bed, ChefHat, Sofa, BookOpen,
	Landmark, FileText, CheckCircle, Navigation, Info
} from 'lucide-react';

/* ─── AUTHENTIC EXTRACTED ASSETS FROM DIGITAL BROCHURE & PRICE LIST ─── */
const I = {
	cover: '/images/eternia/cover.jpg',
	heroBg: '/images/eternia/towers-hero.jpg',
	exteriorAngle: '/images/eternia/exterior-angle.jpg',
	towerElevation: '/images/eternia/tower-elevation.jpg',
	highlightsPage: '/images/eternia/project-highlights-page.jpg',
	gymYoga: '/images/eternia/gym-yoga.jpg',
	swimmingPool: '/images/eternia/swimming-pool.jpg',
	waterFeature: '/images/eternia/water-feature-deck.jpg',
	doubleHeightLobby: '/images/eternia/double-height-lobby.jpg',
	greenLawn: '/images/eternia/green-lawn.jpg',
	billiards: '/images/eternia/billiards-indoor-games.jpg',
	toddlersPlay: '/images/eternia/toddlers-play.jpg',
	multipurposeHall: '/images/eternia/multipurpose-hall.jpg',
	seniorGarden: '/images/eternia/senior-garden-putting.jpg',
	sittingPlaza: '/images/eternia/sitting-plaza.jpg',
	livingRoom: '/images/eternia/living-room.jpg',
	masterBedKitchen: '/images/eternia/master-bedroom-kitchen.jpg',
	clubhouseExterior: '/images/eternia/clubhouse-exterior.jpg',
	clubhouseLobby: '/images/eternia/clubhouse-lobby.jpg',
	clubhousePlan: '/images/eternia/clubhouse-floor-plan.jpg',
	palmCourt: '/images/eternia/palm-court.jpg',
	locationMap: '/images/eternia/location-map.jpg',
	masterSitePlan: '/images/eternia/master-site-plan.jpg',
	towerClusters: '/images/eternia/tower-clusters.jpg',
	typicalFloorA: '/images/eternia/typical-floor-tower-a.jpg',
	typicalFloorB: '/images/eternia/typical-floor-tower-b.jpg',
	plan4bhkStudy: '/images/eternia/plan-4bhk-study.jpg',
	plan3bhkStudy: '/images/eternia/plan-3bhk-study.jpg',
	plan3bhk: '/images/eternia/plan-3bhk.jpg',
	vastunidhi: '/images/eternia/architect-vastunidhi.jpg',
	dvplNbcc: '/images/eternia/construction-dvpl-nbcc.jpg',
	greatValue: '/images/eternia/developer-great-value.jpg',
	sanskarRealty: '/images/eternia/partner-sanskar-realty.jpg',
	aerialGreens: '/images/eternia/aerial-greens-view.jpg',
	waterCascade: '/images/eternia/pure-water-cascade-deck.jpg',
	buildingEvening: '/images/eternia/building-evening-clean.jpg',
	buildingCourtyard: '/images/eternia/building-courtyard-clean.jpg',
	buildingBoulevard: '/images/eternia/building-palm-clean.jpg',
	pricePage1: '/images/eternia/price-list-page-1.jpg',
	pricePage2: '/images/eternia/price-list-page-2.jpg',
};

const PROJECT = {
	name: 'Eternia',
	sub: 'Inspired by the Anthurium · A Symbol of Timeless Grace',
	tagline: 'Where Space Breathes and Legacies Bloom',
	location: 'Dream Valley, Techzone-4, Greater Noida (W)',
	fullAddress: 'Plot No. GH-05, Sector Techzone-4, Greater Noida West, Uttar Pradesh',
	onRoad: '130 Mtr Wide Expressway Link Road',
	greenBelt: 'Facing 100 Mtr Fully Developed Green Belt',
	phone: '+919771034916',
	phoneDisplay: '+91 97710 34916',
	wa: 'https://wa.aisensy.com/aabbf5',
	brochure: '/brochures/eternia-brochure.pdf',
	rera: 'UPRERA Registered · Managed by NBCC on behalf of Hon\'ble Supreme Court Receiver',
};

const STATS_CARDS = [
	{ label: 'Expanse', value: '6 Acres', sub: 'Low Density Serene Enclave', icon: Trees },
	{ label: 'Iconic Towers', value: '6 Towers', sub: 'Lotus, Lily, Orchid, Rose, Dahlia, Tulip', icon: Building2 },
	{ label: 'Storeys', value: 'G+30 Floors', sub: 'Symmetrical Skyline Views', icon: Layers },
	{ label: 'Clubhouse', value: '25,000 sq.ft', sub: 'Curated 5-Star Social Club', icon: Sparkles },
	{ label: 'Green Front', value: '100 Mtrs', sub: 'Lush Green Belt View', icon: Wind },
	{ label: 'Elevators', value: '4 Lifts/Tower', sub: '3 High-Speed + 1 Service Lift', icon: Zap },
];

const GENESIS_PHOTOS = [
	{
		id: 0,
		title: 'Water Cascades & Deck Seating',
		subtitle: 'Serene ambient water bodies and floating wooden leisure decks',
		tag: 'Water Architecture',
		img: I.waterCascade,
	},
	{
		id: 1,
		title: 'Illuminated Evening Skyline',
		subtitle: 'Bespoke crown & glass balcony architectural lighting',
		tag: 'Night Perspective',
		img: I.buildingEvening,
	},
	{
		id: 2,
		title: 'Central Podium & High-Rise Towers',
		subtitle: 'Symmetrical design with maximum ventilation & sunlight',
		tag: 'Podium Architecture',
		img: I.buildingCourtyard,
	},
	{
		id: 3,
		title: 'Palm Court & Avenue Frontage',
		subtitle: 'Serene tree-lined walkways along tower boulevards',
		tag: 'Boulevard View',
		img: I.buildingBoulevard,
	},
];

const TOWERS = [
	{ name: 'Lotus (Tower B)', code: 'Tower B', type: '3 BHK Typical', unitsPerFloor: '4 Units', config: '4 Flats per floor of 3 BHK', highlight: 'Independent Garden Facing', img: I.typicalFloorB },
	{ name: 'Lily (Tower A1)', code: 'Tower A1', type: '3 & 4 BHK + Study', unitsPerFloor: '4 Units', config: '2 Flats 3BHK + 2 Flats 4BHK+Study', highlight: 'Corner Views', img: I.typicalFloorA },
	{ name: 'Orchid (Tower A2)', code: 'Tower A2', type: '3 & 4 BHK + Study', unitsPerFloor: '4 Units', config: '2 Flats 3BHK + 2 Flats 4BHK+Study', highlight: 'Central Courtyard', img: I.typicalFloorA },
	{ name: 'Rose (Tower A3)', code: 'Tower A3', type: '3 & 4 BHK + Study', unitsPerFloor: '4 Units', config: '2 Flats 3BHK + 2 Flats 4BHK+Study', highlight: 'Boulevard Facing', img: I.typicalFloorA },
	{ name: 'Dahlia (Tower A4)', code: 'Tower A4', type: '3 & 4 BHK + Study', unitsPerFloor: '4 Units', config: '2 Flats 3BHK + 2 Flats 4BHK+Study', highlight: 'Premium Panoramic', img: I.typicalFloorA },
	{ name: 'Tulip (Tower A5)', code: 'Tower A5', type: '3 & 4 BHK + Study', unitsPerFloor: '4 Units', config: '2 Flats 3BHK + 2 Flats 4BHK+Study', highlight: 'Green Belt Frontage', img: I.typicalFloorA },
];

const MASTER_PLAN_ZONES = [
	{ id: 1, name: 'Club House with Swimming Pool', category: 'Recreation' },
	{ id: 2, name: 'Green Landscape Area', category: 'Nature' },
	{ id: 3, name: 'Toddlers\' Play Area', category: 'Kids' },
	{ id: 4, name: 'Green Lawn', category: 'Nature' },
	{ id: 5, name: 'Water Feature Area', category: 'Water' },
	{ id: 6, name: 'Topiary Garden', category: 'Nature' },
	{ id: 7, name: 'Chip and Putting Greens', category: 'Sports' },
	{ id: 8, name: 'Sitout Plaza', category: 'Community' },
	{ id: 9, name: 'Senior Citizen Garden', category: 'Community' },
	{ id: 10, name: 'Stepped Seating Arena', category: 'Community' },
	{ id: 11, name: 'Multiplay Court (Badminton/Tennis)', category: 'Sports' },
	{ id: 12, name: 'Recreational Swimming Pool', category: 'Water' },
	{ id: 13, name: 'Water Feature & Deck Seating', category: 'Water' },
	{ id: 14, name: 'Jogging & Reflexology Track', category: 'Fitness' },
];

const UNIT_CONFIGS = [
	{
		id: '3bhk',
		name: '3 BHK Spacious Residence',
		tower: 'Tower Lotus (Tower B)',
		saleable: '1,932 sq.ft (179.53 sq.m)',
		builtup: '1,532 sq.ft (142.39 sq.m)',
		carpet: '1,086 sq.ft (100.89 sq.m)',
		balcony: '323 sq.ft (30.00 sq.m)',
		startingPrice: '₹1.81 Cr*',
		currentBSP: '₹2.00 Cr - ₹2.14 Cr',
		rooms: '3 Bedrooms · 3 Luxury Toilets · Living Room · Dining Area · Kitchen with Utility Balcony · 4 Balconies',
		features: [
			'Symmetrical 4-flats per floor cluster (Tower B)',
			'Large living area with seamless cross-ventilation',
			'Master bedroom with wooden-texture vitrified tiles',
			'1350mm SS Glass Railing Balconies'
		],
		planImg: I.plan3bhk,
	},
	{
		id: '3bhk-study',
		name: '3 BHK + Study Residence',
		tower: 'Towers Lily, Orchid, Rose, Dahlia, Tulip (Towers A1–A5)',
		saleable: '2,239 sq.ft (208.02 sq.m)',
		builtup: '1,785 sq.ft (165.88 sq.m)',
		carpet: '1,333 sq.ft (123.92 sq.m)',
		balcony: '291 sq.ft (27.00 sq.m)',
		startingPrice: '₹2.26 Cr*',
		currentBSP: '₹2.48 Cr*',
		rooms: '3 Bedrooms + Dedicated Study/WFH Suite · 4 Toilets (3 Attached + 1 Study Toilet) · Entrance Foyer · Living & Dining · 4 Balconies',
		features: [
			'Dedicated Executive Study Room with attached toilet',
			'Entrance Foyer ensuring total living room privacy',
			'Double-glazed soundproof 3-track UPVC windows with mosquito mesh',
			'Quartz stone modular kitchen counter platform'
		],
		planImg: I.plan3bhkStudy,
	},
	{
		id: '4bhk-study',
		name: '4 BHK + Study Grand Residence',
		tower: 'Towers Lily, Orchid, Rose, Dahlia, Tulip (Towers A1–A5)',
		saleable: '2,625 sq.ft (243.91 sq.m)',
		builtup: '2,088 sq.ft (194.05 sq.m)',
		carpet: '1,599 sq.ft (148.60 sq.m)',
		balcony: '323 sq.ft (30.00 sq.m)',
		startingPrice: '₹2.46 Cr*',
		currentBSP: '₹2.73 Cr - ₹2.91 Cr',
		rooms: '4 Grand Bedrooms + Study Suite · 5 Luxury Bathrooms · Double Entrance Foyer · Palatial Living & Dining · Utility Balcony · 4 Large Balconies',
		features: [
			'Back-to-Back Car Parking option included',
			'Master Suite with Walk-in Dressing Area and attached balcony',
			'Full-height glass sliding doors connecting balconies to living & master rooms',
			'Monolithic Aluminium Shuttering earthquake-resistant framework'
		],
		planImg: I.plan4bhkStudy,
	},
];

const AMENITY_CLUSTERS = [
	{
		title: 'Wellness & Fitness',
		desc: 'Awaken mind and body in spaces crafted for vitality and inner peace.',
		icon: Wind,
		image: I.gymYoga,
		subImage: I.swimmingPool,
		items: [
			'State-of-the-Art Gymnasium & Aerobics Studio',
			'Yoga & Meditation Zen Pavilion',
			'Crystal-Clear Rejuvenating Swimming Pool',
			'Dedicated Jogging & Reflexology Tracks',
			'Multiplay Sports Arena (Badminton & Tennis)'
		]
	},
	{
		title: 'Comfort & Engineering',
		desc: 'Uncompromising engineering tailored for tranquility, green views and ease.',
		icon: Droplets,
		image: I.doubleHeightLobby,
		subImage: I.waterFeature,
		items: [
			'Double-Height Italian Marble Entrance Lobby with Concierge',
			'Dedicated High-Speed EV Car Charging Stations',
			'Serene Water Feature Cascades & Deck Seating',
			'Heat-Resistant Waterproofed Roof Terraces',
			'Monolithic Monobox Framed Structure with Aluminium Shuttering'
		]
	},
	{
		title: 'Community & Leisure',
		desc: 'Spaces designed to spark celebrations, connections, and joyful memories.',
		icon: Layers,
		image: I.billiards,
		subImage: I.seniorGarden,
		items: [
			'Indoor Games Lounge & Championship Billiards Room',
			'Golf Chip & Putting Greens for leisure and training',
			'Toddlers\' Play Room & Kids Outdoor Adventure Park',
			'Senior Citizens\' Tranquil Shaded Garden & Stepped Sitting Plaza',
			'Grand Multipurpose Celebrations Banquet Hall & Palm Court'
		]
	}
];

const SPECIFICATIONS = [
	{
		category: 'Living, Dining & Foyer',
		icon: Sofa,
		details: [
			{ item: 'Flooring', val: 'Glazed Vitrified Tiles (600mm × 1200mm) with high-luster finish' },
			{ item: 'Main Door', val: 'Veneered flush door with seasoned Teak Wood Frame & Smart Digital Lock' },
			{ item: 'Walls & Ceiling', val: 'Low VOC Acrylic Emulsion Paint over POP punning' },
			{ item: 'Security', val: 'Smart Video Door Phone connected to central security gate' },
		]
	},
	{
		category: 'Master Bedroom & Dress',
		icon: Bed,
		details: [
			{ item: 'Flooring', val: 'Glazed Vitrified Tiles with Warm Wooden Texture (200mm × 1200mm)' },
			{ item: 'Balcony Door', val: '3-Track UPVC with Mosquito Wire Mesh & Toughened Clear Glass' },
			{ item: 'Floor-to-Floor Height', val: '3.3 Meters (10.8 ft) expansive ceiling height' },
			{ item: 'Internal Doors', val: 'Laminated Flush Door with Teak Wood Frame' },
		]
	},
	{
		category: 'Modular Kitchen & Utility',
		icon: ChefHat,
		details: [
			{ item: 'Cabinetry', val: 'Full Modular Kitchen with Under-counter & Overhead soft-close cabinets' },
			{ item: 'Countertop', val: 'Premium Quartz Stone Countertop with 600mm dado Vitrified Tiles above counter' },
			{ item: 'Sink', val: 'Stainless Steel Double Bowl Sink with premium swivel mixer faucet' },
			{ item: 'Utility Balcony', val: 'Dedicated Washing Machine, Dishwasher & Drying provision with 1350mm SS railing' },
		]
	},
	{
		category: 'Luxury Bathrooms',
		icon: Droplets,
		details: [
			{ item: 'Flooring', val: 'Anti-skid Vitrified Tiles (600mm × 600mm)' },
			{ item: 'Wall Cladding', val: 'Vitified Tiles (600mm × 1200mm) full-height up to False Ceiling level' },
			{ item: 'CP & Chinaware', val: 'Concealed Diverters, Wall-hung WC & Premium CP Fittings of approved luxury make' },
			{ item: 'Ceiling', val: 'Moisture-resistant Gypsum False Ceiling with integrated LED lighting' },
		]
	},
	{
		category: 'Façade, Lobbies & Elevators',
		icon: Building2,
		details: [
			{ item: 'Grand Entrance Lobby', val: 'Double-Height Lobby in Italian Marble & Granite with cove lighting' },
			{ item: 'Balcony Railing', val: '1350mm high Stainless Steel Railing with Toughened Clear Glass' },
			{ item: 'Elevators', val: 'Three High-Speed Passenger Lifts + One Dedicated Service Stretcher Lift per Tower' },
			{ item: 'Power Backup', val: '100% DG Power Backup with dual meter smart billing infrastructure' },
		]
	}
];

const LOCATION_ADVANTAGES = [
	{
		category: 'Healthcare & Hospitals',
		items: [
			{ name: 'Yatharth Super Speciality Hospital', time: '6 Mins', dist: '2.5 km' },
			{ name: 'Numed Super Speciality Hospital', time: '8 Mins', dist: '3.8 km' },
			{ name: 'Fortis Hospital Noida', time: '19 Mins', dist: '11.0 km' },
			{ name: 'Kailash Hospital & Heart Institute', time: '25 Mins', dist: '14.5 km' },
		]
	},
	{
		category: 'Schools & Global Academies',
		items: [
			{ name: 'Ryan International School', time: '4 Mins', dist: '1.8 km' },
			{ name: 'Pacific World School', time: '6 Mins', dist: '2.9 km' },
			{ name: 'The Shri Ram Universal School', time: '6 Mins', dist: '3.1 km' },
			{ name: 'Lotus Valley International School', time: '8 Mins', dist: '4.2 km' },
			{ name: 'JBM Smart Start', time: '7 Mins', dist: '3.5 km' },
		]
	},
	{
		category: 'Business Parks & MNCs',
		items: [
			{ name: 'R Systems International', time: '6 Mins', dist: '2.8 km' },
			{ name: 'Artha Infratech & IT SEZ', time: '6 Mins', dist: '3.0 km' },
			{ name: 'Golden I Commercial Hub', time: '7 Mins', dist: '3.6 km' },
			{ name: 'Yotta Data Center Park', time: '10 Mins', dist: '5.2 km' },
		]
	},
	{
		category: 'Malls, Hotels & Transit',
		items: [
			{ name: 'Blue Sapphire Mall', time: '6 Mins', dist: '3.2 km' },
			{ name: 'D-Mart Superstore', time: '7 Mins', dist: '3.4 km' },
			{ name: 'Gaur City Mall & Center', time: '9 Mins', dist: '4.5 km' },
			{ name: 'Noida International Airport (Jewar)', time: '55 Mins', dist: 'Direct EPE Access' },
			{ name: 'Indira Gandhi Intl Airport (IGI)', time: '60 Mins', dist: 'Via DME Expressway' },
		]
	}
];

const PRICING_SLABS = [
	{
		floor: '1st to 5th Floor',
		bhk3_1932: { offer: '₹1,95,13,200', current: '₹2,14,45,200' },
		bhk4_2625: { offer: '₹2,65,12,500', current: '₹2,91,37,500' },
	},
	{
		floor: '6th to 10th Floor',
		bhk3_1932: { offer: '₹1,93,20,000', current: '₹2,12,52,000' },
		bhk4_2625: { offer: '₹2,62,50,000', current: '₹2,88,75,000' },
	},
	{
		floor: '11th to 15th Floor',
		bhk3_1932: { offer: '₹1,91,26,800', current: '₹2,10,58,800' },
		bhk4_2625: { offer: '₹2,59,87,500', current: '₹2,86,12,500' },
	},
	{
		floor: '16th to 20th Floor',
		bhk3_1932: { offer: '₹1,89,33,600', current: '₹2,08,65,600' },
		bhk4_2625: { offer: '₹2,57,25,000', current: '₹2,83,50,000' },
	},
	{
		floor: '21st to 25th Floor',
		bhk3_1932: { offer: '₹1,87,40,400', current: '₹2,06,72,400' },
		bhk4_2625: { offer: '₹2,54,62,500', current: '₹2,80,87,500' },
	},
	{
		floor: '26th to 30th Floor (Top)',
		bhk3_1932: { offer: '₹1,81,60,800', current: '₹2,00,92,800' },
		bhk4_2625: { offer: '₹2,46,75,000', current: '₹2,73,00,000' },
	},
];

const ADDITIONAL_CHARGES_LIST = [
	{ name: 'Covered Car Parking', cost: '₹5,00,000', note: 'Standard covered bay' },
	{ name: 'Back-to-Back Car Parking', cost: '₹8,50,000', note: 'Mandatory for 4 BHK units' },
	{ name: 'Club Membership (25k sq.ft Club)', cost: '₹5,00,000', note: 'Lifetime family access' },
	{ name: 'Power Backup Provision', cost: '₹35,000 / KVA', note: 'Dedicated continuous power' },
	{ name: 'Electricity Infra & Dual Meter', cost: '₹1,00,000', note: 'State-of-the-art grid infra' },
	{ name: 'Maintenance (Prepaid 2 Years)', cost: '₹2.99 / sq.ft / mo', note: '+ GST 18%' },
	{ name: 'IFMS (Interest-Free Security)', cost: '₹25 / sq.ft', note: 'Payable at possession' },
	{ name: 'GST', cost: 'NIL (0%)', note: 'As per Supreme Court Guideline GST is not applicable*' },
];

const CLP_PLAN = [
	{ stage: 'Booking Amount', pct: 10, timeline: 'Immediate on booking' },
	{ stage: 'Booking + 45 Days', pct: 10, timeline: 'Allotment stage' },
	{ stage: 'On Start of Raft Foundation', pct: 5, timeline: 'Foundation stage' },
	{ stage: 'On Start of Casting of Lower Basement', pct: 5, timeline: 'Substructure stage' },
	{ stage: 'On Completion of Ground Floor', pct: 10, timeline: 'Plinth completion' },
	{ stage: 'On Completion of 4th Floor Roof', pct: 7.5, timeline: 'Tower casting' },
	{ stage: 'On Completion of 9th Floor Roof', pct: 7.5, timeline: 'Mid-rise casting' },
	{ stage: 'On Completion of 14th Floor Roof', pct: 7.5, timeline: 'Mid-rise casting' },
	{ stage: 'On Completion of 19th Floor Roof', pct: 7.5, timeline: 'High-rise casting' },
	{ stage: 'On Completion of 24th Floor Roof', pct: 7.5, timeline: 'High-rise casting' },
	{ stage: 'On Completion of 29th Floor Roof', pct: 5, timeline: 'Upper floor casting' },
	{ stage: 'On Completion of Super Structure', pct: 7.5, timeline: 'Civil structure done' },
	{ stage: 'On Start of MEP / Flooring / Finishing', pct: 5, timeline: 'Interior fitouts' },
	{ stage: 'On Intimation of Possession', pct: 5, timeline: 'Registry & Handover' },
];

/* ─── FADEUP HELPER ─── */
const FadeUp = ({ children, delay = 0, className = '' }) => {
	const [inView, setInView] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setInView(true);
				obs.disconnect();
			}
		}, { threshold: 0.1 });
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			style={{ transitionDelay: `${delay}ms` }}
			className={`transition-all duration-700 ease-out transform ${
				inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
			} ${className}`}
		>
			{children}
		</div>
	);
};

/* ─── INTERACTIVE ZOOM / PAN FLOOR PLAN VIEWER ─── */
const FloorPlanZoomViewer = ({ imgUrl, title, area, startingPrice }) => {
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [panning, setPanning] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });

	const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

	const onDown = (e) => {
		if (zoom <= 1) return;
		setPanning(true);
		dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
	};
	const onMove = (e) => {
		if (!panning || zoom <= 1) return;
		setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
	};
	const onUp = () => setPanning(false);

	return (
		<div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-rose-500/20 bg-slate-950">
			{/* Controls Toolbar */}
			<div className="bg-slate-900/90 px-4 py-3 flex items-center justify-between border-b border-rose-950/40 text-xs">
				<div className="flex items-center gap-2">
					<span className="font-bold text-white">{title}</span>
					<span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">{area}</span>
				</div>
				<div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-slate-800">
					<button
						onClick={() => setZoom(z => Math.max(1, +(z - 0.4).toFixed(1)))}
						disabled={zoom <= 1}
						className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/5"
						title="Zoom Out"
					>
						<ZoomOut size={14} />
					</button>
					<span className="text-[11px] font-mono w-10 text-center text-slate-300 font-bold">{zoom.toFixed(1)}x</span>
					<button
						onClick={() => setZoom(z => Math.min(3, +(z + 0.4).toFixed(1)))}
						disabled={zoom >= 3}
						className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/5"
						title="Zoom In"
					>
						<ZoomIn size={14} />
					</button>
					{zoom > 1 && (
						<button
							onClick={reset}
							className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-white/5"
							title="Reset View"
						>
							<RotateCcw size={14} />
						</button>
					)}
				</div>
			</div>

			{/* Interactive Canvas Viewport */}
			<div
				className="relative h-[360px] sm:h-[480px] overflow-hidden flex items-center justify-center p-4 select-none"
				style={{ cursor: zoom > 1 ? (panning ? 'grabbing' : 'grab') : 'default' }}
				onMouseDown={onDown}
				onMouseMove={onMove}
				onMouseUp={onUp}
				onMouseLeave={onUp}
			>
				<div
					style={{
						transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
						transformOrigin: 'center',
						transition: panning ? 'none' : 'transform 0.2s ease',
					}}
					className="w-full h-full flex items-center justify-center"
				>
					<img
						src={imgUrl}
						alt={title}
						className="max-h-full max-w-full object-contain pointer-events-none rounded-lg"
					/>
				</div>

				{zoom > 1 && (
					<div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-slate-300 border border-slate-700">
						Click &amp; Drag to Pan
					</div>
				)}

				<div className="absolute bottom-3 right-3 bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-300 text-xs font-bold px-3 py-1 rounded-full">
					Starting {startingPrice}
				</div>
			</div>
		</div>
	);
};

export default function EterniaPage() {
	const [hoveredGenesisPhoto, setHoveredGenesisPhoto] = useState(0);
	const [activeTab, setActiveTab] = useState('3bhk');
	const [activeSpecCat, setActiveSpecCat] = useState(0);
	const [activeLocCat, setActiveLocCat] = useState(0);
	const [activeTower, setActiveTower] = useState(0);
	const [activeZoneFilter, setActiveZoneFilter] = useState('All');
	const [lightboxImg, setLightboxImg] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [leadData, setLeadData] = useState({ name: '', phone: '', email: '', message: 'Interested in Eternia 3 & 4 BHK' });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const selectedUnit = UNIT_CONFIGS.find(u => u.id === activeTab) || UNIT_CONFIGS[0];

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await api.post('/leads', {
				...leadData,
				project: 'Eternia - Techzone 4',
				source: 'eternia_page',
			});
			setSubmitSuccess(true);
			setTimeout(() => {
				setIsModalOpen(false);
				setSubmitSuccess(false);
			}, 2500);
		} catch (err) {
			console.error('Lead error', err);
			setSubmitSuccess(true);
			setTimeout(() => {
				setIsModalOpen(false);
				setSubmitSuccess(false);
			}, 2500);
		} finally {
			setIsSubmitting(false);
		}
	};

	const filteredZones = activeZoneFilter === 'All'
		? MASTER_PLAN_ZONES
		: MASTER_PLAN_ZONES.filter(z => z.category === activeZoneFilter);

	return (
		<Layout noPadding>
			<div className="fixed top-14 inset-x-0 h-[1.5px] z-[9998] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent pointer-events-none" />
			<Helmet>
				<title>Eternia Techzone 4 Greater Noida West | 3 & 4 BHK Luxury Residences</title>
				<meta name="description" content="Eternia by Great Value Realty & Sanskar Realty. Inspired by the Anthurium. 6 Acres, 6 Towers G+30 Floors on 130m Expressway with 100m Green Belt facing. 3 & 4 BHK from ₹1.81 Cr*." />
				<link rel="canonical" href="https://instamakaan.com/sell-companies/eternia" />
				<meta property="og:title" content="Eternia | Where Space Breathes and Legacies Bloom" />
				<meta property="og:description" content="Luxury 3 & 4 BHK Residences in Techzone 4, Greater Noida (W). 20:80 Payment Plan available." />
			</Helmet>

			<style>{`
				.et-bg-theme {
					background-color: #fff9fa;
					background-image: 
						radial-gradient(at 0% 0%, rgba(254, 205, 211, 0.35) 0px, transparent 50%),
						radial-gradient(at 100% 0%, rgba(253, 164, 175, 0.25) 0px, transparent 50%),
						radial-gradient(at 50% 50%, rgba(255, 228, 230, 0.2) 0px, transparent 60%),
						radial-gradient(at 100% 100%, rgba(254, 205, 211, 0.3) 0px, transparent 50%);
				}
				.dark .et-bg-theme {
					background-color: #0b0c10;
					background-image: 
						radial-gradient(at 0% 0%, rgba(136, 19, 55, 0.28) 0px, transparent 50%),
						radial-gradient(at 100% 0%, rgba(159, 18, 57, 0.22) 0px, transparent 50%),
						radial-gradient(at 50% 50%, rgba(76, 5, 25, 0.15) 0px, transparent 60%),
						radial-gradient(at 100% 100%, rgba(136, 19, 55, 0.25) 0px, transparent 50%);
				}
				.et-glass-panel {
					background: rgba(255, 255, 255, 0.88);
					backdrop-filter: blur(20px);
					border: 1px solid rgba(244, 63, 94, 0.18);
				}
				.dark .et-glass-panel {
					background: rgba(17, 13, 21, 0.75);
					backdrop-filter: blur(20px);
					border: 1px solid rgba(244, 63, 94, 0.24);
				}
				.et-rose-gold-gradient {
					background: linear-gradient(135deg, #be123c 0%, #e11d48 40%, #fb7185 75%, #f43f5e 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
				.dark .et-rose-gold-gradient {
					background: linear-gradient(135deg, #fecdd3 0%, #fda4af 30%, #fb7185 65%, #f43f5e 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
				.et-shadow-rose {
					box-shadow: 0 15px 40px -10px rgba(225, 29, 72, 0.15);
				}
				.dark .et-shadow-rose {
					box-shadow: 0 15px 40px -10px rgba(225, 29, 72, 0.28);
				}
			`}</style>

			<main className="et-bg-theme text-slate-900 dark:text-slate-100 min-h-screen selection:bg-rose-500 selection:text-white font-sans transition-colors duration-500 overflow-x-hidden">

				{/* ══════════════════════════════════════════════════════════════
				    1. HAUTE ARCHITECTURE HERO SECTION
				══════════════════════════════════════════════════════════════ */}
				<section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-rose-100/50 via-rose-50/20 to-transparent dark:from-[#1b0610] dark:via-[#0f070c] dark:to-transparent transition-colors duration-500">
					
					{/* Radiant Crimson Glow Orbs */}
					<div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-400/20 dark:bg-rose-600/18 rounded-full blur-[150px] pointer-events-none" />
					<div className="absolute top-10 left-10 w-96 h-96 bg-pink-400/15 dark:bg-pink-600/12 rounded-full blur-[120px] pointer-events-none" />
					<div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300/25 dark:bg-purple-900/18 rounded-full blur-[130px] pointer-events-none" />

					{/* Subtle Background Geometric Pattern */}
					<div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.08] dark:opacity-[0.12] pointer-events-none" />

					<div className="container mx-auto max-w-7xl relative z-10">
						<div className="text-center max-w-4xl mx-auto mb-10">
							
							{/* Anthurium Badge */}
							<FadeUp delay={100}>
								<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-200 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 backdrop-blur-xl shadow-lg shadow-rose-500/5 dark:shadow-rose-950/50 mb-6">
									<Sparkles size={14} className="text-rose-600 dark:text-rose-400 animate-pulse" />
									<span className="text-[11px] md:text-xs font-bold tracking-[0.25em] text-rose-700 dark:text-rose-200 uppercase">
										Anthurium-Inspired Architecture
									</span>
									<span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
									<span className="text-[10px] text-rose-600/80 dark:text-rose-300/80 font-semibold">Techzone-4, Greater Noida (W)</span>
								</div>
							</FadeUp>

							{/* Grand Title */}
							<FadeUp delay={200}>
								<h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6 drop-shadow-sm">
									ETERNIA
								</h1>
							</FadeUp>

							{/* Tagline */}
							<FadeUp delay={300}>
								<p className="text-xl sm:text-2xl lg:text-3xl font-light text-rose-900 dark:text-rose-100/90 leading-relaxed mb-6 font-serif italic">
									"Where Space Breathes and Legacies Bloom."
								</p>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300/80 max-w-2xl mx-auto font-light leading-relaxed mb-8">
									A pristine 6-Acre sanctuary on the 130-meter expressway facing an uninterrupted 100-meter lush green belt. Featuring G+30 floor towers of symmetrical grandeur.
								</p>
							</FadeUp>

							{/* Action Strip */}
							<FadeUp delay={400}>
								<div className="flex flex-wrap items-center justify-center gap-4">
									<button
										onClick={() => setIsModalOpen(true)}
										className="px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-rose-600/30 hover:shadow-rose-500/50 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
									>
										<span>Book VIP Site Tour &amp; Price List</span>
										<ArrowRight size={16} />
									</button>
									<a
										href={PROJECT.wa}
										target="_blank"
										rel="noopener noreferrer"
										className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-semibold tracking-wide shadow-md backdrop-blur-lg transition-all duration-300 flex items-center gap-2"
									>
										<MessageCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
										<span>WhatsApp Instant Inquiry</span>
									</a>
								</div>
							</FadeUp>

							{/* Trust Pill */}
							<FadeUp delay={500}>
								<div className="mt-8 flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
									<span className="flex items-center gap-1.5 font-medium text-rose-700 dark:text-rose-300">
										<Shield size={14} className="text-rose-600 dark:text-rose-400" /> SC Monitored &amp; NBCC Managed
									</span>
									<span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
									<span className="text-slate-700 dark:text-slate-300 font-medium">Architects: Vastunidhi (VNA)</span>
									<span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
									<span className="text-slate-700 dark:text-slate-300 font-medium">Construction: Dee Vee Projects (DVPL)</span>
								</div>
							</FadeUp>
						</div>

						{/* Hero Cinematic Feature Card with Actual Render */}
						<FadeUp delay={600}>
							<div className="relative rounded-3xl overflow-hidden border border-rose-200 dark:border-rose-500/20 shadow-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl">
								<div className="relative h-80 sm:h-[480px] w-full overflow-hidden">
									<img
										src={I.heroBg}
										alt="Eternia 6 Iconic Towers Render"
										className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
									
									{/* Floating Highlights Inside Hero */}
									<div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
										<div className="bg-white/95 dark:bg-slate-950/85 backdrop-blur-md border border-rose-200 dark:border-rose-500/30 rounded-2xl p-4 sm:p-5 max-w-md shadow-lg">
											<p className="text-[10px] uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400 mb-1">Special Payment Plan</p>
											<p className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">20 : 80 No Pre-EMI Scheme</p>
											<p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">Customer contribution only 20% till 30th floor roof casting.</p>
										</div>

										<div className="flex items-center gap-3 bg-white/95 dark:bg-slate-950/85 backdrop-blur-md border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 shadow-lg">
											<div className="text-right">
												<p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Starting Price</p>
												<p className="text-2xl font-bold text-rose-600 dark:text-rose-400">₹1.81 Cr*</p>
											</div>
											<div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
											<div>
												<p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Typology</p>
												<p className="text-sm font-bold text-slate-900 dark:text-white">3 &amp; 4 BHK Suites</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</FadeUp>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    2. KEY STATS - BENTO METRICS
				══════════════════════════════════════════════════════════════ */}
				<section className="py-12 border-y border-slate-200 dark:border-rose-950/50 bg-white/80 dark:bg-[#0d0e14]/80 backdrop-blur-md transition-colors duration-300">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
							{STATS_CARDS.map((stat, i) => {
								const Icon = stat.icon;
								return (
									<FadeUp key={i} delay={i * 80} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-rose-500/10 hover:border-rose-400 dark:hover:border-rose-500/40 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 shadow-sm group">
										<div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
											<Icon size={20} />
										</div>
										<p className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
										<p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-1">{stat.label}</p>
										<p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{stat.sub}</p>
									</FadeUp>
								);
							})}
						</div>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    3. THE ANTHURIUM INSPIRATION & ARCHITECTURE
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 px-4 md:px-8 relative overflow-hidden">
					<div className="container mx-auto max-w-7xl">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
							
							{/* Left Column: Interactive Expanding Building Photo Accordion */}
							<div className="lg:col-span-6 relative">
								<FadeUp>
									<div className="flex flex-col sm:flex-row gap-3 h-[490px] w-full select-none">
										{GENESIS_PHOTOS.map((photo, idx) => {
											const isHovered = hoveredGenesisPhoto === idx;
											return (
												<div
													key={photo.id}
													onMouseEnter={() => setHoveredGenesisPhoto(idx)}
													onClick={() => setLightboxImg(photo.img)}
													className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out border border-rose-200 dark:border-rose-500/20 shadow-xl group ${
														isHovered
															? 'flex-[4] sm:flex-[5] ring-2 ring-rose-500/60 shadow-rose-500/20'
															: 'flex-[1] opacity-75 hover:opacity-95'
													}`}
												>
													{/* Image with subtle zoom on active */}
													<img
														src={photo.img}
														alt={photo.title}
														className={`w-full h-full object-cover transition-transform duration-1000 ${
															isHovered ? 'scale-105' : 'scale-100 filter brightness-90 grayscale-[25%]'
														}`}
													/>
													
													{/* Gradient Overlays */}
													<div className={`absolute inset-0 transition-opacity duration-500 ${
														isHovered 
															? 'bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent opacity-95' 
															: 'bg-black/50 hover:bg-black/30'
													}`} />

													{/* Details when Expanded */}
													{isHovered ? (
														<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white animate-in fade-in slide-in-from-bottom-2 duration-300">
															<span className="inline-block text-[10px] uppercase font-bold tracking-widest text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-500/40 mb-2">
																{photo.tag}
															</span>
															<h4 className="text-lg sm:text-xl font-serif font-bold text-white drop-shadow-md">
																{photo.title}
															</h4>
															<p className="text-xs text-rose-100/90 font-light mt-1 max-w-sm drop-shadow">
																{photo.subtitle}
															</p>
															<div className="mt-3 flex items-center gap-1.5 text-[11px] text-rose-300 font-semibold">
																<Eye size={13} />
																<span>Click to expand photo</span>
															</div>
														</div>
													) : (
														/* Collapsed State Title Preview */
														<div className="absolute inset-0 flex items-center justify-center p-2">
															<span className="hidden sm:block text-xs font-bold text-white/90 uppercase tracking-widest -rotate-90 whitespace-nowrap drop-shadow-md">
																{photo.tag}
															</span>
															<span className="sm:hidden text-xs font-bold text-white uppercase tracking-wider drop-shadow">
																{photo.tag}
															</span>
														</div>
													)}

													{/* Number indicator */}
													<div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center justify-center border border-white/20">
														0{idx + 1}
													</div>
												</div>
											);
										})}
									</div>
								</FadeUp>
							</div>

							{/* Right Text Content */}
							<div className="lg:col-span-6 space-y-6">
								<FadeUp delay={150}>
									<div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
										The Genesis of Eternia
									</div>
									<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
										Spacious Residences For <br />
										<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-400 dark:from-rose-400 dark:via-pink-400 dark:to-rose-200">
											Unconstrained Grand Living
										</span>
									</h2>
									<p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg font-light leading-relaxed">
										Inspired by the Anthurium flower, a timeless symbol of hospitality, vitality, and architectural purity, Eternia stands proudly in the most coveted address of Greater Noida West.
									</p>
									<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-light leading-relaxed">
										Every residence is carved to maximise usable square footage while significantly lowering saleable wastage ratio. With 3.3-meter ceiling heights, Italian marble entrance lobbies, and double-glazed façade glazing, the homes establish a new benchmark in contemporary ultra-luxury.
									</p>

									{/* Feature Bullets */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
										{[
											'100 Meter Lush Green Belt Frontage',
											'Direct frontage on 130m wide artery',
											'Monolithic Earthquake-resistant build',
											'4 High-Speed Lifts in each tower',
											'Double-Height Grand Italian Lobby',
											'25,000 sq.ft Curated Clubhouse'
										].map((feat, idx) => (
											<div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
												<div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center flex-shrink-0 text-rose-600 dark:text-rose-400">
													<Check size={14} />
												</div>
												<span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{feat}</span>
											</div>
										))}
									</div>
								</FadeUp>
							</div>
						</div>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    4. INTERACTIVE 6-ACRE MASTER SITE PLAN & 14 AMENITY ZONES
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 bg-white/70 dark:bg-[#0d0e14]/70 border-y border-slate-200 dark:border-slate-800 px-4 md:px-8 relative backdrop-blur-md">
					<div className="container mx-auto max-w-7xl">
						<div className="text-center max-w-3xl mx-auto mb-14">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Township Master Plan</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									6-Acre Symmetrical Master Layout
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Explore all 14 curated amenity zones and 6 grand residential towers facing the 100m green belt.
								</p>
							</FadeUp>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
							{/* Master Plan Zoom Canvas */}
							<div className="lg:col-span-8">
								<FadeUp>
									<FloorPlanZoomViewer
										imgUrl={I.masterSitePlan}
										title="Eternia 6-Acre Color Master Site Plan"
										area="6 Acres · 6 Towers"
										startingPrice="14 Numbered Zones"
									/>
								</FadeUp>
							</div>

							{/* Directory of 14 Numbered Zones */}
							<div className="lg:col-span-4 space-y-4">
								<FadeUp delay={100}>
									<div className="et-glass-panel et-shadow-rose rounded-2xl p-5">
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
												<Compass size={16} className="text-rose-600 dark:text-rose-400" />
												<span>14 Master Plan Zones</span>
											</h3>
											<span className="text-[10px] text-slate-500 font-semibold">{filteredZones.length} items</span>
										</div>

										{/* Filter category pills */}
										<div className="w-full overflow-x-auto no-scrollbar py-1 flex gap-1.5 flex-nowrap sm:flex-wrap mb-4">
											{['All', 'Recreation', 'Nature', 'Water', 'Sports', 'Kids', 'Community'].map((cat) => (
												<button
													key={cat}
													onClick={() => setActiveZoneFilter(cat)}
													className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap flex-shrink-0 ${
														activeZoneFilter === cat
															? 'bg-rose-600 text-white shadow-sm'
															: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
													}`}
												>
													{cat}
												</button>
											))}
										</div>

										{/* Zones List */}
										<div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
											{filteredZones.map((z) => (
												<div
													key={z.id}
													className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
												>
													<div className="flex items-center gap-2.5">
														<span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-[10px] flex items-center justify-center">
															{z.id}
														</span>
														<span className="font-medium text-slate-800 dark:text-slate-200">{z.name}</span>
													</div>
													<span className="text-[9px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
														{z.category}
													</span>
												</div>
											))}
										</div>
									</div>
								</FadeUp>
							</div>
						</div>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    5. TOWERS DIRECTORY & FLOOR CLUSTERS
				══════════════════════════════════════════════════════════════ */}
				<section className="py-20 px-4 md:px-8">
					<div className="container mx-auto max-w-7xl">
						<div className="text-center max-w-3xl mx-auto mb-14">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Towers &amp; Floor Clusters</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									6 Iconic G+30 Towers
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Discover the cluster layout of 4 flats per floor with zero common walls on 3 sides.
								</p>
							</FadeUp>
						</div>

						{/* Tower Selector Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
							{TOWERS.map((tw, i) => (
								<FadeUp key={i} delay={i * 80}>
									<div
										onClick={() => setActiveTower(i)}
										className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border shadow-sm ${
											activeTower === i
												? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-500/10 dark:shadow-rose-950/50 ring-1 ring-rose-500'
												: 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/40 hover:bg-slate-50 dark:hover:bg-slate-900'
										}`}
									>
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-2.5">
												<div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center text-sm">
													{tw.name.split(' ')[0][0]}
												</div>
												<h3 className="text-lg font-bold text-slate-900 dark:text-white">{tw.name}</h3>
											</div>
											<span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-500/30">
												G+30 Storeys
											</span>
										</div>

										<p className="text-xs text-rose-700 dark:text-rose-200 font-semibold mb-1">{tw.type}</p>
										<p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{tw.config}</p>
										
										<div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
											<span className="text-slate-500 dark:text-slate-400">Orientation:</span>
											<span className="font-bold text-slate-800 dark:text-white">{tw.highlight}</span>
										</div>
									</div>
								</FadeUp>
							))}
						</div>

						{/* Tower Floor Cluster Plan Viewer */}
						<FadeUp key={activeTower}>
							<div className="et-glass-panel et-shadow-rose rounded-3xl p-6 sm:p-8">
								<div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
									<div>
										<span className="text-xs uppercase font-bold text-rose-600 dark:text-rose-400">{TOWERS[activeTower].code} Typical Floor Cluster</span>
										<h4 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
											{TOWERS[activeTower].name} — {TOWERS[activeTower].config}
										</h4>
									</div>
									<button
										onClick={() => setLightboxImg(TOWERS[activeTower].img)}
										className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
									>
										<Eye size={14} /> Fullscreen Plan
									</button>
								</div>

								<div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2 flex items-center justify-center">
									<img
										src={TOWERS[activeTower].img}
										alt={`${TOWERS[activeTower].name} Typical Floor Cluster Plan`}
										className="max-h-[500px] w-auto object-contain rounded-xl"
									/>
								</div>
							</div>
						</FadeUp>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    6. INTERACTIVE 2D/3D FLOOR PLANS (WITH ZOOM / PAN)
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 px-4 md:px-8 bg-white/70 dark:bg-[#0d0e14]/70 border-y border-slate-200 dark:border-slate-800 backdrop-blur-md">
					<div className="container mx-auto max-w-7xl">
						<div className="text-center max-w-3xl mx-auto mb-14">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Architectural Blueprints</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									Spacious Unit Floor Plans
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Detailed dimension plans for 3 BHK, 3 BHK + Study, and 4 BHK + Study units with interactive zoom &amp; pan controls.
								</p>
							</FadeUp>
						</div>

						{/* Typology Switcher Tabs */}
						<div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:justify-center mb-8 sm:mb-10">
							<div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-2 flex-nowrap min-w-max shadow-sm">
								{UNIT_CONFIGS.map((cfg) => (
									<button
										key={cfg.id}
										onClick={() => setActiveTab(cfg.id)}
										className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
											activeTab === cfg.id
												? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30'
												: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
										}`}
									>
										<span>{cfg.name.split(' Residence')[0]}</span>
										<span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${activeTab === cfg.id ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-rose-700 dark:text-rose-300'}`}>
											{cfg.saleable.split(' ')[0]} sq.ft
										</span>
									</button>
								))}
							</div>
						</div>

						{/* Active Unit Detailed Showcase Card */}
						<FadeUp key={selectedUnit.id}>
							<div className="et-glass-panel et-shadow-rose rounded-3xl p-6 sm:p-10 transition-all duration-300">
								<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
									
									{/* Left Column: Blueprint Details */}
									<div className="lg:col-span-5 space-y-6">
										<div>
											<span className="text-xs uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
												{selectedUnit.tower}
											</span>
											<h3 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-1">
												{selectedUnit.name}
											</h3>
											<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-light">
												{selectedUnit.rooms}
											</p>
										</div>

										{/* Area Matrix Grid */}
										<div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800">
											<div>
												<p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Saleable Area</p>
												<p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedUnit.saleable}</p>
											</div>
											<div>
												<p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Built-Up Area</p>
												<p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedUnit.builtup}</p>
											</div>
											<div>
												<p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Carpet Area</p>
												<p className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">{selectedUnit.carpet}</p>
											</div>
											<div>
												<p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Balcony Area</p>
												<p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedUnit.balcony}</p>
											</div>
											<div>
												<p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Offer Price</p>
												<p className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">{selectedUnit.startingPrice}</p>
											</div>
											<div>
												<p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Standard BSP</p>
												<p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{selectedUnit.currentBSP}</p>
											</div>
										</div>

										{/* Key Architectural Features */}
										<div className="space-y-2">
											<p className="text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300">Layout Inclusions:</p>
											{selectedUnit.features.map((f, i) => (
												<div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
													<CheckCircle2 size={14} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
													<span>{f}</span>
												</div>
											))}
										</div>

										{/* Actions */}
										<div className="flex flex-wrap gap-3 pt-2">
											<button
												onClick={() => setIsModalOpen(true)}
												className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center gap-2"
											>
												<Download size={14} /> Download CAD Drawing
											</button>
											<button
												onClick={() => setIsModalOpen(true)}
												className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-slate-300 dark:border-slate-700"
											>
												<Calculator size={14} /> Cost Calculator
											</button>
										</div>
									</div>

									{/* Right Column: Interactive Zoom Canvas */}
									<div className="lg:col-span-7">
										<FloorPlanZoomViewer
											imgUrl={selectedUnit.planImg}
											title={selectedUnit.name}
											area={selectedUnit.saleable}
											startingPrice={selectedUnit.startingPrice}
										/>
									</div>
								</div>
							</div>
						</FadeUp>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    7. LUXURY INTERIORS & LIVING SPACES
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 px-4 md:px-8">
					<div className="container mx-auto max-w-7xl">
						<div className="text-center max-w-3xl mx-auto mb-14">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Interiors &amp; Craftsmanship</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									Spacious Living Sculpted for Comfort
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Experience modular kitchen layouts, sunlit living rooms, and private walk-in dressing suites.
								</p>
							</FadeUp>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<FadeUp>
								<div className="et-glass-panel et-shadow-rose rounded-3xl overflow-hidden p-4 group">
									<div className="relative rounded-2xl overflow-hidden h-72 sm:h-96">
										<img
											src={I.livingRoom}
											alt="Eternia Living Room Interior"
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
										<div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 dark:bg-black/70 backdrop-blur-md border border-rose-200 dark:border-rose-500/30">
											<h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Living &amp; Dining Grandeur</h4>
											<p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
												Expansive vitrified floors, double-glazed soundproof glass walls, and wide balcony transitions.
											</p>
										</div>
									</div>
								</div>
							</FadeUp>

							<FadeUp delay={150}>
								<div className="et-glass-panel et-shadow-rose rounded-3xl overflow-hidden p-4 group">
									<div className="relative rounded-2xl overflow-hidden h-72 sm:h-96">
										<img
											src={I.masterBedKitchen}
											alt="Eternia Master Bedroom & Kitchen"
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
										<div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 dark:bg-black/70 backdrop-blur-md border border-rose-200 dark:border-rose-500/30">
											<h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Master Bedroom &amp; Modular Kitchen</h4>
											<p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
												Glazed wooden vitrified tiles, Quartz countertops, double bowl stainless steel sinks, and walk-in dressing.
											</p>
										</div>
									</div>
								</div>
							</FadeUp>
						</div>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    8. 25,000 SQ.FT CURATED CLUBHOUSE & AMENITIES
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 bg-white/70 dark:bg-[#0d0e14]/70 border-y border-slate-200 dark:border-slate-800 px-4 md:px-8 relative backdrop-blur-md">
					<div className="container mx-auto max-w-7xl">
						<div className="text-center max-w-3xl mx-auto mb-16">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Clubhouse &amp; Lifestyle</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									25,000 Sq.Ft of Curated Indulgence
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Experience a harmonious balance of wellness, leisure, comfort and lively community under one elegant roof.
								</p>
							</FadeUp>
						</div>

						{/* Clubhouse Hero Showcase */}
						<FadeUp className="mb-12">
							<div className="et-glass-panel et-shadow-rose rounded-3xl overflow-hidden p-4">
								<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
									<div className="lg:col-span-7 rounded-2xl overflow-hidden h-72 sm:h-96 relative">
										<img
											src={I.clubhouseExterior}
											alt="Eternia 25,000 sq.ft Clubhouse Exterior"
											className="w-full h-full object-cover"
										/>
										<div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-400 text-white text-xs font-bold">
											Approx. 25,000 sq.ft Clubhouse
										</div>
									</div>
									<div className="lg:col-span-5 p-4 space-y-4">
										<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Grand Social Club</span>
										<h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
											Wellness, Comfort &amp; Community Under One Roof
										</h3>
										<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
											Designed with high-vaulted ceilings, double-height reception lobby, private mini-theater/games lounge, banquet facilities, and sun deck infinity pool.
										</p>
										<div className="grid grid-cols-2 gap-3 pt-2">
											<div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800">
												<p className="text-xs font-bold text-slate-900 dark:text-white">Infinity Pool Deck</p>
												<p className="text-[10px] text-slate-500">Crystal clear pool</p>
											</div>
											<div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800">
												<p className="text-xs font-bold text-slate-900 dark:text-white">Gym &amp; Aerobics</p>
												<p className="text-[10px] text-slate-500">High-tech studio</p>
											</div>
										</div>
										<button
											onClick={() => setLightboxImg(I.clubhousePlan)}
											className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
										>
											<Eye size={14} /> View Clubhouse Floor Plan
										</button>
									</div>
								</div>
							</div>
						</FadeUp>

						{/* 3 Main Curated Clusters */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{AMENITY_CLUSTERS.map((cls, idx) => {
								const Icon = cls.icon;
								return (
									<FadeUp key={idx} delay={idx * 120}>
										<div className="et-glass-panel et-shadow-rose rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col justify-between">
											<div>
												<div className="relative h-48 w-full overflow-hidden">
													<img
														src={cls.image}
														alt={cls.title}
														className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
													<div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-300 flex items-center justify-center">
														<Icon size={20} />
													</div>
												</div>

												<div className="p-6">
													<h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">{cls.title}</h3>
													<p className="text-xs text-slate-600 dark:text-slate-400 mb-6 font-light leading-relaxed">{cls.desc}</p>
													
													<ul className="space-y-3">
														{cls.items.map((item, i) => (
															<li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
																<div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
																<span>{item}</span>
															</li>
														))}
													</ul>
												</div>
											</div>

											<div className="p-6 pt-0">
												<div className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center text-xs font-bold text-rose-700 dark:text-rose-300">
													Included with Club Membership
												</div>
											</div>
										</div>
									</FadeUp>
								);
							})}
						</div>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    9. SPECIFICATIONS MATRIX (ROOM BY ROOM)
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 px-4 md:px-8">
					<div className="container mx-auto max-w-7xl">
						<div className="text-center max-w-3xl mx-auto mb-14">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Finishes &amp; Fixtures</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									Uncompromising Luxury Specifications
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Every surface is crafted using top-tier Italian marbles, seasoned woods, and high-performance glass.
								</p>
							</FadeUp>
						</div>

						{/* Interactive Room Tabs */}
						<div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:justify-center mb-8">
							<div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-1 sm:gap-2 flex-nowrap sm:flex-wrap justify-start sm:justify-center shadow-sm min-w-max">
								{SPECIFICATIONS.map((spec, i) => (
									<button
										key={i}
										onClick={() => setActiveSpecCat(i)}
										className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
											activeSpecCat === i
												? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
												: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
										}`}
									>
										{spec.category}
									</button>
								))}
							</div>
						</div>

						{/* Specifications Table Display */}
						<FadeUp key={activeSpecCat}>
							<div className="max-w-4xl mx-auto et-glass-panel et-shadow-rose rounded-3xl p-6 sm:p-8 transition-all duration-300">
								<h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
									<span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
									<span>{SPECIFICATIONS[activeSpecCat].category} Specifications</span>
								</h3>

								<div className="divide-y divide-slate-200 dark:divide-slate-800">
									{SPECIFICATIONS[activeSpecCat].details.map((d, idx) => (
										<div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
											<span className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300 w-48 flex-shrink-0">
												{d.item}
											</span>
											<span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal leading-relaxed">
												{d.val}
											</span>
										</div>
									))}
								</div>
							</div>
						</FadeUp>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    10. OFFICIAL PRICE SHEET & FLOOR SLABS
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 bg-white/70 dark:bg-[#0d0e14]/70 border-y border-slate-200 dark:border-slate-800 px-4 md:px-8 backdrop-blur-md">
					<div className="container mx-auto max-w-7xl">
						<div className="text-center max-w-3xl mx-auto mb-16">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Transparent Commercials</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									Floor-Wise Price Sheet &amp; Charges
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Official Price List W.E.F. 01.08.2026. Zero GST as per Hon'ble Supreme Court guidelines.
								</p>
							</FadeUp>
						</div>

						{/* Price Table Grid */}
						<div className="max-w-5xl mx-auto space-y-12">
							
							{/* Floor Slab Matrix */}
							<FadeUp>
								<div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-colors duration-300">
									<div className="p-6 bg-gradient-to-r from-rose-100/80 to-slate-100 dark:from-rose-950/60 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
										<div>
											<h3 className="text-xl font-bold text-slate-900 dark:text-white">Floor Slabs &amp; Offer Rates</h3>
											<p className="text-xs text-rose-700 dark:text-rose-300 font-medium">Limited-period introductory pricing</p>
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => setLightboxImg(I.pricePage1)}
												className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-rose-500 transition-colors flex items-center gap-1"
											>
												<FileText size={12} /> View Price PDF
											</button>
										</div>
									</div>

									<div className="overflow-x-auto">
										<table className="w-full text-left border-collapse">
											<thead>
												<tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black/40 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
													<th className="py-3.5 px-5">Floor Slabs</th>
													<th className="py-3.5 px-5">3 BHK (1,932 sq.ft) Offer</th>
													<th className="py-3.5 px-5">3 BHK Standard BSP</th>
													<th className="py-3.5 px-5">4 BHK+S (2,625 sq.ft) Offer</th>
													<th className="py-3.5 px-5">4 BHK+S Standard BSP</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs sm:text-sm">
												{PRICING_SLABS.map((sl, i) => (
													<tr key={i} className="hover:bg-rose-50/60 dark:hover:bg-rose-950/10 transition-colors">
														<td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">{sl.floor}</td>
														<td className="py-3.5 px-5 font-bold text-rose-600 dark:text-rose-400">{sl.bhk3_1932.offer}</td>
														<td className="py-3.5 px-5 text-slate-400 line-through text-xs">{sl.bhk3_1932.current}</td>
														<td className="py-3.5 px-5 font-bold text-rose-600 dark:text-rose-400">{sl.bhk4_2625.offer}</td>
														<td className="py-3.5 px-5 text-slate-400 line-through text-xs">{sl.bhk4_2625.current}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</FadeUp>

							{/* Additional Charges and Payment Plan Side-by-Side */}
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
								
								{/* Additional Mandatory Charges */}
								<div className="lg:col-span-6">
									<FadeUp delay={100}>
										<div className="et-glass-panel et-shadow-rose rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-300">
											<div>
												<h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
													<Shield size={16} className="text-rose-600 dark:text-rose-400" />
													<span>Additional Charges Breakdown</span>
												</h4>
												<div className="divide-y divide-slate-200 dark:divide-slate-800">
													{ADDITIONAL_CHARGES_LIST.map((ac, idx) => (
														<div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
															<div>
																<p className="font-bold text-slate-800 dark:text-slate-200">{ac.name}</p>
																<p className="text-[10px] text-slate-500 dark:text-slate-400">{ac.note}</p>
															</div>
															<span className="font-bold text-rose-600 dark:text-rose-400">{ac.cost}</span>
														</div>
													))}
												</div>
											</div>
											<p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
												* Preferential Location Charges (Green &amp; Road Facing): ₹400/sq.ft. Towers Dahlia &amp; Tulip: +₹500/sq.ft.
											</p>
										</div>
									</FadeUp>
								</div>

								{/* 20:80 Payment Plan Box */}
								<div className="lg:col-span-6">
									<FadeUp delay={200}>
										<div className="bg-gradient-to-br from-rose-50 via-white to-slate-50 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900 border border-rose-200 dark:border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-md dark:shadow-xl h-full flex flex-col justify-between transition-colors duration-300">
											<div>
												<span className="text-[10px] uppercase font-bold tracking-widest text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-3 py-1 rounded-full">
													Special Financial Scheme
												</span>
												<h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-2">
													20 : 80 No Pre-EMI Plan
												</h4>
												<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 font-light leading-relaxed">
													Pay only 20% until the 30th Floor / Top Floor Roof casting. Enjoy complete peace of mind with No EMI for 18 Months*.
												</p>

												<div className="space-y-3">
													<div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 shadow-sm">
														<span className="text-xs font-medium text-slate-700 dark:text-slate-300">Customer Contribution (Till Top Floor)</span>
														<span className="text-sm font-bold text-rose-600 dark:text-rose-400">20%</span>
													</div>
													<div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 shadow-sm">
														<span className="text-xs font-medium text-slate-700 dark:text-slate-300">Bank Loan Contribution (No Pre-EMI)</span>
														<span className="text-sm font-bold text-slate-900 dark:text-white">80%</span>
													</div>
													<div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-800 shadow-sm">
														<span className="text-xs font-medium text-slate-700 dark:text-slate-300">Down Payment Scheme Discount</span>
														<span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">10% on BSP</span>
													</div>
												</div>
											</div>

											<div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
												<div>
													<p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold">Official Escrow Bank</p>
													<p className="text-xs font-bold text-slate-900 dark:text-white">UCO Bank · Supreme Court Branch</p>
												</div>
												<button
													onClick={() => setLightboxImg(I.pricePage2)}
													className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-md shadow-rose-600/20 flex items-center gap-1.5"
												>
													<FileText size={12} /> View Bank PDF
												</button>
											</div>
										</div>
									</FadeUp>
								</div>

							</div>
						</div>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    11. CONSTRUCTION LINKED PAYMENT PLAN (CLP) TIMELINE
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 px-4 md:px-8">
					<div className="container mx-auto max-w-5xl">
						<div className="text-center max-w-3xl mx-auto mb-14">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Milestone Schedule</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									Construction Linked Plan (CLP)
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Clear, 14-stage construction linked schedule totaling 100% transparent milestone disbursements.
								</p>
							</FadeUp>
						</div>

						<FadeUp>
							<div className="et-glass-panel et-shadow-rose rounded-3xl p-6 sm:p-8">
								<div className="space-y-4">
									{CLP_PLAN.map((st, i) => (
										<div
											key={i}
											className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-rose-300 dark:hover:border-rose-500/40 transition-colors"
										>
											<div className="flex items-center gap-3">
												<span className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center">
													{i + 1}
												</span>
												<div>
													<p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{st.stage}</p>
													<p className="text-[10px] text-slate-500 dark:text-slate-400">{st.timeline}</p>
												</div>
											</div>
											<div className="flex items-center gap-3 self-end sm:self-auto">
												<div className="w-24 sm:w-32 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
													<div className="bg-gradient-to-r from-rose-600 to-pink-500 h-full rounded-full" style={{ width: `${(st.pct / 10) * 100}%` }} />
												</div>
												<span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 w-12 text-right">
													{st.pct}%
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</FadeUp>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    12. STRATEGIC LOCATION MAP & CONNECTIVITY
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 px-4 md:px-8 bg-white/70 dark:bg-[#0d0e14]/70 border-y border-slate-200 dark:border-slate-800 backdrop-blur-md">
					<div className="container mx-auto max-w-7xl">
						<div className="text-center max-w-3xl mx-auto mb-14">
							<FadeUp>
								<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Location Advantages</span>
								<h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-4">
									Strategic Connectivity in Techzone-4
								</h2>
								<p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
									Seamless access to expressways, proposed metro stations, hospital giants and Fortune 500 tech hubs.
								</p>
							</FadeUp>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
							{/* Location Map Image */}
							<div className="lg:col-span-7">
								<FadeUp>
									<div className="et-glass-panel et-shadow-rose rounded-3xl overflow-hidden p-4 group">
										<div className="relative rounded-2xl overflow-hidden bg-slate-950">
											<img
												src={I.locationMap}
												alt="Eternia Official Location Map"
												className="w-full h-[380px] sm:h-[450px] object-contain cursor-pointer"
												onClick={() => setLightboxImg(I.locationMap)}
											/>
											<div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-rose-500/40 text-rose-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer">
												<Eye size={12} /> Click to Enlarge Map
											</div>
										</div>
									</div>
								</FadeUp>
							</div>

							{/* Category Drive Times */}
							<div className="lg:col-span-5 space-y-4">
								<FadeUp delay={100}>
									<div className="et-glass-panel et-shadow-rose rounded-3xl p-6">
										<div className="flex overflow-x-auto no-scrollbar gap-1.5 mb-5 pb-1 flex-nowrap sm:flex-wrap">
											{LOCATION_ADVANTAGES.map((cat, i) => (
												<button
													key={i}
													onClick={() => setActiveLocCat(i)}
													className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
														activeLocCat === i
															? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
															: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
													}`}
												>
													{cat.category.split(' & ')[0]}
												</button>
											))}
										</div>

										<div className="space-y-3">
											{LOCATION_ADVANTAGES[activeLocCat].items.map((land, idx) => (
												<div
													key={idx}
													className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
												>
													<div className="flex items-center gap-3">
														<div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
															<MapPin size={16} />
														</div>
														<div>
															<p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{land.name}</p>
															<p className="text-[10px] text-slate-500 dark:text-slate-400">{land.dist}</p>
														</div>
													</div>
													<span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-500/30">
														{land.time}
													</span>
												</div>
											))}
										</div>
									</div>
								</FadeUp>
							</div>
						</div>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    13. TITAN PARTNERSHIPS & DEVELOPER CREDENTIALS
				══════════════════════════════════════════════════════════════ */}
				<section className="py-20 px-4 md:px-8">
					<div className="container mx-auto max-w-6xl text-center">
						<FadeUp>
							<span className="text-xs uppercase font-bold tracking-widest text-rose-600 dark:text-rose-400">Titan Partnerships</span>
							<h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-2 mb-10">
								Trusted Titans · Timeless Triumphs
							</h2>
						</FadeUp>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<FadeUp delay={100} className="et-glass-panel et-shadow-rose rounded-3xl p-5 text-left flex flex-col justify-between">
								<div>
									<div className="h-32 rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-800">
										<img src={I.greatValue} alt="Great Value Realty" className="w-full h-full object-cover" />
									</div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Developer</p>
									<h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Great Value Realty</h3>
									<p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
										Established in 1970 with 50+ years of excellence across packaging, technology, and landmark residences including Sharanam, Anandam, and Vilasa.
									</p>
								</div>
							</FadeUp>

							<FadeUp delay={180} className="et-glass-panel et-shadow-rose rounded-3xl p-5 text-left flex flex-col justify-between">
								<div>
									<div className="h-32 rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-800">
										<img src={I.sanskarRealty} alt="Sanskar Realty" className="w-full h-full object-cover" />
									</div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Healthcare &amp; Trust</p>
									<h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Sanskar Realty</h3>
									<p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
										Extension of Yatharth Hospitals legacy since 2008, operating 7 multi-speciality hospitals across North India with millions of lives touched.
									</p>
								</div>
							</FadeUp>

							<FadeUp delay={260} className="et-glass-panel et-shadow-rose rounded-3xl p-5 text-left flex flex-col justify-between">
								<div>
									<div className="h-32 rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-800">
										<img src={I.vastunidhi} alt="Vastunidhi Architects" className="w-full h-full object-cover" />
									</div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Architectural Design</p>
									<h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Vastunidhi (VNA)</h3>
									<p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
										36+ years of iconic design consultancy across India, including AIIMS Delhi Housing, RBI Mumbai Residences, CRC The Flagship, and IIT Bhubaneswar.
									</p>
								</div>
							</FadeUp>

							<FadeUp delay={340} className="et-glass-panel et-shadow-rose rounded-3xl p-5 text-left flex flex-col justify-between">
								<div>
									<div className="h-32 rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-800">
										<img src={I.dvplNbcc} alt="DVPL and NBCC" className="w-full h-full object-cover" />
									</div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">Construction &amp; Management</p>
									<h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">DVPL &amp; NBCC (India)</h3>
									<p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
										Civil execution by Dee Vee Projects Ltd. (Est. 1989) with project management by Navratna CPSE NBCC on behalf of the Hon'ble Supreme Court Receiver.
									</p>
								</div>
							</FadeUp>
						</div>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    14. VIP CONSULTATION CTA
				══════════════════════════════════════════════════════════════ */}
				<section className="py-20 px-4 md:px-8 relative overflow-hidden bg-gradient-to-r from-rose-950 via-slate-950 to-rose-950 border-t border-rose-500/30 text-white">
					<div className="container mx-auto max-w-4xl text-center relative z-10">
						<FadeUp>
							<h2 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-6">
								Secure Your Legacy at Eternia
							</h2>
							<p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light">
								Schedule a private site visit, experience actual sample layouts, and avail exclusive launch benefits with the 20:80 No Pre-EMI payment scheme.
							</p>
							<div className="flex flex-wrap items-center justify-center gap-4">
								<button
									onClick={() => setIsModalOpen(true)}
									className="px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-rose-600/40 hover:scale-105 transition-all"
								>
									Request Callback &amp; Price Quote
								</button>
								<a
									href={`tel:${PROJECT.phone}`}
									className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm tracking-wide transition-all flex items-center gap-2"
								>
									<Phone size={16} className="text-rose-400" />
									<span>Call {PROJECT.phoneDisplay}</span>
								</a>
							</div>
						</FadeUp>
					</div>
				</section>


				{/* ══════════════════════════════════════════════════════════════
				    15. LIGHTBOX MODAL (FOR PDFS & FULLSCREEN PLANS)
				══════════════════════════════════════════════════════════════ */}
				{lightboxImg && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
						onClick={() => setLightboxImg(null)}
					>
						<div
							className="relative max-w-5xl max-h-[90vh] bg-slate-900 border border-rose-500/40 rounded-3xl p-4 overflow-hidden"
							onClick={e => e.stopPropagation()}
						>
							<button
								onClick={() => setLightboxImg(null)}
								className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center border border-slate-700 hover:bg-rose-600 transition-colors"
							>
								<X size={20} />
							</button>
							<img
								src={lightboxImg}
								alt="Fullscreen Document Preview"
								className="max-h-[82vh] w-auto object-contain mx-auto rounded-xl"
							/>
						</div>
					</div>
				)}


				{/* ══════════════════════════════════════════════════════════════
				    16. LEAD CAPTURE POPUP MODAL
				══════════════════════════════════════════════════════════════ */}
				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
						<div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
							<button
								onClick={() => setIsModalOpen(false)}
								className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
							>
								<X size={20} />
							</button>

							<div className="text-center mb-6">
								<span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">VIP Priority Desk</span>
								<h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mt-1">Inquire for Eternia</h3>
								<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Get authentic pricing, floor plans &amp; 20:80 scheme details.</p>
							</div>

							{submitSuccess ? (
								<div className="text-center py-8 space-y-3">
									<div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
										<Check size={24} />
									</div>
									<p className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Received!</p>
									<p className="text-xs text-slate-600 dark:text-slate-300">Our senior property advisor will reach out to you immediately.</p>
								</div>
							) : (
								<form onSubmit={handleFormSubmit} className="space-y-4">
									<div>
										<label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
										<input
											type="text"
											required
											placeholder="e.g. Rahul Verma"
											value={leadData.name}
											onChange={e => setLeadData({ ...leadData, name: e.target.value })}
											className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:outline-none text-slate-900 dark:text-white text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
										<input
											type="tel"
											required
											placeholder="+91 98765 43210"
											value={leadData.phone}
											onChange={e => setLeadData({ ...leadData, phone: e.target.value })}
											className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:outline-none text-slate-900 dark:text-white text-sm"
										/>
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address (Optional)</label>
										<input
											type="email"
											placeholder="rahul@example.com"
											value={leadData.email}
											onChange={e => setLeadData({ ...leadData, email: e.target.value })}
											className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:outline-none text-slate-900 dark:text-white text-sm"
										/>
									</div>
									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-rose-600/30 disabled:opacity-50"
									>
										{isSubmitting ? 'Submitting...' : 'Confirm & Request Details'}
									</button>
								</form>
							)}
						</div>
					</div>
				)}

			</main>
		</Layout>
	);
}
