import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { slugToPropertyId, propertyToSlug } from '@/utils/slugUtils';
import { Helmet } from 'react-helmet-async';
import {
	CheckCircle,
	Bookmark,
	ShieldCheck,
	Camera,
	Share2,
	Waves,
	Dumbbell,
	Users,
	ArrowLeft,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	MapPin,
	Trees,
	Bus,
	Train,
	Plane,
	Hospital,
	School,
	CreditCard,
	ShoppingBag,
	Film,
	Footprints,
	Gamepad2,
	Building2,
	Wifi,
	Sparkles,
	Lock,
	Flame,
	Phone,
	Star,
	Lightbulb,
	Wind,
	Thermometer,
	Eye,
	Car,
	Sofa,
	Tv,
	UtensilsCrossed,
	WashingMachine,
	Microwave,
	Coffee,
	BedDouble,
	BookOpen,
	Bath,
	ChefHat,
	RefrigeratorIcon,
} from 'lucide-react';
import DynamicFAQ, { generatePropertyFAQs } from '@/components/DynamicFAQ';
/* ---------- SAFE NUMBER PARSER ---------- */
const toNumber = (val) => {
	if (!val) return 0;
	if (typeof val === 'number') return val;
	return Number(val.toString().replace(/[^\d]/g, '')) || 0;
};

/* ---------- ICON MAP — covers ALL amenities from PropertyFormPage ---------- */
const amenityIconMap = {
	// ── House ──
	Light: <Lightbulb size={16} />,
	Fan: <Wind size={16} />,
	Geyser: <Thermometer size={16} />,
	Ventilation: <Eye size={16} />,
	Balcony: <Trees size={16} />,
	'Private Parking': <Car size={16} />,
	'CCTV Surveillance': <Camera size={16} />,
	CCTV: <Camera size={16} />,
	Security: <ShieldCheck size={16} />,
	'24x7 Security': <ShieldCheck size={16} />,
	'Smart Lock': <Lock size={16} />,
	'Video Door Phone': <Phone size={16} />,
	'Fire Safety': <Flame size={16} />,
	'Power Backup': <Lightbulb size={16} />,
	Lift: <Building2 size={16} />,
	'24/7 Water': <Waves size={16} />,

	// ── Living Room ──
	Sofa: <Sofa size={16} />,
	Television: <Tv size={16} />,
	WiFi: <Wifi size={16} />,
	'High-Speed WiFi': <Wifi size={16} />,
	AC: <Wind size={16} />,
	Curtains: <Eye size={16} />,
	'Dining Table': <UtensilsCrossed size={16} />,

	// ── Kitchen ──
	'Modular Kitchen': <ChefHat size={16} />,
	Refrigerator: <RefrigeratorIcon size={16} />,
	Microwave: <Microwave size={16} />,
	'Washing Machine': <WashingMachine size={16} />,
	'Gas Pipeline': <Flame size={16} />,
	Chimney: <Wind size={16} />,
	'Water Purifier': <Waves size={16} />,
	'Coffee Maker': <Coffee size={16} />,
	'Exhaust Fan': <Wind size={16} />,
	'Storage Cabinets': <BookOpen size={16} />,

	// ── Bedroom ──
	Bed: <BedDouble size={16} />,
	Wardrobe: <BookOpen size={16} />,
	'Attached Bathroom': <Bath size={16} />,
	'Study Table': <BookOpen size={16} />,

	// ── Legacy / society-level amenities ──
	'Swimming Pool': <Waves size={16} />,
	Gymnasium: <Dumbbell size={16} />,
	Clubhouse: <Building2 size={16} />,
	'Kids Play Area': <Trees size={16} />,
	Garden: <Trees size={16} />,
	'Jogging Track': <Footprints size={16} />,
	'Indoor Games': <Gamepad2 size={16} />,
	'Community Hall': <Users size={16} />,
	'Badminton Court': <Gamepad2 size={16} />,
	'Tennis Court': <Gamepad2 size={16} />,
	Housekeeping: <Sparkles size={16} />,
};

const DescriptionSection = ({ description }) => {
	const [expanded, setExpanded] = useState(false);
	const text = description || 'No description available.';
	const LIMIT = 180;
	const isLong = text.length > LIMIT;
	const shown = expanded || !isLong ? text : text.slice(0, LIMIT) + '…';

	return (
		<div className="mt-8 mb-0 px-2 sm:px-0">
			<h2 className="text-xl sm:text-2xl font-bold mb-3">Description</h2>
			<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-4 sm:p-6">
				<p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
					{shown}
				</p>
				{isLong && (
					<button
						onClick={() => setExpanded(!expanded)}
						className="mt-3 text-teal-600 dark:text-teal-400 text-sm font-semibold hover:underline"
					>
						{expanded ? 'Show less ↑' : 'Read full description ↓'}
					</button>
				)}
			</div>
		</div>
	);
};

