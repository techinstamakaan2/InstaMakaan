import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
	Instagram,
	Play,
	Loader2,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Instagram Card ─────────────────────────────────────────────
const InstagramEmbedCard = ({ post, index }) => {
	const [loaded, setLoaded] = useState(false);
	const [inView, setInView] = useState(false);
	const cardRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) setInView(true); },
			{ rootMargin: '200px' }
		);
		if (cardRef.current) observer.observe(cardRef.current);
		return () => observer.disconnect();
	}, []);

	const embedSrc = post.embed_url.replace(/\/?$/, '/') + 'embed/';

	return (
		<div
			ref={cardRef}
			style={{ animationDelay: `${index * 100}ms` }}
			className="relative flex-shrink-0 w-[260px] sm:w-[300px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-900 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
		>
			{/* ── Clip the Instagram embed header ──────────────────────
			    The embed always renders a ~60px header (avatar + username +
			    "View profile"). We clip it by pulling the iframe up with a
			    negative marginTop and hiding overflow on this wrapper.       */}
			<div className="overflow-hidden rounded-2xl" style={{ height: '340px' }}>
				{/* Loader */}
				{!loaded && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-900 z-10">
						<Loader2 className="w-6 h-6 animate-spin text-gray-400" />
					</div>
				)}

				<div className="overflow-hidden rounded-2xl h-[300px] sm:h-[340px]">
					<iframe
						src={embedSrc}
						title={`InstaMakaan Instagram post ${index + 1}`}
						className="w-full border-0 block"
						style={{
							marginTop: '-60px',
							height: 'calc(100% + 60px)', // 🔥 magic fix
						}}
						scrolling="no"
						onLoad={() => setLoaded(true)}
					/>
				</div>
			</div>

			{/* Reel badge */}
			{post.has_video && (
				<div className="absolute top-2 right-2 w-7 h-7 rounded-md bg-black/70 flex items-center justify-center z-20 pointer-events-none">
					<Play className="w-3.5 h-3.5 text-white" fill="currentColor" />
				</div>
			)}

			{/* Hover overlay — desktop only so mobile taps still open IG */}
			<a
				href={post.embed_url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Open on Instagram"
				className="absolute inset-0 z-10 bg-black/0 hover:bg-black/30 transition-all duration-300 hidden sm:flex items-center justify-center group"
			>
				<Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300" />
			</a>
		</div>
	);
};

// ─── Skeleton ────────────────────────────────────────────────────
const SkeletonCard = () => (
	<div className="flex-shrink-0 w-[260px] sm:w-[300px] h-[340px] rounded-2xl bg-gray-100 dark:bg-neutral-900 animate-pulse" />
);

// ─── Main Section ─────────────────────────────────────────────
export const InstagramSection = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const sliderRef = useRef(null);

	useEffect(() => {
		api
			.get('/instagram/')
			.then((res) => {
				if (res.data.success) setPosts(res.data.data);
				else setError('Failed to load posts');
			})
			.catch(() => setError('Server error'))
			.finally(() => setLoading(false));
	}, []);

	const updateScrollButtons = () => {
		const el = sliderRef.current;
		if (!el) return;
		setCanScrollLeft(el.scrollLeft > 10);
		setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
	};

	const scroll = (dir) => {
		const el = sliderRef.current;
		if (!el) return;
		el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
	};

	return (
		<section className="py-10 sm:py-12 md:py-16 bg-white dark:bg-[#0b1220]">
			<div className="w-full max-w-7xl mx-auto px-4 md:px-6">
				{/* Header */}
				<div className="text-center mb-6 sm:mb-10 px-4">
					<h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 tracking-tight">
						VISIT OUR INSTAGRAM
					</h2>
					<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
						Follow our journey, see behind-the-scenes content, and explore our
						latest properties.
					</p>
				</div>

				{/* ── Slider ──────────────────────────────────────────────── */}
				<div className="relative group">
					{/* Left arrow (shows on hover, desktop) */}
					{canScrollLeft && (
						<button
							onClick={() => scroll('left')}
							className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-neutral-700"
							aria-label="Scroll left"
						>
							<ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
						</button>
					)}

					{/* Right arrow */}
					{canScrollRight && (
						<button
							onClick={() => scroll('right')}
							className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-neutral-700"
							aria-label="Scroll right"
						>
							<ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
						</button>
					)}

					{/* Scrollable track — native horizontal scroll on touch */}
					<div
						ref={sliderRef}
						onScroll={updateScrollButtons}
						className="flex gap-4 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 pb-2"
						style={{
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
							WebkitOverflowScrolling: 'touch',
						}}
					>
						{loading && [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}

						{!loading && error && (
							<p className="text-red-700 text-sm mx-auto py-8">{error}</p>
						)}

						{!loading && !error && posts.length === 0 && (
							<p className="text-gray-400 text-sm mx-auto py-8">
								No posts available right now.
							</p>
						)}

						{!loading &&
							!error &&
							posts.map((post, i) => (
								<InstagramEmbedCard key={post.id} post={post} index={i} />
							))}
					</div>
				</div>

				{/* CTA */}
				<div className="mt-6 sm:mt-8 flex justify-center px-4">
					<Button
						variant="yellow"
						size="lg"
						asChild
						className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-semibold rounded-xl"
					>
						<a
							href="https://instagram.com/instamakaan"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2"
						>
							<Instagram className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
							<span>Follow us on Instagram @InstaMakaan</span>
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
};
