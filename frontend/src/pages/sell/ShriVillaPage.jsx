import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import {
	MapPin, Building2, Check, ArrowRight, Download,
	Shield, ChevronRight, X, Phone, MessageCircle,
	ChevronDown, Wind, Droplets, Layers, Sparkles,
	Clock, Car, Zap, CheckCircle2, ChevronLeft, Calculator,
	ExternalLink, Share2, Compass, Award, Trees, Eye, Lock,
	ZoomIn, ZoomOut, RotateCcw, BookOpen,
	Landmark, FileText, CheckCircle, Navigation, Info, Maximize2,
	Activity, Dumbbell, Waves, Tent, Star, Users, Calendar,
	TrendingUp, Mountain, ShieldCheck, Move, Trophy
} from 'lucide-react';

/* ─── AUTHENTIC EXTRACTED BROCHURE ASSETS & HIGH-RES PHOTOGRAPHY ─── */
const I = {
	heroLuxury: '/images/shri-villa/hero-luxury-villa.jpg',
	heroVillaCropped: '/images/shri-villa/hero-villa.jpg',
	forestMansion: '/images/shri-villa/forest-mansion.jpg',
	mountainVillaExterior: '/images/shri-villa/modern-mountain-villa-exterior.jpg',
	villaLivingNature: '/images/shri-villa/villa-living-nature.jpg',
	dehradunHills: '/images/shri-villa/dehradun-hills-panorama.jpg',
	mountainSunset: '/images/shri-villa/mountain-sunset-highway.jpg',
	grandGate: '/images/shri-villa/grand-gate.jpg',
	familyPicnic: '/images/shri-villa/family-picnic.jpg',
	masterPlan: '/images/shri-villa/master-plan.jpg',
	surveyPlanFull: '/images/shri-villa/survey-plan-full.jpg',
	connectivityMap: '/images/shri-villa/connectivity-map.jpg',
	clubhousePool: '/images/shri-villa/clubhouse-infinity-pool.jpg',
	wellnessGym: '/images/shri-villa/wellness-open-gym.jpg',
	kidsPlay: '/images/shri-villa/kids-play-nature.jpg',
	templeSerenity: '/images/shri-villa/temple-serenity.jpg',
	cricketTurf: '/images/shri-villa/cricket-sports-turf.jpg',
	villaPatio: '/images/shri-villa/villa-patio-deck.jpg',
	lushForest: '/images/shri-villa/lush-pine-forest.jpg',
	amenityTemple: '/images/shri-villa/amenity-temple.jpg',
	amenityPool: '/images/shri-villa/amenity-pool.jpg',
	amenityClubhouse: '/images/shri-villa/amenity-clubhouse.jpg',
	amenityCricket: '/images/shri-villa/amenity-cricket.jpg',
	amenityParty: '/images/shri-villa/amenity-partyhall.jpg',
	amenityBadminton: '/images/shri-villa/amenity-badminton.jpg',
};

const PROJECT = {
	name: 'Shri Villa',
	sub: 'Live Close to Nature, Stay Closer to Luxury',
	tagline: 'A Life of Peace, Privacy & Purpose in Dehradun',
	location: 'Vill- Sorna, Dehradun, Uttarakhand',
	fullAddress: 'Vill- Sorna, Near Yamunotri Highway, Dehradun, Uttarakhand - 248007',
	phone: '+919771034916',
	phoneDisplay: '+91 97710 34916',
	wa: 'https://wa.aisensy.com/aabbf5',
	brochure: '/brochures/shri-villa-brochure.pdf',
	developer: 'GRDA INFRA PRIVATE LIMITED',
	tagDeveloper: 'The Best Investment on Earth is Earth',
};

const STATS_CARDS = [
	{ label: 'Total Land Expanse', value: '22,941 Sq.Yd', sub: '2.06 Lakh Sq.Ft Greenfield Estate', icon: MapPin },
	{ label: 'Exclusive Plots', value: '50 Villa Plots', sub: 'Low-Density Mountain Enclave', icon: Trees },
	{ label: 'Internal Boulevards', value: '30 Ft+ Wide', sub: '5,014 Sq.Yd Dedicated Roadways', icon: Compass },
	{ label: 'Yamunotri Highway', value: '4 KM Distance', sub: 'Seamless Highway Corridor Access', icon: Navigation },
	{ label: 'Title & Approvals', value: 'Immediate Registry', sub: 'Bank Loan Sanctions Available', icon: ShieldCheck },
	{ label: 'Serenity & Air', value: 'AQI < 35', sub: 'Pristine Himalayan Foothills', icon: Wind },
];

const GENESIS_PHOTOS = [
	{
		id: 0,
		title: 'Grand Gateway & 24x7 Security',
		subtitle: 'Bespoke entrance architecture with boom barriers, guardhouse, and perimeter monitoring',
		tag: 'Secure Enclave',
		img: I.grandGate,
	},
	{
		id: 1,
		title: 'Misty Foothill Villa Architecture',
		subtitle: 'Design your bespoke 2-3 storey mountain chalet with uninterrupted pine valley vistas',
		tag: 'Himalayan Living',
		img: I.forestMansion,
	},
	{
		id: 2,
		title: 'Holistic Greenery & Family Parks',
		subtitle: 'Lush manicured open spaces, walking trails, and rejuvenating fresh mountain breeze',
		tag: 'Eco Serenity',
		img: I.familyPicnic,
	},
	{
		id: 3,
		title: 'Scenic Dehradun Roadways',
		subtitle: 'Smooth transit connecting Delhi-Dehradun Expressway, Doon School, and Mussoorie',
		tag: 'Highway Transit',
		img: I.mountainSunset,
	},
];

const PLOT_INVENTORY = [
	{ id: 1, plotNo: 'Plot 01', bsf: '845.98', sqft: '886.28', sqyd: '98.58', category: 'Compact', status: 'Available', highlight: 'Near Entrance Gate' },
	{ id: 2, plotNo: 'Plot 02', bsf: '2181.11', sqft: '228.82', sqyd: '107.71', category: 'Compact', status: 'Available', highlight: 'Main Boulevard Frontage' },
	{ id: 3, plotNo: 'Plot 03', bsf: '2262.35', sqft: '237.53', sqyd: '105.15', category: 'Compact', status: 'Available', highlight: 'Tree-Lined Avenue' },
	{ id: 4, plotNo: 'Plot 04', bsf: '2362.73', sqft: '247.39', sqyd: '109.89', category: 'Compact', status: 'Available', highlight: 'East Facing Orientation' },
	{ id: 5, plotNo: 'Plot 05', bsf: '3002.63', sqft: '313.66', sqyd: '139.12', category: 'Standard', status: 'Available', highlight: 'Dual Avenue Access' },
	{ id: 6, plotNo: 'Plot 06', bsf: '2079.89', sqft: '435.54', sqyd: '97.61', category: 'Compact', status: 'Available', highlight: 'Cozy Mountain View' },
	{ id: 7, plotNo: 'Plot 07', bsf: '1971.82', sqft: '453.90', sqyd: '146.69', category: 'Standard', status: 'Available', highlight: 'Corner Boulevard' },
	{ id: 8, plotNo: 'Plot 08', bsf: '2087.72', sqft: '459.68', sqyd: '143.81', category: 'Standard', status: 'Available', highlight: 'Near Central Green' },
	{ id: 9, plotNo: 'Plot 09', bsf: '2602.28', sqft: '485.81', sqyd: '161.61', category: 'Standard', status: 'Available', highlight: 'Premium Garden Vista' },
	{ id: 10, plotNo: 'Plot 10', bsf: '3603.65', sqft: '620.78', sqyd: '183.94', category: 'Standard', status: 'Available', highlight: 'Spacious Front Yard' },
	{ id: 11, plotNo: 'Plot 11', bsf: '5088.52', sqft: '696.14', sqyd: '340.49', category: 'Grand Estate', status: 'Available', highlight: 'Wide Estate Frontage' },
	{ id: 12, plotNo: 'Plot 12', bsf: '4477.78', sqft: '584.93', sqyd: '500.69', category: 'Grand Estate', status: 'Available', highlight: 'Prime 500 Sq.Yd Flagship Corner' },
	{ id: 13, plotNo: 'Plot 13', bsf: '2382.21', sqft: '250.83', sqyd: '186.24', category: 'Standard', status: 'Available', highlight: 'Scenic Valley Facing' },
	{ id: 20, plotNo: 'Plot 20', bsf: '2545.70', sqft: '228.86', sqyd: '205.50', category: 'Standard', status: 'Available', highlight: 'Quiet Cul-de-sac Road' },
	{ id: 21, plotNo: 'Plot 21', bsf: '2648.16', sqft: '293.71', sqyd: '217.80', category: 'Grand Estate', status: 'Available', highlight: 'North-East Vastu Compliant' },
	{ id: 22, plotNo: 'Plot 22', bsf: '2291.65', sqft: '252.78', sqyd: '235.78', category: 'Grand Estate', status: 'Available', highlight: 'Panoramic Mountain Line' },
	{ id: 35, plotNo: 'Plot 35', bsf: '2756.63', sqft: '308.22', sqyd: '256.04', category: 'Grand Estate', status: 'Available', highlight: 'Clubhouse Proximity' },
	{ id: 37, plotNo: 'Plot 37', bsf: '2692.37', sqft: '326.88', sqyd: '287.82', category: 'Grand Estate', status: 'Available', highlight: 'Exclusive Private Enclave' },
	{ id: 47, plotNo: 'Plot 47', bsf: '930.96', sqft: '101.33', sqyd: '89.45', category: 'Compact', status: 'Available', highlight: 'Entry-Level Investment' },
	{ id: 50, plotNo: 'Plot 50', bsf: '1455.65', sqft: '148.45', sqyd: '137.69', category: 'Standard', status: 'Available', highlight: 'Private Corner Plot' },
];