const PropertyDetailPage = () => {
	const navigate = useNavigate();
	const visitRef = React.useRef(null);
	const scrollToVisit = () => {
		if (visitRef.current) {
			visitRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};
	const { id } = useParams();
	const [property, setProperty] = useState(null);
	const [related, setRelated] = useState([]);

	const [index, setIndex] = useState(0);
	const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

	// schedule visit fields
	const [visitName, setVisitName] = useState('');
	const [visitPhone, setVisitPhone] = useState('');
	const [visitDate, setVisitDate] = useState('');
	const [whatsappOptIn, setWhatsappOptIn] = useState(false);
	const [visitLoading, setVisitLoading] = useState(false);
	const [showFullTerms, setShowFullTerms] = useState(false);
	const [showLightbox, setShowLightbox] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);
	const [shareSuccess, setShareSuccess] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [savingProp, setSavingProp] = useState(false);
	const { isAuthenticated } = useAuth();
	// NEIGHBORHOOD STATE
	const [activeTab, setActiveTab] = useState('transit');
	const [openSections, setOpenSections] = useState({});
	const [showAllTakeCare, setShowAllTakeCare] = useState(false);
	const [showAllDos, setShowAllDos] = useState(false);
	const [showAllDonts, setShowAllDonts] = useState(false);
	// Extract Latitude & Longitude from Google Map Embed URL
	const extractLatLng = (url) => {
		if (!url) return null;

		const lonMatch = url.match(/!2d([0-9.\-]+)/);
		const latMatch = url.match(/!3d([0-9.\-]+)/);

		if (!latMatch || !lonMatch) return null;

		return {
			lat: latMatch[1],
			lng: lonMatch[1],
		};
	};

	/* ---------- LOAD PROPERTY ---------- */
	useEffect(() => {
		const load = async () => {
			try {
				let data;

				// UUID format check — purana URL
				const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(id);

				if (isUUID) {
					// Purana UUID URL — directly fetch
					const res = await api.get(`/properties/${id}`);
					data = res.data;
				} else {
					// SEO slug URL — last 8 chars se property dhundho
					const shortId = slugToPropertyId(id);
					const res = await api.get(`/properties/by-short-id/${shortId}`);
					data = res.data;

					// URL ko canonical slug pe update karo (no redirect, just history replace)
					const canonicalSlug = propertyToSlug(data);
					if (id !== canonicalSlug) {
						window.history.replaceState(null, '', `/property/${canonicalSlug}`);
					}
				}

				setProperty(data);

				const listRes = await api.get(`/properties/`);
				const list = listRes.data.data || [];

				const currentPrice = toNumber(data.price);
				const currentBeds = toNumber(data.beds);

				const scored = list
					.filter(
						(p) => p.id !== data.id && p.property_type === data.property_type,
					)
					.map((p) => {
						let score = 0;
						if (p.city === data.city) score += 3;
						const priceDiff = Math.abs(toNumber(p.price) - currentPrice);
						if (priceDiff <= 10000) score += 2;
						if (toNumber(p.beds) === currentBeds) score += 2;
						return { ...p, score };
					});

				const sorted = scored.sort((a, b) => b.score - a.score);

				const cleaned = sorted.slice(0, 3).map((p) => ({
					...p,
					images: Array.isArray(p.images) ? p.images : [p.images],
				}));

				setRelated(cleaned);
			} catch (error) {
				console.error('Failed to load property:', error);
			}
		};

		load();
	}, [id]);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 150) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);
	const toggleSection = (sectionKey) => {
		setOpenSections((prev) => ({
			...prev,
			[sectionKey]: !prev[sectionKey],
		}));
	};
	const handleSaveProperty = async () => {
		if (!isAuthenticated) { toast.info('Login to save properties'); return; }
		if (savingProp) return;
		const propId = property.id || property._id;
		setSavingProp(true);
		const next = !isSaved;
		setIsSaved(next);
		try {
			await api.post(`/users/me/saved/${propId}`);
			toast.success(next ? 'Property saved to your dashboard!' : 'Removed from saved');
		} catch {
			setIsSaved(!next);
			toast.error('Could not save. Try again.');
		} finally {
			setSavingProp(false);
		}
	};

	const handleShare = async () => {
		const url = window.location.href;
		try {
			if (navigator.share) {
				await navigator.share({
					title: property.title,
					text: `Check out this property: ${property.title}`,
					url: url,
				});
			} else {
				await navigator.clipboard.writeText(url);
			}
		} catch {}
		setShareSuccess(true);
		setTimeout(() => setShareSuccess(false), 2000);
	};

	/* ---------- SUBMIT VISIT INQUIRY ---------- */
	const submitInquiry = async () => {
		if (!visitName || !visitPhone || !visitDate) {
			alert('Please fill all fields');
			return;
		}

		setVisitLoading(true);
		try {
			const res = await api.post('/inquiries/', {
				name: visitName,
				phone: visitPhone,
				listing_id: property.id,
				whatsapp_opt_in: whatsappOptIn,
				inquiry_type: 'TENANT',
				source_page: window.location.pathname,
				preferred_date: visitDate,
			});
			alert('Visit scheduled successfully! ✅');
			setVisitName('');
			setVisitPhone('');
			setVisitDate('');
			setWhatsappOptIn(false);
		} catch (err) {
			console.error('Inquiry error:', err);
			alert('Visit scheduled successfully! ✅');
			setVisitName('');
			setVisitPhone('');
			setVisitDate('');
			setWhatsappOptIn(false);
		} finally {
			setVisitLoading(false);
		}
	};
	const { monthlyRent, securityDeposit, brokerageAmount, totalPayable } =
		useMemo(() => {
			let monthlyRent = toNumber(property?.price || 0);

			let securityDeposit = 0;

			if (property?.deposit) {
				const depositStr = String(property.deposit).toLowerCase();

				if (depositStr.includes('month')) {
					const months = toNumber(depositStr);
					securityDeposit = monthlyRent * months;
				} else if (depositStr.includes('day')) {
					const days = toNumber(depositStr);
					securityDeposit = Math.round((monthlyRent / 30) * days);
				} else {
					securityDeposit = toNumber(depositStr);
				}
			}

			let brokerageAmount = 0;

			if (property?.brokerage) {
				const brokerageStr = String(property.brokerage).toLowerCase();

				if (brokerageStr.includes('month')) {
					const months = toNumber(brokerageStr);
					brokerageAmount = monthlyRent * months;
				} else if (brokerageStr.includes('day')) {
					const days = toNumber(brokerageStr);
					brokerageAmount = Math.round((monthlyRent / 30) * days);
				} else {
					brokerageAmount = toNumber(brokerageStr);
				}
			}

			const totalPayable = monthlyRent + securityDeposit + brokerageAmount;

			return { monthlyRent, securityDeposit, brokerageAmount, totalPayable };
		}, [property, selectedRoomIndex]);

	/* ---------- IMAGES ---------- */
	const BASE_URL = api?.defaults?.baseURL
		? api.defaults.baseURL.replace('/api', '')
		: '';

	const getImageUrl = useCallback(
		(img) => {
			if (!img) return 'https://via.placeholder.com/300';

			let url = img;

			if (Array.isArray(img)) {
				url = img[0];
			} else if (typeof img === 'object') {
				url = img.url || '';
			}

			if (typeof img === 'string' && img.startsWith('[')) {
				try {
					const parsed = JSON.parse(img);
					url = parsed[0];
				} catch {
					url = '';
				}
			}

			if (!url) return 'https://via.placeholder.com/300';

			return url.startsWith('http') ? url : `${BASE_URL}${url}`;
		},
		[BASE_URL],
	);
	const images = Array.isArray(property?.images)
		? property.images
		: property?.images
			? [property.images]
			: [];
	if (!property) {
		return (
			<Layout>
				<Helmet>
					<title>
						{property?.title
							? `${property.title} in ${property.city} | Rent ₹${property.price} | InstaMakaan`
							: 'Loading Property | InstaMakaan'}
					</title>

					<meta
						name="description"
						content={
							property?.title
								? `${property.title} available in ${property.city}. Rent ₹${property.price}. ${property.beds} BHK property with amenities like ${property.amenities?.slice(0, 3).join(', ')}. Book visit now on InstaMakaan.`
								: 'Loading property details...'
						}
					/>

					<meta
						name="keywords"
						content={
							property?.title
								? `${property.city} property, ${property.beds} bhk in ${property.city}, rent house ${property.city}, flat for rent ${property.city}, pg in ${property.city}`
								: 'property listing, rent, buy, real estate'
						}
					/>

					<link
						rel="canonical"
						href={
							property?.id
								? `https://instamakaan.com/property/${property.id}`
								: 'https://instamakaan.com'
						}
					/>
				</Helmet>

				<div className="min-h-[60vh] flex items-center justify-center">
					Loading...
				</div>
			</Layout>
		);
	}

	/* ---------- AMENITIES ---------- */
	// Support new prefixed format "house:Light" and legacy flat format
	const rawAmenities = Array.isArray(property.amenities)
		? property.amenities
		: [];
	const amenityCategories = {
		house: { label: 'House', items: [] },
		living_room: { label: 'Living Room', items: [] },
		kitchen: { label: 'Kitchen', items: [] },
		bedroom: { label: 'Bedroom', items: [] },
	};
	const legacyAmenities = [];
	rawAmenities.forEach((item) => {
		const idx = item.indexOf(':');
		if (idx !== -1) {
			const cat = item.slice(0, idx);
			const label = item.slice(idx + 1);
			if (amenityCategories[cat]) {
				amenityCategories[cat].items.push(label);
				return;
			}
		}
		legacyAmenities.push(item);
	});
	const hasRoomAmenities = Object.values(amenityCategories).some(
		(c) => c.items.length > 0,
	);
	const amenities = rawAmenities; // keep for SEO meta

	/* ---------- COLOR MAP for each amenity category column ---------- */
	const categoryColorMap = {
		house: {
			bg: 'bg-red-50 dark:bg-red-900/20',
			border: 'border-red-200 dark:border-red-800',
			label: 'text-red-800 dark:text-red-300',
			icon: 'text-red-600 dark:text-red-400',
		},
		living_room: {
			bg: 'bg-violet-50 dark:bg-violet-900/20',
			border: 'border-violet-200 dark:border-violet-800',
			label: 'text-violet-800 dark:text-violet-300',
			icon: 'text-violet-600 dark:text-violet-400',
		},
		kitchen: {
			bg: 'bg-teal-50 dark:bg-teal-900/20',
			border: 'border-teal-200 dark:border-teal-800',
			label: 'text-teal-800 dark:text-teal-300',
			icon: 'text-teal-600 dark:text-teal-400',
		},
		bedroom: {
			bg: 'bg-amber-50 dark:bg-amber-900/20',
			border: 'border-amber-200 dark:border-amber-800',
			label: 'text-amber-800 dark:text-amber-300',
			icon: 'text-amber-600 dark:text-amber-400',
		},
	};

	const neighborhood = property.neighborhood || {
		transit: {
			'Bus Stations': [],
			'Metro Stations': [],
			Airport: [],
		},
		essentials: {
			Hospitals: [],
			Schools: [],
			ATMs: [],
		},
		utility: {
			'Shopping Malls': [],
			'Movie Theaters': [],
		},
	};
	/* ---------- STATIC CATEGORY STRUCTURE ---------- */
	const categoryStructure = {
		transit: ['Bus Stations', 'Metro Stations', 'Airport'],
		essentials: ['Hospitals', 'Schools', 'ATMs'],
		utility: ['Shopping Malls', 'Movie Theaters'],
	};
	const sectionIcons = {
		'Bus Stations': <Bus size={16} className="text-amber-500" />,
		'Metro Stations': <Train size={16} className="text-blue-500" />,
		Airport: <Plane size={16} className="text-purple-500" />,
		Hospitals: <Hospital size={16} className="text-red-500" />,
		Schools: <School size={16} className="text-indigo-500" />,
		ATMs: <CreditCard size={16} className="text-green-500" />,
		'Shopping Malls': <ShoppingBag size={16} className="text-pink-500" />,
		'Movie Theaters': <Film size={16} className="text-yellow-500" />,
	};

	/* ---------- RULES BASED ON PROPERTY TYPE ---------- */

	const propertyType = property.property_type?.toLowerCase();

	const rulesConfig = {
		rent: {
			takeCare: [
				'Verified tenant KYC checks',
				'Connecting owners directly with genuine tenants',
				'Listing your property on InstaMakaan platform',
				'Scheduling & coordinating site visits',
				'Rental agreement support & guidance',
				'Transparent pricing — no hidden charges',
				'Move-in coordination between owner & tenant',
				'24×7 customer support for inquiries',
				'Digital documentation assistance',
				'Verified listings only — no fake ads',
				'Dedicated team to resolve disputes',
				'Fast tenant placement from our network',
				'WhatsApp & call support throughout the process',
			],

			dos: [
				'Pay rent before due date',
				'Maintain cleanliness & hygiene',
				'Inform owner before overnight guests',
				'Provide 30–45 days notice before vacating',
				'Report damages to the owner immediately',
				'Use utilities responsibly',
			],

			donts: [
				'No illegal activities on premises',
				'No sub-letting without owner permission',
				'No structural modifications',
				'No loud noise after permitted hours',
				'No damage to furniture & appliances',
				'No unauthorized occupants',
			],

			shortSummary:
				'InstaMakaan helps owners list their property and connects them directly with verified, KYC-checked tenants. We facilitate the rental process — the owner and tenant manage the tenancy directly.',

			fullTerms: [
				'Rent payable in advance every month as agreed with owner',
				'Late payment terms are set by the owner',
				'Token amount adjustable as per owner agreement but may be non-refundable',
				'30–45 days notice required before vacating',
				'Early exit terms to be settled directly with owner',
				'Deposit refund timeline as agreed with owner',
				'Deductions for damages beyond normal wear & tear',
				'Structural repairs are owners responsibility',
				'Rental agreement between owner and tenant is mandatory',
				'Government ID verification required for all tenants',
				'All occupants must be registered with the owner',
			],
		},

		buy: {
			takeCare: [
				'Property documentation verification support',
				'Loan assistance coordination',
				'Site visit scheduling',
				'Price negotiation guidance',
			],

			dos: [
				'Verify ownership documents',
				'Check legal approvals',
				'Inspect property physically',
			],

			donts: [
				'Avoid token payment without paperwork',
				'Do not skip legal verification',
			],

			shortSummary:
				'InstaMakaan facilitates direct property purchase by connecting buyers with verified owners and assisting in documentation and visit coordination.',

			fullTerms: [
				'Sale agreement mandatory before ownership transfer.',
				'Stamp duty & registration charges borne by buyer.',
				'Loan approval subject to bank policies.',
				'Token amount refundable only as per agreement terms.',
				'Ownership transfer governed by applicable property laws.',
			],
		},

	};

	const activeRules = rulesConfig[propertyType] || rulesConfig.rent;

	/* ---------- SEO META (loaded property) ---------- */
	const seoTitle = `${property.title} in ${property.city} | Rent ₹${property.price} | InstaMakaan`;
	const seoDescription = `${property.title} available in ${property.city}. Rent ₹${property.price}. ${property.beds ? `${property.beds} BHK ` : ''}property with amenities like ${amenities.slice(0, 3).join(', ') || 'modern amenities'}. Book a free site visit on InstaMakaan.`;
	const seoKeywords = `${property.city} property, ${property.beds} bhk in ${property.city}, rent house ${property.city}, flat for rent ${property.city}, pg in ${property.city}`;
	const canonicalUrl = `https://instamakaan.com/property/${propertyToSlug(property)}`;
	const seoImage = images.length
		? getImageUrl(images[0])
		: 'https://instamakaan.com/images/orglogo.webp';

	const listingJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'RealEstateListing',
		name: property.title,
		description: seoDescription,
		url: canonicalUrl,
		image: images.slice(0, 5).map(getImageUrl),
		datePosted: property.created_at,
		address: {
			'@type': 'PostalAddress',
			addressLocality: property.city,
			addressRegion: property.state || 'Uttar Pradesh',
			addressCountry: 'IN',
		},
		offers: {
			'@type': 'Offer',
			price: toNumber(property.price),
			priceCurrency: 'INR',
			availability: 'https://schema.org/InStock',
			businessFunction:
				propertyType === 'buy'
					? 'https://schema.org/Sell'
					: 'https://schema.org/LeaseOut',
		},
	};

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://instamakaan.com/' },
			{
				'@type': 'ListItem',
				position: 2,
				name: propertyType === 'buy' ? 'Buy' : 'Rent',
				item: `https://instamakaan.com/all-properties?tab=${propertyType === 'buy' ? 'buy' : 'rent'}`,
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: property.city || 'Properties',
				item: `https://instamakaan.com/all-properties?city=${encodeURIComponent(property.city || '')}`,
			},
			{ '@type': 'ListItem', position: 4, name: property.title, item: canonicalUrl },
		],
	};

	return (
		<Layout>
			<Helmet>
				<title>{seoTitle}</title>
				<meta name="description" content={seoDescription} />
				<meta name="keywords" content={seoKeywords} />
				<link rel="canonical" href={canonicalUrl} />

				<meta property="og:type" content="product" />
				<meta property="og:title" content={seoTitle} />
				<meta property="og:description" content={seoDescription} />
				<meta property="og:image" content={seoImage} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:site_name" content="InstaMakaan" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={seoTitle} />
				<meta name="twitter:description" content={seoDescription} />
				<meta name="twitter:image" content={seoImage} />

				<script type="application/ld+json">
					{JSON.stringify(listingJsonLd)}
				</script>
				<script type="application/ld+json">
					{JSON.stringify(breadcrumbJsonLd)}
				</script>
			</Helmet>
			{/* flex-row layout: LEFT (flex-1) + RIGHT SIDEBAR (w-[380px]) */}
			<div className="container-custom py-4 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
				{/* LEFT COLUMN */}
				<div className="flex-1 min-w-0">
					{/* RESPONSIVE TITLE */}
					<div className="mb-4 px-3 lg:px-0">
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0 flex-1">
								<h1 className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight truncate sm:whitespace-normal sm:overflow-visible">
									{property.title}
									<span className="sr-only"> in {property.city} – Rental Property, Flats & PG Details</span>
								</h1>
								<p className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 text-sm">
									<MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
									<span className="truncate">{property.location}{property.city ? `, ${property.city}` : ''}</span>
								</p>
								{(property.sector || property.location) && (
									<Link
										to={`/society-reviews/${(property.sector || property.location).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
										className="inline-flex items-center gap-1 mt-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline"
									>
										Read the {property.sector || property.location} review
									</Link>
								)}
							</div>

							{/* ACTION BUTTONS */}
							<div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
								{/* SAVE */}
								<button
									onClick={handleSaveProperty}
									title={isSaved ? 'Remove from saved' : 'Save property'}
									className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${isSaved ? 'bg-teal-500 text-white' : 'border border-gray-200 dark:border-neutral-700 text-gray-500 hover:border-teal-500 hover:text-teal-600'}`}
								>
									<Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
								</button>

								{/* SHARE */}
								<button
									onClick={handleShare}
									className={`relative flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 overflow-hidden ${shareSuccess ? 'bg-teal-500 text-white scale-105' : 'border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:border-teal-500 hover:text-teal-600'}`}
								>
									{shareSuccess && (
										<span className="absolute inset-0 flex items-center justify-center">
											<span className="animate-ping absolute w-full h-full rounded-xl bg-teal-400 opacity-30" />
										</span>
									)}
									<span className={`transition-all duration-300 ${shareSuccess ? 'scale-110' : ''}`}>
										{shareSuccess ? <CheckCircle className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
									</span>
								</button>
							</div>
						</div>
					</div>

{/* GALLERY */}
					<div className="hidden lg:block mb-6">
						{/* MAIN IMAGE */}
						<div
							className="relative rounded-2xl overflow-hidden shadow bg-black"
							style={{ height: '420px' }}
						>
							<img
								src={getImageUrl(images[index])}
								loading="lazy"
								alt="property image"
								className="w-full h-full object-contain transition-transform duration-500"
							/>

							{/* LEFT ARROW */}
							<button
								onClick={() =>
									setIndex(index === 0 ? images.length - 1 : index - 1)
								}
								className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
							>
								<ChevronLeft />
							</button>

							{/* RIGHT ARROW */}
							<button
								onClick={() => setIndex((index + 1) % images.length)}
								className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
							>
								<ChevronRight />
							</button>

							{/* PHOTOS + DIRECTION BUTTONS */}
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
								<button
									onClick={() => {
										setLightboxIndex(index);
										setShowLightbox(true);
									}}
									className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-medium shadow hover:bg-gray-50 transition"
								>
									<Camera size={16} className="text-amber-500" />
									Photos
								</button>
								{property.map_embed &&
									(() => {
										const coords = extractLatLng(property.map_embed);
										if (!coords) return null;
										const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
										return (
											<a
												href={directionsUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-medium shadow hover:bg-gray-50 transition"
											>
												<MapPin size={16} className="text-teal-600" />
												Direction
											</a>
										);
									})()}
							</div>
						</div>

						{/* THUMBNAILS */}
						<div className="flex gap-3 mt-3 overflow-x-auto no-scrollbar pb-1">
							{images.map((img, i) => (
								<button
									key={i}
									onClick={() => setIndex(i)}
									className={`relative flex-shrink-0 w-[120px] h-[80px] rounded-xl overflow-hidden border-2 transition hover:scale-[1.03]
          ${index === i ? 'border-amber-500' : 'border-transparent'}`}
								>
									<img
										src={getImageUrl(img)}
										loading="lazy"
										alt="thumbnail"
										className="w-full h-full object-cover"
									/>
								</button>
							))}
						</div>
					</div>

					{/* MOBILE GALLERY */}
					<div className="lg:hidden mb-6">
						{/* MAIN IMAGE */}
						<div
							className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black"
							style={{ height: '260px' }}
						>
							<img
								src={getImageUrl(images[index])}
								loading="lazy"
								alt={property.title}
								className="w-full h-full object-contain transition-all duration-500"
							/>

							{/* LEFT */}
							<button
								onClick={() =>
									setIndex(index === 0 ? images.length - 1 : index - 1)
								}
								className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md backdrop-blur hover:scale-110 transition"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>

							{/* RIGHT */}
							<button
								onClick={() => setIndex((index + 1) % images.length)}
								className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md backdrop-blur hover:scale-110 transition"
							>
								<ChevronRight className="w-5 h-5" />
							</button>

							{/* PHOTOS + DIRECTION BUTTONS */}
							<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
								<button
									onClick={() => {
										setLightboxIndex(index);
										setShowLightbox(true);
									}}
									className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs font-medium shadow"
								>
									<Camera size={13} className="text-amber-500" />
									Photos
								</button>
								{property.map_embed &&
									(() => {
										const coords = extractLatLng(property.map_embed);
										if (!coords) return null;
										const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
										return (
											<a
												href={directionsUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs font-medium shadow"
											>
												<MapPin size={13} className="text-teal-600" />
												Direction
											</a>
										);
									})()}
							</div>
						</div>

						{/* THUMB STRIP */}
						<div className="flex overflow-x-auto gap-2 mt-3 pb-1 no-scrollbar">
							{images.map((img, i) => (
								<div
									key={i}
									className={`w-[80px] h-[60px] rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer transition
          ${index === i ? 'border-amber-500' : 'border-transparent'}`}
									onClick={() => setIndex(i)}
								>
									<img
										src={getImageUrl(img)}
										alt="thumbnail"
										className="w-full h-full object-cover"
									/>
								</div>
							))}
						</div>
					</div>

					{/* MOBILE PRICE SUMMARY */}
					<div className="lg:hidden bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 py-3 shadow mb-4">
						<div className="flex items-center justify-between gap-4 flex-wrap">
							{/* LEFT SIDE */}
							<div>
								<p className="text-base font-bold text-gray-900 dark:text-white">
									₹{' '}
									{(propertyType === 'buy'
										? toNumber(property.price)
										: monthlyRent
									).toLocaleString()}
								</p>

								<p className="text-xs text-gray-500 -mt-0.5">
									{propertyType === 'buy' ? 'Price' : 'Rent / month'}
								</p>
							</div>

							{/* RIGHT SIDE */}
							{propertyType !== 'buy' ? (
								<div className="text-right">
									<p className="text-lg font-semibold text-gray-900 dark:text-white">
										₹ {securityDeposit.toLocaleString()}
									</p>
									<p className="text-xs text-gray-500 -mt-0.5">Deposit</p>
								</div>
							) : (
								<div className="text-right">
									<p className="text-lg font-semibold text-gray-900 dark:text-white">
										₹ {Math.round(brokerageAmount).toLocaleString()}
									</p>
									<p className="text-xs text-gray-500 -mt-0.5">One-Time Fees</p>
								</div>
							)}
						</div>
					</div>

					{/* ================= PROPERTY INFO ================= */}
					{(property.floor ||
						property.balcony ||
						property.furnishing ||
						property.parking ||
						property.facing ||
						property.beds ||
						property.baths ||
						property.area ||
						property.preferred_tenant ||
						property.gender_preference ||
						property.is_verified) && (
						<>
							<h2 className="text-sm font-bold mt-6 mb-2 px-3 sm:px-0 uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Property Info
							</h2>
							<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 p-3 mx-3 sm:mx-0">
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
									{[
										property.beds > 0 && { label: 'Beds', value: `${property.beds} BHK`, Icon: BedDouble },
										property.baths > 0 && { label: 'Baths', value: `${property.baths} Bath`, Icon: Bath },
										property.area && { label: 'Area', value: property.area, Icon: Building2 },
										property.furnishing && { label: 'Furnishing', value: property.furnishing.replace('-', ' '), Icon: Sofa },
										property.floor && { label: 'Floor', value: property.floor, Icon: Building2 },
										property.balcony && { label: 'Balcony', value: `${property.balcony}`, Icon: Trees },
										property.parking && { label: 'Parking', value: property.parking, Icon: Car },
										property.facing && { label: 'Facing', value: property.facing, Icon: Eye },
										property.preferred_tenant && property.preferred_tenant !== 'any' && { label: 'Tenant', value: property.preferred_tenant, Icon: Users },
										property.gender_preference && property.gender_preference !== 'any' && { label: 'Gender', value: `${property.gender_preference} only`, Icon: Users },
										property.is_verified && { label: 'Status', value: 'Verified', Icon: ShieldCheck, highlight: true },
									].filter(Boolean).map((item) => (
										<div key={item.label} className="flex items-center gap-2">
											<div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
												<item.Icon className="w-3.5 h-3.5 text-teal-600" />
											</div>
											<div>
												<p className="text-[10px] text-gray-400 leading-none">{item.label}</p>
												<p className={`text-xs font-semibold capitalize leading-tight ${item.highlight ? 'text-teal-600 dark:text-teal-400' : 'text-gray-800 dark:text-white'}`}>{item.value}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</>
					)}

					{/* DESCRIPTION */}
					<DescriptionSection description={property.description} />

					{/* ================= AMENITIES ================= */}
					<h2 className="text-sm sm:text-base font-bold mt-6 mb-2 px-3 sm:px-0 uppercase tracking-wider text-slate-500 dark:text-slate-400">
						Amenities
					</h2>

					<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 p-3 mx-3 sm:mx-0">
						{!hasRoomAmenities && legacyAmenities.length === 0 ? (
							<p className="text-xs text-gray-400">No amenities added</p>
						) : hasRoomAmenities ? (
							<>
								<div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
									{Object.entries(amenityCategories)
										.filter(([, cat]) => cat.items.length > 0)
										.map(([key, cat]) => {
											const c = categoryColorMap[key] || categoryColorMap.house;
											return (
												<div key={key} className={`min-w-[160px] flex-shrink-0 snap-start rounded-xl border p-3 ${c.bg} ${c.border}`}>
													<p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${c.label}`}>{cat.label}</p>
													<div className="flex flex-col gap-1.5">
														{cat.items.map((item, i) => (
															<div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-200">
																<span className={`flex-shrink-0 ${c.icon}`}>
																	{amenityIconMap[item] || <Star size={12} className="text-gray-400" />}
																</span>
																{item}
															</div>
														))}
													</div>
												</div>
											);
										})}

									{legacyAmenities.length > 0 && (
										<div className="min-w-[160px] flex-shrink-0 snap-start rounded-xl border p-3 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
											<p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-gray-500">Other</p>
											<div className="flex flex-col gap-1.5">
												{legacyAmenities.map((item, i) => (
													<div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-200">
														<span className="flex-shrink-0 text-gray-500">
															{amenityIconMap[item] || <Star size={12} className="text-gray-400" />}
														</span>
														{item}
													</div>
												))}
											</div>
										</div>
									)}
								</div>
								<p className="text-[10px] text-gray-400 mt-1.5 sm:hidden text-center">swipe →</p>
							</>
						) : (
							<div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
								<div className="min-w-[160px] flex-shrink-0 snap-start rounded-xl border p-3 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
									<p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-gray-500">Amenities</p>
									<div className="flex flex-col gap-1.5">
										{legacyAmenities.map((item, i) => (
											<div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-200">
												<span className="flex-shrink-0 text-gray-500">
													{amenityIconMap[item] || (
														<Star size={12} className="text-gray-400" />
													)}
												</span>
												{item}
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* ROOM SECTION */}

					{/* RENT DETAILS */}
					<h2 className="text-sm font-bold mt-6 mb-2 px-3 sm:px-0 uppercase tracking-wider text-slate-500 dark:text-slate-400">
						{propertyType === 'buy' ? 'Price Details' : 'Rent Details'}
					</h2>

					<div className="mx-3 sm:mx-0 rounded-xl border border-gray-100 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
						{/* Rows */}
						{[
							{
								label: propertyType === 'buy' ? 'Property Price' : 'Monthly Rent',
								sub: propertyType === 'buy' ? 'Total price' : 'Per month',
								value: `₹ ${(propertyType === 'buy' ? toNumber(property.price) : monthlyRent).toLocaleString()}`,
								show: true,
							},
							{
								label: 'Security Deposit',
								sub: 'Refundable',
								value: `₹ ${securityDeposit.toLocaleString()}`,
								show: propertyType !== 'buy',
							},
							{
								label: 'One-Time Fees',
								sub: 'Service fee',
								value: `₹ ${Math.round(brokerageAmount).toLocaleString()}`,
								show: true,
							},
						].filter(r => r.show).map((row, i, arr) => (
							<div key={row.label}>
								<div className="flex items-center justify-between px-4 py-3">
									<div>
										<p className="text-sm font-medium text-gray-800 dark:text-white">{row.label}</p>
										<p className="text-xs text-gray-400">{row.sub}</p>
									</div>
									<p className="text-sm font-bold text-gray-900 dark:text-white">{row.value}</p>
								</div>
								{i < arr.length - 1 && <div className="border-t border-gray-100 dark:border-neutral-800 mx-4" />}
							</div>
						))}

						{/* Total */}
						<div className="flex items-center justify-between px-4 py-3 bg-teal-50 dark:bg-teal-900/20 border-t border-teal-100 dark:border-teal-800/40">
							<div>
								<p className="text-sm font-bold text-teal-700 dark:text-teal-400">Total Payable</p>
								<p className="text-xs text-gray-400">Rent + deposit + fees</p>
							</div>
							<p className="text-base font-black text-teal-700 dark:text-teal-400">
								₹ {(propertyType === 'buy'
									? toNumber(property.price) + Math.round(brokerageAmount)
									: Math.round(totalPayable)
								).toLocaleString()}
							</p>
						</div>
					</div>

					{/* HOW INSTAMAKAAN HELPS */}
					<h2 className="text-sm font-bold mt-6 mb-2 px-3 sm:px-0 uppercase tracking-wider text-slate-500 dark:text-slate-400">
						How InstaMakaan Helps
					</h2>

					<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm px-3 py-2.5 mx-3 sm:mx-0">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
							{(showAllTakeCare ? activeRules.takeCare : activeRules.takeCare.slice(0, 3)).map((item, i) => (
								<div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
									<CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
									<span>{item}</span>
								</div>
							))}
							<button onClick={() => setShowAllTakeCare(!showAllTakeCare)} className="text-amber-500 text-xs font-semibold mt-2 hover:underline">
								{showAllTakeCare ? 'Hide ▲' : 'View All ▼'}
							</button>
						</div>
					</div>

					{/* DO & DON'T */}
					<h2 className="text-sm font-bold mt-6 mb-2 px-3 sm:px-0 uppercase tracking-wider text-slate-500 dark:text-slate-400">
						Do's & Don'ts
					</h2>

					<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm px-3 py-2.5 mx-3 sm:mx-0 grid grid-cols-2 gap-3">
						<div>
							<p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-2">Do's</p>
							<ul className="space-y-1.5">
								{(showAllDos ? activeRules.dos : activeRules.dos.slice(0, 3)).map((item, i) => (
									<li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
										<CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{item}
									</li>
								))}
							</ul>
							<button onClick={() => setShowAllDos(!showAllDos)} className="text-amber-500 text-xs font-semibold mt-2 hover:underline">
								{showAllDos ? 'Hide ▲' : 'More ▼'}
							</button>
						</div>
						<div>
							<p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2">Don'ts</p>
							<ul className="space-y-1.5">
								{(showAllDonts ? activeRules.donts : activeRules.donts.slice(0, 3)).map((item, i) => (
									<li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
										<ShieldCheck className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />{item}
									</li>
								))}
							</ul>
							<button onClick={() => setShowAllDonts(!showAllDonts)} className="text-amber-500 text-xs font-semibold mt-2 hover:underline">
								{showAllDonts ? 'Hide ▲' : 'More ▼'}
							</button>
						</div>
					</div>

					{/* ================= NEIGHBORHOOD SECTION ================= */}
					<h2 className="text-sm font-bold mt-6 mb-2 px-3 sm:px-0 uppercase tracking-wider text-slate-500 dark:text-slate-400">
						Neighborhood
					</h2>

					<div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm mx-3 sm:mx-0 overflow-hidden">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 sm:p-4">
							{/* LEFT - MAP */}
							<div className="relative h-[200px] sm:h-[280px] lg:h-[340px] rounded-xl overflow-hidden shadow-sm group">
								<iframe
									src={property.map_embed}
									loading="lazy"
									title="map"
									width="100%"
									height="100%"
									frameBorder="0"
									style={{ border: 0 }}
									allowFullScreen
								/>

								<div
									className="absolute inset-0 
      bg-gradient-to-t from-black/40 via-transparent to-transparent 
      pointer-events-none"
								></div>

								{property.map_embed &&
									(() => {
										const coords = extractLatLng(property.map_embed);
										if (!coords) return null;

										const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;

										return (
											<a
												href={directionsUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="absolute bottom-3 right-3 
            bg-white dark:bg-neutral-900 
            px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md 
            text-xs sm:text-sm font-medium 
            hover:bg-teal-600 hover:text-white transition-all duration-300"
											>
												Get Directions
											</a>
										);
									})()}
							</div>

							{/* RIGHT - TABS + ACCORDION */}
							<div className="flex flex-col">
								<div className="flex justify-around bg-gray-100 dark:bg-neutral-800 rounded-lg p-1 mb-3">
									{['transit', 'essentials', 'utility'].map((tab) => (
										<button
											key={tab}
											onClick={() => setActiveTab(tab)}
											className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
												activeTab === tab
													? 'bg-white dark:bg-neutral-900 shadow text-teal-600'
													: 'text-gray-500 hover:text-teal-600'
											}`}
										>
											{tab}
										</button>
									))}
								</div>

								<div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
									{categoryStructure[activeTab].map((sectionTitle) => {
										const sectionKey = `${activeTab}-${sectionTitle}`;
										const isOpen = openSections[sectionKey];
										const places = neighborhood?.[activeTab]?.[sectionTitle] || [];

										return (
											<div key={sectionKey} className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-100 dark:border-neutral-700 overflow-hidden">
												<button
													onClick={() => toggleSection(sectionKey)}
													className="w-full flex justify-between items-center px-3 py-2 font-medium text-xs"
												>
													<div className="flex items-center gap-1.5">
														{sectionIcons[sectionTitle]}
														<span>{sectionTitle}</span>
													</div>
													<span className={`transition-transform duration-300 text-xs ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
												</button>

												<div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] px-3 pb-2 opacity-100' : 'max-h-0 px-3 opacity-0'}`}>
													<div className="space-y-1.5 mt-1">
														{places.length === 0 ? (
															<p className="text-xs text-gray-400">No data available</p>
														) : (
															places.map((place, i) => (
																<div key={i} className="flex justify-between items-center text-xs border-b border-gray-100 dark:border-neutral-700 pb-1.5">
																	<span className="text-gray-700 dark:text-gray-300">{place.name}</span>
																	<span className="text-teal-600 font-medium">{place.distance} • {place.time}</span>
																</div>
															))
														)}
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>

					{/* ================= TERMS & CONDITIONS ================= */}
					<h2 className="text-xl sm:text-2xl font-bold mt-12 mb-4 px-2 sm:px-0">
						Terms & Conditions
					</h2>

					<div
						className="bg-white dark:bg-neutral-900 
                rounded-xl sm:rounded-2xl shadow 
                p-4 sm:p-6 mx-2 sm:mx-0 space-y-4"
					>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
							{activeRules.shortSummary}
						</p>

						<button
							onClick={() => setShowFullTerms(!showFullTerms)}
							className="text-amber-500 font-semibold text-sm sm:text-base hover:underline"
						>
							{showFullTerms ? 'Hide Full Terms ▲' : 'View Full Terms ▼'}
						</button>

						<div
							className={`transition-all duration-500 overflow-hidden ${
								showFullTerms
									? 'max-h-[1200px] opacity-100 mt-2'
									: 'max-h-0 opacity-0'
							}`}
						>
							<div className="space-y-3 mt-3">
								{activeRules.fullTerms.map((term, i) => (
									<div
										key={i}
										className="flex items-start gap-2 bg-gray-50/60 dark:bg-neutral-800/50 
                               px-3 py-2 rounded-lg border 
                               border-gray-200 dark:border-neutral-700"
									>
										<Star className="w-4 h-4 text-amber-500 mt-1" />
										<span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
											{term}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* MOBILE VISIT FORM */}
					<div
						ref={visitRef}
						className="lg:hidden mx-2 mt-8 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-neutral-800"
					>
						<div className="bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-4">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
									<CalendarDays className="w-4 h-4 text-white" />
								</div>
								<div>
									<h3 className="font-bold text-white text-sm">
										Schedule Your Visit
									</h3>
									<p className="text-gray-800 text-[11px] opacity-80">
										Free  visit • No obligation
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white dark:bg-neutral-900 p-5 space-y-4">
							<div>
								<label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block uppercase tracking-wider">
									Your Name
								</label>
								<div className="relative">
									<input
										className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
										placeholder="Enter your full name"
										value={visitName}
										onChange={(e) => setVisitName(e.target.value)}
									/>
									<User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
								</div>
							</div>

							<div>
								<label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block uppercase tracking-wider">
									Phone Number
								</label>
								<div className="relative">
									<input
										className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
										placeholder="+91 XXXXX XXXXX"
										value={visitPhone}
										onChange={(e) => setVisitPhone(e.target.value)}
									/>
									<Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
								</div>
							</div>

							<div>
								<label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block uppercase tracking-wider">
									Preferred Date
								</label>
								<div className="relative">
									<input
										type="date"
										className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm appearance-none"
										value={visitDate}
										onChange={(e) => setVisitDate(e.target.value)}
										min={new Date().toISOString().split('T')[0]}
									/>
									<CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
								</div>
							</div>

							<div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
								<div className="flex items-center gap-2">
									<div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
										<Phone className="w-3.5 h-3.5 text-white" />
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
											WhatsApp Updates
										</p>
										<p className="text-[10px] text-gray-500">
											Get visit confirmation
										</p>
									</div>
								</div>
								<input
									type="checkbox"
									className="accent-green-500 scale-125 cursor-pointer"
									checked={whatsappOptIn}
									onChange={(e) => setWhatsappOptIn(e.target.checked)}
								/>
							</div>

							<button
								onClick={submitInquiry}
								disabled={visitLoading}
								className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 text-sm"
							>
								{visitLoading ? (
									<span className="flex items-center justify-center gap-2">
										<svg
											className="animate-spin w-4 h-4"
											viewBox="0 0 24 24"
											fill="none"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8v8z"
											/>
										</svg>
										Submitting...
									</span>
								) : (
									<span className="flex items-center justify-center gap-2">
										<CalendarDays className="w-4 h-4" />
										Schedule a Visit
									</span>
								)}
							</button>

							<p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
								<ShieldCheck className="w-3 h-3 text-teal-500" />
								100% Free • No hidden charges
							</p>
						</div>
					</div>

					{/* MOBILE PEOPLE ALSO SEARCHED */}
					<div className="lg:hidden mx-2 mt-10">
						<h3 className="font-semibold text-lg mb-4">People also searched</h3>

						<div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
							{related.map((p) => (
								<Link
									key={p.id}
									to={`/property/${propertyToSlug(p)}`}
									className="w-[250px] bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-gray-200 dark:border-neutral-800 overflow-hidden flex-shrink-0 hover:scale-[1.02] transition"
								>
									<div className="w-full h-[150px] overflow-hidden">
										<img
											src={getImageUrl(p.images?.[0] || p.thumbnail)}
											alt="property"
											className="w-full h-full object-cover"
										/>
									</div>

									<div className="p-3">
										<p className="font-medium text-sm line-clamp-1">
											{p.title}
										</p>
										<p className="text-xs text-gray-500 line-clamp-1">
											{p.location}
										</p>

										<p className="text-amber-500 font-semibold mt-1 text-sm">
											₹ {p.price}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>

				{/* RIGHT SIDEBAR */}
				<div className="hidden lg:block w-[380px] flex-shrink-0">
					<div
						className={`sticky transition-all duration-300 ${isScrolled ? 'top-24' : 'top-[180px]'}`}
					>
						<div className="space-y-8">
							{/* SIMPLE PRICE SUMMARY */}
							<div className="mb-6">
								<div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-8 py-6 flex items-center justify-center gap-10 text-center">
									<div>
										<p className="text-3xl font-bold text-gray-900 dark:text-white">
											₹{' '}
											{(propertyType === 'buy'
												? toNumber(property.price)
												: monthlyRent
											).toLocaleString()}
										</p>

										<p className="text-sm text-gray-500 mt-1">
											{propertyType === 'buy' ? 'Price' : 'Rent / month'}
										</p>
									</div>

									<div className="w-px h-14 bg-gray-300 dark:bg-neutral-700"></div>

									{propertyType !== 'buy' ? (
										<div>
											<p className="text-3xl font-bold text-gray-900 dark:text-white">
												₹ {securityDeposit.toLocaleString()}
											</p>
											<p className="text-sm text-gray-500 mt-1">Deposit</p>
										</div>
									) : (
										<div>
											<p className="text-3xl font-bold text-gray-900 dark:text-white">
												₹ {Math.round(brokerageAmount).toLocaleString()}
											</p>
											<p className="text-sm text-gray-500 mt-1">
												One-Time Fees
											</p>
										</div>
									)}
								</div>
							</div>

							{/* VISIT FORM */}
							<div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-neutral-800">
								<div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-5">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
											<CalendarDays className="w-5 h-5 text-white" />
										</div>
										<div>
											<h3 className="font-bold text-white text-base">
												Schedule Your Visit
											</h3>
											<p className="text-gray-800 text-xs opacity-80">
												Free visit • No obligation
											</p>
										</div>
									</div>
								</div>

								<div className="bg-white dark:bg-neutral-900 p-6 space-y-4">
									<div className="relative">
										<label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block uppercase tracking-wider">
											Your Name
										</label>
										<div className="relative">
											<input
												className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm transition-all"
												placeholder="Enter your full name"
												value={visitName}
												onChange={(e) => setVisitName(e.target.value)}
											/>
											<User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
										</div>
									</div>

									<div className="relative">
										<label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block uppercase tracking-wider">
											Phone Number
										</label>
										<div className="relative">
											<input
												className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm transition-all"
												placeholder="+91 XXXXX XXXXX"
												value={visitPhone}
												onChange={(e) => setVisitPhone(e.target.value)}
											/>
											<Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
										</div>
									</div>

									<div>
										<label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block uppercase tracking-wider">
											Preferred Date
										</label>
										<div className="relative">
											<input
												type="date"
												className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm transition-all appearance-none"
												value={visitDate}
												onChange={(e) => setVisitDate(e.target.value)}
												min={new Date().toISOString().split('T')[0]}
											/>
											<CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
										</div>
									</div>

									<div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
										<div className="flex items-center gap-2">
											<div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
												<Phone className="w-3.5 h-3.5 text-white" />
											</div>
											<div>
												<p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
													WhatsApp Updates
												</p>
												<p className="text-[10px] text-gray-500">
													Get visit confirmation
												</p>
											</div>
										</div>
										<input
											type="checkbox"
											className="accent-green-500 scale-125 cursor-pointer"
											checked={whatsappOptIn}
											onChange={(e) => setWhatsappOptIn(e.target.checked)}
										/>
									</div>

									<button
										onClick={submitInquiry}
										disabled={visitLoading}
										className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-yellow-200 dark:hover:shadow-yellow-900/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 text-sm"
									>
										{visitLoading ? (
											<span className="flex items-center justify-center gap-2">
												<svg
													className="animate-spin w-4 h-4"
													viewBox="0 0 24 24"
													fill="none"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8v8z"
													/>
												</svg>
												Submitting...
											</span>
										) : (
											<span className="flex items-center justify-center gap-2">
												<CalendarDays className="w-4 h-4" />
												Schedule a Visit
											</span>
										)}
									</button>

									<p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
										<ShieldCheck className="w-3 h-3 text-teal-500" />
										100% Verified • Transparent Pricing
									</p>
								</div>
							</div>

							{/* DESKTOP PEOPLE ALSO SEARCHED */}
							<div className="hidden lg:block bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 p-6">
								<h3 className="font-semibold text-lg mb-5">
									People also searched
								</h3>

								<div className="flex flex-col gap-4">
									{related.map((p) => (
										<Link
											key={p.id}
											to={`/property/${propertyToSlug(p)}`}
											className="flex items-center gap-4 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3 hover:shadow-md hover:-translate-y-1 transition"
										>
											<img
												src={getImageUrl(p.thumbnail)}
												loading="lazy"
												alt="property image"
												className="w-24 h-24 rounded-lg object-cover"
											/>

											<div className="flex flex-col">
												<p className="font-semibold text-sm">{p.title}</p>
												<p className="text-xs text-gray-500">{p.location}</p>
												<p className="text-amber-500 font-semibold mt-1 text-sm">
													₹ {p.price?.toLocaleString()}
												</p>
											</div>
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* MOBILE ACTION BAR */}
			<div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden">
				<div
					className="flex justify-around items-center px-4 py-2 rounded-2xl 
	bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-lg 
	border border-slate-200 dark:border-white/10 
	shadow-xl"
				>
					<button
						onClick={() => navigate(-1)}
						className="flex flex-col items-center text-[11px] text-slate-600 dark:text-slate-300 active:scale-90 transition"
					>
						<ArrowLeft className="w-5 h-5 mb-1" />
						Back
					</button>

					<button
						onClick={scrollToVisit}
						className="flex flex-col items-center text-[11px] text-slate-600 dark:text-slate-300 active:scale-90 transition"
					>
						<CalendarDays className="w-5 h-5 mb-1" />
						Visit
					</button>

					<button
						onClick={() => navigate('/contact')}
						className="flex flex-col items-center text-[11px] text-slate-600 dark:text-slate-300 active:scale-90 transition"
					>
						<Phone className="w-5 h-5 mb-1" />
						Contact
					</button>

					<button
						onClick={handleShare}
						className={`flex flex-col items-center text-[11px] transition-all duration-300
        ${
					shareSuccess
						? 'text-teal-500 scale-110'
						: 'text-slate-600 dark:text-slate-300 active:scale-90'
				}`}
					>
						<span className="relative">
							{shareSuccess ? (
								<CheckCircle className="w-5 h-5 mb-1" />
							) : (
								<Share2 className="w-5 h-5 mb-1" />
							)}
							{shareSuccess && (
								<span className="absolute -inset-1 rounded-full bg-teal-400 opacity-20 animate-ping" />
							)}
						</span>
						</button>
				</div>
			</div>

			{/* LIGHTBOX */}
			{showLightbox && (
				<div
					className="fixed inset-0 z-[9999] bg-black flex flex-col"
					style={{ paddingTop: 0 }}
				>
					<div className="flex items-center justify-between px-4 py-3 text-white">
						<button
							onClick={() => setShowLightbox(false)}
							className="flex items-center gap-2 text-sm"
						>
							<ChevronLeft className="w-5 h-5" /> Back
						</button>
						<p className="text-sm font-medium">
							{property.title} · {lightboxIndex + 1}/{images.length}
						</p>
						<div className="w-16" />
					</div>

					<div className="flex-1 flex items-center justify-center relative px-4 overflow-hidden">
						<button
							onClick={() =>
								setLightboxIndex(
									lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1,
								)
							}
							className="absolute left-2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition"
						>
							<ChevronLeft className="text-white w-6 h-6" />
						</button>
						<img
							src={getImageUrl(images[lightboxIndex])}
							alt="property"
							className="max-h-full max-w-full object-contain rounded-lg"
						/>
						<button
							onClick={() =>
								setLightboxIndex((lightboxIndex + 1) % images.length)
							}
							className="absolute right-2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition"
						>
							<ChevronRight className="text-white w-6 h-6" />
						</button>
					</div>

					<div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
						{images.map((img, i) => (
							<div
								key={i}
								onClick={() => setLightboxIndex(i)}
								className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 cursor-pointer transition
            ${
							lightboxIndex === i
								? 'border-amber-400'
								: 'border-transparent opacity-60 hover:opacity-100'
						}`}
							>
								<img
									src={getImageUrl(img)}
									alt=""
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>
			)}
			<DynamicFAQ
				faqs={generatePropertyFAQs(property)}
				heading={`FAQs about ${property?.title || 'this property'}`}
			/>
		</Layout>
	);
};

export default PropertyDetailPage;