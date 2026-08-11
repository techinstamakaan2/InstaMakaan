import { useState, useMemo, useRef, useCallback, useEffect } from 'react';

/* Story metadata — shown in the mobile viewer */
const STORIES = [
	{ src: '/videos/review-2.mp4', name: 'Priya Singh',   role: 'Tenant',         location: 'Noida Extension' },
	{ src: '/videos/review-3.mp4', name: 'Rohan Mehta',   role: 'Property Owner', location: 'Greater Noida'  },
	{ src: '/videos/review-6.mp4', name: 'Anjali Sharma', role: 'Tenant',         location: 'Sector 62, Noida'},
	{ src: '/videos/review-7.mp4', name: 'Vikram Gupta',  role: 'Agent',          location: 'Delhi NCR'      },
	{ src: '/videos/review-2.mp4', name: 'Simran Kaur',   role: 'Tenant',         location: 'Ghaziabad'      },
];
const STORY_DURATION = 8000;

export default function VideoStoriesSection() {
	const [hovered, setHovered] = useState(null);

	/* ── Mobile story state ── */
	const [mobileActive, setMobileActive] = useState(0);
	const touchStartX = useRef(null);

	const mobileNext = useCallback(() =>
		setMobileActive(p => (p + 1) % STORIES.length), []);
	const mobilePrev = useCallback(() =>
		setMobileActive(p => (p - 1 + STORIES.length) % STORIES.length), []);

	/* Auto-advance */
	useEffect(() => {
		const t = setTimeout(mobileNext, STORY_DURATION);
		return () => clearTimeout(t);
	}, [mobileActive, mobileNext]);

	/* Swipe */
	const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
	const onTouchEnd   = (e) => {
		if (touchStartX.current === null) return;
		const diff = touchStartX.current - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 40) diff > 0 ? mobileNext() : mobilePrev();
		touchStartX.current = null;
	};

	/* Tap left/right half to navigate */
	const onTap = (e) => {
		const { left, width } = e.currentTarget.getBoundingClientRect();
		(e.clientX - left) < width / 2 ? mobilePrev() : mobileNext();
	};

	const baseVideos = [
		'/videos/review-2.mp4',
		'/videos/review-2.mp4',
		'/videos/review-3.mp4',
		'/videos/review-6.mp4',
		'/videos/review-7.mp4',
	];

	const generateVideos = () => {
		const grid = [];

		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 3; c++) {
				let options = [...baseVideos];

				for (let i = r * 3; i < r * 3 + c; i++) {
					options = options.filter((v) => v !== grid[i]);
				}

				for (let i = c; i < grid.length; i += 3) {
					options = options.filter((v) => v !== grid[i]);
				}

				const random = options[Math.floor(Math.random() * options.length)];

				grid.push(random);
			}
		}

		return grid;
	};

	const videos = useMemo(() => generateVideos(), []);

	const row = (i) => Math.floor(i / 3);
	const col = (i) => i % 3;

	const rows =
		hovered === null
			? '1fr 1fr 1fr'
			: [0, 1, 2].map((r) => (r === hovered.row ? '2fr' : '0.7fr')).join(' ');

	const cols =
		hovered === null
			? '1fr 1fr 1fr'
			: [0, 1, 2].map((c) => (c === hovered.col ? '2fr' : '0.7fr')).join(' ');

	return (
		<>
		<style>{`
			@keyframes storyProgress {
				from { width: 0%; }
				to   { width: 100%; }
			}
			@keyframes storyBadge {
				from { opacity: 0; transform: translateY(12px); }
				to   { opacity: 1; transform: translateY(0); }
			}
		`}</style>
		<section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#020617] dark:via-[#07101d] dark:to-[#020617] overflow-hidden relative">
			{/* HEADING */}
			<div className="max-w-6xl mx-auto text-center mb-10 md:mb-16 px-4">
				<h2 className="text-3xl md:text-6xl font-bold text-gray-900 dark:text-white">
					Customer Stories
				</h2>
				<p className="text-gray-700 dark:text-gray-300 mt-3 md:mt-4 text-base md:text-lg">
					Hear directly from the people who trust InstaMakaan.
				</p>
			</div>

			{/* ── MOBILE: Instagram Stories viewer ── */}
			<div className="md:hidden px-4">
				<div
					className="relative w-full overflow-hidden rounded-3xl bg-black"
					style={{ aspectRatio: '9/16', maxHeight: '82vh' }}
					onTouchStart={onTouchStart}
					onTouchEnd={onTouchEnd}
					onClick={onTap}
				>
					{/* Videos — stack all, show active via opacity */}
					{STORIES.map((s, i) => (
						<video
							key={i}
							src={s.src}
							autoPlay muted loop playsInline
							className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
							style={{ opacity: i === mobileActive ? 1 : 0, pointerEvents: 'none' }}
						/>
					))}

					{/* Gradient overlays */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

					{/* Progress bars */}
					<div className="absolute top-3 left-3 right-3 flex gap-1 z-20 pointer-events-none">
						{STORIES.map((_, i) => (
							<div key={i} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
								{i < mobileActive && (
									<div className="w-full h-full bg-white rounded-full" />
								)}
								{i === mobileActive && (
									<div
										key={`p-${mobileActive}`}
										className="h-full bg-white rounded-full"
										style={{ animation: `storyProgress ${STORY_DURATION}ms linear forwards` }}
									/>
								)}
							</div>
						))}
					</div>

					{/* Live badge */}
					<div className="absolute top-8 right-4 flex items-center gap-1.5 z-20 pointer-events-none">
						<div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
						<span className="text-white text-[11px] font-semibold tracking-wide">LIVE</span>
					</div>

					{/* Name + rating badge */}
					<div
						key={`badge-${mobileActive}`}
						className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none"
						style={{ animation: 'storyBadge 0.4s ease forwards' }}
					>
						<div className="flex gap-0.5 mb-1">
							{[1,2,3,4,5].map(s => (
								<span key={s} className="text-yellow-400 text-sm">★</span>
							))}
						</div>
						<p className="text-white font-bold text-lg leading-tight">
							{STORIES[mobileActive].name}
						</p>
						<p className="text-white/75 text-sm mt-0.5">
							{STORIES[mobileActive].role} · {STORIES[mobileActive].location}
						</p>
					</div>

					{/* Tap hint arrows (subtle) */}
					<div className="absolute inset-y-0 left-0 w-1/2 z-10" />
					<div className="absolute inset-y-0 right-0 w-1/2 z-10" />
				</div>

				{/* Dot navigation */}
				<div className="flex justify-center gap-1.5 mt-4">
					{STORIES.map((_, i) => (
						<button
							key={i}
							onClick={(e) => { e.stopPropagation(); setMobileActive(i); }}
							className="rounded-full transition-all duration-300"
							style={{
								width:  i === mobileActive ? '20px' : '6px',
								height: '6px',
								background: i === mobileActive ? '#14b8a6' : '#cbd5e1',
							}}
							aria-label={`Story ${i + 1}`}
						/>
					))}
				</div>
			</div>

			{/* DESKTOP INTERACTIVE GRID */}

			<div className="hidden md:block max-w-7xl mx-auto px-6">
				<div
					className="grid gap-0 h-[520px] lg:h-[600px]"
					style={{
						gridTemplateRows: rows,
						gridTemplateColumns: cols,
						transition: 'all 0.45s ease',
					}}
				>
					{videos.map((v, i) => {
						const r = row(i);
						const c = col(i);

						return (
							<div
								key={i}
								onMouseEnter={() => setHovered({ row: r, col: c })}
								onMouseLeave={() => setHovered(null)}
								className="relative overflow-hidden"
							>
								<video
									src={v}
									autoPlay
									muted
									loop
									playsInline
									className="w-full h-full object-cover"
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
		</>
	);
}
