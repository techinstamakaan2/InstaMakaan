import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	ArrowLeft,
	Upload,
	X,
	Plus,
	Loader2,
	Image as ImageIcon,
	Building2,
	MapPin,
	DollarSign,
	Map,
	BedDouble,
	Wifi,
	Save,
	// amenity icons
	Lightbulb,
	Wind,
	Flame,
	Eye,
	Car,
	ShowerHead,
	Thermometer,
	Sofa,
	Tv,
	UtensilsCrossed,
	RefrigeratorIcon,
	WashingMachine,
	Microwave,
	Coffee,
	Lock,
	Phone,
	Camera,
	ShieldCheck,
	Dumbbell,
	Trees,
	Waves,
	Footprints,
	Users,
	Gamepad2,
	Sparkles,
	Home,
	ChefHat,
	BookOpen,
	Bath,
	Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LOCALITY_SUGGESTIONS = [
	'Gaur City', 'Techzone 4', 'Noida Extension', 'Greater Noida West',
	'Crossing Republik', 'Nirala Estate', 'Mahagun Mywoods', 'Panchsheel Greens',
	'ATS Society', 'Ace City', 'Bisrakh', 'Cherry County',
	'Sector 62 Noida', 'Sector 75 Noida', 'Sector 76 Noida', 'Sector 78 Noida',
	'Sector 93 Noida', 'Sector 100 Noida', 'Sector 104 Noida', 'Sector 107 Noida',
	'Sector 137 Noida', 'Sector 143 Noida', 'Sector 150 Noida', 'Sector 168 Noida',
	'Sector 18 Noida', 'Sector 44 Noida', 'Sector 50 Noida',
	'Alpha Greater Noida', 'Beta Greater Noida', 'Chi Greater Noida',
	'Delta Greater Noida', 'Ecotech Greater Noida', 'Gamma Greater Noida',
	'Omega Greater Noida', 'Phi Greater Noida', 'Sigma Greater Noida',
	'Zeta Greater Noida', 'Techzone Greater Noida',
	'Knowledge Park', 'Pari Chowk', 'Yamuna Expressway', 'Jewar',
];

const LOCALITY_ALIASES = {
	'gaur city 1': 'Gaur City', 'gaur city 2': 'Gaur City', 'gaur': 'Gaur City',
	'techzone-4': 'Techzone 4', 'tech zone 4': 'Techzone 4', 'techzone4': 'Techzone 4',
	'noida ext': 'Noida Extension', 'noida extension': 'Noida Extension',
	'greater noida west': 'Greater Noida West', 'greater noida w': 'Greater Noida West', 'gnw': 'Greater Noida West',
	'crossing': 'Crossing Republik',
	'nirala': 'Nirala Estate',
	'mahagun': 'Mahagun Mywoods',
	'panchsheel green': 'Panchsheel Greens', 'panchsheel': 'Panchsheel Greens',
	'o2 valley': 'Greater Noida West', 'o2valley': 'Greater Noida West',
	'dream valley': 'Greater Noida West',
	'ats': 'ATS Society', 'ace': 'Ace City', 'cherry': 'Cherry County',
	'knowledge park': 'Knowledge Park', 'pari chowk': 'Pari Chowk',
	'yamuna': 'Yamuna Expressway',
};

function inferFromAddress(text) {
	const t = text.toLowerCase().trim();
	if (!t) return {};

	const result = {};

	// City
	if (t.includes('greater noida')) result.city = 'Greater Noida';
	else if (t.includes('noida')) result.city = 'Noida';
	else if (t.includes('ghaziabad')) result.city = 'Ghaziabad';

	// Sector from text like "Sector 62" or "Sec 62"
	const secMatch = t.match(/\bsec(?:tor)?\s*[-]?\s*(\d+)\b/);
	if (secMatch) {
		result.sector = `Sector ${secMatch[1]}`;
		result.locality = `Sector ${secMatch[1]} Noida`;
	}

	// Aliases (most specific first)
	for (const [alias, canonical] of Object.entries(LOCALITY_ALIASES)) {
		if (t.includes(alias)) { result.locality = canonical; break; }
	}

	// Fallback: canonical list substring match
	if (!result.locality) {
		for (const loc of LOCALITY_SUGGESTIONS) {
			if (t.includes(loc.toLowerCase())) { result.locality = loc; break; }
		}
	}

	return result;
}

