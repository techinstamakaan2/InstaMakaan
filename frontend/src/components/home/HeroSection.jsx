import React, { useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import {
	Search,
	MapPin,
	ChevronDown,
	X,
	Home,
	Building2,
	Key,
} from 'lucide-react';
import { useMode } from '@/context/ModeContext';

const modeConfig = {
	rent: {
		headline: 'Find Your Rental',
		highlight: 'Space',
		subheadline: 'Calm, friendly living spaces for your comfort.',
		searchPlaceholder: 'Search locality / society / landmark',
		filterTwoLabel: 'BHK',
		filterTwoOptions: ['1', '2', '3', '4', '5+'],
		searchBtnText: 'Search',
		accentColor: 'text-teal-600 dark:text-teal-400',
		highlightColor: 'text-amber-500 dark:text-amber-400',
		overlay:
			'bg-gradient-to-b from-white/70 via-white/60 to-white/80 dark:from-[#0b1220]/90 dark:via-[#0b1220]/85 dark:to-[#0b1220]/95',
		inputFocus: 'focus:ring-teal-400 focus:border-teal-400',
		inputHover: 'hover:border-teal-400',
		autocompleteActive: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600',
		autocompleteBtnBg:
			'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40',
		autocompleteBtnText: 'text-teal-700 dark:text-teal-400',
		searchBtnClass: 'bg-teal-700 hover:bg-teal-800 shadow-teal-500/30',
		spinnerBorder: 'border-teal-400',
		accentText: 'text-teal-500',
	},
	buy: {
		headline: 'Find Your Dream',
		highlight: 'Space',
		subheadline: 'Explore verified properties and own your perfect home.',
		searchPlaceholder: 'Search locality / project / city',
		filterOneLabel: 'Property Type',
		filterOneOptions: [
			'Apartment',
			'Villa',
			'Plot',
			'Builder Floor',
			'Commercial',
		],
		filterTwoLabel: 'Budget',
		filterTwoOptions: ['Under 30L', '30L–60L', '60L–1Cr', '1Cr–2Cr', '2Cr+'],
		searchBtnText: 'Search',
		accentColor: 'text-teal-600 dark:text-teal-400',
		highlightColor: 'text-amber-500 dark:text-amber-400',
		overlay:
			'bg-gradient-to-b from-white/70 via-white/60 to-white/80 dark:from-[#0b1220]/90 dark:via-[#0b1220]/85 dark:to-[#0b1220]/95',
		inputFocus: 'focus:ring-teal-400 focus:border-teal-400',
		inputHover: 'hover:border-teal-400',
		autocompleteActive: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600',
		autocompleteBtnBg:
			'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40',
		autocompleteBtnText: 'text-teal-700 dark:text-teal-400',
		searchBtnClass: 'bg-teal-700 hover:bg-teal-800 shadow-teal-500/30',
		spinnerBorder: 'border-teal-400',
		accentText: 'text-teal-500',
	},
};

const Dropdown = ({ icon: Icon, label, value, setValue, options, cfg }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);
	return (
		<div ref={ref} className="relative w-full sm:w-auto">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className={`w-full h-11 sm:h-12 px-4 flex items-center gap-2 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md text-sm text-slate-900 dark:text-slate-100 focus:ring-2 ${cfg.inputFocus} transition-all ${cfg.inputHover}`}
			>
				<div className="flex items-center gap-2 flex-1">
					{Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
					<span
						className={`truncate ${value ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-400'}`}
					>
						{value || label}
					</span>
				</div>
				{value ? (
					<X
						className="w-3.5 h-3.5 shrink-0 text-slate-400 hover:text-slate-600"
						onClick={(e) => {
							e.stopPropagation();
							setValue('');
						}}
					/>
				) : (
					<ChevronDown
						className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
					/>
				)}
			</button>
			{open && (
				<div className="absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1 min-w-[160px]">
					<div className="max-h-[180px] overflow-y-auto">
						{options.map((o) => (
							<div
								key={o}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => {
									setValue(o);
									setOpen(false);
								}}
								className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === o ? `${cfg.autocompleteActive} font-medium` : 'hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'}`}
							>
								{o}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const SuggestionIcon = ({ type }) => {
	if (type === 'property')
		return <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />;
	if (type === 'location')
		return <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
	return <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
};

export const HeroSection = forwardRef((props, ref) => {
	const [isMobile, setIsMobile] = useState(false);
	const navigate = useNavigate();
	const { mode } = useMode();
	const cfg = modeConfig[mode];
	const isBuy = mode === 'buy';

	const [city, setCity] = useState('');
	const [searchText, setSearchText] = useState('');
	const [showAuto, setShowAuto] = useState(false);
	const [filterOne, setFilterOne] = useState('');
	const [filterTwo, setFilterTwo] = useState('');
	const [allProperties, setAllProperties] = useState([]);
	const [loadingSuggestions, setLoadingSuggestions] = useState(false);
	const [activeIdx, setActiveIdx] = useState(-1);
	const inputRef = useRef(null);

	useEffect(() => {
		setFilterOne('');
		setFilterTwo('');
		setSearchText('');
	}, [mode]);
	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 640);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);
	useEffect(() => {
		let mounted = true;
		const load = async () => {
			try {
				setLoadingSuggestions(true);
				const res = await api.get('/properties/?limit=50');
				if (!mounted) return;
				const data = Array.isArray(res.data)
					? res.data
					: res.data?.results || res.data?.data || [];
				setAllProperties(data);
			} catch (err) {
				console.error(err);
			} finally {
				if (mounted) setLoadingSuggestions(false);
			}
		};
		load();
		return () => {
			mounted = false;
		};
	}, []);

	const suggestionsList = useMemo(() => {
		const seen = new Set();
		const list = [];
		for (const p of allProperties) {
			const title = String(p?.title ?? '').trim();
			const location = String(p?.location ?? '').trim();
			const sector = String(p?.sector ?? '').trim();
			if (title && !seen.has(title)) {
				seen.add(title);
				list.push({ text: title, type: 'property' });
			}
			if (location && !seen.has(location)) {
				seen.add(location);
				list.push({ text: location, type: 'location' });
			}
			if (sector && !seen.has(sector)) {
				seen.add(sector);
				list.push({ text: sector, type: 'sector' });
			}
		}
		return list;
	}, [allProperties]);

	const filteredSuggestions = useMemo(() => {
		const q = searchText.trim().toLowerCase();
		if (!q) return [];
		return suggestionsList
			.filter((s) => s.text.toLowerCase().includes(q))
			.slice(0, 7);
	}, [searchText, suggestionsList]);

	const handleSuggestionClick = (s) => {
		setSearchText(s.text);
		setShowAuto(false);
		setActiveIdx(-1);
		navigate(
			`/all-properties?${isBuy ? 'mode=buy&' : ''}search=${encodeURIComponent(s.text)}`,
		);
	};

	const handleSearch = () => {
		setShowAuto(false);
		const params = new URLSearchParams();
		if (isBuy) params.append('mode', 'buy');
		if (city) params.append('city', city);
		if (searchText) params.append('search', searchText);
		if (filterTwo) params.append(isBuy ? 'budget' : 'bhk', filterTwo);
		if (filterOne && isBuy) params.append('type', filterOne);
		navigate(`/all-properties?${params.toString()}`);
	};

	const handleKeyDown = (e) => {
		if (!showAuto || !filteredSuggestions.length) {
			if (e.key === 'Enter') handleSearch();
			return;
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveIdx((i) => Math.min(i + 1, filteredSuggestions.length - 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveIdx((i) => Math.max(i - 1, -1));
		} else if (e.key === 'Enter') {
			e.preventDefault();
			activeIdx >= 0
				? handleSuggestionClick(filteredSuggestions[activeIdx])
				: handleSearch();
		} else if (e.key === 'Escape') {
			setShowAuto(false);
			setActiveIdx(-1);
		}
	};

	const bgImages = {
		desktop: '/images/hero-pre.webp',
		mobile: '/images/hero-pre-mobile.webp',
	};

	return (
		<section className="relative min-h-[85vh] sm:min-h-screen overflow-hidden -mt-8 sm:-mt-6 w-full">
			<img
				src={isMobile ? bgImages.mobile : bgImages.desktop}
				alt="Hero background"
				className="absolute inset-0 w-full h-full object-cover hero-bg"
				loading="eager"
				fetchpriority="high"
				decoding="sync"
			/>
			<div
				className={`absolute inset-0 transition-all duration-700 ${cfg.overlay}`}
			/>

			<div className="relative z-10 text-center w-full max-w-6xl mx-auto px-4 pt-36 sm:pt-40">
				{/* RENT / BUY TOGGLE */}
				<div className="flex justify-center mb-6">
					<div className="inline-flex items-center bg-white/70 dark:bg-[#0b1220]/70 backdrop-blur-md border border-slate-200/60 dark:border-white/10 rounded-2xl p-1 shadow-lg gap-1">
						<button
							onClick={() => navigate('/')}
							className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${mode === 'rent' ? 'bg-teal-700 text-white shadow-md scale-[1.03]' : 'text-slate-500 dark:text-slate-400 hover:text-teal-600'}`}
						>
							<Key className="w-4 h-4" /> Rent
						</button>
						<button
							onClick={() => navigate('/buy')}
							className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${mode === 'buy' ? 'bg-teal-700 text-white shadow-md scale-[1.03]' : 'text-slate-500 dark:text-slate-400 hover:text-teal-600'}`}
						>
							<Building2 className="w-4 h-4" /> Buy
						</button>
					</div>
				</div>

				{/* HEADLINE — always single line */}
				<h1
					className={`text-2xl sm:text-6xl md:text-7xl font-bold leading-tight transition-colors duration-500 ${cfg.accentColor}`}
				>
					{cfg.headline}{' '}
					<span
						className={`font-bold transition-colors duration-500 ${cfg.highlightColor}`}
					>
						{cfg.highlight}
					</span>
				</h1>

				{/* SUBHEADLINE — one sentence, no wrapping forced */}
				<p className="mt-2 sm:mt-6 text-[13px] sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 mx-auto transition-all duration-500 max-w-[90vw] text-center">
					{cfg.subheadline}
				</p>
			</div>

			{/* SEARCH BAR */}
			<div
				ref={ref}
				className="relative z-10 mt-4 sm:mt-10 w-full max-w-6xl mx-auto px-3 sm:px-4"
			>
				<div className="backdrop-blur-xl bg-white/60 dark:bg-[#0b1220]/60 border border-white/30 dark:border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-2.5 sm:p-4 md:p-5 flex flex-col md:flex-row gap-2 md:gap-3 transition-all duration-300">

					{/* Row 1 on mobile: City + BHK side by side */}
					<div className="flex gap-2 md:contents">
						<div className="flex-1 md:flex-none">
							<Dropdown
								icon={MapPin}
								label="City"
								value={city}
								setValue={setCity}
								options={['Noida', 'Greater Noida', 'Noida Extension', 'Ghaziabad']}
								cfg={cfg}
							/>
						</div>
						{!isBuy && (
							<div className="flex-1 md:hidden">
								<Dropdown
									label={cfg.filterTwoLabel}
									value={filterTwo}
									setValue={setFilterTwo}
									options={cfg.filterTwoOptions}
									cfg={cfg}
								/>
							</div>
						)}
					</div>

					{/* Search Input */}
					<div className="relative flex-1">
						<div className="relative">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
							<input
								ref={inputRef}
								value={searchText}
								onChange={(e) => {
									setSearchText(e.target.value);
									setShowAuto(true);
									setActiveIdx(-1);
								}}
								onFocus={() => {
									if (searchText) setShowAuto(true);
								}}
								onBlur={() => setTimeout(() => setShowAuto(false), 200)}
								onKeyDown={handleKeyDown}
								placeholder={cfg.searchPlaceholder}
								className={`w-full h-11 sm:h-12 pl-10 pr-9 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md ${cfg.inputHover} focus:ring-2 ${cfg.inputFocus} transition text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none`}
							/>
							{searchText && (
								<button
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										setSearchText('');
										setShowAuto(false);
										inputRef.current?.focus();
									}}
									className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 transition-colors"
								>
									<X className="w-3 h-3 text-slate-600 dark:text-slate-200" />
								</button>
							)}
						</div>
						{showAuto && searchText && (
							<div
								className="absolute left-0 right-0 mt-2 z-[999] bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
								style={{ maxHeight: '285px', overflowY: 'auto' }}
							>
								{loadingSuggestions ? (
									<div className="flex items-center gap-3 px-4 py-4 text-sm text-slate-400">
										<div
											className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${cfg.spinnerBorder}`}
										/>{' '}
										Searching...
									</div>
								) : filteredSuggestions.length > 0 ? (
									<>
										<div className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-white/5">
											Suggestions
										</div>
										{filteredSuggestions.map((s, i) => (
											<div
												key={s.text + i}
												onMouseDown={(e) => e.preventDefault()}
												onClick={() => handleSuggestionClick(s)}
												className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-slate-50 dark:border-white/5 last:border-0 ${activeIdx === i ? cfg.autocompleteActive : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
											>
												<SuggestionIcon type={s.type} />
												<div className="flex-1 min-w-0">
													<span className="text-sm text-slate-800 dark:text-slate-100 truncate block">
														{s.text}
													</span>
													<span className="text-[10px] text-slate-400 capitalize">
														{s.type === 'property'
															? 'Property'
															: s.type === 'location'
																? 'Location'
																: 'Sector'}
													</span>
												</div>
												{activeIdx === i && (
													<span
														className={`text-[10px] font-medium shrink-0 ${cfg.accentText}`}
													>
														Enter ↵
													</span>
												)}
											</div>
										))}
										<div
											onMouseDown={(e) => e.preventDefault()}
											onClick={handleSearch}
											className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${cfg.autocompleteBtnBg}`}
										>
											<Search className={`w-3.5 h-3.5 ${cfg.accentText}`} />
											<span
												className={`text-sm font-medium ${cfg.autocompleteBtnText}`}
											>
												Search for &ldquo;
												<span className="font-semibold">{searchText}</span>
												&rdquo;
											</span>
										</div>
									</>
								) : (
									<div className="flex flex-col items-center py-8 text-slate-400">
										<Search className="w-8 h-8 mb-2 opacity-20" />
										<p className="text-sm font-medium">No matches found</p>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Desktop filters — BHK + Property Type */}
					{!isBuy && (
						<div className="hidden md:flex gap-3">
							{cfg.filterOneOptions && (
								<Dropdown
									label={cfg.filterOneLabel}
									value={filterOne}
									setValue={setFilterOne}
									options={cfg.filterOneOptions}
									cfg={cfg}
								/>
							)}
							<Dropdown
								label={cfg.filterTwoLabel}
								value={filterTwo}
								setValue={setFilterTwo}
								options={cfg.filterTwoOptions}
								cfg={cfg}
							/>
						</div>
					)}

					<button
						onClick={handleSearch}
						className={`w-full md:w-auto h-11 sm:h-12 px-7 sm:px-9 rounded-2xl text-white flex items-center justify-center gap-2 text-sm sm:text-base font-semibold shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 active:scale-[0.98] ${cfg.searchBtnClass}`}
					>
						<Search className="w-4 h-4" /> {cfg.searchBtnText}
					</button>
				</div>
			</div>

			<style>{`
				.hero-bg { animation: heroZoom 25s ease-in-out infinite alternate; }
				@keyframes heroZoom { 0% { transform: scale(1.05); } 100% { transform: scale(1.15); } }
			`}</style>
		</section>
	);
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
