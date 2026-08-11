/* ===========================================================
   CustomerStories.jsx — Improved: mobile-first, SEO-friendly,
   smoother animations, accessible
=========================================================== */
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

const items = [
	{
		name: 'Amisha Verma',
		role: 'Property Owner',
		location: 'Noida',
		review:
			'InstaMakaan helped me rent my property within 48 hours. The process was smooth and the tenants were verified.',
		type: 'video',
		src: '/videos/review-4.mp4',
		poster: '/images/review-4-poster.webp',
	},
	{
		name: 'Rashi Sharma',
		role: 'Tenant',
		location: 'Bangalore',
		review:
			'I found my flat in Bangalore within a day. The experience was simple and hassle-free.',
		type: 'video',
		src: '/videos/review-5.mp4',
		poster: '/images/review-5-poster.webp',
	},
	{
		name: 'Zoya Khan',
		role: 'Agent',
		location: 'Delhi',
		review:
			'I started getting verified leads every day. It improved my property closing rate significantly.',
		type: 'image',
		src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=75',
	},
];

const STARS = [1, 2, 3, 4, 5];

export default function CustomerStories() {
	const [active, setActive] = useState(0);
	const [muted, setMuted] = useState(true);
	const [animDir, setAnimDir] = useState('next'); // 'next' | 'prev'
	const [animating, setAnimating] = useState(false);
	const autoTimer = useRef(null);

	const go = useCallback(
		(dir) => {
			if (animating) return;
			setAnimDir(dir);
			setAnimating(true);
			setMuted(true);
			setTimeout(() => {
				setActive((prev) =>
					dir === 'next'
						? (prev + 1) % items.length
						: (prev - 1 + items.length) % items.length,
				);
				setAnimating(false);
			}, 320);
		},
		[animating],
	);

	const next = useCallback(() => go('next'), [go]);
	const prev = useCallback(() => go('prev'), [go]);

	/* Auto-advance only on non-video slides */
	useEffect(() => {
		clearInterval(autoTimer.current);
		if (items[active].type !== 'video') {
			autoTimer.current = setInterval(next, 8000);
		}
		return () => clearInterval(autoTimer.current);
	}, [active, next]);

	const item = items[active];

	return (
		<>
			<style>{`
				@keyframes csSlideInNext {
					from { opacity:0; transform:translateX(40px) scale(.97); }
					to   { opacity:1; transform:translateX(0)    scale(1);   }
				}
				@keyframes csSlideInPrev {
					from { opacity:0; transform:translateX(-40px) scale(.97); }
					to   { opacity:1; transform:translateX(0)     scale(1);   }
				}
				@keyframes csSlideOut {
					from { opacity:1; transform:scale(1);   }
					to   { opacity:0; transform:scale(.95); }
				}
				@keyframes csDotPop {
					0%,100% { transform:scale(1); }
					50%     { transform:scale(1.35); }
				}
				@keyframes csGlow {
					0%,100% { opacity:.3; transform:scale(1); }
					50%     { opacity:.6; transform:scale(1.1); }
				}
				@keyframes csFadeUp {
					from { opacity:0; transform:translateY(14px); }
					to   { opacity:1; transform:translateY(0); }
				}

				.cs-section {
					padding:2rem 0 3rem;
					background:linear-gradient(180deg,#f8fafc 0%,#ffffff 50%,#f1f5f9 100%);
					position:relative; overflow:hidden;
				}
				@media(min-width:768px) {
					.cs-section { padding:3.5rem 0 4rem; }
				}
				.dark .cs-section {
					background:linear-gradient(180deg,#020617 0%,#07101d 50%,#020617 100%);
				}

				/* orb */
				.cs-orb {
					position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none;
					animation: csGlow 8s ease-in-out infinite;
				}
				.cs-orb-1 { width:350px;height:350px;top:-80px;left:-60px;
					background:radial-gradient(circle,rgba(20,184,166,.14),transparent 70%); }
				.cs-orb-2 { width:280px;height:280px;bottom:-60px;right:-40px;animation-delay:4s;
					background:radial-gradient(circle,rgba(245,158,11,.13),transparent 70%); }
				.dark .cs-orb-1 { background:radial-gradient(circle,rgba(20,184,166,.22),transparent 70%); }
				.dark .cs-orb-2 { background:radial-gradient(circle,rgba(245,158,11,.18),transparent 70%); }

				/* title */
				.cs-title {
					font-family:'Clash Display',sans-serif;
					font-size:clamp(1.6rem,5vw,2.8rem); font-weight:700;
					color:#0f172a; text-align:center; margin-bottom:.5rem;
				}
				.dark .cs-title { color:#f8fafc; }
				.cs-subtitle {
					font-family:'Cabinet Grotesk',sans-serif;
					font-size:clamp(.85rem,2vw,1rem); color:#64748b; text-align:center;
				}
				.dark .cs-subtitle { color:rgba(255,255,255,.5); }

				/* layout */
				.cs-layout {
					display:grid;
					grid-template-columns:1fr;
					gap:2rem; align-items:center;
					max-width:1060px; margin:2.5rem auto 0; padding:0 1.25rem;
				}
				@media(min-width:768px) {
					.cs-layout { grid-template-columns:1fr 1fr; gap:3rem; }
				}

				/* stack */
				.cs-stack {
					position:relative; height:340px;
					display:flex; align-items:center; justify-content:center;
				}
				@media(min-width:768px) { .cs-stack { height:440px; } }

				.cs-stack-glow {
					position:absolute; width:260px; height:260px; border-radius:50%;
					background:radial-gradient(circle,rgba(20,184,166,.18),transparent 70%);
					filter:blur(50px); pointer-events:none;
					animation: csGlow 5s ease-in-out infinite;
				}

				.cs-card {
					position:absolute;
					border-radius:20px; overflow:hidden;
					box-shadow:0 20px 50px rgba(15,23,42,.18);
					transition:all .45s cubic-bezier(.22,1,.36,1);
					cursor:pointer;
				}
				.cs-card img, .cs-card video {
					width:100%; height:100%; object-fit:cover; display:block;
				}

				/* active */
				.cs-card--active {
					width:200px; height:300px; z-index:30;
					transform:scale(1) translateX(0) rotate(0deg);
					box-shadow:0 28px 64px rgba(15,23,42,.24), 0 0 0 3px rgba(20,184,166,.35);
				}
				@media(min-width:768px) { .cs-card--active { width:248px; height:370px; } }

				/* right */
				.cs-card--right {
					width:150px; height:220px; z-index:20; opacity:.55;
					transform:scale(.88) translateX(90px) rotate(3deg);
				}
				@media(min-width:400px) { .cs-card--right { width:170px; height:250px; transform:scale(.9) translateX(110px) rotate(3deg); } }
				@media(min-width:768px) { .cs-card--right { width:180px; height:265px; transform:scale(.9) translateX(165px) rotate(3deg); } }

				/* left */
				.cs-card--left {
					width:150px; height:220px; z-index:20; opacity:.55;
					transform:scale(.88) translateX(-90px) rotate(-3deg);
				}
				@media(min-width:400px) { .cs-card--left { width:170px; height:250px; transform:scale(.9) translateX(-110px) rotate(-3deg); } }
				@media(min-width:768px) { .cs-card--left { width:180px; height:265px; transform:scale(.9) translateX(-165px) rotate(-3deg); } }

				/* hidden */
				.cs-card--hidden { opacity:0; pointer-events:none; transform:scale(.8); }

				/* mute btn */
				.cs-mute-btn {
					position:absolute; bottom:10px; right:10px; z-index:40;
					width:32px; height:32px; border-radius:50%; border:none; cursor:pointer;
					background:rgba(0,0,0,.55); color:#fff; backdrop-filter:blur(4px);
					display:flex; align-items:center; justify-content:center;
					transition:background .2s, transform .2s;
				}
				.cs-mute-btn:hover { background:rgba(0,0,0,.75); transform:scale(1.1); }

				/* text panel */
				.cs-panel {
					border-radius:1.5rem; padding:2rem 1.75rem;
					background:linear-gradient(135deg,#f0fdfc,#fffbeb);
					border:1px solid rgba(20,184,166,.18);
					box-shadow:0 8px 34px rgba(15,23,42,.07);
					position:relative; overflow:hidden;
				}
				.dark .cs-panel {
					background:linear-gradient(135deg,rgba(15,30,48,.85),rgba(10,20,34,.95));
					border-color:rgba(20,184,166,.15);
					box-shadow:0 20px 50px rgba(0,0,0,.4);
				}
				.cs-panel::before {
					content:''; position:absolute; top:0; left:0; right:0; height:1px;
					background:linear-gradient(90deg,transparent,rgba(20,184,166,.5),transparent);
				}

				.cs-panel-name {
					font-family:'Clash Display',sans-serif; font-size:1.35rem; font-weight:700;
					color:#0f172a; margin-bottom:.15rem;
				}
				.dark .cs-panel-name { color:#f8fafc; }
				.cs-panel-meta {
					font-family:'Cabinet Grotesk',sans-serif; font-size:.82rem; color:#64748b;
					display:flex; align-items:center; gap:.4rem; margin-bottom:1rem;
				}
				.dark .cs-panel-meta { color:rgba(255,255,255,.5); }
				.cs-panel-meta span { width:4px;height:4px;border-radius:50%;background:#14b8a6;display:inline-block; }

				.cs-stars { display:flex; gap:.2rem; margin-bottom:.85rem; }
				.cs-star { font-size:1rem; color:#f59e0b; transition:transform .2s; }
				.cs-star:hover { transform:scale(1.3); }

				.cs-quote {
					font-family:'Cabinet Grotesk',sans-serif;
					font-size:clamp(.9rem,2vw,1.05rem); line-height:1.75;
					color:#475569; font-style:italic;
					animation: csFadeUp .5s ease both;
				}
				.dark .cs-quote { color:rgba(255,255,255,.65); }

				.cs-quote-mark {
					font-family:Georgia,serif; font-size:4rem; line-height:.8;
					color:rgba(20,184,166,.25); float:left; margin-right:.3rem; margin-top:.3rem;
				}

				/* nav */
				.cs-nav { display:flex; align-items:center; gap:.75rem; margin-top:1.5rem; }
				.cs-nav-btn {
					width:40px; height:40px; border-radius:50%; border:none; cursor:pointer;
					display:flex; align-items:center; justify-content:center;
					background:linear-gradient(135deg,#14b8a6,#0d9488); color:#fff;
					box-shadow:0 4px 14px rgba(20,184,166,.35);
					transition:transform .2s, box-shadow .2s;
				}
				.cs-nav-btn:hover { transform:scale(1.12); box-shadow:0 6px 20px rgba(20,184,166,.5); }
				.cs-nav-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; }

				/* dots */
				.cs-dots { display:flex; gap:.5rem; align-items:center; }
				.cs-dot {
					width:8px; height:8px; border-radius:999px; border:none; cursor:pointer;
					background:#cbd5e1; padding:0;
					transition:all .3s cubic-bezier(.22,1,.36,1);
				}
				.dark .cs-dot { background:rgba(255,255,255,.2); }
				.cs-dot--active {
					width:24px; background:linear-gradient(90deg,#14b8a6,#f59e0b);
					animation: csDotPop .4s ease;
				}

				/* slide animations */
				.cs-slide-next  { animation: csSlideInNext .32s cubic-bezier(.22,1,.36,1) both; }
				.cs-slide-prev  { animation: csSlideInPrev .32s cubic-bezier(.22,1,.36,1) both; }
			`}</style>

			<section className="cs-section" aria-label="Customer Stories">
				<div className="cs-orb cs-orb-1" aria-hidden="true" />
				<div className="cs-orb cs-orb-2" aria-hidden="true" />

				<div className="max-w-7xl mx-auto px-4">
					{/* Title */}
					<header>
						<h2 className="cs-title">
							Real experiences from InstaMakaan users
						</h2>
						<p className="cs-subtitle">
							Owners, tenants & agents share their stories
						</p>
					</header>

					<div className="cs-layout">
						{/* ── Stack ── */}
						<div className="cs-stack" role="region" aria-label="Story media">
							<div className="cs-stack-glow" aria-hidden="true" />

							{items.map((it, idx) => {
								const pos = (idx - active + items.length) % items.length;
								let cls = 'cs-card--hidden';
								if (pos === 0) cls = 'cs-card--active';
								else if (pos === 1) cls = 'cs-card--right';
								else if (pos === items.length - 1) cls = 'cs-card--left';

								return (
									<div
										key={idx}
										className={`cs-card ${cls}`}
										onClick={() => {
											if (pos === 1) next();
											else if (pos === items.length - 1) prev();
										}}
										aria-hidden={pos !== 0}
									>
										{it.type === 'video' ? (
											<>
												<video
													src={it.src}
													poster={it.poster}
													autoPlay
													loop
													playsInline
													preload="metadata"
													muted={muted || pos !== 0}
												/>
												{pos === 0 && (
													<button
														className="cs-mute-btn"
														onClick={(e) => {
															e.stopPropagation();
															setMuted((m) => !m);
														}}
														aria-label={muted ? 'Unmute video' : 'Mute video'}
													>
														{muted ? (
															<VolumeX size={15} />
														) : (
															<Volume2 size={15} />
														)}
													</button>
												)}
											</>
										) : (
											<img
												src={it.src}
												alt={`Review by ${it.name}`}
												loading="lazy"
												decoding="async"
											/>
										)}
									</div>
								);
							})}
						</div>

						{/* ── Text panel ── */}
						<div className="cs-panel">
							<div
								className={
									animDir === 'next' ? 'cs-slide-next' : 'cs-slide-prev'
								}
							>
								<h3 className="cs-panel-name">{item.name}</h3>
								<p className="cs-panel-meta">
									{item.role} <span /> {item.location}
								</p>

								<div className="cs-stars" aria-label="5 out of 5 stars">
									{STARS.map((s) => (
										<span key={s} className="cs-star">
											★
										</span>
									))}
								</div>

								<blockquote className="cs-quote">
									<span className="cs-quote-mark" aria-hidden="true">
										"
									</span>
									{item.review}
								</blockquote>
							</div>

							{/* Nav */}
							<nav className="cs-nav" aria-label="Story navigation">
								<button
									className="cs-nav-btn"
									onClick={prev}
									aria-label="Previous story"
								>
									<ChevronLeft size={18} />
								</button>
								<button
									className="cs-nav-btn"
									onClick={next}
									aria-label="Next story"
								>
									<ChevronRight size={18} />
								</button>

								<div
									className="cs-dots"
									role="tablist"
									aria-label="Story indicator"
								>
									{items.map((_, i) => (
										<button
											key={i}
											className={`cs-dot${active === i ? ' cs-dot--active' : ''}`}
											onClick={() => {
												setMuted(true);
												setActive(i);
											}}
											role="tab"
											aria-selected={active === i}
											aria-label={`Story ${i + 1}: ${items[i].name}`}
										/>
									))}
								</div>
							</nav>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
