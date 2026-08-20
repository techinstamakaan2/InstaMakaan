/* ===========================================================
   HeroSection.jsx — Smooth infinite scroll, zero jitter
=========================================================== */

const testimonials = [
	{
		text: 'Found my flat in 24 hours!',
		image: 'https://i.pravatar.cc/150?img=1',
		name: 'Rohit',
		role: 'Tenant',
	},
	{
		text: 'Tenant verified in 2 days.',
		image: 'https://i.pravatar.cc/150?img=2',
		name: 'Amit',
		role: 'Owner',
	},
	{
		text: 'Smooth, zero stress.',
		image: 'https://i.pravatar.cc/150?img=3',
		name: 'Zoya',
		role: 'Agent',
	},
	{
		text: 'Support was incredible!',
		image: 'https://i.pravatar.cc/150?img=4',
		name: 'Harsh',
		role: 'Partner',
	},
	{
		text: 'Super fast process!',
		image: 'https://i.pravatar.cc/150?img=5',
		name: 'Sneha',
		role: 'Tenant',
	},
	{
		text: 'User-friendly system!',
		image: 'https://i.pravatar.cc/150?img=6',
		name: 'Karan',
		role: 'Owner',
	},
	{
		text: 'Highly recommended!',
		image: 'https://i.pravatar.cc/150?img=7',
		name: 'Simran',
		role: 'Tenant',
	},
	{
		text: 'Very helpful team!',
		image: 'https://i.pravatar.cc/150?img=8',
		name: 'Tanya',
		role: 'Agent',
	},
	{
		text: '5-star experience!',
		image: 'https://i.pravatar.cc/150?img=9',
		name: 'Sahil',
		role: 'Partner',
	},
	{
		text: 'Nice UI, easy to use!',
		image: 'https://i.pravatar.cc/150?img=25',
		name: 'Rashi',
		role: 'Tenant',
	},
	{
		text: 'Loved every step!',
		image: 'https://i.pravatar.cc/150?img=26',
		name: 'Manav',
		role: 'Partner',
	},
	{
		text: 'Got great tenants fast.',
		image: 'https://i.pravatar.cc/150?img=27',
		name: 'Kritika',
		role: 'Owner',
	},
	{
		text: 'Would use again!',
		image: 'https://i.pravatar.cc/150?img=31',
		name: 'Renu',
		role: 'Tenant',
	},
	{
		text: 'Great team & support.',
		image: 'https://i.pravatar.cc/150?img=32',
		name: 'Raghav',
		role: 'Partner',
	},
	{
		text: 'Very fast resolution!',
		image: 'https://i.pravatar.cc/150?img=33',
		name: 'Kabir',
		role: 'Owner',
	},
	{
		text: 'Perfect for owners!',
		image: 'https://i.pravatar.cc/150?img=37',
		name: 'Tejas',
		role: 'Partner',
	},
	{
		text: 'Worked great for me!',
		image: 'https://i.pravatar.cc/150?img=38',
		name: 'Vipin',
		role: 'Agent',
	},
	{
		text: 'Very clear & transparent.',
		image: 'https://i.pravatar.cc/150?img=39',
		name: 'Muskan',
		role: 'Tenant',
	},
];

/* Split into N even columns */
function chunkInto(arr, n) {
	const cols = Array.from({ length: n }, () => []);
	arr.forEach((item, i) => cols[i % n].push(item));
	return cols;
}

