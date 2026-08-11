import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Ruler, MapPin, UserCheck, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { propertyToSlug } from '@/utils/slugUtils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const PropertyCard = ({ property, isGrid, savedIds = [] }) => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hovered, setHovered] = useState(false);
	const propId = property.id || property._id;
	const [isSaved, setIsSaved] = useState(() => savedIds.includes(propId));
	const [savingInProgress, setSavingInProgress] = useState(false);
	const timerRef = useRef(null);

	useEffect(() => {
		setIsSaved(savedIds.includes(propId));
	}, [savedIds, propId]);

	const handleSave = useCallback(async (e) => {
		e.stopPropagation();
		e.preventDefault();
		if (!isAuthenticated) {
			toast.info('Login to save properties');
			return;
		}
		if (savingInProgress) return;
		setSavingInProgress(true);
		const next = !isSaved;
		setIsSaved(next);
		try {
			await api.post(`/users/me/saved/${propId}`);
			toast.success(next ? 'Property saved!' : 'Removed from saved');
		} catch {
			setIsSaved(!next);
			toast.error('Could not save. Try again.');
		} finally {
			setSavingInProgress(false);
		}
	}, [isAuthenticated, savingInProgress, isSaved, propId]);

	const handleClick = () => {
		if (isGrid && window.innerWidth < 768) {
			navigate(`/property/${propertyToSlug(property)}`);
		}
	};

	const BASE_URL = api?.defaults?.baseURL
		? api.defaults.baseURL.replace('/api', '')
		: '';

	const images = useMemo(() => {
		const resolveUrl = (url) => {
			if (!url) return null;
			if (url.startsWith('http') || url.startsWith('//')) return url;
			return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
		};

		const seen = new Set();
		const arr = [];

		const addUrl = (url) => {
			const resolved = resolveUrl(url);
			if (resolved && !seen.has(resolved)) {
				seen.add(resolved);
				arr.push(resolved);
			}
		};

		if (property.thumbnail) addUrl(property.thumbnail);

		if (Array.isArray(property.images)) {
			property.images.forEach((img) => {
				const url = typeof img === 'object' ? img.url : img;
				addUrl(url);
			});
		}

		return arr;
	}, [property.thumbnail, property.images, BASE_URL]);

	/* ── Auto-slide: 4 s, pauses on hover ── */
	const startTimer = useCallback(() => {
		if (images.length <= 1) return;
		clearInterval(timerRef.current);
		timerRef.current = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % images.length);
		}, 4000);
	}, [images.length]);

	useEffect(() => {
		if (!hovered) startTimer();
		else clearInterval(timerRef.current);
		return () => clearInterval(timerRef.current);
	}, [hovered, startTimer]);

	useEffect(() => {
		setCurrentIndex(0);
	}, [property.id, property._id]);

	const goTo = (e, idx) => {
		e.stopPropagation();
		e.preventDefault();
		setCurrentIndex(idx);
		startTimer(); // restart timer on manual navigation
	};

	return (
		<div
			onClick={handleClick}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className={`
				group relative
				bg-white dark:bg-neutral-900
				rounded-2xl overflow-hidden
				border border-gray-200 dark:border-white/10
				shadow-sm
				transition-all duration-300 ease-out
				hover:-translate-y-1 hover:shadow-xl
				h-full
				${isGrid ? 'flex flex-col cursor-pointer' : 'flex flex-row'}
			`}
		>
			{/* IMAGE */}
			<div
				className={
					isGrid
						? 'relative h-40 md:h-48 overflow-hidden bg-gray-100 dark:bg-neutral-800'
						: 'relative w-32 sm:w-48 md:w-64 shrink-0 h-full min-h-[128px] overflow-hidden bg-gray-100 dark:bg-neutral-800'
				}
			>
				{images.length > 0 ? (
					<>
						{images.map((src, i) => (
							<img
								key={src}
								src={src}
								alt={property.title}
								loading={i === 0 ? 'eager' : 'lazy'}
								onError={(e) => { e.currentTarget.style.display = 'none'; }}
								style={{
									position: 'absolute',
									inset: 0,
									width: '100%',
									height: '100%',
									objectFit: 'cover',
									opacity: i === currentIndex ? 1 : 0,
									transition: 'opacity 0.7s ease-in-out',
									willChange: 'opacity',
								}}
							/>
						))}

						{/* Prev / Next arrows — visible on hover when multiple images */}
						{images.length > 1 && hovered && (
							<>
								<button
									onClick={(e) => goTo(e, (currentIndex - 1 + images.length) % images.length)}
									style={{
										position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
										zIndex: 12, width: 28, height: 28, borderRadius: 8, border: 'none',
										background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
										display: 'flex', alignItems: 'center', justifyContent: 'center',
										cursor: 'pointer', color: '#fff',
									}}
								>
									<ChevronLeft size={16} />
								</button>
								<button
									onClick={(e) => goTo(e, (currentIndex + 1) % images.length)}
									style={{
										position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
										zIndex: 12, width: 28, height: 28, borderRadius: 8, border: 'none',
										background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
										display: 'flex', alignItems: 'center', justifyContent: 'center',
										cursor: 'pointer', color: '#fff',
									}}
								>
									<ChevronRight size={16} />
								</button>
							</>
						)}

						{/* Dot indicators */}
						{images.length > 1 && (
							<div
								style={{
									position: 'absolute', bottom: 8, left: '50%',
									transform: 'translateX(-50%)',
									display: 'flex', gap: 4, zIndex: 10,
								}}
							>
								{images.map((_, i) => (
									<button
										key={i}
										onClick={(e) => goTo(e, i)}
										style={{
											display: 'block', height: 5,
											width: i === currentIndex ? 18 : 5,
											borderRadius: 999, border: 'none',
											padding: 0, cursor: 'pointer',
											background: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.4)',
											transition: 'all 0.3s ease',
										}}
									/>
								))}
							</div>
						)}

						{/* Image counter badge */}
						{images.length > 1 && (
							<div style={{
								position: 'absolute', top: 8, left: 8,
								background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
								color: '#fff', fontSize: '0.62rem', fontWeight: 700,
								padding: '2px 8px', borderRadius: 6, zIndex: 10,
								letterSpacing: '0.03em',
							}}>
								{currentIndex + 1}/{images.length}
							</div>
						)}
					</>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<span className="text-4xl">🏠</span>
					</div>
				)}

				{/* SOFT OVERLAY */}
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

				{/* BADGE — only when no counter (single image) */}
				{images.length <= 1 && (
					<span className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 text-gray-900 dark:text-white text-xs px-3 py-1 rounded-full backdrop-blur">
						{property.property_type?.toUpperCase() || 'RENT'}
					</span>
				)}
				{images.length > 1 && (
					<span className="absolute top-8 left-3 bg-white/90 dark:bg-black/60 text-gray-900 dark:text-white text-xs px-3 py-1 rounded-full backdrop-blur" style={{top: 28}}>
						{property.property_type?.toUpperCase() || 'RENT'}
					</span>
				)}

				{/* SAVE BUTTON */}
				<button
					onClick={handleSave}
					title={isSaved ? 'Remove from saved' : 'Save property'}
					style={{
						position: 'absolute', top: 10, right: 10,
						width: 34, height: 34, borderRadius: 10, border: 'none',
						background: isSaved ? '#0d9488' : 'rgba(255,255,255,0.85)',
						backdropFilter: 'blur(6px)',
						display: 'flex', alignItems: 'center', justifyContent: 'center',
						cursor: 'pointer', zIndex: 10,
						transition: 'all 0.2s',
						boxShadow: isSaved ? '0 2px 10px rgba(13,148,136,0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
					}}
				>
					<Bookmark
						size={15}
						color={isSaved ? '#fff' : '#374151'}
						fill={isSaved ? '#fff' : 'none'}
					/>
				</button>
			</div>

			{/* CONTENT */}
			<div className={`p-3 md:p-4 flex flex-col flex-1 min-w-0 ${!isGrid ? 'justify-center' : ''}`}>
				<h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
					{property.title}
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
					<MapPin className="w-4 h-4 text-teal-500" />
					<span className="line-clamp-1">
						{property.location}
						{property.city ? ` • ${property.city}` : ''}
					</span>
				</p>
				{property.managed_by && (
					<p className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-1">
						<UserCheck className="w-3.5 h-3.5" />
						<span>Managed by {property.managed_by}</span>
					</p>
				)}
				<div className="grid grid-cols-3 sm:grid-cols-3 text-[11px] sm:text-sm mt-3 gap-2">
					<span className="flex items-center gap-1 truncate whitespace-nowrap">
						<BedDouble className="w-4 h-4" /> {property.beds || 0} Beds
					</span>
					<span className="flex items-center gap-1 truncate whitespace-nowrap">
						<Bath className="w-4 h-4" /> {property.baths || 0} Baths
					</span>
					<span className="flex items-center gap-1 truncate whitespace-nowrap">
						<Ruler className="w-4 h-4" />
						<span>{property.area ? property.area : 'N/A'}</span>
					</span>
				</div>
				<div className="mt-auto pt-3 flex justify-between items-center">
					<p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
						₹ {property.price || 'Contact'}
					</p>
					<Link
						to={`/property/${propertyToSlug(property)}`}
						aria-label={`View details for ${property.title || 'this property'}`}
						onClick={(e) => e.stopPropagation()}
					>
						<button className="bg-teal-700 text-white px-3 py-2 md:px-4 rounded-lg text-xs sm:text-sm whitespace-nowrap">
							View Details
						</button>
					</Link>
				</div>
			</div>

			{/* GLOW EFFECT */}
			<div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-teal-400/10 via-transparent to-yellow-400/10" />
		</div>
	);
};