const SECTOR_ZONES = [
	{
		title: 'Sector A · Boulevard Frontage',
		plots: 'Plots 01 – 10',
		sizes: '98 to 184 Sq.Yd',
		desc: 'Direct frontage along the 30 Ft grand entrance boulevard with fast access to security gate.',
		badge: 'High Accessibility'
	},
	{
		title: 'Sector B · Central Valley Enclave',
		plots: 'Plots 11 – 25',
		sizes: '186 to 500 Sq.Yd',
		desc: 'Includes the flagship 500.69 Sq.Yd corner estate (Plot 12) with dual-side landscaped roads.',
		badge: 'Flagship Estates'
	},
	{
		title: 'Sector C · Elevated Green Ring',
		plots: 'Plots 26 – 40',
		sizes: '121 to 288 Sq.Yd',
		desc: 'Elevated contours with perimeter wire fencing, dense green tree buffers, and mountain sunsets.',
		badge: 'Scenic Mountain Vistas'
	},
	{
		title: 'Sector D · Secluded Cul-de-Sac',
		plots: 'Plots 41 – 50',
		sizes: '89 to 138 Sq.Yd',
		desc: 'Peaceful dead-end private avenues offering maximum privacy and minimal vehicle traffic.',
		badge: 'Utmost Privacy'
	}
];

const AMENITIES_LIST = [
	{
		id: 1,
		name: 'Gated City & Security',
		desc: 'Grand entrance archway with 24x7 security personnel, boom barriers, and visitor management.',
		icon: ShieldCheck,
		category: 'Safety',
		img: I.grandGate,
		highlight: '24x7 Guarded Access'
	},
	{
		id: 2,
		name: 'Club House & Social Lounge',
		desc: 'Elegantly appointed community club with indoor entertainment, coffee lounge, and meeting areas.',
		icon: Building2,
		category: 'Clubhouse',
		img: I.amenityClubhouse,
		fallbackImg: I.clubhousePool,
		highlight: 'Exclusive Members Club'
	},
	{
		id: 3,
		name: 'Mountain Infinity Pool',
		desc: 'Temperature-regulated swimming pool featuring water cascade jets and sundeck seating.',
		icon: Waves,
		category: 'Clubhouse',
		img: I.amenityPool,
		fallbackImg: I.clubhousePool,
		highlight: 'Sundeck & Cascades'
	},
	{
		id: 4,
		name: 'Open-Air Wellness Gym',
		desc: 'State-of-the-art outdoor fitness and calisthenics station surrounded by fresh pine air.',
		icon: Dumbbell,
		category: 'Sports',
		img: I.wellnessGym,
		highlight: 'Pine View Aerobics'
	},
	{
		id: 5,
		name: 'Net Cricket Practice Pitch',
		desc: 'Professional turf cricket practice net for enthusiasts and youth weekend training.',
		icon: Activity,
		category: 'Sports',
		img: I.amenityCricket,
		fallbackImg: I.cricketTurf,
		highlight: 'Turf Practice Pitch'
	},
	{
		id: 6,
		name: 'Badminton Court',
		desc: 'Outdoor tournament-spec badminton arena with high-visibility lighting for evening matches.',
		icon: Trophy,
		category: 'Sports',
		img: I.amenityBadminton,
		highlight: 'Floodlit Court'
	},
	{
		id: 7,
		name: 'Temple in Premises',
		desc: 'Sacred, architecturally crafted Hindu temple within the township for peace, prayers, and community devotion.',
		icon: Star,
		category: 'Community',
		img: I.amenityTemple,
		fallbackImg: I.templeSerenity,
		highlight: 'Daily Devotion & Serenity'
	},
	{
		id: 8,
		name: 'Party Hall & Rest Rooms',
		desc: 'Grand banquet and celebration hall with dedicated catering staging and modern luxury washrooms.',
		icon: Users,
		category: 'Community',
		img: I.amenityParty,
		highlight: 'Private Family Gatherings'
	},
	{
		id: 9,
		name: 'Children’s Nature Play Park',
		desc: 'Safe, rubberized outdoor playground with slides, swings, and climbing frames surrounded by greenery.',
		icon: Tent,
		category: 'Community',
		img: I.kidsPlay,
		highlight: 'Safe Soft-Play Zone'
	},
	{
		id: 10,
		name: '30 Ft Wide Boulevard Roads',
		desc: 'Heavy-duty asphalt & concrete internal roads with pedestrian walkways and manicured kerbs.',
		icon: Compass,
		category: 'Infrastructure',
		img: I.lushForest,
		highlight: '5,014 Sq.Yd Road Network'
	},
	{
		id: 11,
		name: '24x7 HD CCTV Surveillance',
		desc: 'Complete camera coverage across every internal intersection, perimeter wall, and entrance checkpoint.',
		icon: Eye,
		category: 'Safety',
		img: I.forestMansion,
		highlight: 'Perimeter Laser/CCTV'
	},
	{
		id: 12,
		name: 'Illuminated LED Street Lighting',
		desc: 'Energy-efficient designer pole lights illuminating all 30 ft avenues throughout the night.',
		icon: Zap,
		category: 'Infrastructure',
		img: I.mountainSunset,
		highlight: 'Dusk-to-Dawn Automation'
	},
];

const CONNECTIVITY_DATA = {
	local: [
		{ name: 'Yamunotri Highway', time: '5 Mins', dist: '4 KM', icon: Navigation, desc: 'Direct arterial highway to Dehradun and scenic hill stations' },
		{ name: 'Eco Global Public School', time: '6 Mins', dist: '4 KM', icon: BookOpen, desc: 'Reputed K-12 English Medium CBSE curriculum institution' },
		{ name: 'Graphic Era Hospital', time: '10 Mins', dist: '6 KM', icon: Activity, desc: 'Multi-speciality medical care and 24x7 emergency trauma center' },
		{ name: 'The Doon School', time: '12 Mins', dist: '6 KM', icon: Landmark, desc: 'India’s premier historic educational institution' },
		{ name: 'Dehradun Railway Station', time: '25 Mins', dist: '15 KM', icon: Landmark, desc: 'Direct Vande Bharat & Shatabdi Express connectivity to Delhi' },
		{ name: 'Delhi-Dehradun Expressway', time: '35 Mins', dist: '30 KM', icon: Car, desc: 'Access to newly built expressway cutting Delhi travel to 2.5 hrs' },
	],
	regional: [
		{ name: 'Chandigarh City Center', time: '3.0 Hrs', dist: '168 KM', icon: Car, desc: 'Fast expressway link via Paonta Sahib & Panchkula' },
		{ name: 'Delhi IGI Airport', time: '3.5 Hrs', dist: '208 KM', icon: Navigation, desc: 'Direct access via the new Delhi-Dehradun Greenfield Corridor' },
		{ name: 'Noida / Greater Noida', time: '3.2 Hrs', dist: '200 KM', icon: Car, desc: 'Seamless expressway commute from Delhi NCR' },
		{ name: 'Ghaziabad & Anand Vihar', time: '3.0 Hrs', dist: '200 KM', icon: Landmark, desc: 'Direct bus and train connectivity' },
	],
	scenic: [
		{ name: 'Mussoorie Queen of Hills', time: '45 Mins', dist: '35 KM', icon: Mountain, desc: 'Famous Mall Road, Kempty Falls, and Himalayan view points' },
		{ name: 'Rishikesh Yoga Capital', time: '55 Mins', dist: '45 KM', icon: Waves, desc: 'Ganga Aarti, white water rafting, and wellness retreats' },
		{ name: 'Haridwar Har Ki Pauri', time: '60 Mins', dist: '55 KM', icon: Star, desc: 'Historic spiritual riverfront and temple circuits' },
		{ name: 'Paonta Sahib', time: '40 Mins', dist: '38 KM', icon: Landmark, desc: 'Renowned historic riverside Gurudwara on the Yamuna river' },
	]
};