/* ── Single scrolling column ── */
function TestimonialsColumn({
	items,
	duration = 16,
	reverse = false,
	delay = '0s',
}) {
	return (
		<div
			className={`hero-col ${reverse ? 'hero-col--reverse' : ''}`}
			style={{ '--dur': `${duration}s`, '--delay': delay }}
			aria-hidden="true"
		>
			{/*
				Triple-duplicate so there is always content visible
				on any screen height — the seam never shows.
				Animation moves exactly -33.333% (one copy length)
				then loops: visually identical start/end = zero jump.
			*/}
			{[...items, ...items, ...items].map((t, i) => (
				<div key={i} className="hero-card">
					<div className="hero-card__avatar" aria-hidden="true">
						{t.name[0]}
					</div>
					<div className="hero-card__body">
						<p className="hero-card__name">{t.name}</p>
						<p className="hero-card__role">{t.role}</p>
						<p className="hero-card__text">{t.text}</p>
					</div>
				</div>
			))}
		</div>
	);
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function HeroSection() {
	const allCols = chunkInto(testimonials, 6);
	const durations = [13, 17, 15, 19, 14, 21];

	/*
		Negative delays mean each column starts mid-animation.
		Their individual "reset" moments are spread far apart
		so you never see multiple columns snap at the same frame.
	*/
	const delays = ['-3s', '-8s', '-2s', '-11s', '-5s', '-14s'];

	return (
		<>
			<style>{`
				/* ─── Keyframes ───────────────────────────────────────
				   Move exactly one-third of the tripled list upward.
				   At 100% the position is identical to what was shown
				   at 0%, so the browser loops with zero visible seam.
				──────────────────────────────────────────────────── */
				@keyframes heroScrollUp {
					0%   { transform: translateY(0); }
					100% { transform: translateY(-33.3333%); }
				}
				@keyframes heroScrollDown {
					0%   { transform: translateY(-33.3333%); }
					100% { transform: translateY(0); }
				}
				@keyframes heroWordPop {
					0%   { opacity:0; transform:translateY(18px) scale(.92); }
					60%  { transform:translateY(-3px) scale(1.03); }
					100% { opacity:1; transform:translateY(0) scale(1); }
				}
				@keyframes heroFadeUp {
					from { opacity:0; transform:translateY(14px); }
					to   { opacity:1; transform:translateY(0); }
				}
				@keyframes heroPulse {
					0%,100% { transform:scale(1);   opacity:.45; }
					50%     { transform:scale(1.1); opacity:.75; }
				}

				/* ─── Section ─── */
				.hero-section {
					position: relative;
					overflow: hidden;
					background: linear-gradient(180deg,#ffffff 0%,#f8fafc 50%,#f1f5f9 100%);
					padding-top: 3rem;
					padding-bottom: 0;
					margin-top: -3.5rem;
					min-height: 300px;
				}
				@media(min-width:640px) {
					.hero-section { padding-top: 5rem; min-height: 420px; }
				}
				.dark .hero-section {
					background: linear-gradient(180deg,#020617 0%,#07101d 50%,#020617 100%);
				}

				/* ─── Orbs ─── */
				.hero-orb {
					position: absolute; border-radius: 50%;
					filter: blur(80px); pointer-events: none;
					animation: heroPulse 7s ease-in-out infinite;
				}
				.hero-orb-1 {
					width:340px; height:340px; top:-60px; left:-60px;
					background: radial-gradient(circle,rgba(20,184,166,.18),transparent 70%);
				}
				.hero-orb-2 {
					width:280px; height:280px; bottom:0; right:-40px;
					animation-delay: 3.5s;
					background: radial-gradient(circle,rgba(245,158,11,.15),transparent 70%);
				}
				.dark .hero-orb-1 { background: radial-gradient(circle,rgba(20,184,166,.26),transparent 70%); }
				.dark .hero-orb-2 { background: radial-gradient(circle,rgba(245,158,11,.2), transparent 70%); }

				/* ─── Center text ─── */
				.hero-text {
					position: absolute; inset: 0; z-index: 20;
					display: flex; flex-direction: column;
					align-items: center; justify-content: center;
					text-align: center; padding: 0 1rem;
					pointer-events: none;
				}
				.hero-title {
					font-family: 'Clash Display', sans-serif;
					font-size: clamp(2rem,7vw,5rem);
					font-weight: 800; line-height: 1.1;
					letter-spacing: -.02em;
					display: flex; flex-wrap: wrap;
					gap: .3em; justify-content: center;
				}
				.hero-title span {
					display: inline-block; opacity: 0;
					animation: heroWordPop .7s cubic-bezier(.22,1,.36,1) both;
				}
				.hero-title span:nth-child(1) { color:#0d9488; animation-delay:.1s; }
				.hero-title span:nth-child(2) { color:#eab308; }   /* yellow-500 */				
				.hero-title span:nth-child(3) { color:#0d9488; animation-delay:.5s; }
				.dark .hero-title span:nth-child(1),
				.dark .hero-title span:nth-child(3) { color:#14b8a6; }
				.dark .hero-title span:nth-child(2) { color:#fbbf24; }
				.hero-subtitle {
					font-family: 'Cabinet Grotesk', sans-serif;
					font-size: clamp(.82rem,2.2vw,1.05rem);
					color: #64748b; margin-top: .6rem;
					opacity: 0;
					animation: heroFadeUp .8s ease both .8s;
				}
				.dark .hero-subtitle { color: rgba(255,255,255,.5); }

				/* ─── Grid wrapper ─── */
				.hero-grid {
					position: relative; z-index: 1;
					display: grid;
					grid-template-columns: repeat(2,1fr);
					gap: .7rem; padding: 0 .7rem;
					width: 100%; height: 300px;
					overflow: hidden;

					/* Soft fade on top & bottom */
					-webkit-mask-image: linear-gradient(
						to bottom,
						transparent 0%,
						black 22%,
						black 78%,
						transparent 100%
					);
					mask-image: linear-gradient(
						to bottom,
						transparent 0%,
						black 22%,
						black 78%,
						transparent 100%
					);

					opacity: .48;
					filter: blur(1.5px);

					/* Own GPU layer so column repaints don't affect the rest */
					transform: translateZ(0);
				}
				@media(min-width:640px)  { .hero-grid { grid-template-columns:repeat(3,1fr); height:480px; } }
				/* hero title smaller on mobile */
				@media(max-width:639px) {
					.hero-title { font-size: 1.8rem; gap: .2em; }
					.hero-subtitle { font-size: .8rem; margin-top: .4rem; }
				}
				@media(min-width:768px)  { .hero-grid { grid-template-columns:repeat(4,1fr); height:520px; } }
				@media(min-width:1024px) { .hero-grid { grid-template-columns:repeat(5,1fr); height:580px; } }
				@media(min-width:1280px) { .hero-grid { grid-template-columns:repeat(6,1fr); } }

				/* ─── Column ─── */
				.hero-col {
					display: flex; flex-direction: column; gap: .65rem;

					/*
						Each column gets its own compositor layer.
						This is the most important fix:
						- translateZ(0) promotes to GPU layer
						- backface-visibility:hidden prevents subpixel flicker
						- will-change:transform tells browser to keep it on GPU
					*/
					transform: translateZ(0);
					backface-visibility: hidden;
					-webkit-backface-visibility: hidden;
					will-change: transform;

					animation: heroScrollUp var(--dur,16s) linear var(--delay,0s) infinite;
				}
				.hero-col--reverse {
					animation-name: heroScrollDown;
				}

				/* Honor system accessibility setting */
				@media (prefers-reduced-motion: reduce) {
					.hero-col { animation: none !important; }
				}

				/* ─── Card ─── */
				.hero-card {
					display: flex; align-items: flex-start; gap: .5rem;
					padding: .6rem .7rem; border-radius: .85rem; flex-shrink: 0;
					background: #ffffff;
					border: 1px solid #e2e8f0;
					box-shadow: 0 2px 8px rgba(15,23,42,.06);
				}
				.dark .hero-card {
					background: #111827;
					border-color: rgba(255,255,255,.08);
					box-shadow: none;
				}
				.hero-card__avatar {
					width:32px; height:32px; border-radius:50%; flex-shrink:0;
					background: linear-gradient(135deg,#14b8a6,#10b981);
					color:#fff; font-weight:700; font-size:.8rem;
					display:flex; align-items:center; justify-content:center;
				}
				.hero-card__body {
					display:flex; flex-direction:column; gap:.08rem; min-width:0;
				}
				.hero-card__name {
					font-family:'Cabinet Grotesk',sans-serif;
					font-size:.78rem; font-weight:700;
					color:#0f172a; white-space:nowrap;
				}
				.dark .hero-card__name { color:#f1f5f9; }
				.hero-card__role { font-size:.68rem; color:#94a3b8; }
				.hero-card__text {
					font-size:.72rem; color:#475569;
					line-height:1.45; margin-top:.12rem;
				}
				.dark .hero-card__text { color:rgba(255,255,255,.55); }

				/* ─── Bottom fade ─── */
				.hero-bottom-fade {
					position:absolute; bottom:0; left:0; right:0;
					height:5rem; pointer-events:none; z-index:10;
					background: linear-gradient(to bottom,transparent,#f1f5f9);
				}
				.dark .hero-bottom-fade {
					background: linear-gradient(to bottom,transparent,#020617);
				}
			`}</style>

			<section
				className="hero-section"
				aria-label="Testimonials from InstaMakaan users"
			>
				{/* SEO h1 — screen-reader only */}
				<h1 className="sr-only">
					InstaMakaan — India's Trusted Rental Platform. Experience. Trust.
					Excellence.
				</h1>

				<div className="hero-orb hero-orb-1" aria-hidden="true" />
				<div className="hero-orb hero-orb-2" aria-hidden="true" />

				{/* Animated headline */}
				<div className="hero-text">
					<h2
						className="hero-title"
						aria-label="Experience. Trust. Excellence."
					>
						<span>Experience.</span>
						<span>Trust.</span>
						<span>Excellence.</span>
					</h2>
					<p className="hero-subtitle">
						Trusted by 5000+ tenants, owners &amp; agents across India
					</p>
				</div>

				{/* Scrolling background columns */}
				<div className="hero-grid" role="presentation">
					{allCols.map((col, i) => (
						<TestimonialsColumn
							key={i}
							items={col}
							duration={durations[i]}
							reverse={i % 2 === 1}
							delay={delays[i]}
						/>
					))}
				</div>

				<div className="hero-bottom-fade" aria-hidden="true" />
			</section>
		</>
	);
}