// ─── Room-wise amenity definitions ────────────────────────────────────────────
const ROOM_AMENITY_CATEGORIES = {
	house: {
		label: 'House',
		icon: Home,
		color: 'bg-rose-50 border-rose-200 text-rose-700',
		activeColor: 'bg-rose-500 text-white border-rose-500',
		options: [
			{ label: 'Light', icon: Lightbulb },
			{ label: 'Fan', icon: Wind },
			{ label: 'Geyser', icon: Thermometer },
			{ label: 'Ventilation', icon: Eye },
			{ label: 'Balcony', icon: Trees },
			{ label: 'Private Parking', icon: Car },
			{ label: 'CCTV Surveillance', icon: Camera },
			{ label: 'Security', icon: ShieldCheck },
			{ label: 'Smart Lock', icon: Lock },
			{ label: 'Video Door Phone', icon: Phone },
			{ label: 'Fire Safety', icon: Flame },
			{ label: 'Power Backup', icon: Lightbulb },
			{ label: 'Lift', icon: Building2 },
			{ label: '24/7 Water', icon: Waves },
		],
	},
	living_room: {
		label: 'Living Room',
		icon: Sofa,
		color: 'bg-violet-50 border-violet-200 text-violet-700',
		activeColor: 'bg-violet-500 text-white border-violet-500',
		options: [
			{ label: 'Light', icon: Lightbulb },
			{ label: 'Fan', icon: Wind },
			{ label: 'Sofa', icon: Sofa },
			{ label: 'Television', icon: Tv },
			{ label: 'WiFi', icon: Wifi },
			{ label: 'AC', icon: Wind },
			{ label: 'Curtains', icon: Eye },
			{ label: 'Dining Table', icon: UtensilsCrossed },
		],
	},
	kitchen: {
		label: 'Kitchen',
		icon: ChefHat,
		color: 'bg-teal-50 border-teal-200 text-teal-700',
		activeColor: 'bg-teal-500 text-white border-teal-500',
		options: [
			{ label: 'Modular Kitchen', icon: ChefHat },
			{ label: 'Refrigerator', icon: RefrigeratorIcon },
			{ label: 'Microwave', icon: Microwave },
			{ label: 'Washing Machine', icon: WashingMachine },
			{ label: 'Gas Pipeline', icon: Flame },
			{ label: 'Chimney', icon: Wind },
			{ label: 'Water Purifier', icon: Waves },
			{ label: 'Coffee Maker', icon: Coffee },
			{ label: 'Exhaust Fan', icon: Wind },
			{ label: 'Storage Cabinets', icon: BookOpen },
		],
	},
	bedroom: {
		label: 'Bedroom',
		icon: BedDouble,
		color: 'bg-amber-50 border-amber-200 text-amber-700',
		activeColor: 'bg-amber-500 text-white border-amber-500',
		options: [
			{ label: 'Light', icon: Lightbulb },
			{ label: 'Fan', icon: Wind },
			{ label: 'AC', icon: Wind },
			{ label: 'Bed', icon: BedDouble },
			{ label: 'Wardrobe', icon: BookOpen },
			{ label: 'Attached Bathroom', icon: Bath },
			{ label: 'Balcony', icon: Trees },
			{ label: 'Geyser', icon: Thermometer },
			{ label: 'WiFi', icon: Wifi },
			{ label: 'Television', icon: Tv },
			{ label: 'Curtains', icon: Eye },
			{ label: 'Study Table', icon: BookOpen },
		],
	},
};

// ─── Amenities stored as prefixed flat list e.g. ["house:Light", "kitchen:Modular Kitchen"]
// This keeps backend unchanged (still List[str])
const AMENITY_SEP = ':';

function encodeAmenity(category, label) {
	return `${category}${AMENITY_SEP}${label}`;
}

function decodeAmenities(flat) {
	// Returns { house: [], living_room: [], kitchen: [], bedroom: [] }
	const result = { house: [], living_room: [], kitchen: [], bedroom: [] };
	if (!Array.isArray(flat)) return result;
	flat.forEach((item) => {
		const idx = item.indexOf(AMENITY_SEP);
		if (idx === -1) return;
		const cat = item.slice(0, idx);
		const label = item.slice(idx + 1);
		if (result[cat] !== undefined) result[cat].push(label);
	});
	return result;
}

function encodeAmenities(roomAmenities) {
	// Flatten back to List[str]
	const flat = [];
	Object.entries(roomAmenities).forEach(([cat, labels]) => {
		labels.forEach((label) => flat.push(encodeAmenity(cat, label)));
	});
	return flat;
}

// ─── Default form data ────────────────────────────────────────────────────────
const defaultFormData = {
	title: '',
	property_type: 'rent',
	location: '',
	sector: '',
	city: '',
	locality: '',
	map_embed: '',
	price: '',
	price_label: 'Full Flat Rent',
	description: '',
	beds: 1,
	baths: 1,
	area: '',
	features: [],
	amenities: [],
	furnishing: 'semi-furnished',
	preferred_tenant: 'any',
	gender_preference: 'any',
	is_managed: false,
	managed_by: '',
	status: 'active',
	deposit: '',
	brokerage: '15 Days',
	owner_id: '',
	monthly_rent_amount: 0,
};

// ─── Section nav (Features removed) ──────────────────────────────────────────
const sections = [
	{ id: 'basic', label: 'Basic Info', icon: Building2 },
	{ id: 'pricing', label: 'Pricing', icon: DollarSign },
	{ id: 'details', label: 'Details', icon: BedDouble },
	{ id: 'images', label: 'Images', icon: ImageIcon },
	{ id: 'amenities', label: 'Amenities', icon: Wifi },
	{ id: 'map', label: 'Map & Location', icon: Map },
	{ id: 'neighborhood', label: 'Neighborhood', icon: MapPin },
];

const SectionCard = ({ id, title, icon: Icon, children }) => (
	<Card
		id={id}
		className="bg-card border border-border shadow-none scroll-mt-6"
	>
		<CardHeader className="pb-4">
			<CardTitle className="text-base font-semibold flex items-center gap-2">
				<Icon className="w-4 h-4 text-muted-foreground" />
				{title}
			</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4">{children}</CardContent>
	</Card>
);