const FAQS = [
	{
		q: 'What is the legal status and land title of Shri Villa plots?',
		a: 'Shri Villa is 100% freehold land with clear title documentation and Section 143 clearance. Immediate Registry and Mutation (Dakhil Kharij) are guaranteed upon purchase.'
	},
	{
		q: 'Are bank loan facilities available for plot purchase and construction?',
		a: 'Yes, leading nationalized and private banks (including SBI, HDFC, ICICI, and PNB) provide up to 75%–80% loan options for both land purchase and home construction.'
	},
	{
		q: 'What sizes of villa plots are available at Shri Villa?',
		a: 'The township offers a curated spectrum of 50 plots ranging from compact 89–120 Sq.Yd plots, standard 130–200 Sq.Yd plots, up to sprawling 500 Sq.Yd corner estate plots.'
	},
	{
		q: 'What internal infrastructure is provided by GRDA Infra?',
		a: 'The project features 30 Ft+ wide heavy-duty concrete/asphalt internal roads, underground electrical conduits, overhead water storage supply, stormwater drainage, 24x7 gated security, street lights, and boundary wall.'
	},
	{
		q: 'Can I build a custom 2 or 3 storey mountain villa on my plot?',
		a: 'Absolutely! Buyers have the total freedom to design and construct their dream hill villa or holiday home according to their taste, with optional architectural support from GRDA Infra’s empanelled designers.'
	},
	{
		q: 'Why is Dehradun plotted land considered a high-growth investment?',
		a: 'With the completion of the Delhi-Dehradun Expressway reducing travel time to 2.5 hours, Dehradun land prices have appreciated 15%–20% year-on-year. Furthermore, clean mountain air and rising holiday rental yields (Airbnb) make it a lucrative asset.'
	}
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
			className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
				inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
			} ${className}`}
		>
			{children}
		</div>
	);
};

export default function ShriVillaPage() {
	const [activeGenesis, setActiveGenesis] = useState(0);
	const [plotFilter, setPlotFilter] = useState('All');
	const [amenityFilter, setAmenityFilter] = useState('All');
	const [connectTab, setConnectTab] = useState('local');
	
	// Master Plan Interactive State
	const [planZoom, setPlanZoom] = useState(1);
	const [planPan, setPlanPan] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const [startPos, setStartPos] = useState({ x: 0, y: 0 });

	const [lightboxImg, setLightboxImg] = useState(null);
	const [activeFaq, setActiveFaq] = useState(null);
	
	// Calculator State
	const [calcSqYd, setCalcSqYd] = useState(150);
	const [calcRatePerYd, setCalcRatePerYd] = useState(25000);
	const [calcDownPaymentPct, setCalcDownPaymentPct] = useState(20);
	const [calcTenureYears, setCalcTenureYears] = useState(15);
	const [calcInterestRate] = useState(8.5);

	// Lead Modal State
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [leadData, setLeadData] = useState({ name: '', phone: '', email: '', preferredSize: '150 Sq.Yd', visitDate: '', message: 'Interested in Shri Villa Dehradun Plots' });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	// Calculations
	const totalPlotCost = calcSqYd * calcRatePerYd;
	const downPaymentAmount = (totalPlotCost * calcDownPaymentPct) / 100;
	const loanAmount = totalPlotCost - downPaymentAmount;
	const monthlyInterest = calcInterestRate / 12 / 100;
	const totalMonths = calcTenureYears * 12;
	const estimatedEmi = loanAmount > 0 
		? Math.round((loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, totalMonths)) / (Math.pow(1 + monthlyInterest, totalMonths) - 1))
		: 0;

	// Pan/Zoom handlers for Master Plan
	const handleMouseDown = (e) => {
		if (planZoom <= 1) return;
		setIsPanning(true);
		setStartPos({ x: e.clientX - planPan.x, y: e.clientY - planPan.y });
	};

	const handleMouseMove = (e) => {
		if (!isPanning || planZoom <= 1) return;
		setPlanPan({
			x: e.clientX - startPos.x,
			y: e.clientY - startPos.y,
		});
	};

	const handleMouseUp = () => {
		setIsPanning(false);
	};

	const resetPlanView = () => {
		setPlanZoom(1);
		setPlanPan({ x: 0, y: 0 });
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await api.post('/leads', {
				...leadData,
				project: 'Shri Villa - Dehradun',
				source: 'shri_villa_page',
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

	const filteredPlots = plotFilter === 'All'
		? PLOT_INVENTORY
		: PLOT_INVENTORY.filter(p => p.category === plotFilter);

	const filteredAmenities = amenityFilter === 'All'
		? AMENITIES_LIST
		: AMENITIES_LIST.filter(a => a.category === amenityFilter);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setLightboxImg(null);
				setIsModalOpen(false);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<Layout noPadding>
			{/* Slim Ambient Top Glow Strip directly beneath Header */}
			<div className="fixed top-14 inset-x-0 h-[1.5px] z-[9998] bg-gradient-to-r from-transparent via-amber-400/60 dark:via-amber-300/70 to-transparent pointer-events-none" />

			<Helmet>
				<title>Shri Villa Dehradun | 50 Premium Mountain Villa Plots by GRDA Infra</title>
				<meta name="description" content="Shri Villa by GRDA Infra: 22,941 Sq.Yd freehold gated plotting project in Vill- Sorna, Dehradun. 30 Ft wide roads, Clubhouse, Pool, Temple, 4km from Yamunotri Highway. Immediate Registry & Bank Loan." />
				<link rel="canonical" href="https://instamakaan.com/sell-companies/shri-villa" />
				<meta property="og:title" content="Shri Villa Dehradun | Live Close to Nature, Stay Closer to Luxury" />
				<meta property="og:description" content="50 Premium Villa Plots in Dehradun foothills with immediate registry, 30 ft roads, clubhouse & bank loans." />
				<meta property="og:image" content="https://instamakaan.com/images/shri-villa/hero-luxury-villa.jpg" />
			</Helmet>

			<style>{`
				@keyframes sv-shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(200%); }
				}
				@keyframes sv-float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-6px); }
				}
				@keyframes sv-pulse-glow {
					0%, 100% { opacity: 0.35; transform: scale(1); }
					50% { opacity: 0.65; transform: scale(1.08); }
				}
				@keyframes sv-kenburns {
					0% { transform: scale(1); }
					50% { transform: scale(1.06); }
					100% { transform: scale(1); }
				}
				.sv-shimmer-btn {
					position: relative;
					overflow: hidden;
				}
				.sv-shimmer-btn::after {
					content: '';
					position: absolute;
					top: 0; left: 0; right: 0; bottom: 0;
					background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent);
					transform: translateX(-100%);
					animation: sv-shimmer 3.5s infinite;
				}
				.sv-gold-shimmer-btn {
					position: relative;
					overflow: hidden;
				}
				.sv-gold-shimmer-btn::after {
					content: '';
					position: absolute;
					top: 0; left: 0; right: 0; bottom: 0;
					background: linear-gradient(90deg, transparent, rgba(253, 224, 71, 0.38), transparent);
					transform: translateX(-100%);
					animation: sv-shimmer 3.2s infinite;
				}
				.sv-floating {
					animation: sv-float 4s ease-in-out infinite;
				}
				.sv-theme-bg {
					background-color: #f8fafc;
					background-image: 
						radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.12) 0px, transparent 50%),
						radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.12) 0px, transparent 50%),
						radial-gradient(at 50% 50%, rgba(30, 58, 138, 0.06) 0px, transparent 60%),
						radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.10) 0px, transparent 50%),
						radial-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px);
					background-size: auto, auto, auto, auto, 32px 32px;
				}
				.dark .sv-theme-bg {
					background-color: #030712;
					background-image: 
						radial-gradient(at 0% 0%, rgba(29, 78, 216, 0.40) 0px, transparent 50%),
						radial-gradient(at 100% 0%, rgba(217, 119, 6, 0.28) 0px, transparent 50%),
						radial-gradient(at 50% 50%, rgba(30, 58, 138, 0.35) 0px, transparent 60%),
						radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.30) 0px, transparent 50%),
						radial-gradient(rgba(96, 165, 250, 0.12) 1px, transparent 1px);
					background-size: auto, auto, auto, auto, 32px 32px;
				}
				.sv-glass-card {
					background: rgba(255, 255, 255, 0.90);
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
					border: 1px solid rgba(59, 130, 246, 0.20);
					box-shadow: 0 10px 30px -10px rgba(30, 58, 138, 0.08);
				}
				.dark .sv-glass-card {
					background: rgba(8, 18, 38, 0.85);
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
					border: 1px solid rgba(96, 165, 250, 0.25);
					box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.7);
				}
				.sv-gold-card {
					background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,243,199,0.70) 100%);
					backdrop-filter: blur(20px);
					border: 1px solid rgba(245, 158, 11, 0.40);
					box-shadow: 0 12px 32px -10px rgba(217, 119, 6, 0.12);
				}
				.dark .sv-gold-card {
					background: linear-gradient(135deg, rgba(15, 28, 55, 0.92) 0%, rgba(38, 28, 10, 0.88) 100%);
					backdrop-filter: blur(20px);
					border: 1px solid rgba(245, 158, 11, 0.40);
					box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.7);
				}
				.sv-text-gold {
					background: linear-gradient(135deg, #fef08a 0%, #facc15 35%, #eab308 70%, #ca8a04 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
				.sv-text-sapphire {
					background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 40%, #1d4ed8 80%, #1e3a8a 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}
			`}</style>

			<main className="sv-theme-bg text-slate-900 dark:text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white font-sans transition-colors duration-500 overflow-x-hidden">

				{/* ══════════════════════════════════════════════════════════════
				    1. HERO SECTION (Haute Himalayan Nature & Luxury Estates)
				══════════════════════════════════════════════════════════════ */}
				<section id="overview" className="relative min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-16 px-4 md:px-8 overflow-hidden transition-colors duration-500">
					
					{/* Ambient Mountain Glow Orbs */}
					<div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[850px] bg-blue-600/20 dark:bg-blue-500/15 rounded-full blur-[160px] pointer-events-none sv-floating" />
					<div className="absolute top-10 left-10 w-[420px] h-[420px] bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
					<div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-500/20 dark:bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

					<div className="container mx-auto max-w-7xl relative z-10">
						<FadeUp delay={100}>
							<div className="text-center max-w-4xl mx-auto mb-12">

								{/* Luxury Crown Tag */}
								<div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-blue-500/20 to-amber-500/15 border border-amber-500/40 dark:border-amber-400/40 text-amber-900 dark:text-amber-300 text-xs font-black tracking-widest uppercase mb-5 shadow-lg backdrop-blur-md sv-floating">
									<Sparkles size={14} className="text-amber-500 animate-spin-slow" />
									<span>50 BESPOKE VILLA PLOTS · FREEHOLD GATED SANCTUARY</span>
									<Sparkles size={14} className="text-amber-500 animate-spin-slow" />
								</div>

								{/* Grand Title */}
								<h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-5 drop-shadow-md">
									<span className="block text-slate-900 dark:text-white">SHRI VILLA</span>
									<span className="block text-2xl sm:text-3xl lg:text-4xl font-serif font-light tracking-wide text-blue-900 dark:text-blue-300 mt-2">
										DEHRADUN FOOTHILLS
									</span>
								</h1>

								{/* Tagline */}
								<p className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-slate-900 dark:text-blue-200 leading-relaxed mb-4">
									<span className="text-amber-500 font-serif mr-1 text-3xl">“</span>
									Live Close to Nature, Stay Closer to Luxury
									<span className="text-amber-500 font-serif ml-1 text-3xl">”</span>
								</p>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
									An elite 22,941 Sq.Yd freehold gated enclave of 50 luxury villa plots with 30 Ft+ concrete boulevards, clubhouse, pool &amp; temple nestled in the serene pines of Vill- Sorna, Dehradun.
								</p>

								{/* Action Strip */}
								<div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
									<button
										onClick={() => setIsModalOpen(true)}
										className="sv-shimmer-btn px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm tracking-wide shadow-2xl shadow-blue-950/40 hover:shadow-blue-900/50 hover:scale-[1.03] transition-all duration-300 flex items-center gap-2.5 border border-amber-400/40"
									>
										<Calendar size={17} className="text-amber-300" />
										<span>Book VIP Site Tour &amp; Price List</span>
										<ArrowRight size={16} className="text-amber-300" />
									</button>
									<a
										href={PROJECT.wa}
										target="_blank"
										rel="noopener noreferrer"
										className="px-7 py-4 rounded-2xl bg-white/90 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-blue-300 dark:border-blue-700/60 text-slate-900 dark:text-white text-sm font-semibold tracking-wide shadow-xl backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-2.5"
									>
										<MessageCircle size={17} className="text-blue-500 dark:text-blue-400" />
										<span>WhatsApp Instant Assistance</span>
									</a>
									<a
										href={PROJECT.brochure}
										download="Shri-Villa-Brochure.pdf"
										target="_blank"
										rel="noopener noreferrer"
										className="px-6 py-4 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 text-sm font-bold shadow-md hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
									>
										<Download size={16} className="text-amber-600 dark:text-amber-400" />
										<span>Download Brochure</span>
									</a>
								</div>

								{/* Trust Strip */}
								<div className="mt-8 flex items-center justify-center gap-3 sm:gap-6 text-xs text-slate-700 dark:text-slate-300 flex-wrap font-semibold">
									<span className="flex items-center gap-1.5 text-blue-900 dark:text-blue-300 font-bold bg-blue-100/60 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-300 dark:border-blue-800">
										<ShieldCheck size={14} className="text-blue-600 dark:text-blue-400" /> Immediate Registry
									</span>
									<span className="flex items-center gap-1.5 bg-amber-100/60 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300">
										<Star size={13} className="text-amber-600 fill-amber-500" /> Bank Loan Approved (SBI, HDFC, ICICI)
									</span>
									<span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/70 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200">
										<Compass size={13} className="text-blue-500" /> 30 Ft+ Heavy Concrete Boulevards
									</span>
								</div>
							</div>
						</FadeUp>

						{/* Hero Cinematic Feature Showcase */}
						<FadeUp delay={200}>
							<div className="relative rounded-3xl overflow-hidden border-2 border-blue-300/80 dark:border-blue-500/40 shadow-[0_25px_60px_-15px_rgba(30,58,138,0.25)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl">
								<div className="relative h-80 sm:h-[500px] w-full overflow-hidden">
									<img
										src={I.heroLuxury}
										alt="Shri Villa Dehradun Luxury Mountain Villa Render"
										className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
									
									{/* Floating Highlight Badges Inside Hero */}
									<div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
										<div className="sv-glass-card rounded-2xl p-4 sm:p-5 max-w-md shadow-2xl border border-blue-400/40 dark:border-blue-400/30">
											<p className="text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
												<Sparkles size={12} className="text-amber-400" />
												<span>Limited 50 Exclusive Plots</span>
											</p>
											<p className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white">
												Bespoke Mountain Villa Sanctuary
											</p>
											<p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium leading-relaxed">
												Custom 2–3 storey hillside architectural freedom with serene Himalayan pine valley vistas.
											</p>
										</div>

										<div className="flex items-center gap-3 sv-glass-card rounded-2xl p-4 shadow-2xl border border-amber-400/40 dark:border-amber-400/30">
											<div className="text-right">
												<p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Plot Sizes</p>
												<p className="text-xl font-serif font-black text-amber-700 dark:text-amber-300">89 – 500 Sq.Yd</p>
											</div>
											<div className="h-8 w-px bg-amber-300 dark:bg-amber-700/60" />
											<div>
												<p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Total Land</p>
												<p className="text-sm font-bold text-slate-900 dark:text-white">22,941 Sq.Yd</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    2. KEY STATS - BENTO METRICS BAR
				══════════════════════════════════════════════════════════════ */}
				<section className="py-14 border-y border-blue-200/50 dark:border-blue-950/60 bg-white/60 dark:bg-[#071122]/90 backdrop-blur-2xl transition-colors duration-300 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
								{STATS_CARDS.map((stat, i) => (
									<div
										key={i}
										className="p-5 rounded-2xl sv-glass-card hover:border-amber-400/80 dark:hover:border-amber-400/60 hover:shadow-[0_12px_30px_rgba(217,119,6,0.15)] hover:-translate-y-1.5 transition-all duration-300 group text-center flex flex-col items-center justify-center cursor-default"
									>
										<div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-amber-100 dark:from-blue-950 dark:to-amber-950/70 border border-blue-300/50 dark:border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm">
											<stat.icon size={20} className="text-blue-900 dark:text-amber-300" />
										</div>
										<p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
											{stat.label}
										</p>
										<p className="text-lg md:text-xl font-serif font-black text-slate-900 dark:text-white mb-0.5 group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
											{stat.value}
										</p>
										<p className="text-[10px] text-blue-800/90 dark:text-blue-300/90 font-semibold line-clamp-1">
											{stat.sub}
										</p>
									</div>
								))}
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    3. THE GENESIS OF SHRI VILLA (Interactive Expanding Accordion)
				══════════════════════════════════════════════════════════════ */}
				<section id="genesis" className="py-24 md:py-32 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="text-center max-w-3xl mx-auto mb-16">
								<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 dark:bg-slate-900/80 border border-blue-300 dark:border-blue-700/60 text-blue-900 dark:text-blue-300 text-xs font-black tracking-widest uppercase mb-3">
									<Sparkles size={13} className="text-amber-500" />
									<span>THE GENESIS OF SHRI VILLA</span>
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
									A Life of Peace, Privacy &amp; Purpose
								</h2>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
									Immerse yourself in Dehradun’s cool mountain climate. Explore the harmony of nature and modern plotted infrastructure designed for multi-generational luxury living.
								</p>
							</div>
						</FadeUp>

						{/* 4-Image Interactive Accordion */}
						<FadeUp delay={200}>
							<div className="flex flex-col md:flex-row gap-4 h-[580px]">
								{GENESIS_PHOTOS.map((photo, i) => {
									const isActive = activeGenesis === i;
									return (
										<div
											key={photo.id}
											onMouseEnter={() => setActiveGenesis(i)}
											onClick={() => setActiveGenesis(i)}
											className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border ${
												isActive
													? 'flex-[4] shadow-2xl border-amber-400/80 dark:border-amber-400/60 ring-2 ring-amber-400/30'
													: 'flex-[1] opacity-75 hover:opacity-100 border-blue-950/40'
											}`}
										>
											<img
												src={photo.img}
												alt={photo.title}
												className="absolute inset-0 w-full h-full object-cover object-center"
											/>
											<div
												className={`absolute inset-0 transition-opacity duration-500 ${
													isActive
														? 'bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-100'
														: 'bg-black/50'
												}`}
											/>
											
											<div
												className={`absolute bottom-0 left-0 p-6 md:p-8 w-full transition-all duration-500 ${
													isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
												}`}
											>
												<span className="inline-block px-3.5 py-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3 shadow-lg border border-amber-300/40">
													{photo.tag}
												</span>
												<h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 leading-tight">
													{photo.title}
												</h3>
												<p className="text-slate-200 text-xs md:text-sm line-clamp-2 max-w-lg font-medium leading-relaxed">
													{photo.subtitle}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    4. UPGRADED TOWNSHIP MASTER SURVEY PLAN (Interactive Studio)
				══════════════════════════════════════════════════════════════ */}
				<section id="masterplan" className="py-24 md:py-32 border-y border-blue-200/50 dark:border-blue-950/60 bg-white/60 dark:bg-[#071122]/90 backdrop-blur-2xl transition-colors duration-300 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="text-center max-w-3xl mx-auto mb-14">
								<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-black tracking-widest uppercase mb-3">
									<Compass size={14} className="text-amber-500" />
									<span>OFFICIAL ARCHITECTURAL LAND SURVEY</span>
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
									Township Master Survey Plan
								</h2>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
									Detailed survey plan of land at Vill- Sorna, Dehradun (U.K.). Interactive zoomable blueprint showing 50 numbered plots, internal 30 Ft+ road network, and cardinal orientations.
								</p>
							</div>
						</FadeUp>

						{/* Interactive Master Plan Studio Box */}
						<FadeUp delay={200}>
							<div className="sv-glass-card rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-blue-300/60 dark:border-blue-800/80 mb-10">
								
								{/* Top Architectural Header Bar */}
								<div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-blue-100 dark:border-blue-900/60">
									<div>
										<h4 className="font-serif font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
											<span>SURVEY PLAN OF LAND AT VILL- SORNA, DEHRADUN</span>
										</h4>
										<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
											Surveyed by: <strong className="text-slate-700 dark:text-slate-200">Verma Plan &amp; Land Surveyors, Ring Road, Dehradun</strong>
										</p>
									</div>

									{/* Control Actions */}
									<div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-blue-900/80 shadow-sm">
										<button
											onClick={() => setPlanZoom(z => Math.max(1, +(z - 0.3).toFixed(1)))}
											disabled={planZoom <= 1}
											className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-blue-950 disabled:opacity-30 transition-all"
											title="Zoom Out"
										>
											<ZoomOut size={16} />
										</button>
										<span className="text-xs font-mono font-bold px-2 text-blue-900 dark:text-amber-300">
											{planZoom.toFixed(1)}x
										</span>
										<button
											onClick={() => setPlanZoom(z => Math.min(2.8, +(z + 0.3).toFixed(1)))}
											disabled={planZoom >= 2.8}
											className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-blue-950 disabled:opacity-30 transition-all"
											title="Zoom In"
										>
											<ZoomIn size={16} />
										</button>
										{planZoom > 1 && (
											<button
												onClick={resetPlanView}
												className="p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-blue-950 transition-all"
												title="Reset View"
											>
												<RotateCcw size={16} />
											</button>
										)}
										<button
											onClick={() => setLightboxImg(I.surveyPlanFull)}
											className="p-2 rounded-lg text-blue-700 dark:text-blue-300 hover:bg-white dark:hover:bg-blue-950 transition-all"
											title="Fullscreen Lightbox"
										>
											<Maximize2 size={16} />
										</button>
									</div>
								</div>

								{/* Blueprint Viewport with Drag & Pan */}
								<div
									className="relative h-[420px] sm:h-[580px] w-full rounded-2xl overflow-hidden bg-[#030914] border border-blue-900/80 flex items-center justify-center p-3 select-none shadow-inner"
									style={{ cursor: planZoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
									onMouseDown={handleMouseDown}
									onMouseMove={handleMouseMove}
									onMouseUp={handleMouseUp}
									onMouseLeave={handleMouseUp}
								>
									{/* Topographic Grid Texture */}
									<div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

									<div
										style={{
											transform: `translate(${planPan.x}px, ${planPan.y}px) scale(${planZoom})`,
											transformOrigin: 'center',
											transition: isPanning ? 'none' : 'transform 0.25s cubic-bezier(0.2,0,0,1)',
										}}
										className="w-full h-full flex items-center justify-center pointer-events-none"
									>
										<img
											src={I.surveyPlanFull}
											alt="Shri Villa Dehradun 50 Plot Master Survey Plan"
											className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
										/>
									</div>

									{/* Zoom / Pan Help Overlay */}
									{planZoom > 1 && (
										<div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[11px] text-blue-300 border border-blue-500/40 flex items-center gap-2 shadow-lg">
											<Move size={14} className="text-amber-400" />
											<span>Click &amp; Drag to Pan Blueprint</span>
										</div>
									)}

									{/* Top Right Scale Note */}
									<div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-amber-300 border border-amber-500/40 shadow-lg">
										1 Bigha = 752.52 SQMT
									</div>
								</div>

								{/* Master Survey Summary Strip */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5 pt-5 border-t border-blue-100 dark:border-blue-900/60 text-xs">
									<div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-400/80 hover:bg-white dark:hover:bg-blue-900/40 group cursor-default">
										<p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">Total Land Expanse</p>
										<p className="text-sm sm:text-base font-serif font-black text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">22,941.70 Sq.Yd</p>
										<p className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">2,06,475.34 Sq.Ft</p>
									</div>
									<div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-400/80 hover:bg-white dark:hover:bg-blue-900/40 group cursor-default">
										<p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">Road Infrastructure</p>
										<p className="text-sm sm:text-base font-serif font-black text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">5,014.16 Sq.Yd</p>
										<p className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">45,127.47 Sq.Ft dedicated</p>
									</div>
									<div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-400/80 hover:bg-white dark:hover:bg-blue-900/40 group cursor-default">
										<p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">Internal Road Width</p>
										<p className="text-sm sm:text-base font-serif font-black text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">30 Ft &amp; Above</p>
										<p className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold">Heavy-Duty Concrete Roads</p>
									</div>
									<div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-400/80 hover:bg-white dark:hover:bg-blue-900/40 group cursor-default">
										<p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">Registry &amp; Mutation</p>
										<p className="text-sm sm:text-base font-serif font-black text-amber-700 dark:text-amber-300 mt-0.5">Immediate Registry</p>
										<p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">100% Freehold Title</p>
									</div>
								</div>
							</div>
						</FadeUp>

						{/* Sector Zone Breakdown Cards */}
						<FadeUp delay={300}>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								{SECTOR_ZONES.map((zone, i) => (
									<div
										key={i}
										className="sv-glass-card p-6 rounded-2xl border border-blue-200/60 dark:border-blue-900/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-amber-400/80 dark:hover:border-amber-400/60 hover:shadow-blue-950/30 group cursor-default"
									>
										<span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/50 px-2.5 py-0.5 rounded-full mb-3 group-hover:scale-105 transition-transform">
											{zone.badge}
										</span>
										<h4 className="font-serif font-bold text-base text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
											{zone.title}
										</h4>
										<p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2 font-mono">
											{zone.plots} · {zone.sizes}
										</p>
										<p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
											{zone.desc}
										</p>
									</div>
								))}
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    5. PLOT INVENTORY & SIZES TABLE
				══════════════════════════════════════════════════════════════ */}
				<section id="inventory" className="py-24 md:py-32 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="text-center max-w-3xl mx-auto mb-14">
								<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 dark:bg-slate-900/80 border border-blue-300 dark:border-blue-700/60 text-blue-900 dark:text-blue-300 text-xs font-black tracking-widest uppercase mb-3">
									<Sparkles size={13} className="text-amber-500" />
									<span>PLOT SIZES &amp; DIMENSIONS</span>
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
									Curated Villa Plot Inventory
								</h2>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
									Choose from an exclusive selection of compact, standard luxury, and grand corner estate villa plots with clear freehold demarcations.
								</p>

								{/* Filter Pill Bar */}
								<div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:justify-center mt-6 sm:mt-8">
									<div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-blue-100/80 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-900 shadow-md backdrop-blur-md flex-nowrap min-w-max">
										{[
											{ id: 'All', label: 'All Plots (50)' },
											{ id: 'Compact', label: 'Compact (89–120 Sq.Yd)' },
											{ id: 'Standard', label: 'Standard (130–200 Sq.Yd)' },
											{ id: 'Grand Estate', label: 'Grand Estates (210–500 Sq.Yd)' },
										].map(f => (
											<button
												key={f.id}
												onClick={() => setPlotFilter(f.id)}
												className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
													plotFilter === f.id
														? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg border border-blue-400/30'
														: 'text-slate-600 dark:text-slate-300 hover:text-blue-800 dark:hover:text-amber-300'
												}`}
											>
												{f.label}
											</button>
										))}
									</div>
								</div>
							</div>
						</FadeUp>

						{/* Inventory Grid */}
						<FadeUp delay={200}>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
								{filteredPlots.map((plot) => (
									<div
										key={plot.id}
										className="sv-glass-card rounded-2xl p-5 hover:border-amber-400/70 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
									>
										<div>
											<div className="flex items-center justify-between mb-3.5">
												<span className="font-serif font-black text-xl text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
													{plot.plotNo}
												</span>
												<span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
													{plot.category}
												</span>
											</div>

											<div className="space-y-2.5 mb-5 text-xs">
												<div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-blue-950/60">
													<span className="text-slate-500 dark:text-slate-400">Plot Size:</span>
													<span className="font-serif font-black text-blue-800 dark:text-amber-300 text-base">{plot.sqyd} Sq.Yd</span>
												</div>
												<div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-blue-950/60">
													<span className="text-slate-500 dark:text-slate-400">Area (Sq.Ft):</span>
													<span className="font-semibold text-slate-800 dark:text-slate-200">{plot.sqft} sq.ft</span>
												</div>
												<div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-blue-950/60">
													<span className="text-slate-500 dark:text-slate-400">Location Note:</span>
													<span className="font-medium text-slate-700 dark:text-slate-300">{plot.highlight}</span>
												</div>
											</div>
										</div>

										<button
											onClick={() => {
												setLeadData(prev => ({ ...prev, message: `Inquiring about ${plot.plotNo} (${plot.sqyd} Sq.Yd) at Shri Villa Dehradun` }));
												setIsModalOpen(true);
											}}
											className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-amber-50 dark:from-blue-950/60 dark:to-amber-950/40 hover:from-blue-900 hover:to-indigo-900 hover:text-white text-blue-900 dark:text-amber-300 font-bold text-xs border border-blue-200 dark:border-blue-800 hover:border-transparent transition-all flex items-center justify-center gap-2 shadow-sm"
										>
											<span>Request Official Quote</span>
											<ChevronRight size={14} />
										</button>
									</div>
								))}
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    6. PLOT INVESTMENT & EMI ESTIMATOR CALCULATOR
				══════════════════════════════════════════════════════════════ */}
				<section id="calculator" className="py-24 md:py-32 border-y border-blue-200/50 dark:border-blue-950/60 bg-white/60 dark:bg-[#071122]/90 backdrop-blur-2xl transition-colors duration-300 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="text-center max-w-3xl mx-auto mb-16">
								<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-black tracking-widest uppercase mb-3">
									<Calculator size={14} className="text-amber-500" />
									<span>TRANSPARENT FINANCIAL PLANNING</span>
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
									Plot Investment &amp; EMI Estimator
								</h2>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
									Calculate your estimated down payment, bank loan eligibility, and monthly EMI based on your preferred plot size.
								</p>
							</div>
						</FadeUp>

						<FadeUp delay={200}>
							<div className="sv-glass-card rounded-3xl p-6 md:p-10 shadow-2xl max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-2 border-blue-300/60 dark:border-blue-800/80">
								
								{/* Controls Left Column */}
								<div className="lg:col-span-7 space-y-6">
									<div>
										<div className="flex justify-between items-center mb-2">
											<label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
												Plot Size (Sq. Yards)
											</label>
											<span className="text-xl font-serif font-black text-blue-900 dark:text-amber-300">
												{calcSqYd} Sq.Yd
											</span>
										</div>
										<input
											type="range"
											min="89"
											max="500"
											step="10"
											value={calcSqYd}
											onChange={(e) => setCalcSqYd(Number(e.target.value))}
											className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-blue-950 rounded-lg"
										/>
										<div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
											<span>89 Sq.Yd (Compact)</span>
											<span>250 Sq.Yd</span>
											<span>500 Sq.Yd (Grand Estate)</span>
										</div>
									</div>

									<div>
										<div className="flex justify-between items-center mb-2">
											<label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
												Down Payment Contribution
											</label>
											<span className="text-xl font-serif font-black text-blue-900 dark:text-amber-300">
												{calcDownPaymentPct}% (₹{Math.round(downPaymentAmount).toLocaleString('en-IN')})
											</span>
										</div>
										<input
											type="range"
											min="20"
											max="50"
											step="5"
											value={calcDownPaymentPct}
											onChange={(e) => setCalcDownPaymentPct(Number(e.target.value))}
											className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-blue-950 rounded-lg"
										/>
										<div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
											<span>20% (Standard)</span>
											<span>35%</span>
											<span>50%</span>
										</div>
									</div>

									<div>
										<div className="flex justify-between items-center mb-2">
											<label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
												Bank Loan Tenure
											</label>
											<span className="text-xl font-serif font-black text-blue-900 dark:text-amber-300">
												{calcTenureYears} Years
											</span>
										</div>
										<input
											type="range"
											min="5"
											max="20"
											step="1"
											value={calcTenureYears}
											onChange={(e) => setCalcTenureYears(Number(e.target.value))}
											className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-blue-950 rounded-lg"
										/>
										<div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
											<span>5 Years</span>
											<span>10 Years</span>
											<span>20 Years</span>
										</div>
									</div>
								</div>

								{/* Summary Right Column */}
								<div className="lg:col-span-5 bg-gradient-to-br from-[#051124] via-[#091a38] to-[#040a16] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
									<div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
									
									<div>
										<p className="text-[11px] uppercase font-black tracking-widest text-amber-300 mb-1">
											Estimated Investment
										</p>
										<h4 className="text-3xl font-serif font-black mb-6 text-white">
											₹{Math.round(totalPlotCost).toLocaleString('en-IN')}*
										</h4>

										<div className="space-y-3 pb-6 border-b border-blue-900/60 text-xs">
											<div className="flex justify-between">
												<span className="text-blue-200">Down Payment ({calcDownPaymentPct}%):</span>
												<span className="font-bold font-mono">₹{Math.round(downPaymentAmount).toLocaleString('en-IN')}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-200">Loan Amount ({100 - calcDownPaymentPct}%):</span>
												<span className="font-bold font-mono">₹{Math.round(loanAmount).toLocaleString('en-IN')}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-blue-200">Bank Interest Rate:</span>
												<span className="font-bold">{calcInterestRate}% p.a.</span>
											</div>
										</div>

										<div className="pt-6">
											<p className="text-[10px] uppercase font-bold text-amber-300/90 mb-1">
												Estimated Monthly EMI
											</p>
											<p className="text-3xl font-serif font-black text-amber-300">
												₹{estimatedEmi.toLocaleString('en-IN')} <span className="text-xs font-sans font-normal text-blue-200">/ mo*</span>
											</p>
										</div>
									</div>

									<button
										onClick={() => setIsModalOpen(true)}
										className="sv-gold-shimmer-btn mt-8 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all border border-amber-300"
									>
										Request Official Quotation
									</button>
								</div>
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    7. MODERN LIFESTYLE AMENITIES SHOWCASE
				══════════════════════════════════════════════════════════════ */}
				<section id="amenities" className="py-24 md:py-32 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="text-center max-w-3xl mx-auto mb-16">
								<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 dark:bg-slate-900/80 border border-blue-300 dark:border-blue-700/60 text-blue-900 dark:text-blue-300 text-xs font-black tracking-widest uppercase mb-3">
									<Sparkles size={13} className="text-amber-500" />
									<span>WORLD-CLASS TOWNSHIP INFRASTRUCTURE</span>
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
									Modern Amenities to Elevate Your Lifestyle
								</h2>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
									From sports arenas and clubhouse entertainment to sacred devotional spaces, every convenience is thoughtfully integrated.
								</p>

								{/* Amenity Filter */}
								<div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:justify-center mt-6 sm:mt-8">
									<div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-blue-100/80 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-900 shadow-md backdrop-blur-md flex-nowrap min-w-max">
										{[
											{ id: 'All', label: 'All Amenities (12)' },
											{ id: 'Clubhouse', label: 'Clubhouse & Pool' },
											{ id: 'Sports', label: 'Sports & Gym' },
											{ id: 'Community', label: 'Community & Temple' },
											{ id: 'Safety', label: 'Safety & Roads' },
										].map(f => (
											<button
												key={f.id}
												onClick={() => setAmenityFilter(f.id)}
												className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
													amenityFilter === f.id
														? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg border border-blue-400/30'
														: 'text-slate-600 dark:text-slate-300 hover:text-blue-800 dark:hover:text-amber-300'
												}`}
											>
												{f.label}
											</button>
										))}
									</div>
								</div>
							</div>
						</FadeUp>

						{/* Amenities Cards Grid */}
						<FadeUp delay={200}>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{filteredAmenities.map((amenity) => (
									<div
										key={amenity.id}
										className="sv-glass-card rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(29,78,216,0.2)] hover:-translate-y-2 transition-all duration-500 flex flex-col group border border-blue-200/60 dark:border-blue-800/60"
									>
										<div className="relative h-48 w-full overflow-hidden bg-slate-900">
											<img
												src={amenity.img}
												alt={amenity.name}
												className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
												onError={(e) => {
													if (amenity.fallbackImg) {
														e.target.src = amenity.fallbackImg;
													}
												}}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
											<div className="absolute top-3.5 right-3.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-amber-300 border border-amber-500/40 shadow-lg">
												{amenity.highlight}
											</div>
										</div>

										<div className="p-6 flex-1 flex flex-col justify-between">
											<div>
												<div className="flex items-center gap-3 mb-2.5">
													<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-amber-100 dark:from-blue-950 dark:to-amber-950/80 border border-blue-300 dark:border-amber-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
														<amenity.icon size={18} className="text-blue-900 dark:text-amber-300" />
													</div>
													<h3 className="font-serif font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
														{amenity.name}
													</h3>
												</div>
												<p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
													{amenity.desc}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    8. PRIME LOCATION & UNMATCHED CONNECTIVITY
				══════════════════════════════════════════════════════════════ */}
				<section id="connectivity" className="py-24 md:py-32 border-y border-blue-200/50 dark:border-blue-950/60 bg-white/60 dark:bg-[#071122]/90 backdrop-blur-2xl transition-colors duration-300 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="text-center max-w-3xl mx-auto mb-16">
								<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-black tracking-widest uppercase mb-3">
									<Navigation size={14} className="text-amber-500" />
									<span>STRATEGIC LOCATION &amp; ARTERIAL HIGHWAYS</span>
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
									Prime Location &amp; Unmatched Connectivity
								</h2>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
									Situated in Vill- Sorna, Dehradun with rapid access to national expressways, premier education, super-specialty hospitals, and Mussoorie hill escapes.
								</p>

								{/* Connectivity Tab Buttons */}
								<div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:justify-center mt-6 sm:mt-8">
									<div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-blue-100/80 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-900 shadow-md backdrop-blur-md flex-nowrap min-w-max">
										{[
											{ id: 'local', label: 'Local Landmarks (0–15 KM)' },
											{ id: 'regional', label: 'Regional Transit (Air/Expressway)' },
											{ id: 'scenic', label: 'Hill Getaways (Mussoorie/Rishikesh)' },
										].map(t => (
											<button
												key={t.id}
												onClick={() => setConnectTab(t.id)}
												className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
													connectTab === t.id
														? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg border border-blue-400/30'
														: 'text-slate-600 dark:text-slate-300 hover:text-blue-800 dark:hover:text-amber-300'
												}`}
											>
												{t.label}
											</button>
										))}
									</div>
								</div>
							</div>
						</FadeUp>

						<FadeUp delay={200}>
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
								
								{/* Left: Interactive Map Graphic */}
								<div className="lg:col-span-6">
									<div className="sv-glass-card rounded-3xl p-5 shadow-2xl overflow-hidden border-2 border-blue-300/60 dark:border-blue-800/80">
										<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950">
											<img
												src={I.connectivityMap}
												alt="Shri Villa Dehradun Connectivity Route Map"
												className="w-full h-full object-cover"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
											<div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs text-white border border-blue-500/40 flex items-center gap-2 shadow-lg">
												<MapPin size={15} className="text-amber-400" />
												<span className="font-semibold">Vill- Sorna, Dehradun (Near Yamunotri Hwy)</span>
											</div>
										</div>
									</div>
								</div>

								{/* Right: Distance List */}
								<div className="lg:col-span-6 space-y-3.5">
									{CONNECTIVITY_DATA[connectTab].map((item, idx) => (
										<div
											key={idx}
											className="sv-glass-card rounded-2xl p-4 sm:p-5 hover:border-amber-400/80 transition-all flex items-center justify-between gap-4 group cursor-default shadow-md"
										>
											<div className="flex items-center gap-4">
												<div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-amber-100 dark:from-blue-950 dark:to-amber-950/80 border border-blue-300 dark:border-amber-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
													<item.icon size={20} className="text-blue-900 dark:text-amber-300" />
												</div>
												<div>
													<h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
														{item.name}
													</h4>
													<p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
														{item.desc}
													</p>
												</div>
											</div>

											<div className="text-right flex-shrink-0">
												<span className="font-serif font-black text-sm sm:text-base text-blue-800 dark:text-amber-300 block">
													{item.dist}
												</span>
												<span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
													~{item.time}
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
				    9. WHY INVEST IN DEHRADUN PLOTTED LAND (ROI PILLARS)
				══════════════════════════════════════════════════════════════ */}
				<section className="py-24 md:py-32 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="text-center max-w-3xl mx-auto mb-16">
								<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 dark:bg-slate-900/80 border border-blue-300 dark:border-blue-700/60 text-blue-900 dark:text-blue-300 text-xs font-black tracking-widest uppercase mb-3">
									<Sparkles size={13} className="text-amber-500" />
									<span>THE INVESTMENT ADVANTAGE</span>
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
									Why Invest in Shri Villa Dehradun?
								</h2>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
									Capitalize on Uttarakhand’s highest growth corridor powered by mega highway infrastructure and booming mountain tourism.
								</p>
							</div>
						</FadeUp>

						<FadeUp delay={200}>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								{[
									{
										title: '2.5 Hr Delhi Expressway',
										desc: 'The new Delhi-Dehradun Greenfield Expressway slashes commute time to just 2.5 hours, driving unprecedented NCR holiday home demand.',
										icon: Car,
										tag: 'Massive Connectivity'
									},
									{
										title: '15%–20% YoY Appreciation',
										desc: 'Plotted land in Dehradun foothills is scarce and freehold titles command steep capital appreciation year after year.',
										icon: TrendingUp,
										tag: 'High Capital Growth'
									},
									{
										title: 'Pristine AQI & Climate',
										desc: 'Escape polluted metropolitan smog to enjoy year-round sub-35 AQI, refreshing pine breezes, and temperate Himalayan summers.',
										icon: Wind,
										tag: 'Holistic Wellness'
									},
									{
										title: 'Lucrative Airbnb Yields',
										desc: 'High demand for mountain chalets on homestay platforms ensures consistent seasonal rental returns for villa owners.',
										icon: Building2,
										tag: 'Passive Rental Income'
									},
								].map((pillar, i) => (
									<div
										key={i}
										className="sv-glass-card rounded-3xl p-7 hover:border-amber-400/70 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between group"
									>
										<div>
											<span className="inline-block px-3 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 text-[10px] font-black uppercase mb-5">
												{pillar.tag}
											</span>
											<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-amber-100 dark:from-blue-950 dark:to-amber-950/80 border border-blue-300 dark:border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-md">
												<pillar.icon size={26} className="text-blue-900 dark:text-amber-300" />
											</div>
											<h4 className="font-serif font-black text-xl text-slate-900 dark:text-white mb-2.5 group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
												{pillar.title}
											</h4>
											<p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
												{pillar.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    10. ABOUT GRDA INFRA PRIVATE LIMITED
				══════════════════════════════════════════════════════════════ */}
				<section id="developer" className="py-24 md:py-32 border-y border-blue-200/50 dark:border-blue-950/60 bg-white/60 dark:bg-[#071122]/90 backdrop-blur-2xl transition-colors duration-300 relative">
					<div className="container mx-auto max-w-7xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
								<div className="lg:col-span-6 space-y-6">
									<div>
										<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-300 text-xs font-bold mb-4">
											<Award size={14} className="text-amber-500" />
											<span>A Legacy of Transparency &amp; Growth</span>
										</div>
										<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
											GRDA INFRA PRIVATE LIMITED
										</h2>
										<p className="text-lg font-serif italic text-blue-900 dark:text-amber-300">
											"The Best Investment on Earth is Earth."
										</p>
									</div>

									<div className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
										<p>
											GRDA Infra is a premier real estate developer with 10 years of proven expertise across Delhi NCR, Bihar, and Uttarakhand. We specialize in luxury freehold residential plots, holiday estates, and integrated townships.
										</p>
										<p>
											With over 300+ acres of delivered plotted developments, we transform pristine hill landscapes into thriving lifestyle destinations. Our cornerstone values remain 100% clear legal titles, timely infrastructure, and uncompromised investor trust.
										</p>
									</div>

									<div className="grid grid-cols-2 gap-4 pt-2">
										<div className="p-5 rounded-2xl sv-glass-card border border-blue-300/60 dark:border-blue-800">
											<p className="text-3xl font-serif font-black text-amber-600 dark:text-amber-300">10+ Yrs</p>
											<p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">Industry Excellence</p>
										</div>
										<div className="p-5 rounded-2xl sv-glass-card border border-blue-300/60 dark:border-blue-800">
											<p className="text-3xl font-serif font-black text-blue-700 dark:text-blue-400">300+ Acres</p>
											<p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">Delivered Development</p>
										</div>
									</div>

									<div className="pt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
										<p><strong>Regd. Office:</strong> A/506, Kamla Niketan, S K Puri, Boring Road, Patna - 800001</p>
										<p><strong>Corp. Office:</strong> Unit UG A09, Tower T3, NX One, Greater Noida West - 201306</p>
										<p><strong>Official Web:</strong> www.grdainfra.com | info@grdainfra.com</p>
									</div>
								</div>

								<div className="lg:col-span-6">
									<div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-300/80 dark:border-blue-700">
										<img
											src={I.forestMansion}
											alt="GRDA Infra Developer Legacy"
											className="w-full h-[460px] object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
										<div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-500/40 text-white shadow-2xl">
											<p className="text-xs uppercase font-black tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
												<ShieldCheck size={14} className="text-blue-400" />
												<span>Authentic Developer Track Record</span>
											</p>
											<p className="text-sm font-semibold text-slate-200">
												100% Freehold Land Parcels with Legally Verified Title Deeds &amp; Bank Loans.
											</p>
										</div>
									</div>
								</div>
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    11. FREQUENTLY ASKED QUESTIONS (Accordion)
				══════════════════════════════════════════════════════════════ */}
				<section id="faqs" className="py-24 md:py-32 relative">
					<div className="container mx-auto max-w-4xl px-4 md:px-8">
						<FadeUp delay={100}>
							<div className="text-center mb-14">
								<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 dark:bg-slate-900/80 border border-blue-300 dark:border-blue-700/60 text-blue-900 dark:text-blue-300 text-xs font-black tracking-widest uppercase mb-3">
									<Sparkles size={13} className="text-amber-500" />
									<span>CLARITY &amp; PEACE OF MIND</span>
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-tight mb-4">
									Frequently Asked Questions
								</h2>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
									Everything you need to know about purchasing, registry, and building a luxury villa at Shri Villa Dehradun.
								</p>
							</div>
						</FadeUp>

						<FadeUp delay={200}>
							<div className="space-y-4">
								{FAQS.map((faq, i) => {
									const isOpen = activeFaq === i;
									return (
										<div
											key={i}
											className="sv-glass-card rounded-2xl overflow-hidden border border-blue-200/60 dark:border-blue-800/60 transition-all shadow-md"
										>
											<button
												onClick={() => setActiveFaq(isOpen ? null : i)}
												className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-blue-700 dark:hover:text-amber-300 transition-colors"
											>
												<span>{faq.q}</span>
												<ChevronDown
													size={20}
													className={`transform transition-transform duration-300 flex-shrink-0 text-amber-500 ${
														isOpen ? 'rotate-180' : ''
													}`}
												/>
											</button>
											{isOpen && (
												<div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-t border-slate-100 dark:border-blue-900/40 pt-4">
													{faq.a}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</FadeUp>
					</div>
				</section>

				{/* ══════════════════════════════════════════════════════════════
				    12. VIP MOUNTAIN SITE VISIT & PRICE LIST MODAL
				══════════════════════════════════════════════════════════════ */}
				{isModalOpen && (
					<div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
						<div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#071120] border-2 border-blue-300 dark:border-blue-600 p-6 sm:p-8 shadow-2xl overflow-hidden">
							<button
								onClick={() => setIsModalOpen(false)}
								className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
							>
								<X size={18} />
							</button>

							<div className="mb-6">
								<span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
									Exclusive VIP Access
								</span>
								<h3 className="text-2xl font-serif font-black text-slate-900 dark:text-white mt-1">
									Schedule Mountain Site Visit
								</h3>
								<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
									Get guaranteed plot allocation, brochure PDF &amp; complimentary Dehradun pickup.
								</p>
							</div>

							{submitSuccess ? (
								<div className="py-8 text-center space-y-3">
									<div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
										<CheckCircle2 size={32} />
									</div>
									<h4 className="text-xl font-bold text-slate-900 dark:text-white">Inquiry Received!</h4>
									<p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
										Our senior project counselor will contact you shortly with the complete survey layout and price sheet.
									</p>
								</div>
							) : (
								<form onSubmit={handleFormSubmit} className="space-y-3.5">
									<div>
										<label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
											Full Name *
										</label>
										<input
											type="text"
											required
											placeholder="e.g. Rahul Sharma"
											value={leadData.name}
											onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
											className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-900 bg-slate-50 dark:bg-[#040914] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div>
										<label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
											Phone Number *
										</label>
										<input
											type="tel"
											required
											placeholder="e.g. +91 98765 43210"
											value={leadData.phone}
											onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
											className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-900 bg-slate-50 dark:bg-[#040914] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
												Preferred Plot Size
											</label>
											<select
												value={leadData.preferredSize}
												onChange={(e) => setLeadData({ ...leadData, preferredSize: e.target.value })}
												className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-blue-900 bg-slate-50 dark:bg-[#040914] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
											>
												<option value="98 Sq.Yd">~98 Sq.Yd (Compact)</option>
												<option value="150 Sq.Yd">~150 Sq.Yd (Standard)</option>
												<option value="250 Sq.Yd">~250 Sq.Yd (Premium)</option>
												<option value="500 Sq.Yd">500 Sq.Yd (Grand Estate)</option>
											</select>
										</div>
										<div>
											<label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
												Tentative Visit Date
											</label>
											<input
												type="date"
												value={leadData.visitDate}
												onChange={(e) => setLeadData({ ...leadData, visitDate: e.target.value })}
												className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-blue-900 bg-slate-50 dark:bg-[#040914] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
									</div>

									<div>
										<label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
											Specific Queries / Requirements
										</label>
										<textarea
											rows="2"
											placeholder="e.g. Interested in corner plots or immediate registry process"
											value={leadData.message}
											onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
											className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-blue-900 bg-slate-50 dark:bg-[#040914] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
										></textarea>
									</div>

									<button
										type="submit"
										disabled={isSubmitting}
										className="sv-shimmer-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 mt-2 border border-amber-400/40"
									>
										{isSubmitting ? (
											<span>Submitting...</span>
										) : (
											<>
												<span>Confirm VIP Site Visit &amp; Callback</span>
												<ArrowRight size={14} className="text-amber-300" />
											</>
										)}
									</button>
								</form>
							)}
						</div>
					</div>
				)}

				{/* ══════════════════════════════════════════════════════════════
				    13. FULLSCREEN IMAGE LIGHTBOX
				══════════════════════════════════════════════════════════════ */}
				{lightboxImg && (
					<div
						onClick={() => setLightboxImg(null)}
						className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md p-4 sm:p-6 flex flex-col items-center justify-center cursor-zoom-out"
					>
						{/* High-visibility prominent floating close button */}
						<button
							onClick={(e) => {
								e.stopPropagation();
								setLightboxImg(null);
							}}
							className="fixed top-5 right-5 sm:top-7 sm:right-7 z-[100000] px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-2xl border-2 border-white/90 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
						>
							<X size={18} />
							<span>Close Preview (Esc)</span>
						</button>

						<div className="relative max-h-[85vh] max-w-[92vw] flex items-center justify-center pointer-events-none">
							<img
								src={lightboxImg}
								alt="Enlarged View"
								className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl border border-blue-500/30"
							/>
						</div>

						<p className="text-slate-400 text-xs mt-4 font-medium text-center">
							Click anywhere outside or press Esc to close
						</p>
					</div>
				)}

			</main>
		</Layout>
	);
}
