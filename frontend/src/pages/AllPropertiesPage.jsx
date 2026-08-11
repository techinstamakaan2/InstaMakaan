import React, { useEffect, useMemo, useState, lazy, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { slugToFilters } from '@/utils/slugUtils';
import { RentBuySwitch } from '@/components/RentBuySwitch';
const FiltersPanel = lazy(() => import('@/components/filters/FiltersPanel'));
import {
	Filter,
	LayoutGrid,
	List,
	Map,
	X,
	ChevronDown,
	ArrowUp,
	ArrowUpDown,
	ArrowLeft,
	RotateCcw,
	SlidersHorizontal,
	Sparkles,
	MapPin,
	Home,
	TrendingUp,
	Building2,
	Search,
} from 'lucide-react';
import PageFAQSection from '@/components/home/PageFAQSection';

const PROPERTIES_FAQS = [
	{
		question: 'How do I search for flats within my budget?',
		answer:
			'Use the rent range slider or the budget filter on the left panel to set your maximum monthly rent. You can also browse our budget-specific pages like "Flats for Rent Below ₹15,000" or "Below ₹20,000" directly from the home page.',
	},
	{
		question: 'What does "verified listing" mean?',
		answer:
			'A verified listing means our team has checked the property details, photos, location, and ownership documents before the listing went live. This ensures that every flat you see on InstaMakaan is a real, available property with accurate information.',
	},
	{
		question: 'How do I schedule a visit to a property?',
		answer:
			'Open any property listing and click the "Schedule Visit" or "Contact Owner" button. Our team will connect you with the owner or arrange a site visit at a time that works for you.',
	},
	{
		question: 'Can I filter properties by number of bedrooms?',
		answer:
			'Yes. Use the BHK filter to search for 1 BHK, 2 BHK, or 3 BHK flats. You can combine this with a location and budget filter to find exactly what you are looking for.',
	},
	{
		question: 'Are all properties on InstaMakaan available for immediate move-in?',
		answer:
			'Most listed properties are available. Availability dates are mentioned on each listing. If you need immediate possession, filter by "Available Now" or contact us and we will help match you with a property that meets your timeline.',
	},
	{
		question: 'Is there a way to save properties I like?',
		answer:
			'Yes, log in to your InstaMakaan account and click the save or bookmark icon on any listing to add it to your saved properties. You can view all your saved listings from your profile dashboard.',
	},
];
const headlines = [
	'24/7 Service. 100% Verified. Total Sukoon.',
	'Your Home, Your Vibe, Our Responsibility.',
	'Welcome to a Managed Home. Renting, Redefined.',
];

/* ════════════════════════════════════════════
   MAP VIEW — Leaflet + OpenStreetMap (no API key)
   Improved markers, popups, alignment & design.
════════════════════════════════════════════ */
const PropertiesMapView = ({ properties, getPropertyValue }) => {
	const mapRef = useRef(null);
	const leafletMapRef = useRef(null);
	const markersRef = useRef([]);

	const formatRent = (val) => {
		if (!val || val === 0) return null;
		if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
		if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
		return `₹${val}`;
	};

	const extractLatLng = (url) => {
		if (!url) return null;
		const lonMatch = url.match(/!2d([0-9.\-]+)/);
		const latMatch = url.match(/!3d([0-9.\-]+)/);
		if (!latMatch || !lonMatch) return null;
		return { lat: parseFloat(latMatch[1]), lng: parseFloat(lonMatch[1]) };
	};

	useEffect(() => {
		const loadLeaflet = async () => {
			if (!document.getElementById('leaflet-css')) {
				const link = document.createElement('link');
				link.id = 'leaflet-css';
				link.rel = 'stylesheet';
				link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
				document.head.appendChild(link);
			}
			if (!window.L) {
				await new Promise((resolve, reject) => {
					const script = document.createElement('script');
					script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
					script.onload = resolve;
					script.onerror = reject;
					document.head.appendChild(script);
				});
			}
			return window.L;
		};

		let map;
		loadLeaflet().then((L) => {
			if (!mapRef.current || leafletMapRef.current) return;

			map = L.map(mapRef.current, {
				center: [28.5355, 77.391],
				zoom: 12,
				zoomControl: false,
			});
			leafletMapRef.current = map;

			L.control.zoom({ position: 'topright' }).addTo(map);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom: 19,
			}).addTo(map);

			/* Inject styles once */
			if (!document.getElementById('im-map-styles')) {
				const style = document.createElement('style');
				style.id = 'im-map-styles';
				style.textContent = `
					.im-marker-wrap {
						display: flex;
						flex-direction: column;
						align-items: center;
						cursor: pointer;
						transition: transform 0.18s cubic-bezier(.22,.68,0,1.3);
						filter: drop-shadow(0 4px 10px rgba(0,0,0,0.22));
					}
					.im-marker-wrap:hover { transform: scale(1.12) translateY(-3px); z-index: 9999 !important; }
					.im-badge {
						background: linear-gradient(135deg, #0d9488, #0891b2);
						color: #fff;
						font-family: 'Segoe UI', system-ui, sans-serif;
						font-size: 12px;
						font-weight: 800;
						letter-spacing: -0.3px;
						padding: 5px 11px;
						border-radius: 999px;
						white-space: nowrap;
						border: 2.5px solid #fff;
						line-height: 1.2;
						display: flex;
						align-items: center;
						gap: 4px;
					}
					.im-badge-no-price {
						background: linear-gradient(135deg, #6366f1, #8b5cf6);
						padding: 7px 9px;
					}
					.im-badge-managed {
						background: linear-gradient(135deg, #f59e0b, #ef4444);
					}
					.im-pin-stem {
						width: 2.5px;
						height: 9px;
						background: linear-gradient(to bottom, #0d9488, transparent);
					}
					.im-pin-dot {
						width: 7px;
						height: 7px;
						background: #0d9488;
						border-radius: 50%;
						border: 2px solid #fff;
						box-shadow: 0 2px 6px rgba(13,148,136,0.5);
					}
					.leaflet-popup-content-wrapper {
						padding: 0 !important;
						border-radius: 16px !important;
						overflow: hidden !important;
						border: none !important;
						box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1) !important;
					}
					.leaflet-popup-content {
						margin: 0 !important;
						width: 240px !important;
					}
					.leaflet-popup-tip { background: #fff !important; box-shadow: none !important; }
					.im-popup {
						font-family: 'Segoe UI', system-ui, sans-serif;
						background: #fff;
						border-radius: 16px;
						overflow: hidden;
					}
					.im-popup-img {
						width: 100%;
						height: 130px;
						object-fit: cover;
						display: block;
					}
					.im-popup-img-placeholder {
						width: 100%;
						height: 130px;
						background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 36px;
					}
					.im-popup-body { padding: 12px 14px 14px; }
					.im-popup-title {
						font-size: 13.5px;
						font-weight: 800;
						color: #0f172a;
						margin: 0 0 3px;
						line-height: 1.3;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.im-popup-location {
						font-size: 11.5px;
						color: #64748b;
						margin: 0 0 9px;
						display: flex;
						align-items: center;
						gap: 3px;
					}
					.im-popup-price {
						font-size: 18px;
						font-weight: 900;
						color: #0d9488;
						line-height: 1;
						margin-bottom: 9px;
						display: flex;
						align-items: baseline;
						gap: 3px;
					}
					.im-popup-price span {
						font-size: 11px;
						font-weight: 500;
						color: #94a3b8;
					}
					.im-popup-chips {
						display: flex;
						flex-wrap: wrap;
						gap: 5px;
						margin-bottom: 11px;
					}
					.im-chip {
						font-size: 10.5px;
						font-weight: 600;
						padding: 3px 9px;
						border-radius: 999px;
					}
					.im-chip-bhk  { background: #f0fdf4; color: #16a34a; }
					.im-chip-mgd  { background: #eff6ff; color: #2563eb; }
					.im-chip-furn { background: #fef3c7; color: #d97706; }
					.im-chip-type { background: #f5f3ff; color: #7c3aed; }
					.im-popup-btn {
						display: block;
						width: 100%;
						padding: 9px 0;
						background: linear-gradient(135deg, #0d9488, #0891b2);
						color: #fff;
						font-size: 12.5px;
						font-weight: 700;
						text-align: center;
						border-radius: 10px;
						border: none;
						cursor: pointer;
						text-decoration: none;
						transition: opacity 0.15s;
						box-sizing: border-box;
					}
					.im-popup-btn:hover { opacity: 0.88; }
					.leaflet-control-zoom a {
						border-radius: 10px !important;
						border: 1.5px solid #e2e8f0 !important;
						color: #334155 !important;
						font-weight: 700 !important;
					}
					.leaflet-control-zoom {
						border: none !important;
						border-radius: 12px !important;
						overflow: hidden;
						box-shadow: 0 2px 12px rgba(0,0,0,0.12) !important;
					}
				`;
				document.head.appendChild(style);
			}

			const mapped = properties
				.map((p) => ({ ...p, _coords: extractLatLng(p.map_embed) }))
				.filter((p) => p._coords !== null);

			if (mapped.length === 0) {
				const noCoords = document.createElement('div');
				noCoords.style.cssText =
					'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,255,255,0.9);z-index:1000;gap:10px;border-radius:16px;';
				noCoords.innerHTML = `
					<div style="font-size:3rem">📍</div>
					<p style="font-size:14px;color:#334155;font-weight:700;margin:0;">No map coordinates found</p>
					<p style="font-size:12px;color:#94a3b8;margin:0;text-align:center;max-width:260px;">Add a Google Maps embed URL in the property form to show pins here</p>
				`;
				mapRef.current.style.position = 'relative';
				mapRef.current.appendChild(noCoords);
				return;
			}

			const bounds = [];

			mapped.forEach((p) => {
				const rent = getPropertyValue(p);
				const rentLabel = formatRent(rent);
				const title = p.title || p.name || 'Property';
				const location = [p.sector, p.location, p.city]
					.filter(Boolean)
					.join(', ');
				const isManaged = !!p.is_managed;
				const bhk = p.beds ? `${p.beds} BHK` : null;
				const furnishing = p.furnishing
					? String(p.furnishing).toLowerCase().includes('fully')
						? 'Furnished'
						: String(p.furnishing).toLowerCase().includes('semi')
							? 'Semi-Furn'
							: String(p.furnishing).toLowerCase().includes('un')
								? 'Unfurnished'
								: null
					: null;
				const propType = p.property_type
					? String(p.property_type).charAt(0).toUpperCase() +
						String(p.property_type).slice(1)
					: null;

				const badgeClass = isManaged
					? 'im-badge im-badge-managed'
					: rentLabel
						? 'im-badge'
						: 'im-badge im-badge-no-price';

				const badgeContent = rentLabel
					? rentLabel
					: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;

				const iconHtml = `
					<div class="im-marker-wrap">
						<div class="${badgeClass}">${badgeContent}</div>
						<div class="im-pin-stem"></div>
						<div class="im-pin-dot"></div>
					</div>
				`;

				const icon = L.divIcon({
					html: iconHtml,
					className: '',
					iconSize: [80, 48],
					iconAnchor: [40, 48],
					popupAnchor: [0, -52],
				});

				const chips = [
					bhk ? `<span class="im-chip im-chip-bhk">${bhk}</span>` : '',
					isManaged ? `<span class="im-chip im-chip-mgd">✓ Managed</span>` : '',
					furnishing
						? `<span class="im-chip im-chip-furn">${furnishing}</span>`
						: '',
					propType
						? `<span class="im-chip im-chip-type">${propType}</span>`
						: '',
				]
					.filter(Boolean)
					.join('');

				const imgEl =
					p.image || p.thumbnail || p.cover_image
						? `<img class="im-popup-img" src="${p.image || p.thumbnail || p.cover_image}" alt="${title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
					   <div class="im-popup-img-placeholder" style="display:none;">🏠</div>`
						: `<div class="im-popup-img-placeholder">🏠</div>`;

				const propertyId = p.id || p._id || '';
				const detailUrl = propertyId ? `/property/${propertyId}` : '#';

				const popupHtml = `
					<div class="im-popup">
						${imgEl}
						<div class="im-popup-body">
							<p class="im-popup-title" title="${title}">${title}</p>
							${location ? `<p class="im-popup-location">📍 ${location}</p>` : ''}
							${
								rent > 0
									? `<div class="im-popup-price">₹${rent.toLocaleString('en-IN')}<span>/month</span></div>`
									: '<div style="height:4px"></div>'
							}
							${chips ? `<div class="im-popup-chips">${chips}</div>` : ''}
							<a class="im-popup-btn" href="${detailUrl}">View Property →</a>
						</div>
					</div>
				`;

				const marker = L.marker([p._coords.lat, p._coords.lng], { icon }).addTo(
					map,
				);
				marker.bindPopup(popupHtml, {
					maxWidth: 260,
					minWidth: 240,
					closeButton: true,
				});

				marker.on('popupopen', () => {
					marker
						.getElement()
						?.style.setProperty('z-index', '9999', 'important');
				});
				marker.on('popupclose', () => {
					marker.getElement()?.style.removeProperty('z-index');
				});

				markersRef.current.push(marker);
				bounds.push([p._coords.lat, p._coords.lng]);
			});

			if (bounds.length > 0) {
				map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
			}
		});

		return () => {
			if (leafletMapRef.current) {
				leafletMapRef.current.remove();
				leafletMapRef.current = null;
				markersRef.current = [];
			}
		};
	}, [properties]);

	const managedCount = properties.filter((p) => p.is_managed).length;

	return (
		<div
			className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm"
			style={{ height: '70vh', minHeight: 480 }}
		>
			<div ref={mapRef} style={{ width: '100%', height: '100%' }} />
			<div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
				<div className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 shadow-lg border border-slate-200 dark:border-white/10 flex items-center gap-2">
					<span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 inline-block flex-shrink-0" />
					<span className="font-bold text-slate-800 dark:text-white">
						{properties.length}
					</span>
					&nbsp;propert{properties.length === 1 ? 'y' : 'ies'} shown
				</div>
				{managedCount > 0 && (
					<div className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 shadow-lg border border-slate-200 dark:border-white/10 flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-red-400 inline-block flex-shrink-0" />
						<span className="font-bold text-slate-800 dark:text-white">
							{managedCount}
						</span>
						&nbsp;managed
					</div>
				)}
			</div>
			<div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 shadow border border-slate-200 dark:border-white/10">
				Click a pin to see details
			</div>
		</div>
	);
};

const AllPropertiesPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { slug } = useParams();
	const heroRef = useRef(null);

	const slugFilters = useMemo(() => (slug ? slugToFilters(slug) : {}), [slug]);
	const isRentRoute = location.pathname.startsWith('/rent');

	const params = new URLSearchParams(location.search);
	const urlTab = params.get('tab') || (isRentRoute ? 'rent' : null);
	const urlCity = params.get('city');
	const urlSearch = params.get('search') || slugFilters.location || null;
	const urlBhk = params.get('bhk') || slugFilters.beds || null;
	const highlightId = params.get('highlight');

	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showNoResults, setShowNoResults] = useState(false);

	/* filters */
	const [propertyTypes, setPropertyTypes] = useState([]);
	const [beds, setBeds] = useState([]);
	const [furnishing, setFurnishing] = useState([]);
	const [managedOnly, setManagedOnly] = useState(false);
	const [priceRange, setPriceRange] = useState([0, 100000]);
	const [minPrice, setMinPrice] = useState('0');
	const [maxPriceInput, setMaxPriceInput] = useState('100000');
	const [showFilters, setShowFilters] = useState(false);
	const [filterTab, setFilterTab] = useState('filters');

	/* ui */
	const [headlineIndex, setHeadlineIndex] = useState(0);
	const [headlineVisible, setHeadlineVisible] = useState(true);
	const [view, setView] = useState('grid');
	const [sortBy, setSortBy] = useState('');
	const [openSortDesktop, setOpenSortDesktop] = useState(false);
	const [openSortMobile, setOpenSortMobile] = useState(false);
	const [heroScrolled, setHeroScrolled] = useState(false);

	/* ── helpers ── */
	const parseNumber = (val) => {
		if (!val) return 0;
		if (typeof val === 'number') return val;
		let s = String(val).toLowerCase().replace(/,/g, '').trim();
		if (s.includes('cr')) return parseFloat(s) * 10000000;
		if (s.includes('lac') || s.includes('lakh')) return parseFloat(s) * 100000;
		return parseFloat(s) || 0;
	};

	const getPropertyValue = (p) =>
		parseNumber(
			p?.monthly_rent_amount ?? p?.monthly_rent ?? p?.rent ?? p?.price,
		);

	/* ── data fetch ── */
	useEffect(() => {
		api
			.get('/properties?limit=1000')
			.then((res) => {
				const data = Array.isArray(res.data)
					? res.data
					: res.data?.results || res.data?.data || [];
				setProperties(data);
			})
			.catch(() => setError('Failed to load properties'))
			.finally(() => setLoading(false));
	}, []);

	/* ── rotating headline ── */
	useEffect(() => {
		const i = setInterval(() => {
			setHeadlineVisible(false);
			setTimeout(() => {
				setHeadlineIndex((p) => (p + 1) % headlines.length);
				setHeadlineVisible(true);
			}, 350);
		}, 3500);
		return () => clearInterval(i);
	}, []);

	/* ── bhk from url ── */
	useEffect(() => {
		if (urlBhk) setBeds([urlBhk]);
	}, [urlBhk]);

	/* ── scroll detection for sticky search bar feel ── */
	useEffect(() => {
		const fn = () => setHeroScrolled(window.scrollY > 100);
		window.addEventListener('scroll', fn, { passive: true });
		return () => window.removeEventListener('scroll', fn);
	}, []);

	/* ── max rent ── */
	const maxRent = useMemo(() => {
		const rents = properties
			.filter((p) => p.property_type?.toLowerCase() === 'rent')
			.map((p) => getPropertyValue(p))
			.filter((n) => n > 0);
		return Math.max(rents.length ? Math.max(...rents) : 70000, 100000);
	}, [properties]);

	const toggleArray = (v, fn) =>
		fn((prev) =>
			prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
		);

	const handleSliderChange = (val) => {
		setPriceRange(val);
		setMinPrice(String(val[0]));
		setMaxPriceInput(String(val[1]));
	};
	const handleMinInput = (e) => {
		setMinPrice(e.target.value);
		const n = Number(e.target.value);
		if (!isNaN(n)) setPriceRange([n, priceRange[1]]);
	};
	const handleMaxInput = (e) => {
		setMaxPriceInput(e.target.value);
		const n = Number(e.target.value);
		if (!isNaN(n)) setPriceRange([priceRange[0], n]);
	};
	const clearFilters = () => {
		setPropertyTypes([]);
		setBeds([]);
		setFurnishing([]);
		setManagedOnly(false);
		setPriceRange([0, maxRent]);
		setMinPrice('0');
		setMaxPriceInput(String(maxRent));
	};

	/* ── filtering ── */
	const filteredProperties = useMemo(() => {
		return properties.filter((p) => {
			if (urlTab === 'rent' && p.property_type !== 'rent') return false;
			if (urlCity) {
				const c = urlCity.trim().toLowerCase();
				if (
					!(
						p.city?.toLowerCase() === c || p.location?.toLowerCase().includes(c)
					)
				)
					return false;
			}
			if (urlSearch) {
				const t = urlSearch.toLowerCase();
				if (
					!(
						p.title?.toLowerCase().includes(t) ||
						p.location?.toLowerCase().includes(t) ||
						p.sector?.toLowerCase().includes(t) ||
						p.city?.toLowerCase().includes(t)
					)
				)
					return false;
			}
			if (
				propertyTypes.length &&
				!propertyTypes
					.map((x) => x.toLowerCase())
					.includes((p.property_type || '').toLowerCase())
			)
				return false;
			if (beds.length && !beds.map(String).includes(String(p.beds ?? '')))
				return false;
			if (furnishing.length) {
				let f = String(p.furnishing ?? '').toLowerCase();
				if (f.includes('fully')) f = 'furnished';
				else if (f.includes('semi')) f = 'semi-furnished';
				else if (f.includes('un')) f = 'unfurnished';
				if (!furnishing.map((x) => x.toLowerCase()).includes(f)) return false;
			}
			if (managedOnly && !p.is_managed) return false;
			const val = getPropertyValue(p);
			if (val > 0 && (val < priceRange[0] || val > priceRange[1])) return false;
			return true;
		});
	}, [
		properties,
		propertyTypes,
		beds,
		furnishing,
		managedOnly,
		priceRange,
		urlTab,
		urlCity,
		urlSearch,
		urlBhk,
	]);

	const finalProperties = useMemo(() => {
		const list = [...filteredProperties];
		if (sortBy === 'price_low')
			list.sort((a, b) => getPropertyValue(a) - getPropertyValue(b));
		if (sortBy === 'price_high')
			list.sort((a, b) => getPropertyValue(b) - getPropertyValue(a));
		return list;
	}, [filteredProperties, sortBy]);

	useEffect(() => {
		if (highlightId) {
			const el = document.getElementById(highlightId);
			if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [highlightId, finalProperties]);

	useEffect(() => {
		setShowNoResults(!loading && finalProperties.length === 0);
	}, [finalProperties, loading]);

	/* active filter count */
	const activeFilterCount = [
		propertyTypes.length,
		beds.length,
		furnishing.length,
		managedOnly ? 1 : 0,
		priceRange[0] > 0 || priceRange[1] < maxRent ? 1 : 0,
	].reduce((a, b) => a + b, 0);

	const seoLocation = slugFilters.location
		? slugFilters.location.replace(/\b\w/g, (c) => c.toUpperCase())
		: null;
	const seoBhkText = slugFilters.beds ? `${slugFilters.beds} BHK ` : '';
	const seoTitle = seoLocation
		? `${seoBhkText}Flats for Rent in ${seoLocation} | InstaMakaan`
		: 'Flats, PG & Rental Properties in Noida, Greater Noida & Ghaziabad | InstaMakaan';
	const seoDesc = seoLocation
		? `Find ${seoBhkText}flats for rent in ${seoLocation}. Verified properties with transparent pricing. Browse now on InstaMakaan.`
		: 'Explore verified rental properties, flats, PGs and co-living spaces in Noida, Greater Noida, Noida Extension and Ghaziabad. Filter by budget, BHK, furnishing and find your perfect home with InstaMakaan.';
	const seoCanonical = slug
		? `https://instamakaan.com/rent/${slug}`
		: 'https://instamakaan.com/all-properties';

	return (
		<Layout>
			<Helmet>
				<title>{seoTitle}</title>
				<meta name="description" content={seoDesc} />
				<meta name="keywords" content="flats in noida, pg in noida, rental properties noida, rent house noida, flats in greater noida, 1 bhk flat noida, 2 bhk flat noida, furnished flats noida" />
				<link rel="canonical" href={seoCanonical} />
				<meta property="og:title" content={seoTitle} />
				<meta property="og:description" content={seoDesc} />
				<meta property="og:url" content={seoCanonical} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={seoTitle} />
				<meta name="twitter:description" content={seoDesc} />
				<meta name="twitter:image" content="https://instamakaan.com/images/orglogo.webp" />
			</Helmet>

			{/* Hidden H1 for SEO */}
			<h1 className="sr-only">
				Rental Flats, PG & Properties in Noida, Greater Noida, Noida Extension &
				Ghaziabad
			</h1>

			<div className="min-h-screen w-full bg-slate-50 dark:bg-[#080f1e]">
				{/* ════════════════════════════════════
            HERO BANNER — compact
        ════════════════════════════════════ */}
				<section
					ref={heroRef}
					className="relative overflow-hidden -mt-14 pt-20 pb-6 md:pt-24 md:pb-8"
				>
					{/* background */}
					<div className="absolute inset-0 -z-10 bg-white dark:bg-[#0a1120]" />
					<div
						className="absolute inset-0 -z-10"
						style={{
							background:
								'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(56,189,248,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(45,212,191,0.15) 0%, transparent 60%)',
						}}
					/>
					{/* subtle orbs */}
					<div className="absolute top-6 left-10 w-48 h-48 rounded-full bg-teal-400/10 blur-3xl animate-pulse-slow pointer-events-none" />
					<div
						className="absolute bottom-0 right-16 w-56 h-56 rounded-full bg-cyan-400/8 blur-3xl animate-pulse-slow pointer-events-none"
						style={{ animationDelay: '1.5s' }}
					/>

					<div className="container-custom text-center relative z-10">
						{isRentRoute && <RentBuySwitch active="rent" className="mb-4" />}
						{/* Animated headline */}
						<h2
							className={`text-xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-800 dark:text-white mb-2 transition-all duration-300 ${
								headlineVisible
									? 'opacity-100 translate-y-0'
									: 'opacity-0 -translate-y-2'
							}`}
						>
							{headlines[headlineIndex]}
						</h2>

						<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1 hero-fade-in">
							Browse across Noida, Greater Noida, Noida Extension & Ghaziabad
						</p>
						{isRentRoute && (
							<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
								<Link
									to="/guides/renting-a-property-in-noida"
									className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline"
								>
									New to renting? Read our complete guide →
								</Link>
								<Link
									to="/areas"
									className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline"
								>
									Explore area guides →
								</Link>
							</div>
						)}

						{/* Dot indicators */}
						<div className="flex justify-center gap-1.5">
							{headlines.map((_, i) => (
								<button
									key={i}
									onClick={() => {
										setHeadlineIndex(i);
										setHeadlineVisible(true);
									}}
									className={`rounded-full transition-all duration-300 ${
										i === headlineIndex
											? 'w-6 h-1.5 bg-teal-500'
											: 'w-1.5 h-1.5 bg-slate-300 dark:bg-white/20 hover:bg-teal-400'
									}`}
								/>
							))}
						</div>
					</div>
				</section>

				{/* ════════════════════════════════════
            CONTENT AREA
        ════════════════════════════════════ */}
				<div className="container-custom py-4 md:py-8">
					{/* TOP CONTROL BAR — desktop only sticky, hidden on mobile */}
					<div
						className={`hidden lg:block sticky top-16 z-40 mb-6 transition-all duration-300 ${
							heroScrolled
								? 'bg-white/90 dark:bg-[#0a1120]/90 backdrop-blur-xl shadow-lg rounded-2xl px-4 py-3 border border-slate-200/60 dark:border-white/8'
								: ''
						}`}
					>
						<div className="flex items-center justify-between gap-3 flex-wrap">
							{/* Left: sort + clear */}
							<div className="flex items-center gap-2 flex-wrap">
								{/* Sort dropdown */}
								<div className="relative">
									<button
										onClick={() => setOpenSortDesktop((p) => !p)}
										className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-teal-400 transition-all shadow-sm"
									>
										<ArrowUpDown className="w-4 h-4" />
										<span>
											{sortBy === 'price_low'
												? 'Price: Low → High'
												: sortBy === 'price_high'
													? 'Price: High → Low'
													: 'Sort By'}
										</span>
										<ChevronDown
											className={`w-3.5 h-3.5 transition-transform ${openSortDesktop ? 'rotate-180' : ''}`}
										/>
									</button>
									{openSortDesktop && (
										<div className="absolute left-0 mt-2 w-52 bg-white dark:bg-[#0f172a] rounded-xl shadow-xl border border-slate-200 dark:border-white/10 z-50 overflow-hidden animate-dropdown">
											{[
												{ key: 'price_low', label: 'Price: Low to High' },
												{ key: 'price_high', label: 'Price: High to Low' },
												{ key: '', label: 'Default Order', muted: true },
											].map(({ key, label, muted }) => (
												<button
													key={key}
													onClick={() => {
														setSortBy(key);
														setOpenSortDesktop(false);
													}}
													className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between ${
														muted
															? 'text-slate-400'
															: sortBy === key
																? 'text-teal-600 font-semibold'
																: 'text-slate-700 dark:text-slate-200'
													}`}
												>
													{label}
													{sortBy === key && key && (
														<span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
													)}
												</button>
											))}
										</div>
									)}
								</div>

								{activeFilterCount > 0 && (
									<button
										onClick={clearFilters}
										className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20 transition-all"
									>
										<RotateCcw className="w-3.5 h-3.5" />
										Clear ({activeFilterCount})
									</button>
								)}
							</div>

							{/* Right: result count + view toggle */}
							<div className="flex items-center gap-3 ml-auto">
								<span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
									<span className="text-slate-800 dark:text-white font-bold">
										{finalProperties.length}
									</span>{' '}
									properties
								</span>
								<div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
									<button
										onClick={() => setView('grid')}
										className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-white/10 shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
									>
										<LayoutGrid className="w-4 h-4" />
									</button>
									<button
										onClick={() => setView('list')}
										className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-white/10 shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
									>
										<List className="w-4 h-4" />
									</button>
									<button
										onClick={() => setView('map')}
										className={`p-2 rounded-lg transition-all ${view === 'map' ? 'bg-white dark:bg-white/10 shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
									>
										<Map className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>

						{/* Active filter chips row */}
						{activeFilterCount > 0 && (
							<div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
								{urlSearch && (
									<span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-medium border border-teal-200 dark:border-teal-500/20">
										<Search className="w-3 h-3" /> "{urlSearch}"
									</span>
								)}
								{beds.map((b) => (
									<span
										key={b}
										className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-500/20"
									>
										{b} BHK
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => toggleArray(b, setBeds)}
										/>
									</span>
								))}
								{propertyTypes.map((t) => (
									<span
										key={t}
										className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-500/20"
									>
										{t}
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => toggleArray(t, setPropertyTypes)}
										/>
									</span>
								))}
							</div>
						)}
					</div>

					{/* MOBILE TOP BAR — result count + view toggle only, no filters/sort (those are in bottom bar) */}
					<div className="lg:hidden flex items-center justify-between mb-4 px-1">
						<span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
							<span className="text-slate-800 dark:text-white font-bold">
								{finalProperties.length}
							</span>{' '}
							properties found
						</span>
						<div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
							<button
								onClick={() => setView('grid')}
								className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-white/10 shadow-sm text-teal-600' : 'text-slate-400'}`}
							>
								<LayoutGrid className="w-4 h-4" />
							</button>
							<button
								onClick={() => setView('list')}
								className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-white/10 shadow-sm text-teal-600' : 'text-slate-400'}`}
							>
								<List className="w-4 h-4" />
							</button>
							<button
								onClick={() => setView('map')}
								className={`p-2 rounded-lg transition-all ${view === 'map' ? 'bg-white dark:bg-white/10 shadow-sm text-teal-600' : 'text-slate-400'}`}
							>
								<Map className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Active filter chips — mobile */}
					{activeFilterCount > 0 && (
						<div className="lg:hidden flex flex-wrap gap-2 mb-4">
							{beds.map((b) => (
								<span
									key={b}
									className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-500/20"
								>
									{b} BHK
									<X
										className="w-3 h-3 cursor-pointer"
										onClick={() => toggleArray(b, setBeds)}
									/>
								</span>
							))}
							{propertyTypes.map((t) => (
								<span
									key={t}
									className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-500/20"
								>
									{t}
									<X
										className="w-3 h-3 cursor-pointer"
										onClick={() => toggleArray(t, setPropertyTypes)}
									/>
								</span>
							))}
							<button
								onClick={clearFilters}
								className="flex items-center gap-1 px-3 py-1 rounded-full text-xs text-red-500 border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10"
							>
								<RotateCcw className="w-3 h-3" /> Clear all
							</button>
						</div>
					)}

					{/* MAIN GRID: sidebar + cards */}
					<div className="grid lg:grid-cols-[280px_1fr] gap-6">
						{/* ── DESKTOP SIDEBAR ── */}
						<aside className="hidden lg:block">
							<div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm sticky top-32 overflow-hidden">
								<div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-teal-50 to-white dark:from-teal-900/20 dark:to-transparent">
									<div className="flex items-center gap-2">
										<SlidersHorizontal className="w-4 h-4 text-teal-600" />
										<h3 className="text-sm font-bold text-slate-800 dark:text-white">
											Filters
										</h3>
										{activeFilterCount > 0 && (
											<span className="px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold">
												{activeFilterCount}
											</span>
										)}
									</div>
									{activeFilterCount > 0 && (
										<button
											onClick={clearFilters}
											className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
										>
											<RotateCcw className="w-3 h-3" /> Reset
										</button>
									)}
								</div>
								<div className="p-4">
									<FiltersPanel
										filterTab={filterTab}
										setFilterTab={setFilterTab}
										beds={beds}
										setBeds={setBeds}
										toggleArray={toggleArray}
										priceRange={priceRange}
										minPrice={minPrice}
										maxPriceInput={maxPriceInput}
										handleMinInput={handleMinInput}
										handleMaxInput={handleMaxInput}
										handleSliderChange={handleSliderChange}
										setPriceRange={setPriceRange}
										maxRent={maxRent}
										propertyTypes={propertyTypes}
										setPropertyTypes={setPropertyTypes}
										furnishing={furnishing}
										setFurnishing={setFurnishing}
										managedOnly={managedOnly}
										setManagedOnly={setManagedOnly}
										clearFilters={clearFilters}
									/>
								</div>
							</div>
						</aside>

						{/* ── MOBILE FILTER DRAWER ── */}
						{showFilters && (
							<div className="fixed inset-0 z-[9999] lg:hidden">
								<div
									className="absolute inset-0 bg-black/50 backdrop-blur-sm"
									onClick={() => setShowFilters(false)}
								/>
								<div className="absolute left-0 top-0 bottom-0 w-[88%] max-w-[360px] bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col animate-slideInLeft">
									<div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-teal-50 to-white dark:from-teal-900/20 dark:to-transparent shrink-0">
										<div className="flex items-center gap-2">
											<SlidersHorizontal className="w-4 h-4 text-teal-600" />
											<h3 className="text-base font-bold text-slate-800 dark:text-white">
												Filters
											</h3>
											{activeFilterCount > 0 && (
												<span className="px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold">
													{activeFilterCount}
												</span>
											)}
										</div>
										<button
											onClick={() => setShowFilters(false)}
											className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
										>
											<X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
										</button>
									</div>
									<div className="flex-1 overflow-y-auto p-4">
										<FiltersPanel
											isMobile
											filterTab={filterTab}
											setFilterTab={setFilterTab}
											beds={beds}
											setBeds={setBeds}
											toggleArray={toggleArray}
											priceRange={priceRange}
											minPrice={minPrice}
											maxPriceInput={maxPriceInput}
											handleMinInput={handleMinInput}
											handleMaxInput={handleMaxInput}
											handleSliderChange={handleSliderChange}
											setPriceRange={setPriceRange}
											maxRent={maxRent}
											propertyTypes={propertyTypes}
											setPropertyTypes={setPropertyTypes}
											furnishing={furnishing}
											setFurnishing={setFurnishing}
											managedOnly={managedOnly}
											setManagedOnly={setManagedOnly}
											clearFilters={clearFilters}
										/>
									</div>
									<div className="shrink-0 p-4 border-t border-slate-100 dark:border-white/10">
										<button
											onClick={() => setShowFilters(false)}
											className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors shadow-lg"
										>
											Show {finalProperties.length} Properties
										</button>
									</div>
								</div>
							</div>
						)}

						{/* ── PROPERTY CARDS ── */}
						<div className="pb-24 lg:pb-0">
							{loading && (
								<div
									className={cn(
										view === 'grid'
											? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5'
											: 'space-y-4',
									)}
								>
									{[...Array(6)].map((_, i) => (
										<div
											key={i}
											className="rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden animate-pulse"
										>
											<div className="h-36 bg-slate-200 dark:bg-white/10" />
											<div className="p-3 space-y-2">
												<div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded-lg w-3/4" />
												<div className="h-3 bg-slate-100 dark:bg-white/5 rounded-lg w-1/2" />
												<div className="h-7 bg-slate-100 dark:bg-white/5 rounded-lg" />
											</div>
										</div>
									))}
								</div>
							)}

							{error && (
								<div className="text-center py-16">
									<p className="text-red-500 font-medium">{error}</p>
								</div>
							)}

							{!loading && !error && (
								<>
									{view === 'map' ? (
										<PropertiesMapView
											properties={finalProperties}
											getPropertyValue={getPropertyValue}
										/>
									) : (
										<div
											className={cn(
												view === 'grid'
													? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5'
													: 'space-y-4',
											)}
										>
											{finalProperties.map((property, i) => (
												<div
													id={property.id}
													key={property.id || property._id || i}
													className="card-enter"
													style={{
														animationDelay: `${Math.min(i * 50, 400)}ms`,
													}}
												>
													<PropertyCard
														property={property}
														isGrid={view === 'grid'}
													/>
												</div>
											))}
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>

				{/* ════════════════════════════════════
            NO RESULTS MODAL
        ════════════════════════════════════ */}
				{showNoResults && (
					<div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
						<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
						<div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 animate-modalIn">
							<button
								onClick={() => setShowNoResults(false)}
								className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white"
							>
								<X className="w-5 h-5" />
							</button>
							<div className="flex justify-center mb-5">
								<img
									src="/images/orglogo.webp"
									alt="InstaMakaan"
									loading="lazy"
									className="h-10 w-auto"
								/>
							</div>
							<div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
								<Search className="w-8 h-8 text-red-400" />
							</div>
							<h3 className="text-xl sm:text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
								No Properties Found
							</h3>
							<p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-5">
								Try adjusting your filters or explore all available listings.
							</p>
							{activeFilterCount > 0 && (
								<div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 mb-5 space-y-2 text-sm">
									{beds.length > 0 && (
										<p className="text-red-500 flex items-center gap-2">
											<X className="w-3.5 h-3.5" /> {beds.join(', ')} BHK
											unavailable
										</p>
									)}
									{propertyTypes.length > 0 && (
										<p className="text-red-500 flex items-center gap-2">
											<X className="w-3.5 h-3.5" /> {propertyTypes.join(', ')}{' '}
											type unavailable
										</p>
									)}
									{furnishing.length > 0 && (
										<p className="text-red-500 flex items-center gap-2">
											<X className="w-3.5 h-3.5" /> {furnishing.join(', ')} not
											available
										</p>
									)}
									{managedOnly && (
										<p className="text-red-500 flex items-center gap-2">
											<X className="w-3.5 h-3.5" /> Managed homes unavailable
										</p>
									)}
								</div>
							)}
							<div className="flex flex-col gap-3">
								<button
									onClick={() => {
										clearFilters();
										setShowNoResults(false);
									}}
									className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity"
								>
									Clear All Filters
								</button>
								<button
									onClick={() => {
										setShowNoResults(false);
										navigate('/contact');
									}}
									className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
								>
									Contact InstaMakaan
								</button>
							</div>
						</div>
					</div>
				)}
				<PageFAQSection faqs={PROPERTIES_FAQS} title="Property Search — FAQs" />
				{/* ════════════════════════════════════
            MOBILE BOTTOM BAR — single bar, no duplicate
        ════════════════════════════════════ */}
				<div className="fixed bottom-3 left-3 right-3 z-50 lg:hidden">
					<div className="flex justify-around items-center px-2 py-3 rounded-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl">
						<button
							onClick={() => navigate(-1)}
							className="flex flex-col items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 active:scale-90 transition min-w-[52px]"
						>
							<ArrowLeft className="w-5 h-5" />
							<span>Back</span>
						</button>

						<div className="w-px h-8 bg-slate-200 dark:bg-white/10" />

						<div className="relative flex flex-col items-center min-w-[52px]">
							<button
								onClick={() => setOpenSortMobile((p) => !p)}
								className="flex flex-col items-center gap-1 text-[11px] active:scale-90 transition text-slate-500 dark:text-slate-400"
							>
								<ArrowUpDown className="w-5 h-5" />
								<span>Sort</span>
							</button>
							{openSortMobile && (
								<div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-52 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 z-50 overflow-hidden animate-dropdown">
									{[
										{ key: 'price_low', label: 'Price: Low to High' },
										{ key: 'price_high', label: 'Price: High to Low' },
										{ key: '', label: 'Default Order' },
									].map(({ key, label }) => (
										<button
											key={key}
											onClick={() => {
												setSortBy(key);
												setOpenSortMobile(false);
											}}
											className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${sortBy === key ? 'text-teal-600 font-semibold' : 'text-slate-700 dark:text-slate-200'}`}
										>
											{label}
										</button>
									))}
								</div>
							)}
						</div>

						<div className="w-px h-8 bg-slate-200 dark:bg-white/10" />

						<button
							onClick={() => setShowFilters(true)}
							className="relative flex flex-col items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 active:scale-90 transition min-w-[52px]"
						>
							<Filter className="w-5 h-5" />
							<span>Filters</span>
							{activeFilterCount > 0 && (
								<span className="absolute -top-1 right-6 w-4 h-4 rounded-full bg-teal-500 text-white text-[9px] font-bold flex items-center justify-center">
									{activeFilterCount}
								</span>
							)}
						</button>

						<div className="w-px h-8 bg-slate-200 dark:bg-white/10" />

						<button
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							className="flex flex-col items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 active:scale-90 transition min-w-[52px]"
						>
							<ArrowUp className="w-5 h-5" />
							<span>Top</span>
						</button>
					</div>
				</div>
			</div>

			{/* ════ GLOBAL STYLES ════ */}
			<style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-in { animation: heroFadeIn 0.5s ease both; }

        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .card-enter { animation: cardEnter 0.4s ease both; }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        .animate-slideInLeft { animation: slideInLeft 0.3s cubic-bezier(.22,.68,0,1.2); }

        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown { animation: dropdown 0.2s ease; }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .animate-modalIn { animation: modalIn 0.3s cubic-bezier(.22,.68,0,1.2); }

        @keyframes pulseSlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.04); }
        }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }

        /* Slider */
        [data-radix-slider-root] { display:flex; align-items:center; position:relative; height:30px; }
        [data-radix-slider-track] { background:#e2e8f0; position:relative; flex-grow:1; border-radius:999px; height:8px; }
        .dark [data-radix-slider-track] { background:#1e293b; }
        [data-radix-slider-range] { position:absolute; background:linear-gradient(90deg,#14b8a6,#0ea5e9); border-radius:999px; height:8px; }
        [data-radix-slider-thumb] { display:block; width:22px; height:22px; background:white; border:4px solid #14b8a6; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.2); transition:transform .15s,box-shadow .15s; cursor:grab; }
        .dark [data-radix-slider-thumb] { background:#0f172a; }
        [data-radix-slider-thumb]:hover { transform:scale(1.15); box-shadow:0 6px 20px rgba(20,184,166,0.4); }
        [data-radix-slider-thumb]:active { cursor:grabbing; transform:scale(1.2); }

        .hide-scrollbar::-webkit-scrollbar { display:none; }
        .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
		</Layout>
	);
};

export default AllPropertiesPage;