// ─── Room Amenity Tab ─────────────────────────────────────────────────────────
const RoomAmenityTab = ({ categoryKey, roomAmenities, setRoomAmenities }) => {
	const category = ROOM_AMENITY_CATEGORIES[categoryKey];
	const selected = roomAmenities[categoryKey] || [];
	const [customInput, setCustomInput] = useState('');

	const toggle = (label) => {
		setRoomAmenities((prev) => {
			const current = prev[categoryKey] || [];
			const next = current.includes(label)
				? current.filter((x) => x !== label)
				: [...current, label];
			return { ...prev, [categoryKey]: next };
		});
	};

	const addCustom = () => {
		const val = customInput.trim();
		if (!val) return;
		setRoomAmenities((prev) => {
			const current = prev[categoryKey] || [];
			if (current.includes(val)) return prev;
			return { ...prev, [categoryKey]: [...current, val] };
		});
		setCustomInput('');
	};

	// Custom amenities = selected items not in predefined list
	const predefinedLabels = category.options.map((o) => o.label);
	const customSelected = selected.filter((s) => !predefinedLabels.includes(s));

	return (
		<div className="space-y-4">
			{/* Predefined options grid */}
			<div className="flex flex-wrap gap-2">
				{category.options.map(({ label, icon: Icon }) => {
					const isSelected = selected.includes(label);
					return (
						<button
							key={label}
							type="button"
							onClick={() => toggle(label)}
							className={cn(
								'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
								isSelected
									? category.activeColor
									: 'bg-muted/40 text-muted-foreground border-transparent hover:border-border hover:bg-muted',
							)}
						>
							<Icon className="w-3.5 h-3.5 flex-shrink-0" />
							{label}
							{isSelected && <span className="ml-0.5 text-xs">✓</span>}
						</button>
					);
				})}
			</div>

			{/* Custom items added */}
			{customSelected.length > 0 && (
				<div className="flex flex-wrap gap-2 pt-2 border-t border-border">
					<p className="w-full text-xs text-muted-foreground">
						Custom amenities:
					</p>
					{customSelected.map((label) => (
						<span
							key={label}
							className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-lg border border-primary/20"
						>
							{label}
							<button type="button" onClick={() => toggle(label)}>
								<X className="w-3 h-3" />
							</button>
						</span>
					))}
				</div>
			)}

			{/* Custom input */}
			<div className="flex gap-2 pt-1">
				<Input
					value={customInput}
					onChange={(e) => setCustomInput(e.target.value)}
					placeholder={`Add custom ${category.label.toLowerCase()} amenity...`}
					onKeyDown={(e) =>
						e.key === 'Enter' && (e.preventDefault(), addCustom())
					}
					className="text-sm"
				/>
				<Button
					type="button"
					variant="outline"
					onClick={addCustom}
					className="flex-shrink-0"
				>
					<Plus className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
};

// ─── Room Amenities Section ───────────────────────────────────────────────────
const RoomAmenitiesSection = ({ roomAmenities, setRoomAmenities }) => {
	const [activeTab, setActiveTab] = useState('house');
	const tabs = Object.entries(ROOM_AMENITY_CATEGORIES);

	const totalSelected = Object.values(roomAmenities).reduce(
		(sum, arr) => sum + arr.length,
		0,
	);

	return (
		<div className="space-y-4">
			{/* Tab header */}
			<div className="flex gap-1 flex-wrap">
				{tabs.map(([key, cat]) => {
					const Icon = cat.icon;
					const count = (roomAmenities[key] || []).length;
					const isActive = activeTab === key;
					return (
						<button
							key={key}
							type="button"
							onClick={() => setActiveTab(key)}
							className={cn(
								'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border',
								isActive
									? 'bg-primary text-primary-foreground border-primary shadow-sm'
									: 'bg-muted/40 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground',
							)}
						>
							<Icon className="w-3.5 h-3.5" />
							{cat.label}
							{count > 0 && (
								<span
									className={cn(
										'ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
										isActive
											? 'bg-white/20 text-white'
											: 'bg-primary/10 text-primary',
									)}
								>
									{count}
								</span>
							)}
						</button>
					);
				})}
			</div>

			{/* Active tab panel */}
			<div className="border border-border rounded-xl p-4 bg-muted/20">
				<div className="flex items-center gap-2 mb-4">
					{(() => {
						const cat = ROOM_AMENITY_CATEGORIES[activeTab];
						const Icon = cat.icon;
						return (
							<>
								<div
									className={cn(
										'w-7 h-7 rounded-lg flex items-center justify-center border',
										cat.color,
									)}
								>
									<Icon className="w-4 h-4" />
								</div>
								<p className="text-sm font-medium">{cat.label} Amenities</p>
							</>
						);
					})()}
				</div>
				<RoomAmenityTab
					key={activeTab}
					categoryKey={activeTab}
					roomAmenities={roomAmenities}
					setRoomAmenities={setRoomAmenities}
				/>
			</div>

			{/* Summary */}
			{totalSelected > 0 && (
				<div className="text-xs text-muted-foreground">
					{totalSelected} amenit{totalSelected === 1 ? 'y' : 'ies'} selected
					across{' '}
					{Object.values(roomAmenities).filter((a) => a.length > 0).length} area
					{Object.values(roomAmenities).filter((a) => a.length > 0).length !== 1
						? 's'
						: ''}
				</div>
			)}
		</div>
	);
};

// ─── Make new place helper ────────────────────────────────────────────────────
const makeNewPlace = () => ({ name: '', distance: '', time: '' });

// ─── Locality Autocomplete ────────────────────────────────────────────────────
const LocalityAutocomplete = ({ value, onChange }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	const matches = value.trim().length === 0
		? LOCALITY_SUGGESTIONS
		: LOCALITY_SUGGESTIONS.filter(s =>
				s.toLowerCase().includes(value.trim().toLowerCase())
			);

	useEffect(() => {
		const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	return (
		<div ref={ref} className="relative">
			<Input
				value={value}
				onChange={(e) => { onChange(e.target.value); setOpen(true); }}
				onFocus={() => setOpen(true)}
				placeholder="Type 'gaur', 'sector 62', 'noida ext'…"
				autoComplete="off"
			/>
			{open && matches.length > 0 && (
				<ul className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
					{matches.map((s) => (
						<li
							key={s}
							onMouseDown={(e) => { e.preventDefault(); onChange(s); setOpen(false); }}
							className="px-3 py-2 cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300"
						>
							{s}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PropertyFormPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditing = Boolean(id);

	const [formData, setFormData] = useState(defaultFormData);
	const [images, setImages] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(isEditing);
	const [owners, setOwners] = useState([]);
	const [selectedImageType, setImageType] = useState('Living Room');
	const [thumbnailImage, setThumbnail] = useState('');
	const [listingMode, setListingMode] = useState('full');
	const [rooms, setRooms] = useState([]);
	const [activeSection, setActiveSection] = useState('basic');

	// Room-wise amenities state
	const [roomAmenities, setRoomAmenities] = useState({
		house: [],
		living_room: [],
		kitchen: [],
		bedroom: [],
	});

	const [neighborhood, setNeighborhood] = useState({
		transit: { 'Bus Stations': [], 'Metro Stations': [], Airport: [] },
		essentials: { Hospitals: [], Schools: [], ATMs: [] },
		utility: { 'Shopping Malls': [], 'Movie Theaters': [] },
	});

	const [newPlaces, setNewPlaces] = useState({});

	const getNewPlace = (tab, cat) =>
		newPlaces[`${tab}__${cat}`] || makeNewPlace();

	const setNewPlace = (tab, cat, value) =>
		setNewPlaces((prev) => ({
			...prev,
			[`${tab}__${cat}`]: value,
		}));

	const clearNewPlace = (tab, cat) =>
		setNewPlaces((prev) => ({
			...prev,
			[`${tab}__${cat}`]: makeNewPlace(),
		}));

	useEffect(() => {
		if (listingMode === 'full') setRooms([]);
	}, [listingMode]);

	useEffect(() => {
		fetchOwners();
		if (isEditing) fetchProperty();
	}, [id]);

	// Scroll spy
	useEffect(() => {
		const handler = () => {
			for (const s of [...sections].reverse()) {
				const el = document.getElementById(s.id);
				if (el && el.getBoundingClientRect().top <= 120) {
					setActiveSection(s.id);
					break;
				}
			}
		};
		window.addEventListener('scroll', handler, { passive: true });
		return () => window.removeEventListener('scroll', handler);
	}, []);

	const extractSrc = (iframe) => {
		if (!iframe) return '';
		const m = iframe.match(/src="([^"]+)"/);
		return m ? m[1] : iframe;
	};

	const fetchOwners = async () => {
		try {
			const { data } = await api.get('/owners', {
				params: { status: 'active' },
			});
			setOwners(data);
		} catch {
			toast.error('Failed to load owners');
		}
	};

	const fetchProperty = async () => {
		try {
			const { data } = await api.get(`/properties/${id}`);
			setFormData({ ...defaultFormData, ...data });
			setImages(
				(data.images || []).map((img) =>
					typeof img === 'string' ? { url: img, label: 'Image' } : img,
				),
			);
			setRooms(data.rooms || []);
			setListingMode(data.listing_mode || 'full');
			setNeighborhood(data.neighborhood || neighborhood);
			if (data.thumbnail_image) setThumbnail(data.thumbnail_image);
			// Decode prefixed amenities back to room-wise object
			if (Array.isArray(data.amenities)) {
				setRoomAmenities(decodeAmenities(data.amenities));
			}
		} catch {
			toast.error('Failed to load property');
			navigate('/admin/properties');
		} finally {
			setLoading(false);
		}
	};

	const set = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

	const handleImageUpload = async (e) => {
		const files = Array.from(e.target.files);
		if (!files.length) return;
		setUploading(true);
		try {
			const fd = new FormData();
			files.forEach((f) => fd.append('files', f));

			const res = await api.post('/properties/upload/multiple', fd, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			if (Array.isArray(res.data)) {
				const newImgs = res.data.map((item) => ({
					url: item.url,
					label: selectedImageType,
				}));
				setImages((p) => [...p, ...newImgs]);
				toast.success(`${newImgs.length} image(s) uploaded`);
			}
		} catch {
			toast.error('Upload failed');
		} finally {
			setUploading(false);
			e.target.value = '';
		}
	};

	const addPlace = (tab, category) => {
		const np = getNewPlace(tab, category);
		if (!np.name || !np.distance || !np.time) return;
		setNeighborhood((p) => ({
			...p,
			[tab]: {
				...p[tab],
				[category]: [
					...p[tab][category],
					{
						name: np.name,
						distance: `${np.distance} KM`,
						time: `${np.time} Min`,
					},
				],
			},
		}));
		clearNewPlace(tab, category);
	};

	const removePlace = (tab, cat, i) =>
		setNeighborhood((p) => ({
			...p,
			[tab]: { ...p[tab], [cat]: p[tab][cat].filter((_, j) => j !== i) },
		}));

	const addRoom = () =>
		setRooms((p) => [
			...p,
			{
				room_type: 'normal',
				furnishing: 'semi-furnished',
				attached_bath: false,
				balcony: false,
				available_from: '',
				monthly_rent: '',
				room_image: '',
			},
		]);

	const updateRoom = (i, field, value) => {
		const r = [...rooms];
		r[i][field] = value;
		setRooms(r);
	};

	const removeRoom = (i) => setRooms((p) => p.filter((_, j) => j !== i));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const payload = {
				...formData,
				neighborhood,
				listing_mode: listingMode,
				images: images.map((img) => ({ url: img.url, label: img.label })),
				thumbnail_image: thumbnailImage,
				rooms: listingMode === 'room-wise' ? rooms : [],
				// Flatten room-wise amenities to prefixed List[str] — backend unchanged
				amenities: encodeAmenities(roomAmenities),
				features: [], // features removed — keep empty array for schema compatibility
			};
			const res = isEditing
				? await api.put(`/properties/${id}`, payload)
				: await api.post('/properties', payload);
			if (res.status >= 200 && res.status < 300) {
				toast.success(isEditing ? 'Property updated!' : 'Property created!');
				navigate('/admin/properties');
			}
		} catch {
			toast.error('Failed to save property');
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);

	const isRoomWise = listingMode === 'room-wise';

	const totalAmenities = Object.values(roomAmenities).reduce(
		(sum, arr) => sum + arr.length,
		0,
	);

	return (
		<div className="space-y-0">
			{/* ── Header ── */}
			<div className="flex items-center gap-3 mb-6">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/admin/properties">
						<ArrowLeft className="w-5 h-5" />
					</Link>
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold text-foreground">
						{isEditing ? 'Edit Property' : 'Add New Property'}
					</h1>
					<p className="text-sm text-muted-foreground">
						{isEditing
							? 'Update property details'
							: 'Fill in the details below'}
					</p>
				</div>
				<div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
					<span>{images.length} images</span>
					<span>·</span>
					<span>{totalAmenities} amenities</span>
				</div>
			</div>

			<div className="flex gap-6 items-start">
				{/* ── Sticky sidebar nav ── */}
				<div className="hidden lg:block w-44 flex-shrink-0 sticky top-6">
					<nav className="space-y-0.5">
						{sections.map((s) => {
							const Icon = s.icon;
							return (
								<a
									key={s.id}
									href={`#${s.id}`}
									onClick={(e) => {
										e.preventDefault();
										document
											.getElementById(s.id)
											?.scrollIntoView({ behavior: 'smooth', block: 'start' });
									}}
									className={cn(
										'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
										activeSection === s.id
											? 'bg-primary/10 text-primary font-medium'
											: 'text-muted-foreground hover:bg-muted hover:text-foreground',
									)}
								>
									<Icon className="w-3.5 h-3.5 flex-shrink-0" />
									{s.label}
								</a>
							);
						})}
					</nav>
					<div className="mt-4 pt-4 border-t border-border">
						<Button
							type="submit"
							form="property-form"
							disabled={saving}
							className="w-full gap-2 text-sm"
						>
							{saving ? (
								<Loader2 className="w-3.5 h-3.5 animate-spin" />
							) : (
								<Save className="w-3.5 h-3.5" />
							)}
							{saving ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
						</Button>
					</div>
				</div>

				{/* ── Form ── */}
				<form
					id="property-form"
					onSubmit={handleSubmit}
					className="flex-1 space-y-5 min-w-0"
				>
					{/* ── Basic Info ── */}
					<SectionCard id="basic" title="Basic Information" icon={Building2}>
						<div>
							<Label htmlFor="title">Property Title *</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => set('title', e.target.value)}
								placeholder="e.g., 3 BHK for Rent in ATS Greens"
								required
							/>
						</div>

						<div className="grid sm:grid-cols-3 gap-4">
							<div>
								<Label>Property Type *</Label>
								<Select
									value={formData.property_type}
									onValueChange={(v) => set('property_type', v)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="rent">Rent</SelectItem>
										<SelectItem value="buy">Buy</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Listing Mode</Label>
								<Select
									value={listingMode}
									onValueChange={setListingMode}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="full">Entire Property</SelectItem>
										<SelectItem value="room-wise">Room-wise</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Assign to Owner</Label>
								<Select
									value={formData.owner_id}
									onValueChange={(v) => set('owner_id', v)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select owner" />
									</SelectTrigger>
									<SelectContent>
										{owners.map((o) => (
											<SelectItem key={o.id} value={o.id}>
												{o.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<Label>Status</Label>
								<Select
									value={formData.status}
									onValueChange={(v) => set('status', v)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
										<SelectItem value="rented">Rented</SelectItem>
										<SelectItem value="sold">Sold</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{formData.property_type !== 'buy' && (
								<div>
									<Label>Monthly Rent (for earnings)</Label>
									<Input
										type="number"
										value={formData.monthly_rent_amount}
										onChange={(e) =>
											set(
												'monthly_rent_amount',
												parseFloat(e.target.value) || 0,
											)
										}
										placeholder="e.g., 35000"
									/>
								</div>
							)}
						</div>

						{/* Society / Building Name */}
						<div>
							<Label>Society / Building Name <span className="text-red-500">*</span></Label>
							<Input
								value={formData.sector}
								onChange={(e) => set('sector', e.target.value)}
								placeholder="e.g., Amrapali O2 Valley, Golden I, NX One"
							/>
							<p className="text-xs text-slate-400 mt-1">The name of the apartment complex or building where the flat is.</p>
						</div>

						{/* Sector / Street address */}
						<div>
							<Label>Sector / Street Address <span className="text-red-500">*</span></Label>
							<Input
								value={formData.location}
								onChange={(e) => set('location', e.target.value)}
								placeholder="e.g., Techzone-4, Plot No. 17"
							/>
							<p className="text-xs text-slate-400 mt-1">The sector or plot number where the society is located.</p>
						</div>

						{/* City */}
						<div>
							<Label>City <span className="text-red-500">*</span></Label>
							<Input
								value={formData.city}
								onChange={(e) => set('city', e.target.value)}
								placeholder="e.g., Greater Noida, Noida"
							/>
							<p className="text-xs text-slate-400 mt-1">Which city is this property in?</p>
						</div>

						{/* Locality — for website pages */}
						<div>
							<Label>Area Name <span className="text-red-500">*</span></Label>
							<LocalityAutocomplete
								value={formData.locality || ''}
								onChange={(val) => set('locality', val)}
							/>
							<p className="text-xs text-slate-400 mt-1">
								Choose the area from the list — your property will appear on that area's page on the website.
								Example: choose "Greater Noida West" → property shows on instamakaan.com/rent/flats-for-rent-in-greater-noida-west
							</p>
						</div>

						<div>
							<Label>Description *</Label>
							<Textarea
								value={formData.description}
								onChange={(e) => set('description', e.target.value)}
								placeholder="Describe the property..."
								rows={4}
								required
							/>
						</div>

						<label className="flex items-center gap-2 cursor-pointer">
							<Checkbox
								checked={formData.is_managed}
								onCheckedChange={(v) => set('is_managed', v)}
							/>
							<span className="text-sm">
								This is an InstaMakaan Managed Home
							</span>
						</label>

						<div>
							<Label>Managed By (Person Name)</Label>
							<Input
								value={formData.managed_by}
								onChange={(e) => set('managed_by', e.target.value)}
								placeholder="e.g., Rahul Sharma"
							/>
							<p className="text-xs text-slate-400 mt-1">Displayed on property card as "Managed by [name]"</p>
						</div>
					</SectionCard>

					{/* ── Pricing ── */}
					<SectionCard id="pricing" title="Pricing" icon={DollarSign}>
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<Label>Price *</Label>
								<Input
									value={formData.price}
									onChange={(e) => set('price', e.target.value)}
									placeholder="e.g., 35000 or 1.25 Cr"
									required
								/>
							</div>
							<div>
								<Label>Price Label</Label>
								<Select
									value={formData.price_label}
									onValueChange={(v) => set('price_label', v)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Per Bed Rent">Per Bed Rent</SelectItem>
										<SelectItem value="Full Flat Rent">
											Full Flat Rent
										</SelectItem>
										<SelectItem value="Price">Price</SelectItem>
										<SelectItem value="Total Price">Total Price</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid sm:grid-cols-2 gap-4">
							<div>
								<Label>Security Deposit</Label>
								<Input
									value={formData.deposit}
									onChange={(e) => set('deposit', e.target.value)}
									placeholder="e.g., 2 Months"
								/>
							</div>
							<div>
								<Label>Brokerage</Label>
								<Input
									value={formData.brokerage}
									onChange={(e) => set('brokerage', e.target.value)}
									placeholder="e.g., 15 Days"
								/>
							</div>
						</div>
					</SectionCard>

					{/* ── Property Details ── */}
					<SectionCard id="details" title="Property Details" icon={BedDouble}>
						{!isRoomWise && (
							<div className="grid grid-cols-3 gap-4">
								<div>
									<Label>Bedrooms</Label>
									<Input
										type="number"
										min="0"
										value={formData.beds}
										onChange={(e) => set('beds', parseInt(e.target.value) || 0)}
									/>
								</div>
								<div>
									<Label>Bathrooms</Label>
									<Input
										type="number"
										min="0"
										value={formData.baths}
										onChange={(e) =>
											set('baths', parseInt(e.target.value) || 0)
										}
									/>
								</div>
								<div>
									<Label>Area</Label>
									<Input
										value={formData.area}
										onChange={(e) => set('area', e.target.value)}
										placeholder="e.g., 1500 sq.ft."
									/>
								</div>
							</div>
						)}

						<div className="grid sm:grid-cols-3 gap-4">
							{!isRoomWise && (
								<div>
									<Label>Furnishing</Label>
									<Select
										value={formData.furnishing}
										onValueChange={(v) => set('furnishing', v)}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="fully-furnished">
												Fully Furnished
											</SelectItem>
											<SelectItem value="semi-furnished">
												Semi Furnished
											</SelectItem>
											<SelectItem value="unfurnished">Unfurnished</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
							{formData.property_type !== 'buy' && (
								<>
									<div>
										<Label>Preferred Tenant</Label>
										<Select
											value={formData.preferred_tenant}
											onValueChange={(v) => set('preferred_tenant', v)}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="any">Any</SelectItem>
												<SelectItem value="family">Family</SelectItem>
												<SelectItem value="bachelor">Bachelor</SelectItem>
												<SelectItem value="company">Company</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Gender Preference</Label>
										<Select
											value={formData.gender_preference}
											onValueChange={(v) => set('gender_preference', v)}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="any">Any</SelectItem>
												<SelectItem value="male">Male Only</SelectItem>
												<SelectItem value="female">Female Only</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</>
							)}
						</div>

						{/* Rooms section */}
						{isRoomWise && (
							<div className="space-y-4 pt-2">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium">Rooms ({rooms.length})</p>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addRoom}
										className="gap-1 h-7 text-xs"
									>
										<Plus className="w-3 h-3" /> Add Room
									</Button>
								</div>
								{rooms.map((room, i) => (
									<div
										key={i}
										className="border border-border rounded-xl p-4 space-y-3"
									>
										<div className="flex items-center justify-between">
											<p className="text-sm font-semibold">Room {i + 1}</p>
											<button
												type="button"
												onClick={() => removeRoom(i)}
												className="text-xs text-destructive hover:underline"
											>
												Remove
											</button>
										</div>
										<div className="grid sm:grid-cols-2 gap-3">
											<div>
												<Label>Room Type</Label>
												<Select
													value={room.room_type}
													onValueChange={(v) => updateRoom(i, 'room_type', v)}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="normal">Normal Room</SelectItem>
														<SelectItem value="master">
															Master Bedroom
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label>Furnishing</Label>
												<Select
													value={room.furnishing}
													onValueChange={(v) => updateRoom(i, 'furnishing', v)}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="furnished">Furnished</SelectItem>
														<SelectItem value="semi-furnished">
															Semi Furnished
														</SelectItem>
														<SelectItem value="unfurnished">
															Unfurnished
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<div className="grid sm:grid-cols-2 gap-3">
											<div>
												<Label>Available From</Label>
												<Input
													type="date"
													value={room.available_from}
													onChange={(e) =>
														updateRoom(i, 'available_from', e.target.value)
													}
												/>
											</div>
											<div>
												<Label>Monthly Rent</Label>
												<Input
													type="number"
													value={room.monthly_rent}
													onChange={(e) =>
														updateRoom(i, 'monthly_rent', e.target.value)
													}
													placeholder="Enter rent"
												/>
											</div>
										</div>
										<div className="flex items-center gap-6">
											<label className="flex items-center gap-2 cursor-pointer text-sm">
												<Checkbox
													checked={room.attached_bath || false}
													onCheckedChange={(v) =>
														updateRoom(i, 'attached_bath', v)
													}
												/>
												Attached Bathroom
											</label>
											<label className="flex items-center gap-2 cursor-pointer text-sm">
												<Checkbox
													checked={room.balcony || false}
													onCheckedChange={(v) => updateRoom(i, 'balcony', v)}
												/>
												Balcony
											</label>
										</div>
									</div>
								))}
								{rooms.length === 0 && (
									<div className="text-center py-8 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
										No rooms added yet. Click "Add Room" to start.
									</div>
								)}
							</div>
						)}
					</SectionCard>

					{/* ── Images ── */}
					<SectionCard id="images" title="Images" icon={ImageIcon}>
						<div className="flex items-center gap-3">
							<div className="flex-1">
								<Label>Image Type</Label>
								<Select value={selectedImageType} onValueChange={setImageType}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{[
											'Living Room',
											'Kitchen',
											'Master Bedroom',
											'Bedroom',
											'Bathroom',
											'Balcony',
											'Exterior',
											'Other',
										].map((t) => (
											<SelectItem key={t} value={t}>
												{t}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="pt-5">
								<label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors text-sm text-muted-foreground">
									<input
										type="file"
										accept="image/*"
										multiple
										onChange={handleImageUpload}
										className="hidden"
										disabled={uploading}
									/>
									{uploading ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Upload className="w-4 h-4" />
									)}
									{uploading ? 'Uploading...' : 'Upload Images'}
								</label>
							</div>
						</div>

						{images.length > 0 ? (
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								{images.map((img, i) => {
									if (!img?.url) return null;
									const src = img.url.startsWith('http')
										? img.url
										: `${BACKEND_URL}${img.url}`;
									return (
										<div
											key={i}
											className="group relative aspect-square rounded-xl overflow-hidden bg-muted border border-border"
										>
											<img
												src={src}
												alt=""
												className="w-full h-full object-cover"
											/>
											<div className="absolute top-2 left-2 flex gap-1">
												<div className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
													{img.label}
												</div>
												{i === 0 && (
													<div className="bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
														<Star className="w-3 h-3 fill-current" /> Thumbnail
													</div>
												)}
											</div>
											<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
												{i !== 0 && (
													<button
														type="button"
														onClick={() => {
															setImages((p) => {
																const newP = [...p];
																const [selectedImg] = newP.splice(i, 1);
																newP.unshift(selectedImg);
																return newP;
															});
														}}
														className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center hover:bg-primary hover:text-white"
														title="Set as Thumbnail"
													>
														<Star className="w-3.5 h-3.5" />
													</button>
												)}
												<button
													type="button"
													onClick={() =>
														setImages((p) => p.filter((_, j) => j !== i))
													}
													className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-500 hover:text-white"
												>
													<X className="w-3.5 h-3.5" />
												</button>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="text-center py-10 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
								No images uploaded. First image will be the main listing image.
							</div>
						)}
						<p className="text-xs text-muted-foreground">
							Upload high-quality images. First image will be the main listing
							photo.
						</p>
					</SectionCard>

					{/* ── Amenities (room-wise, Nestaway style) ── */}
					<SectionCard id="amenities" title="Amenities" icon={Wifi}>
						<RoomAmenitiesSection
							roomAmenities={roomAmenities}
							setRoomAmenities={setRoomAmenities}
						/>
					</SectionCard>

					{/* ── Optional sections toggle ── */}
					<div className="space-y-4">

					{/* ── Map ── */}
					<SectionCard id="map" title="Map Embed" icon={Map}>
						<div>
							<Label>Google Map iframe / URL</Label>
							<Input
								value={formData.map_embed || ''}
								onChange={(e) => set('map_embed', extractSrc(e.target.value))}
								placeholder="Paste Google Maps iframe code here"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Paste the full iframe embed code from Google Maps
							</p>
						</div>
						{formData.map_embed && (
							<div className="rounded-xl overflow-hidden border border-border">
								<iframe
									src={formData.map_embed}
									width="100%"
									height="240"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
								/>
							</div>
						)}
					</SectionCard>

					{/* ── Neighborhood ── */}
					<SectionCard
						id="neighborhood"
						title="Neighborhood Details"
						icon={MapPin}
					>
						{Object.entries(neighborhood).map(([tab, categories]) => (
							<div key={tab} className="space-y-5">
								<h3 className="text-sm font-semibold capitalize border-b border-border pb-2">
									{tab}
								</h3>
								{Object.entries(categories).map(([cat, places]) => {
									const np = getNewPlace(tab, cat);
									return (
										<div key={cat} className="space-y-3">
											<p className="text-sm font-medium text-foreground">
												{cat}
											</p>
											<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
												<Input
													placeholder="Place name"
													value={np.name}
													onChange={(e) =>
														setNewPlace(tab, cat, {
															...np,
															name: e.target.value,
														})
													}
												/>
												<div className="flex items-center gap-1">
													<Input
														type="number"
														placeholder="Distance"
														value={np.distance}
														onChange={(e) =>
															setNewPlace(tab, cat, {
																...np,
																distance: e.target.value,
															})
														}
													/>
													<span className="text-xs text-muted-foreground flex-shrink-0">
														KM
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Input
														type="number"
														placeholder="Time"
														value={np.time}
														onChange={(e) =>
															setNewPlace(tab, cat, {
																...np,
																time: e.target.value,
															})
														}
													/>
													<span className="text-xs text-muted-foreground flex-shrink-0">
														Min
													</span>
												</div>
												<Button
													type="button"
													onClick={() => addPlace(tab, cat)}
													size="sm"
													variant="outline"
													className="h-9"
												>
													Add
												</Button>
											</div>
											{places.length > 0 && (
												<div className="space-y-1.5">
													{places.map((place, i) => (
														<div
															key={i}
															className="flex items-center justify-between bg-muted/40 px-3 py-2 rounded-lg text-sm"
														>
															<span>
																{place.name} —{' '}
																<span className="text-muted-foreground">
																	{place.distance} · {place.time}
																</span>
															</span>
															<button
																type="button"
																onClick={() => removePlace(tab, cat, i)}
																className="text-destructive hover:text-destructive/80 ml-2"
															>
																<X className="w-3.5 h-3.5" />
															</button>
														</div>
													))}
												</div>
											)}
										</div>
									);
								})}
							</div>
						))}
					</SectionCard>

					</div>


					{/* ── Submit (mobile) ── */}
					<div className="flex items-center gap-3 lg:hidden sticky bottom-0 bg-background/95 backdrop-blur border-t border-border py-4 -mx-4 px-4">
						<Button type="submit" disabled={saving} className="flex-1 gap-2">
							{saving ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							{saving
								? 'Saving...'
								: isEditing
									? 'Update Property'
									: 'Publish Property'}
						</Button>
						<Button type="button" variant="outline" asChild>
							<Link to="/admin/properties">Cancel</Link>
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PropertyFormPage;
