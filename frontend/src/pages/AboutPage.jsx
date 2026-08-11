import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	UserCheck,
	Building2,
	Mail,
	ArrowLeft,
	Users,
	Phone,
	Linkedin,
	Sparkles,
	Star,
	Zap,
	Code2,
	BarChart2,
	Globe,
	Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageFAQSection from '@/components/home/PageFAQSection';

const ABOUT_FAQS = [
	{
		question: 'What is InstaMakaan and how does it work?',
		answer:
			'InstaMakaan is a direct rental platform connecting verified tenants with property owners in Noida, Greater Noida, and Ghaziabad. We handle everything from property listing to tenant KYC, making renting simple and transparent for both sides.',
	},
	{
		question: 'When was InstaMakaan founded and where is it based?',
		answer:
			'InstaMakaan was founded with a mission to make renting honest and stress-free for every Indian. We are a growing team of technology and real estate professionals headquartered at Amrapali Dream Valley, Greater Noida, Uttar Pradesh.',
	},
	{
		question: 'Which cities does InstaMakaan currently serve?',
		answer:
			'We currently operate in Noida, Greater Noida (including Greater Noida West, Techzone 4, Sector 1, and more), and Ghaziabad. We are continuously expanding to cover more areas across Delhi NCR.',
	},
	{
		question: 'How does InstaMakaan verify properties before listing?',
		answer:
			'Every property goes through a verification process where our team checks property details, photographs, and ownership documents before the listing goes live. We also do periodic re-verification to ensure listings stay accurate.',
	},
	{
		question: 'Is InstaMakaan only for tenants, or also for property owners?',
		answer:
			'InstaMakaan serves both tenants and property owners. Tenants can search, explore, and book verified flats. Property owners can list their properties for free and receive inquiries exclusively from KYC-verified, serious renters.',
	},
	{
		question: 'How is InstaMakaan different from other rental platforms?',
		answer:
			'Unlike traditional portals that just show listings, InstaMakaan offers end-to-end support — KYC-verified tenants, transparent service fees, and a dedicated team to assist with the entire rental process from inquiry to move-in. No hidden charges, no surprises.',
	},
	{
		question: 'How can I contact the InstaMakaan team?',
		answer:
			'You can reach us at support@instamakaan.com or call +91 9771034916. Our office is at Tower T2, Flat B809, Amrapali Dream Valley, Greater Noida 201310. Visit our Contact page for a full list of options.',
	},
];

/* ─────────────────────────── DATA ─────────────────────────── */
const techTeam = [
	{
		name: 'Lokendra Singh',
		role: 'Full Stack Developer',
		image: '/images/lokendra.webp',
		email: 'lokendrainstamakaan@gmail.com',
		linkedin: 'https://www.linkedin.com/in/lokendra-singh-nirban/',
		accent: '#14b8a6',
		grad: 'linear-gradient(135deg,#14b8a6,#0d9488)',
		skills: ['React', 'FastAPI', 'MongoDB'],
	},
	{
		name: 'Mohit Soni',
		role: 'Full Stack Developer',
		image: '/images/mohit.webp',
		email: 'mohitinstamakaan@gmail.com',
		linkedin: 'https://www.linkedin.com/in/mohit-soni-819223316',
		accent: '#6366f1',
		grad: 'linear-gradient(135deg,#6366f1,#4f46e5)',
		skills: ['Node.js', 'React', 'DevOps'],
	},
	{
		name: 'Dev Karan Singh',
		role: 'Analytics & AI',
		image: '/images/dev.webp',
		email: 'devinstamakaan@gmail.com',
		linkedin: 'https://www.linkedin.com/in/dev-karan-singh-bhadoria-3294a42a0',
		accent: '#f59e0b',
		grad: 'linear-gradient(135deg,#f59e0b,#d97706)',
		skills: ['Python', 'AI/ML', 'Analytics'],
	},
	{
		name: 'Abhishek Anand',
		role: 'Analytics & AI',
		image: '/images/abhishek.webp',
		email: 'abhishekinstamakaan@gmail.com',
		linkedin: 'https://www.linkedin.com/in/abhishek-anand-23757729a/',
		accent: '#14b8a6',
		grad: 'linear-gradient(135deg,#14b8a6,#0d9488)',
		skills: ['Data', 'SEO', 'Growth'],
	},
];

const ROLE_ICON = {
	'Full Stack Developer': Code2,
	'Analytics & AI': BarChart2,
};

const tabContent = {
	who: {
		icon: Users,
		tag: 'Our Identity',
		title: 'Built for NCR Renters & Owners.',
		desc: 'InstaMakaan is a direct rental platform for Noida, Greater Noida & Ghaziabad. No middlemen, no hidden fees — just real homes and real people.',
		image: '/images/who we are.png',
		stat: { value: 'NCR', label: 'Region Focused' },
	},
	what: {
		icon: Building2,
		tag: 'Our Mission',
		title: 'Renting Made Simple & Fast.',
		desc: 'Owners list their flats. Tenants find verified homes. No broker, no delay — just direct connections with transparent pricing.',
		image: '/images/what we do.png',
		stat: { value: '100%', label: 'Verified Listings' },
	},
	how: {
		icon: UserCheck,
		tag: 'Our Approach',
		title: 'Technology Meets Human Touch.',
		desc: 'AI-powered matching connects the right tenant to the right flat. Every tenant is KYC-verified. Owners get real-time inquiry tracking and dedicated support.',
		image: '/images/how we do it.png',
		stat: { value: 'KYC', label: 'Verified Tenants' },
	},
};

/* ──────────────── HOOKS ──────────────── */
function useInView(threshold = 0.15) {
	const ref = useRef(null);
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) setInView(true);
			},
			{ threshold },
		);
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);
	return [ref, inView];
}

/* ──────────────── STABLE PARTICLE DATA ──────────────── */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
	id: i,
	x: (i * 137.508) % 100,
	y: (i * 97.333) % 100,
	size: 1.5 + (i % 3),
	delay: (i * 0.38) % 5,
	dur: 6 + (i % 5),
	opacity: 0.1 + (i % 6) * 0.03,
}));

function ParticleField() {
	return (
		<div
			className="absolute inset-0 overflow-hidden pointer-events-none"
			aria-hidden="true"
		>
			{PARTICLES.map((p) => (
				<div
					key={p.id}
					className="im-particle"
					style={{
						left: `${p.x}%`,
						top: `${p.y}%`,
						width: p.size,
						height: p.size,
						opacity: p.opacity,
						animationDuration: `${p.dur}s`,
						animationDelay: `${p.delay}s`,
					}}
				/>
			))}
		</div>
	);
}

/* ──────────────── MEMBER CARD ──────────────── */
function MemberCard({ member, index }) {
	const [ref, inView] = useInView(0.08);
	return (
		<div
			ref={ref}
			className="im-member-card"
			style={{
				opacity: inView ? 1 : 0,
				transform: inView ? 'translateY(0)' : 'translateY(28px)',
				transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s cubic-bezier(.22,1,.36,1) ${index * 0.08}s`,
			}}
		>
			{/* top accent line */}
			<div style={{ height: '3px', background: member.grad, borderRadius: '1.25rem 1.25rem 0 0', margin: '-1px -1px 0' }} />

			<div className="im-mc-body">
				{/* photo */}
				<img
					src={member.image}
					alt={member.name}
					loading="lazy"
					decoding="async"
					className="im-mc-photo"
					style={{ borderColor: member.accent + '55' }}
				/>

				{/* name */}
				<h4 className="im-mc-name">{member.name}</h4>

				{/* role */}
				<p className="im-mc-role" style={{ color: member.accent }}>{member.role}</p>

				{/* divider */}
				<div className="im-mc-divider" />

				{/* social */}
				<div className="im-mc-links">
					<a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="im-mc-link" style={{ '--ac': member.accent }}>
						<Mail size={15} />
					</a>
					<a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="im-mc-link" style={{ '--ac': member.accent }}>
						<Linkedin size={15} />
					</a>
				</div>
			</div>
		</div>
	);
}

/* ──────────────── FOUNDER CARD ──────────────── */
function FounderCard({ src, name, title, email, linkedin, gradient, delay }) {
	const [ref, inView] = useInView(0.12);
	return (
		<div
			ref={ref}
			className="im-founder-card"
			style={{
				opacity: inView ? 1 : 0,
				transform: inView
					? 'translateY(0) scale(1)'
					: 'translateY(48px) scale(0.96)',
				transition: `all 0.8s cubic-bezier(.22,1,.36,1) ${delay}s`,
			}}
		>
			<div
				className="im-founder-glow"
				style={{ background: gradient }}
				aria-hidden="true"
			/>
			<div className="im-founder-body">
				<div className="im-founder-avatar" style={{ '--grad': gradient }}>
					<img
						src={src}
						alt={name}
						loading="lazy"
						decoding="async"
						width="128"
						height="128"
					/>
					<span className="im-founder-badge" aria-hidden="true">
						<Star size={11} fill="currentColor" />
					</span>
				</div>
				<h3 className="im-founder-name">{name}</h3>
				<p
					className="im-founder-title"
					style={{
						background: gradient,
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}
				>
					{title}
				</p>
				<p className="im-founder-desc">
					{title.includes('CEO')
						? 'Leading InstaMakaan with a mission to make renting simple, honest and stress-free for every Indian.'
						: 'Ensuring every owner and tenant gets a seamless, transparent rental experience from day one.'}
				</p>
				<div className="im-founder-links">
					<a
						href={`mailto:${email}`}
						className="im-icon-btn"
						aria-label={`Email ${name}`}
					>
						<Mail size={17} />
					</a>
					<a
						href={linkedin}
						target="_blank"
						rel="noopener noreferrer"
						className="im-icon-btn im-linkedin"
						aria-label={`${name} LinkedIn`}
					>
						<Linkedin size={17} />
					</a>
				</div>
			</div>
		</div>
	);
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const AboutPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('who');
	const [tabFading, setTabFading] = useState(false);
	const content = tabContent[activeTab];

	const scrollToTeam = () =>
		document
			.getElementById('team-section')
			?.scrollIntoView({ behavior: 'smooth' });

	const switchTab = (tab) => {
		if (tab === activeTab) return;
		setTabFading(true);
		setTimeout(() => {
			setActiveTab(tab);
			setTabFading(false);
		}, 220);
	};

	return (
		<Layout>
			<Helmet>
				<title>About InstaMakaan | Verified Rental Platform in Noida & Greater Noida</title>
				<meta name="description" content="Learn about InstaMakaan — a direct rental platform connecting property owners with verified tenants in Noida, Greater Noida, Noida Extension and Ghaziabad. Transparent pricing, genuine listings." />
				<link rel="canonical" href="https://instamakaan.com/about" />
				<meta property="og:title" content="About InstaMakaan | Verified Rental Platform in Noida & Greater Noida" />
				<meta property="og:description" content="Direct rental platform connecting property owners with verified tenants in Noida, Greater Noida and Ghaziabad. Transparent pricing, genuine listings." />
				<meta property="og:url" content="https://instamakaan.com/about" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="About InstaMakaan | Verified Rental Platform in Noida & Greater Noida" />
				<meta name="twitter:description" content="Direct rental platform connecting property owners with verified tenants in Noida, Greater Noida and Ghaziabad." />
				<meta name="twitter:image" content="https://instamakaan.com/images/orglogo.webp" />
			</Helmet>

			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

        /* ── Keyframes ── */
        @keyframes im-particle  { to { transform:translate(14px,-20px) scale(1.4); } }
        @keyframes im-orbGlow   { 0%,100%{opacity:.22;transform:scale(1)} 50%{opacity:.45;transform:scale(1.11)} }
        @keyframes im-fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes im-gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes im-tagFloat  { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-4px) rotate(1deg)} }
        @keyframes im-badgePop  { 0%{transform:scale(0) rotate(-30deg)} 70%{transform:scale(1.2) rotate(5deg)} 100%{transform:scale(1)} }
        @keyframes im-lineGrow  { from{transform:scaleX(0)} to{transform:scaleX(1)} }

        /* ── Shared ── */
        .im-container { max-width:1200px; margin:0 auto; padding:0 1.5rem; }

        /* ── Particle ── */
        .im-particle {
          position:absolute; border-radius:50%;
          animation: im-particle ease-in-out infinite alternate;
          background:#0d9488; opacity:.07 !important;
        }
        .dark .im-particle { background:#14b8a6; opacity:.15 !important; }

        /* ════════════════════════════════════════
           HERO
        ════════════════════════════════════════ */
        .im-hero {
          position:relative; overflow:hidden;
          min-height:88vh; display:flex; align-items:center;
          padding:8rem 0 4rem; margin-top:-3.5rem;
          background:linear-gradient(160deg,#f0fdfc 0%,#ecfdf5 40%,#fffbeb 100%);
          transition:background .35s;
        }
        .dark .im-hero { background:linear-gradient(160deg,#07101d 0%,#0a1a2e 40%,#071018 100%); }

        .im-hero-bg-img {
          position:absolute; inset:0; width:100%; height:100%;
          object-fit:cover; object-position:top;
          opacity:.05; filter:saturate(1.4);
          transition:opacity .35s;
        }
        .dark .im-hero-bg-img { opacity:.13; }

        .im-hero-orb {
          position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none;
          animation: im-orbGlow 6s ease-in-out infinite;
        }
        .im-hero-orb-1 {
          width:460px; height:460px; top:-80px; right:-50px;
          background:radial-gradient(circle,rgba(20,184,166,.14),transparent 70%);
        }
        .dark .im-hero-orb-1 { background:radial-gradient(circle,rgba(20,184,166,.28),transparent 70%); }
        .im-hero-orb-2 {
          width:360px; height:360px; bottom:-80px; left:-40px;
          animation-delay:3s;
          background:radial-gradient(circle,rgba(245,158,11,.12),transparent 70%);
        }
        .dark .im-hero-orb-2 { background:radial-gradient(circle,rgba(245,158,11,.22),transparent 70%); }

        .im-hero-content { position:relative; z-index:2; text-align:center; }

        .im-eyebrow {
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.38rem 1.2rem; border-radius:999px; margin-bottom:1.4rem; cursor:default;
          font-family:'Cabinet Grotesk',sans-serif; font-size:.8rem; font-weight:800;
          letter-spacing:.1em; text-transform:uppercase;
          background:rgba(20,184,166,.1); border:1px solid rgba(20,184,166,.28); color:#0d9488;
          animation: im-fadeUp .8s ease both .1s;
        }
        .dark .im-eyebrow { background:rgba(20,184,166,.15); border-color:rgba(20,184,166,.35); color:#14b8a6; }

        .im-hero-title {
          font-family:'Clash Display',sans-serif;
          font-size:clamp(3rem,9vw,6.8rem); font-weight:700; line-height:1.02;
          margin:0 0 1.3rem;
          color:#0f172a;
          animation: im-fadeUp .8s ease both .25s;
        }
        .dark .im-hero-title { color:#f8fafc; }
        .im-hero-title .teal   { color:#0d9488; }
        .im-hero-title .yellow { color:#eab308; }
        .dark .im-hero-title .teal   { color:#14b8a6; }
        .dark .im-hero-title .yellow { color:#eab308; }

        .im-hero-sub {
          font-family:'Cabinet Grotesk',sans-serif;
          font-size:clamp(.95rem,2.4vw,1.22rem); max-width:560px; margin:0 auto 2.4rem;
          color:#475569;
          animation: im-fadeUp .8s ease both .4s;
        }
        .dark .im-hero-sub { color:rgba(255,255,255,.6); }

        .im-hero-line {
          width:130px; height:3px; margin:0 auto;
          background:linear-gradient(90deg,#14b8a6,#f59e0b,#14b8a6);
          background-size:200% 100%; border-radius:999px;
          animation: im-gradShift 3s ease infinite;
        }

        .im-cta-row {
          display:flex; gap:1rem; justify-content:center;
          flex-wrap:nowrap;
          margin-top:2rem; animation: im-fadeUp .8s ease both .55s;
        }
        .im-btn-primary {
          padding:.72rem 2rem; border-radius:999px; border:none; cursor:pointer;
          font-family:'Cabinet Grotesk',sans-serif; font-weight:800; font-size:1rem; color:#fff;
          background:linear-gradient(135deg,#14b8a6,#0d9488);
          box-shadow:0 0 26px rgba(20,184,166,.32); transition:transform .2s,box-shadow .2s;
          white-space:nowrap;
        }
        .im-btn-primary:hover { transform:translateY(-2px); box-shadow:0 0 42px rgba(20,184,166,.52); }
        .im-btn-ghost {
          padding:.72rem 2rem; border-radius:999px; cursor:pointer;
          font-family:'Cabinet Grotesk',sans-serif; font-weight:800; font-size:1rem;
          background:rgba(15,23,42,.06); border:1.5px solid rgba(15,23,42,.18); color:#0f172a;
          transition:background .2s,transform .2s;
          white-space:nowrap;
        }
        .dark .im-btn-ghost { background:rgba(255,255,255,.07); border-color:rgba(255,255,255,.18); color:#f8fafc; }
        .im-btn-ghost:hover { transform:translateY(-2px); }
        :root:not(.dark) .im-btn-ghost:hover { background:rgba(15,23,42,.1); }
        .dark .im-btn-ghost:hover { background:rgba(255,255,255,.13); }

        /* ════════════════════════════════════════
           STATS BAR
        ════════════════════════════════════════ */
        .im-stats-bar {
          padding:1.8rem 0;
          background:#f8fafc; border-top:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0;
          transition:background .35s,border-color .35s;
        }
        .dark .im-stats-bar {
          background:linear-gradient(135deg,#0f1e30,#122333);
          border-color:rgba(20,184,166,.1);
        }
        .im-stats-inner { display:flex; justify-content:center; flex-wrap:wrap; }
        .im-stat-item {
          text-align:center; padding:.45rem 2.2rem;
          border-right:1px solid #e2e8f0;
        }
        .dark .im-stat-item { border-color:rgba(255,255,255,.07); }
        .im-stat-item:last-child { border-right:none; }
        .im-stat-val {
          font-family:'Clash Display',sans-serif; font-size:2.3rem; font-weight:700;
          background:linear-gradient(135deg,#14b8a6,#f59e0b);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .im-stat-lbl {
          font-family:'Cabinet Grotesk',sans-serif; font-size:.86rem; margin-top:.12rem;
          color:#64748b;
        }
        .dark .im-stat-lbl { color:rgba(255,255,255,.45); }

        /* ════════════════════════════════════════
           TABS SECTION
        ════════════════════════════════════════ */
        .im-tabs-section {
          padding:5.5rem 0; position:relative; overflow:hidden;
          background:#ffffff;
          transition:background .35s;
        }
        .dark .im-tabs-section { background:#07101d; }
        .im-tabs-section::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse at 50% 0%,rgba(20,184,166,.05) 0%,transparent 60%);
        }

        .im-tab-nav { display:flex; justify-content:center; gap:1rem; margin-bottom:3rem; flex-wrap:wrap; }

        .im-tab-btn {
          padding:.62rem 1.6rem; border-radius:999px; cursor:pointer; position:relative; overflow:hidden;
          font-family:'Cabinet Grotesk',sans-serif; font-weight:700; font-size:.92rem;
          background:#f1f5f9; border:1.5px solid #e2e8f0; color:#475569;
          transition:all .3s;
        }
        .dark .im-tab-btn { background:rgba(255,255,255,.04); border-color:rgba(255,255,255,.1); color:rgba(255,255,255,.55); }

        .im-tab-btn::before {
          content:''; position:absolute; inset:0; border-radius:999px;
          background:linear-gradient(135deg,#14b8a6,#0d9488); opacity:0; transition:opacity .3s;
        }
        .im-tab-btn.active { border-color:#14b8a6; color:#fff; box-shadow:0 0 20px rgba(20,184,166,.28); }
        .im-tab-btn.active::before { opacity:1; }
        .im-tab-btn span { position:relative; z-index:1; }
        :root:not(.dark) .im-tab-btn:hover:not(.active) { border-color:#14b8a6; color:#0d9488; background:#f0fdfc; }
        .dark .im-tab-btn:hover:not(.active) { border-color:rgba(20,184,166,.35); color:rgba(255,255,255,.8); }

        .im-tab-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:stretch;
          max-width:960px; margin:0 auto; padding:0 1.5rem;
          transition:opacity .22s, transform .22s;
        }
        .im-tab-grid.fading { opacity:0; transform:translateY(8px); }
        @media(max-width:768px) { .im-tab-grid { grid-template-columns:1fr; gap:2rem; } }

        .im-video-frame { position:relative; width:100%; margin:0 auto; }
        .im-video-glow {
          position:absolute; inset:-22px; border-radius:2.5rem; pointer-events:none;
          animation: im-orbGlow 4s ease-in-out infinite;
          background:radial-gradient(circle at center,rgba(20,184,166,.12),transparent 70%);
        }
        .dark .im-video-glow { background:radial-gradient(circle at center,rgba(20,184,166,.26),transparent 70%); }
        .im-video-frame video {
          position:relative; z-index:2; width:100%; border-radius:1.5rem;
          box-shadow:0 16px 44px rgba(15,23,42,.1), 0 0 0 1px rgba(20,184,166,.15);
        }
        .dark .im-video-frame video { box-shadow:0 24px 58px rgba(0,0,0,.5), 0 0 0 1px rgba(20,184,166,.2); }

        .im-tab-box {
          position:relative; border-radius:1.5rem; padding:1.6rem; overflow:hidden;
          background:linear-gradient(135deg,#f0fdfc,#fffbeb);
          border:1px solid rgba(20,184,166,.18);
          box-shadow:0 8px 34px rgba(15,23,42,.07);
          display:flex; flex-direction:column; justify-content:center;
        }
        .dark .im-tab-box {
          background:linear-gradient(135deg,rgba(15,30,48,.85),rgba(10,20,34,.95));
          border-color:rgba(20,184,166,.15);
          box-shadow:0 20px 50px rgba(0,0,0,.4);
        }
        .im-tab-box::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(20,184,166,.5),transparent);
        }

        .im-content-tag {
          display:inline-flex; align-items:center; gap:.38rem;
          padding:.3rem .88rem; border-radius:999px; margin-bottom:1rem;
          font-family:'Cabinet Grotesk',sans-serif; font-size:.76rem; font-weight:800;
          letter-spacing:.08em; text-transform:uppercase;
          animation: im-tagFloat 4s ease-in-out infinite;
          background:rgba(20,184,166,.1); border:1px solid rgba(20,184,166,.22); color:#0d9488;
        }
        .dark .im-content-tag { background:rgba(20,184,166,.12); border-color:rgba(20,184,166,.28); color:#14b8a6; }

        .im-content-icon { width:2.8rem; height:2.8rem; margin-bottom:.7rem; color:#14b8a6; }

        .im-content-title {
          font-family:'Clash Display',sans-serif; font-size:clamp(1.25rem,3vw,1.8rem);
          font-weight:700; line-height:1.2; margin-bottom:.85rem;
          color:#0f172a;
        }
        .dark .im-content-title { color:#f8fafc; }

        .im-content-desc {
          font-family:'Cabinet Grotesk',sans-serif; font-size:.98rem; line-height:1.75;
          color:#475569;
        }
        .dark .im-content-desc { color:rgba(255,255,255,.6); }

        .im-content-stat {
          display:inline-flex; flex-direction:column; margin-top:1.3rem;
          padding:.7rem 1.3rem; border-radius:.7rem;
          background:rgba(20,184,166,.07); border:1px solid rgba(20,184,166,.18);
        }
        .dark .im-content-stat { background:rgba(20,184,166,.08); border-color:rgba(20,184,166,.2); }

        .im-stat-num {
          font-family:'Clash Display',sans-serif; font-size:1.85rem; font-weight:700;
          background:linear-gradient(135deg,#14b8a6,#f59e0b);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .im-stat-sublbl {
          font-family:'Cabinet Grotesk',sans-serif; font-size:.78rem;
          color:#94a3b8;
        }
        .dark .im-stat-sublbl { color:rgba(255,255,255,.45); }

        /* ════════════════════════════════════════
           TEAM SECTION
        ════════════════════════════════════════ */
        .im-team-section {
          padding:7rem 0; position:relative; overflow:hidden;
          background:linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%);
          transition:background .35s;
        }
        .dark .im-team-section { background:linear-gradient(180deg,#07101d 0%,#0a1520 100%); }
        .im-team-section::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse at 50% 100%,rgba(245,158,11,.04) 0%,transparent 60%);
        }

        .im-section-eyebrow {
          display:inline-flex; align-items:center; gap:.38rem;
          padding:.3rem .95rem; border-radius:999px; margin-bottom:.85rem; cursor:default;
          font-family:'Cabinet Grotesk',sans-serif; font-size:.76rem; font-weight:800;
          letter-spacing:.09em; text-transform:uppercase;
          background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.26); color:#b45309;
        }
        .dark .im-section-eyebrow { background:rgba(245,158,11,.12); border-color:rgba(245,158,11,.3); color:#f59e0b; }

        /* ── Team hero 3-col layout ── */
        .im-team-hero-row {
          display:grid;
          grid-template-columns:1fr auto 1fr;
          gap:2.5rem;
          align-items:center;
          max-width:1100px; margin:0 auto 1.5rem;
          padding:0 1.5rem;
        }
        .im-team-hero-text {
          display:flex; flex-direction:column; align-items:flex-start;
        }
        .im-team-hero-title {
          font-family:'Clash Display',sans-serif;
          font-size:clamp(2rem,4.5vw,3rem); font-weight:800; line-height:1.15;
          color:#0f172a; margin:.55rem 0 0;
        }
        .dark .im-team-hero-title { color:#f8fafc; }
        .im-team-hero-accent {
          background:linear-gradient(135deg,#14b8a6,#0d9488);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .im-team-hero-desc {
          font-family:'Cabinet Grotesk',sans-serif; font-size:.98rem; line-height:1.75;
          color:#475569; max-width:360px;
        }
        .dark .im-team-hero-desc { color:rgba(255,255,255,.55); }
        .im-team-hero-card { display:flex; justify-content:center; }
        .im-team-hero-illus {
          display:flex; align-items:center; justify-content:flex-end;
          padding-right:1rem;
        }
        .im-building-svg { width:210px; height:auto; opacity:0.55; }

        @media(max-width:900px) {
          .im-team-hero-row {
            grid-template-columns:1fr;
            text-align:center;
          }
          .im-team-hero-text { align-items:center; order:1; }
          .im-team-hero-card { order:2; }
          .im-team-hero-illus { display:none; }
          .im-team-hero-desc { max-width:100%; }
          .im-divider { margin-left:auto !important; }
        }

        .im-section-title {
          font-family:'Clash Display',sans-serif;
          font-size:clamp(1.9rem,5vw,2.95rem); font-weight:700; line-height:1.15;
          color:#0f172a;
        }
        .dark .im-section-title { color:#f8fafc; }

        .im-section-sub {
          font-family:'Cabinet Grotesk',sans-serif; font-size:1.02rem; margin-top:.4rem;
          color:#64748b;
        }
        .dark .im-section-sub { color:rgba(255,255,255,.5); }

        .im-divider {
          width:54px; height:3px; margin:1.3rem auto 0; border-radius:999px;
          background:linear-gradient(90deg,#14b8a6,#f59e0b);
          animation: im-lineGrow 1s ease both; transform-origin:left;
        }

        /* WITH this */
        .im-founders-grid {
          display:flex; justify-content:center; gap:2rem; flex-wrap:wrap;
          max-width:860px; margin:3.5rem auto; padding:0 1.5rem;
        }
        .im-founders-grid > * { flex:0 1 380px; max-width:420px; }
        .im-founder-card {
          position:relative; border-radius:2rem; overflow:hidden;
          background:#ffffff; border:1px solid #e2e8f0;
          box-shadow:0 8px 36px rgba(15,23,42,.08);
          transition:transform .4s ease, box-shadow .4s ease;
        }
        .dark .im-founder-card {
          background:linear-gradient(135deg,rgba(15,30,48,.92),rgba(10,20,34,.98));
          border-color:rgba(255,255,255,.07);
          box-shadow:0 25px 60px rgba(0,0,0,.45);
        }
        .im-founder-card:hover {
          transform:translateY(-6px);
          box-shadow:0 22px 55px rgba(15,23,42,.13), 0 0 28px rgba(20,184,166,.1);
        }
        .dark .im-founder-card:hover {
          box-shadow:0 30px 70px rgba(0,0,0,.6), 0 0 32px rgba(20,184,166,.14);
        }

        .im-founder-glow {
          position:absolute; top:-55px; left:50%; transform:translateX(-50%);
          width:170px; height:170px; border-radius:50%; filter:blur(50px); pointer-events:none;
          opacity:.18;
        }
        .dark .im-founder-glow { opacity:.26; }

        .im-founder-body { position:relative; z-index:1; padding:2.4rem; text-align:center; }

        .im-founder-avatar {
          position:relative; width:112px; height:112px; margin:0 auto 1.1rem;
        }
        .im-founder-avatar img {
          width:100%; height:100%; border-radius:50%; object-fit:cover;
          border:3px solid transparent;
          background:linear-gradient(#fff,#fff) padding-box, var(--grad) border-box;
          box-shadow:0 0 20px rgba(20,184,166,.2);
        }
        .dark .im-founder-avatar img {
          background:linear-gradient(#0f1e30,#0f1e30) padding-box, var(--grad) border-box;
        }
        .im-founder-badge {
          position:absolute; bottom:4px; right:4px; width:26px; height:26px;
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff;
          border:2px solid #fff;
          animation: im-badgePop .6s cubic-bezier(.34,1.56,.64,1) both .5s;
        }
        .dark .im-founder-badge { border-color:#07101d; }

        .im-founder-name {
          font-family:'Clash Display',sans-serif; font-size:1.42rem; font-weight:700;
          margin-bottom:.22rem;
          color:#0f172a;
        }
        .dark .im-founder-name { color:#f8fafc; }

        .im-founder-title {
          font-family:'Cabinet Grotesk',sans-serif; font-size:.87rem; font-weight:800;
          letter-spacing:.05em; margin-bottom:.65rem;
        }

        .im-founder-desc {
          font-family:'Cabinet Grotesk',sans-serif; font-size:.88rem; line-height:1.6; margin-bottom:1.3rem;
          color:#64748b;
        }
        .dark .im-founder-desc { color:rgba(255,255,255,.5); }

        .im-founder-links { display:flex; justify-content:center; gap:.7rem; }

        .im-icon-btn {
          width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center;
          background:#f1f5f9; border:1px solid #e2e8f0; color:#64748b;
          transition:all .25s;
        }
        .dark .im-icon-btn { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.1); color:rgba(255,255,255,.5); }
        .im-icon-btn:hover { background:rgba(20,184,166,.14); border-color:#14b8a6; color:#0d9488; transform:scale(1.1); }
        .dark .im-icon-btn:hover { color:#14b8a6; }
        .im-linkedin:hover { background:rgba(10,102,194,.1) !important; border-color:#0a66c2 !important; color:#0a66c2 !important; }

        /* ── Tech label ── */
        .im-tech-label {
          font-family:'Clash Display',sans-serif; font-size:clamp(1.15rem,2.5vw,1.65rem);
          font-weight:700; text-align:center; margin:2.8rem 0 1.7rem;
          display:flex; align-items:center; justify-content:center; gap:.75rem;
          color:#0f172a;
        }
        .dark .im-tech-label { color:#f8fafc; }
        .im-tech-label::before, .im-tech-label::after {
          content:''; flex:1; max-width:86px; height:1px;
        }
        .im-tech-label::before { background:linear-gradient(90deg,transparent,#cbd5e1); }
        .im-tech-label::after  { background:linear-gradient(270deg,transparent,#cbd5e1); }
        .dark .im-tech-label::before { background:linear-gradient(90deg,transparent,rgba(255,255,255,.12)); }
        .dark .im-tech-label::after  { background:linear-gradient(270deg,transparent,rgba(255,255,255,.12)); }

        /* ── Tech grid ── */
        .im-tech-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem;
          max-width:960px; margin:0 auto; padding:0 1.5rem;
        }
        @media(max-width:860px) { .im-tech-grid { grid-template-columns:repeat(2,1fr); gap:1rem; } }

        /* ── Member card ── */
        .im-member-card {
          border-radius:1.25rem; overflow:hidden; cursor:default;
          background:#fff; border:1px solid #eaeff4;
          box-shadow:0 2px 12px rgba(15,23,42,.06);
          transition:transform .3s ease, box-shadow .3s ease;
        }
        .dark .im-member-card {
          background:#0f1e30;
          border-color:rgba(255,255,255,.07);
          box-shadow:none;
        }
        .im-member-card:hover {
          transform:translateY(-6px);
          box-shadow:0 16px 40px rgba(15,23,42,.1);
        }
        .dark .im-member-card:hover {
          box-shadow:0 16px 40px rgba(0,0,0,.4);
        }

        .im-mc-body {
          padding:1.6rem 1.2rem 1.4rem;
          display:flex; flex-direction:column; align-items:center; text-align:center;
        }

        .im-mc-photo {
          width:80px; height:80px; border-radius:50%;
          object-fit:cover; object-position:top;
          border:3px solid; margin-bottom:1rem;
          box-shadow:0 4px 14px rgba(0,0,0,.1);
        }

        .im-mc-name {
          font-family:'Clash Display',sans-serif;
          font-size:1rem; font-weight:700; color:#0f172a; margin-bottom:.25rem;
        }
        .dark .im-mc-name { color:#f1f5f9; }

        .im-mc-role {
          font-family:'Cabinet Grotesk',sans-serif;
          font-size:.78rem; font-weight:700; letter-spacing:.02em; margin-bottom:.85rem;
        }

        .im-mc-skills {
          display:flex; flex-wrap:wrap; justify-content:center; gap:.3rem; margin-bottom:.9rem;
        }
        .im-mc-skill {
          font-size:.65rem; font-weight:600;
          padding:.18rem .52rem; border-radius:5px;
          background:#f1f5f9; color:#64748b;
        }
        .dark .im-mc-skill { background:rgba(255,255,255,.07); color:rgba(255,255,255,.45); }

        .im-mc-divider {
          width:100%; height:1px; background:#f1f5f9; margin-bottom:.9rem;
        }
        .dark .im-mc-divider { background:rgba(255,255,255,.07); }

        .im-mc-links { display:flex; gap:.55rem; }
        .im-mc-link {
          width:32px; height:32px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:#f8fafc; border:1px solid #e8edf2; color:#94a3b8;
          transition:all .2s;
          text-decoration:none;
        }
        .dark .im-mc-link { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.1); color:rgba(255,255,255,.4); }
        .im-mc-link:hover {
          background:color-mix(in srgb,var(--ac,#14b8a6) 12%,transparent);
          border-color:var(--ac,#14b8a6);
          color:var(--ac,#14b8a6);
          transform:scale(1.1);
        }

        /* ════════════════════════════════════════
           MOBILE BOTTOM NAV
        ════════════════════════════════════════ */
        .im-bottom-nav {
          position:fixed; bottom:0; left:0; right:0; z-index:50;
          display:flex; justify-content:space-around; align-items:center;
          padding:.5rem 0 calc(.5rem + env(safe-area-inset-bottom));
          background:rgba(255,255,255,.93); backdrop-filter:blur(14px);
          border-top:1px solid #e2e8f0;
        }
        .dark .im-bottom-nav { background:rgba(7,16,29,.93); border-color:rgba(255,255,255,.08); }
        @media(min-width:768px) { .im-bottom-nav { display:none; } }

        .im-nav-btn {
          display:flex; flex-direction:column; align-items:center; gap:.15rem;
          font-family:'Cabinet Grotesk',sans-serif; font-size:.61rem; font-weight:700;
          cursor:pointer; background:none; border:none; padding:.12rem .7rem;
          color:#94a3b8;
          transition:color .2s;
        }
        .dark .im-nav-btn { color:rgba(255,255,255,.4); }
        .im-nav-btn.accent { color:#0d9488; }
        .dark .im-nav-btn.accent { color:#14b8a6; }
        .im-nav-btn:hover { color:#0d9488; }
        .dark .im-nav-btn:hover { color:rgba(255,255,255,.8); }
        .im-nav-btn a { color:inherit; display:flex; flex-direction:column; align-items:center; gap:.15rem; text-decoration:none; }

        /* ════════════════════════════════════════
           MOBILE RESPONSIVE OVERRIDES
        ════════════════════════════════════════ */

        /* ── Hero ── */
        @media (max-width: 767px) {
          .im-hero {
            min-height: unset;
            padding: 5.5rem 1rem 3.5rem;
            align-items: flex-start;
          }
          .im-hero-title {
            font-size: clamp(2.4rem, 10vw, 3.2rem);
            margin-bottom: 0.75rem;
          }
          .im-hero-sub {
            font-size: 0.9rem;
            margin-bottom: 1.4rem;
          }
          .im-eyebrow {
            font-size: 0.68rem;
            padding: 0.3rem 0.85rem;
            letter-spacing: .07em;
            margin-bottom: 1rem;
          }
          .im-hero-line {
            width: 90px;
          }
        }

        /* ── CTA buttons always side-by-side ── */
        @media (max-width: 767px) {
          .im-cta-row {
            gap: 0.55rem;
            margin-top: 1.4rem;
          }
          .im-btn-primary,
          .im-btn-ghost {
            padding: 0.62rem 1.1rem;
            font-size: 0.84rem;
          }
        }

        /* ── Stats bar — 2×2 grid on small phones ── */
        @media (max-width: 540px) {
          .im-stats-bar { padding: 1rem 0; }
          .im-stats-inner {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .im-stat-item {
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
            padding: 0.85rem 0.5rem;
          }
          .dark .im-stat-item { border-bottom-color: rgba(255,255,255,.07); }
          .im-stat-item:nth-child(3),
          .im-stat-item:nth-child(4) { border-bottom: none; }
          .im-stat-item:nth-child(odd) { border-right: 1px solid #e2e8f0; }
          .dark .im-stat-item:nth-child(odd) { border-right-color: rgba(255,255,255,.07); }
          .im-stat-val { font-size: 1.7rem; }
          .im-stat-lbl { font-size: 0.76rem; }
        }

        /* ── Tabs section ── */
        @media (max-width: 767px) {
          .im-tab-nav {
            gap: 0.45rem;
            margin-bottom: 1.6rem;
            padding: 0 1rem;
            flex-wrap: nowrap;
            justify-content: center;
          }
          .im-tab-nav::-webkit-scrollbar { display: none; }
          .im-tab-btn {
            padding: 0.48rem 0.95rem;
            font-size: 0.8rem;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .im-tab-box { padding: 1.3rem 1rem; }
          .im-content-title { font-size: 1.1rem; }
          .im-content-desc { font-size: 0.88rem; line-height: 1.65; }
          .im-content-icon { width: 1.8rem; height: 1.8rem; margin-bottom: .5rem; }
          .im-content-stat { margin-top: 1rem; padding: .55rem 1rem; }
          .im-stat-num { font-size: 1.5rem; }
        }

        /* ── Team section ── */
        @media (max-width: 767px) {
          .im-team-section { padding: 3.5rem 0 6rem; }
          .im-section-title { font-size: clamp(1.4rem, 5.5vw, 1.9rem); }
          .im-section-sub { font-size: 0.88rem; }
          .im-founders-grid {
            grid-template-columns: 1fr;
            gap: 1.1rem;
            padding: 0 1rem;
            margin: 1.8rem auto;
          }
          .im-founder-body { padding: 1.5rem 1rem; }
          .im-founder-avatar { width: 90px; height: 90px; }
          .im-founder-name { font-size: 1.15rem; }
          .im-founder-desc { font-size: 0.82rem; }
          .im-tech-label { margin: 2rem 0 1.2rem; font-size: 1rem; }
          .im-tech-grid { gap: .75rem; padding: 0 1rem; }
          .im-mc-body { padding: 1.2rem .9rem 1.1rem; }
          .im-mc-photo { width: 64px; height: 64px; margin-bottom: .75rem; }
          .im-mc-name { font-size: .85rem; }
          .im-mc-role { font-size: .7rem; margin-bottom: .65rem; }
          .im-mc-skills { gap: .22rem; margin-bottom: .7rem; }
          .im-mc-skill { font-size: .58rem; padding: .14rem .42rem; }
          .im-mc-divider { margin-bottom: .7rem; }
          .im-mc-link { width: 28px; height: 28px; }
        }
      `}</style>

			{/* ══════════════════ HERO ══════════════════ */}
			<section className="im-hero">
				<img
					src="/images/about-hero.webp"
					alt=""
					className="im-hero-bg-img"
					aria-hidden="true"
				/>
				<div className="im-hero-orb im-hero-orb-1" aria-hidden="true" />
				<div className="im-hero-orb im-hero-orb-2" aria-hidden="true" />
				<ParticleField />

				<div className="im-container im-hero-content">
					<h1 className="sr-only">
						About InstaMakaan — Find Verified Tenants & Rent Flats in Noida &
						Greater Noida
					</h1>

					<div className="im-eyebrow">
						<Sparkles size={13} />
						India's Trusted Rental Platform
					</div>

					<h1 className="im-hero-title" aria-hidden="true">
						About <span className="teal">Insta</span>
						<span className="yellow">Makaan</span>
					</h1>

					<p className="im-hero-sub">
						Connecting property owners with verified tenants — no brokers, no
						delays, just honest and simple renting.
					</p>

					<div className="im-hero-line" />

					<div className="im-cta-row">
						<button className="im-btn-primary" onClick={scrollToTeam}>
							Meet Our Team
						</button>
						<button
							className="im-btn-ghost"
							onClick={() => navigate('/contact')}
						>
							Get in Touch
						</button>
					</div>
				</div>
			</section>

			{/* ══════════════════ STATS BAR ══════════════════ */}
			<div className="im-stats-bar">
				<div className="im-container">
					<div className="im-stats-inner">
						{[
							{ v: '5000+', l: 'Happy Tenants' },
							{ v: '1200+', l: 'Properties Listed' },
							{ v: '99%', l: 'Satisfaction Rate' },
							{ v: '4', l: 'Cities Covered' },
						].map((s, i) => (
							<div key={i} className="im-stat-item">
								<div className="im-stat-val">{s.v}</div>
								<div className="im-stat-lbl">{s.l}</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ══════════════════ TABS ══════════════════ */}
			<section className="im-tabs-section">
				<div className="im-container">
					<div className="im-tab-nav">
						{[
							['who', 'Who We Are'],
							['what', 'What We Do'],
							['how', 'How We Do It'],
						].map(([key, label]) => (
							<button
								key={key}
								className={`im-tab-btn${activeTab === key ? ' active' : ''}`}
								onClick={() => switchTab(key)}
							>
								<span>{label}</span>
							</button>
						))}
					</div>

					<div className={`im-tab-grid${tabFading ? ' fading' : ''}`}>
						{/* Left — image only, no frame/glow */}
						<img
							key={activeTab}
							src={content.image}
							alt={content.title}
							className="w-full"
						/>

						{/* Right — plain text, no box */}
						<div className="flex flex-col justify-center">
							<p className="text-[11px] font-bold tracking-[0.25em] uppercase text-teal-600 dark:text-teal-400 mb-3">{content.tag}</p>
							<h2 className="im-content-title">{content.title}</h2>
							<p className="im-content-desc">{content.desc}</p>
						</div>
					</div>
				</div>
			</section>

			{/* ══════════════════ TEAM ══════════════════ */}
			<section id="team-section" className="im-team-section">
				<ParticleField />
				<div className="im-container" style={{ position: 'relative', zIndex: 1 }}>

					{/* 3-col hero row */}
					<div className="im-team-hero-row">

						{/* LEFT — text */}
						<div className="im-team-hero-text">
							<div className="im-section-eyebrow">
								<Star size={11} fill="currentColor" />
								The Visionaries
							</div>
							<h2 className="im-team-hero-title">
								The People Behind<br />
								<span className="im-team-hero-accent">InstaMakaan</span>
							</h2>
							<div className="im-divider" style={{ margin: '1.2rem 0', marginLeft: 0 }} />
							<p className="im-team-hero-desc">
								A team of dreamers, doers, and problem solvers working together to make renting simple, honest, and stress-free for every Indian.
							</p>
						</div>

						{/* CENTER — founder card */}
						<div className="im-team-hero-card">
							<FounderCard
								src="/images/shubham.jpg"
								name="Shubham Anand"
								title="Founder & CEO"
								email="Shubham@instamakaan.com"
								linkedin="https://linkedin.com"
								gradient="linear-gradient(135deg,#14b8a6,#0d9488)"
								delay={0.1}
							/>
						</div>

						{/* RIGHT — building illustration */}
						<div className="im-team-hero-illus" aria-hidden="true">
							<svg viewBox="0 0 280 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="im-building-svg">
								<defs>
									<linearGradient id="bldMain" x1="0" y1="0" x2="0.2" y2="1">
										<stop offset="0%" stopColor="#e0fdf4"/>
										<stop offset="100%" stopColor="#f0f9ff"/>
									</linearGradient>
									<linearGradient id="bldBack" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#e0f2fe"/>
										<stop offset="100%" stopColor="#f0fdfa"/>
									</linearGradient>
									<linearGradient id="winTeal" x1="0" y1="0" x2="1" y2="1">
										<stop offset="0%" stopColor="#14b8a6" stopOpacity="0.75"/>
										<stop offset="100%" stopColor="#06b6d4" stopOpacity="0.45"/>
									</linearGradient>
									<linearGradient id="pinFill" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#14b8a6"/>
										<stop offset="100%" stopColor="#0d9488"/>
									</linearGradient>
									<filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
										<feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.08"/>
									</filter>
									<filter id="pinGlow" x="-40%" y="-40%" width="180%" height="180%">
										<feGaussianBlur stdDeviation="4" result="blur"/>
										<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
									</filter>
								</defs>

								{/* Soft bg circle */}
								<circle cx="140" cy="210" r="118" fill="#f0fdfa"/>
								<circle cx="140" cy="210" r="80" fill="#e0fdf4" opacity="0.5"/>

								{/* Back building (right) */}
								<rect x="168" y="138" width="72" height="172" rx="5" fill="url(#bldBack)" stroke="#b3e5fc" strokeWidth="1.2"/>
								<rect x="178" y="153" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.55"/>
								<rect x="198" y="153" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.4"/>
								<rect x="218" y="153" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.6"/>
								<rect x="178" y="174" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.35"/>
								<rect x="198" y="174" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.55"/>
								<rect x="218" y="174" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.4"/>
								<rect x="178" y="195" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.5"/>
								<rect x="198" y="195" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.4"/>
								<rect x="218" y="195" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.3"/>
								<rect x="178" y="216" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.45"/>
								<rect x="198" y="216" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.55"/>
								<rect x="218" y="216" width="14" height="11" rx="2" fill="#7dd3fc" opacity="0.35"/>
								<rect x="192" y="278" width="28" height="32" rx="3" fill="#7dd3fc" opacity="0.35"/>

								{/* Main building */}
								<rect x="48" y="88" width="128" height="222" rx="7" fill="url(#bldMain)" stroke="#a7f3d0" strokeWidth="1.5"/>

								{/* Horizontal floor dividers */}
								<line x1="48" y1="130" x2="176" y2="130" stroke="#d1fae5" strokeWidth="1"/>
								<line x1="48" y1="172" x2="176" y2="172" stroke="#d1fae5" strokeWidth="1"/>
								<line x1="48" y1="214" x2="176" y2="214" stroke="#d1fae5" strokeWidth="1"/>
								<line x1="48" y1="256" x2="176" y2="256" stroke="#d1fae5" strokeWidth="1"/>

								{/* Windows — 3 cols × 4 rows */}
								{/* Row 1 */}
								<rect x="64" y="98" width="28" height="22" rx="3" fill="url(#winTeal)"/>
								<line x1="66" y1="100" x2="74" y2="108" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
								<rect x="102" y="98" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.65"/>
								<line x1="104" y1="100" x2="112" y2="108" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
								<rect x="140" y="98" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.85"/>
								<line x1="142" y1="100" x2="150" y2="108" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
								{/* Row 2 */}
								<rect x="64" y="140" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.5"/>
								<rect x="102" y="140" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.75"/>
								<line x1="104" y1="142" x2="112" y2="150" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
								<rect x="140" y="140" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.45"/>
								{/* Row 3 */}
								<rect x="64" y="182" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.7"/>
								<line x1="66" y1="184" x2="74" y2="192" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
								<rect x="102" y="182" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.4"/>
								<rect x="140" y="182" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.65"/>
								<line x1="142" y1="184" x2="150" y2="192" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
								{/* Row 4 */}
								<rect x="64" y="224" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.45"/>
								<rect x="102" y="224" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.6"/>
								<line x1="104" y1="226" x2="112" y2="234" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
								<rect x="140" y="224" width="28" height="22" rx="3" fill="url(#winTeal)" opacity="0.5"/>

								{/* Door */}
								<rect x="94" y="268" width="36" height="42" rx="4" fill="#14b8a6" opacity="0.4"/>
								<line x1="112" y1="268" x2="112" y2="310" stroke="#0d9488" strokeWidth="1" opacity="0.4"/>
								<circle cx="124" cy="289" r="2.5" fill="#0d9488" opacity="0.6"/>

								{/* Ground shadow */}
								<ellipse cx="112" cy="314" rx="70" ry="6" fill="#14b8a6" opacity="0.09"/>

								{/* Location pin */}
								<path d="M112 12C96 12 84 24 84 40C84 60 112 84 112 84C112 84 140 60 140 40C140 24 128 12 112 12Z" fill="url(#pinFill)" filter="url(#pinGlow)"/>
								<circle cx="112" cy="40" r="12" fill="white"/>
								<circle cx="112" cy="40" r="6" fill="#14b8a6"/>

								{/* Floating verified badge */}
								<rect x="178" y="96" width="86" height="46" rx="12" fill="white" filter="url(#cardShadow)" stroke="#e0fdf4" strokeWidth="1"/>
								<circle cx="196" cy="119" r="11" fill="#e0fdf4"/>
								{/* check mark */}
								<path d="M190 119 L195 124 L202 114" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
								<rect x="212" y="112" width="40" height="5" rx="2.5" fill="#e0fdf4"/>
								<rect x="212" y="122" width="28" height="4" rx="2" fill="#e0fdf4"/>

								{/* Floating stars badge */}
								<rect x="8" y="200" width="58" height="40" rx="10" fill="white" filter="url(#cardShadow)" stroke="#fef9c3" strokeWidth="1"/>
								{/* 3 stars */}
								<path d="M22 218 L24 213 L26 218 L31 218 L27 221 L28 226 L24 223 L20 226 L21 221 L17 218Z" fill="#fbbf24"/>
								<path d="M34 218 L36 213 L38 218 L43 218 L39 221 L40 226 L36 223 L32 226 L33 221 L29 218Z" fill="#fbbf24"/>
								<path d="M46 218 L48 213 L50 218 L55 218 L51 221 L52 226 L48 223 L44 226 L45 221 L41 218Z" fill="#fbbf24"/>

								{/* Decorative dots */}
								<circle cx="32" cy="140" r="5" fill="#14b8a6" opacity="0.2"/>
								<circle cx="22" cy="158" r="3.5" fill="#14b8a6" opacity="0.15"/>
								<circle cx="252" cy="248" r="6" fill="#f59e0b" opacity="0.25"/>
								<circle cx="264" cy="232" r="4" fill="#f59e0b" opacity="0.18"/>
							</svg>
						</div>
					</div>

					{/* Tech label + grid */}
					<div className="im-tech-label">
						<Zap size={17} color="#14b8a6" />
						Our Tech Powerhouse
					</div>
					<div className="im-tech-grid">
						{techTeam.map((m, i) => (
							<MemberCard key={m.name} member={m} index={i} />
						))}
					</div>
				</div>
			</section>

			<PageFAQSection faqs={ABOUT_FAQS} title="About InstaMakaan — FAQs" />

			{/* ══════════════════ MOBILE BOTTOM NAV ══════════════════ */}
			<nav className="im-bottom-nav" aria-label="Page navigation">
				<button className="im-nav-btn" onClick={() => navigate(-1)}>
					<ArrowLeft size={19} />
					Back
				</button>
				<button className="im-nav-btn accent" onClick={scrollToTeam}>
					<Users size={19} />
					Team
				</button>
				<button className="im-nav-btn" onClick={() => navigate('/contact')}>
					<Phone size={19} />
					Contact
				</button>
				<div className="im-nav-btn">
					<a
						href="https://linkedin.com/company/instamakaan"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Linkedin size={19} />
						LinkedIn
					</a>
				</div>
			</nav>
		</Layout>
	);
};

export default AboutPage;