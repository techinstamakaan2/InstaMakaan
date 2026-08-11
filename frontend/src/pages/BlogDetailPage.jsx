import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
	ArrowLeft,
	Clock,
	ChevronRight,
	Home,
	Phone,
	ChevronDown,
	List,
	Share2,
	Facebook,
	Twitter,
	MessageCircle,
	Send,
	User,
	Eye,
	BookOpen,
	TrendingUp,
	CheckCircle2,
	ArrowUp,
	AlertCircle,
	RefreshCw,
	ChevronLeft,
	MapPin,
	Banknote,
	Building2,
	Zap,
} from 'lucide-react';
import { getCategoryStyle } from './BlogPage';
import api from '@/lib/api';

/* ─────────────────────────────────────────────
   SEO HEAD  — replaces react-helmet-async
   Directly mutates document.head so there are
   NO conditional-child issues that broke Helmet.
───────────────────────────────────────────── */
const useSEO = ({ title, description, keywords, author, canonical, og, twitter, schemas }) => {
	useEffect(() => {
		if (!title) return;

		/* ── helpers ── */
		const setMeta = (selector, attr, value) => {
			if (!value) return;
			let el = document.querySelector(selector);
			if (!el) {
				el = document.createElement('meta');
				const [k, v] = attr.split('=');
				el.setAttribute(k, v || selector.replace(/.*\[|\]/g, ''));
				document.head.appendChild(el);
			}
			el.setAttribute('content', value);
		};

		const setLink = (rel, href) => {
			if (!href) return;
			let el = document.querySelector(`link[rel="${rel}"]`);
			if (!el) {
				el = document.createElement('link');
				el.setAttribute('rel', rel);
				document.head.appendChild(el);
			}
			el.setAttribute('href', href);
		};

		const setScript = (id, json) => {
			let el = document.getElementById(id);
			if (!el) {
				el = document.createElement('script');
				el.id = id;
				el.type = 'application/ld+json';
				document.head.appendChild(el);
			}
			el.textContent = JSON.stringify(json);
		};

		const removeScript = (id) => {
			const el = document.getElementById(id);
			if (el) el.remove();
		};

		/* ── title ── */
		document.title = title;

		/* ── standard meta ── */
		setMeta('meta[name="description"]',           'name=description',           description);
		setMeta('meta[name="keywords"]',              'name=keywords',              keywords);
		setMeta('meta[name="author"]',                'name=author',                author);
		setMeta('meta[name="robots"]',                'name=robots',                'index, follow');
		setMeta('meta[name="language"]',              'name=language',              'en');

		/* ── canonical ── */
		setLink('canonical', canonical);

		/* ── Open Graph ── */
		setMeta('meta[property="og:type"]',                 'property=og:type',                 'article');
		setMeta('meta[property="og:site_name"]',            'property=og:site_name',            'InstaMakaan');
		setMeta('meta[property="og:locale"]',               'property=og:locale',               'en_IN');
		setMeta('meta[property="og:url"]',                  'property=og:url',                  canonical);
		setMeta('meta[property="og:title"]',                'property=og:title',                og?.title);
		setMeta('meta[property="og:description"]',          'property=og:description',          og?.description);
		setMeta('meta[property="og:image"]',                'property=og:image',                og?.image);
		setMeta('meta[property="article:published_time"]',  'property=article:published_time',  og?.publishedTime);
		setMeta('meta[property="article:modified_time"]',   'property=article:modified_time',   og?.modifiedTime);
		setMeta('meta[property="article:author"]',          'property=article:author',          og?.author);
		setMeta('meta[property="article:section"]',         'property=article:section',         og?.section);

		/* ── Twitter Card ── */
		setMeta('meta[name="twitter:card"]',        'name=twitter:card',        'summary_large_image');
		setMeta('meta[name="twitter:site"]',        'name=twitter:site',        '@InstaMakaan');
		setMeta('meta[name="twitter:title"]',       'name=twitter:title',       twitter?.title);
		setMeta('meta[name="twitter:description"]', 'name=twitter:description', twitter?.description);
		setMeta('meta[name="twitter:image"]',       'name=twitter:image',       twitter?.image);

		/* ── JSON-LD schemas ── */
		if (schemas?.article)    setScript('ld-article',    schemas.article);
		if (schemas?.faq)        setScript('ld-faq',        schemas.faq);
		else                     removeScript('ld-faq');
		if (schemas?.breadcrumb) setScript('ld-breadcrumb', schemas.breadcrumb);

		/* ── cleanup when navigating away ── */
		return () => {
			document.title = 'InstaMakaan';
			removeScript('ld-article');
			removeScript('ld-faq');
			removeScript('ld-breadcrumb');
		};
	}, [title, description, keywords, author, canonical,
		og?.title, og?.description, og?.image,
		twitter?.title, twitter?.description, twitter?.image,
		schemas?.article, schemas?.faq, schemas?.breadcrumb]);
};

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .article-body { font-family: 'DM Sans', sans-serif; }
  .display-font { font-family: 'DM Serif Display', serif; }

  .progress-bar {
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #0d9488, #14b8a6);
    z-index: 9999; transition: width .1s linear; border-radius: 0 2px 2px 0;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up   { animation: fadeUp .6s cubic-bezier(.22,.68,0,1.2) both; }
  .fade-up-1 { animation-delay: .05s; }
  .fade-up-2 { animation-delay: .12s; }
  .fade-up-3 { animation-delay: .20s; }
  .fade-up-4 { animation-delay: .28s; }

  .pull-quote {
    background: linear-gradient(135deg, #f0fdfa 0%, #fff 100%);
    border-left: 4px solid #0d9488;
    border-radius: 0 12px 12px 0;
  }
  .dark .pull-quote {
    background: linear-gradient(135deg, #134e4a33 0%, transparent 100%);
  }

  .section-heading::after {
    content: ''; display: block; width: 40px; height: 3px;
    background: linear-gradient(90deg, #0d9488, transparent);
    margin-top: 8px; border-radius: 2px;
  }

  .hover-lift { transition: transform .25s ease, box-shadow .25s ease; }
  .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(13,148,136,.12); }

  .share-btn { transition: transform .2s ease, opacity .2s ease; }
  .share-btn:hover  { transform: scale(1.1); opacity: .9; }
  .share-btn:active { transform: scale(.95); }

  .back-top-btn { transition: all .3s ease; }
  .back-top-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(13,148,136,.3); }

  .faq-body { animation: fadeUp .3s ease both; }

  .stat-card {
    background: linear-gradient(135deg, #f0fdfa, #fff);
    border: 1px solid #ccfbf1;
    border-radius: 10px;
    padding: 8px 10px;
    text-align: center;
  }
  .dark .stat-card {
    background: linear-gradient(135deg, #134e4a33, #1e293b);
    border-color: #134e4a;
  }

  .comment-input:focus {
    outline: none; border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13,148,136,.1);
  }

  .tag-pill { transition: all .2s ease; }
  .tag-pill:hover {
    background: #f0fdfa; border-color: #0d9488;
    color: #0d9488; transform: translateY(-1px);
  }

  .mobile-bar {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .hero-overlay {
    background: linear-gradient(to bottom, transparent 40%, rgba(15,26,46,.55) 100%);
  }

  .author-card {
    background: linear-gradient(135deg, #f0fdfa 0%, #fff8f0 100%);
    border: 1px solid #ccfbf1;
  }
  .dark .author-card {
    background: linear-gradient(135deg, #134e4a22, #1e293b);
    border-color: #134e4a;
  }

  /* skeleton */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }
  .dark .skeleton {
    background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
    background-size: 200% 100%;
  }

  /* prose body */
  .prose-body { color: #374151; line-height: 1.85; }
  .dark .prose-body { color: #d1d5db; }
  .prose-body h2 { font-size: 1.2rem; font-weight: 700; margin: 1em 0 .4em; color: #0f1a2e; }
  .dark .prose-body h2 { color: #f1f5f9; }
  .prose-body h3 { font-size: 1rem; font-weight: 600; margin: .9em 0 .3em; color: #0f1a2e; }
  .dark .prose-body h3 { color: #f1f5f9; }
  .prose-body strong { font-weight: 700; }
  .prose-body em     { font-style: italic; }
  .prose-body u      { text-decoration: underline; }
  .prose-body ul { list-style: disc;    padding-left: 1.4em; margin: .5em 0; }
  .prose-body ol { list-style: decimal; padding-left: 1.4em; margin: .5em 0; }
  .prose-body li { margin-bottom: .25em; }
  .prose-body blockquote {
    border-left: 3px solid #0d9488;
    padding-left: 1em; color: #374151; margin: .8em 0;
  }
  .dark .prose-body blockquote { color: #9ca3af; }
  .prose-body p { margin-bottom: .6em; line-height: 1.85; }
  .prose-body .text-center { text-align: center; }
  .prose-body .text-right  { text-align: right; }
  .prose-body a, .prose-body a.interlink {
    color: #0d9488; text-decoration: underline;
    text-decoration-color: #99f6e4;
    text-underline-offset: 3px;
    font-weight: 500;
    transition: color .15s ease, text-decoration-color .15s ease;
  }
  .prose-body a:hover { color: #0f766e; text-decoration-color: #0d9488; }

  /* ══════════════════════════════════════════════════════
     TABLE SYSTEM — horizontal scroll + drag slider
  ══════════════════════════════════════════════════════ */

  html, body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }

  .article-content-col {
    min-width: 0;
    max-width: 100%;
    overflow-x: clip;
  }

  .prose-body {
    overflow-x: clip;
    max-width: 100%;
  }

  /* ── Outer container: clips to column width ── */
  .table-outer {
    position: relative;
    max-width: 100%;
    width: 100%;
    margin: 1.5em 0;
  }

  /* ── Scrollable viewport ── */
  .table-scroll-viewport {
    display: block;
    overflow-x: auto;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
    max-width: 100%;
    width: 100%;
    border-radius: 10px 10px 0 0;
    scrollbar-width: none; /* hide native scrollbar — we use custom slider */
  }
  .table-scroll-viewport::-webkit-scrollbar { display: none; }

  /* ── The table itself ── */
  .blog-table,
  .prose-body table {
    width: max-content;
    min-width: 100%;
    border-collapse: collapse;
    table-layout: auto;
    font-size: 0.68rem;
  }
  @media (min-width: 480px) { .blog-table, .prose-body table { font-size: 0.74rem; } }
  @media (min-width: 640px) { .blog-table, .prose-body table { font-size: 0.85rem; } }

  /* ── Header cells ── */
  .blog-table th,
  .prose-body table th {
    background: #f0fdfa;
    color: #0f766e;
    font-weight: 600;
    padding: 8px 10px;
    text-align: left;
    border: 1px solid #ccfbf1;
    white-space: nowrap;
    position: sticky;
    top: 0;
  }
  @media (min-width: 640px) { .blog-table th, .prose-body table th { padding: 10px 14px; } }
  .dark .blog-table th, .dark .prose-body table th {
    background: #134e4a;
    color: #5eead4;
    border-color: #0d4f47;
  }

  /* ── Data cells ── */
  .blog-table td,
  .prose-body table td {
    padding: 7px 10px;
    border: 1px solid #e5e7eb;
    color: #374151;
    vertical-align: top;
    white-space: normal;
    word-break: break-word;
  }
  @media (min-width: 640px) { .blog-table td, .prose-body table td { padding: 9px 14px; } }
  .dark .blog-table td, .dark .prose-body table td { border-color: #374151; color: #d1d5db; }

  .blog-table tr:nth-child(even) td,
  .prose-body table tr:nth-child(even) td { background: #f9fafb; }
  .dark .blog-table tr:nth-child(even) td,
  .dark .prose-body table tr:nth-child(even) td { background: #1e293b44; }

  .prose-body table thead th { background: #f0fdfa; }
  .dark .prose-body table thead th { background: #134e4a; }

  .blog-table-caption {
    text-align: center;
    font-size: 0.78rem;
    color: #6b7280;
    margin-top: 4px;
  }

  /* ── Custom drag slider bar ── */
  .table-slider-bar {
    position: relative;
    height: 20px;
    background: #f1f5f9;
    border-radius: 0 0 10px 10px;
    border: 1px solid #e2e8f0;
    border-top: none;
    display: flex;
    align-items: center;
    padding: 0 4px;
    cursor: grab;
    user-select: none;
    touch-action: none;
  }
  .dark .table-slider-bar {
    background: #1e293b;
    border-color: #334155;
  }
  .table-slider-bar:active { cursor: grabbing; }

  /* Track line */
  .table-slider-track {
    position: relative;
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 99px;
    overflow: hidden;
  }
  .dark .table-slider-track { background: #334155; }

  /* Filled portion */
  .table-slider-fill {
    position: absolute;
    left: 0; top: 0; height: 100%;
    background: linear-gradient(90deg, #0d9488, #14b8a6);
    border-radius: 99px;
    pointer-events: none;
    transition: width .05s linear;
  }

  /* Thumb */
  .table-slider-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    background: #0d9488;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(13,148,136,.4);
    cursor: grab;
    transition: transform .1s ease, box-shadow .1s ease;
    z-index: 2;
  }
  .table-slider-thumb:hover,
  .table-slider-bar:active .table-slider-thumb {
    transform: translate(-50%, -50%) scale(1.25);
    box-shadow: 0 2px 8px rgba(13,148,136,.5);
  }

  /* Arrow buttons */
  .table-slider-arrow {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0d9488;
    cursor: pointer;
    border-radius: 4px;
    transition: background .15s ease;
  }
  .table-slider-arrow:hover { background: #ccfbf1; }
  .dark .table-slider-arrow:hover { background: #134e4a44; }

  /* Hide slider when table fits without scrolling */
  .table-slider-bar[data-scrollable="false"] {
    display: none;
  }

  /* ── Inline image ── */
  .inline-image-wrap { margin: 1.25em 0; }
  .inline-image-wrap img { width: 100%; border-radius: 12px; object-fit: cover; display: block; }
  .inline-image-caption { text-align: center; font-size: 0.8rem; color: #6b7280; margin-top: 8px; font-style: italic; }

  /* TOC */
  .toc-outer { align-self: flex-start; position: sticky; top: 88px; }
  .toc-inner { max-height: calc(100vh - 108px); overflow-y: auto; scrollbar-width: none; }
  .toc-inner::-webkit-scrollbar { display: none; }

  /* hero image */
  .hero-img { height: 220px; object-fit: cover; width: 100%; display: block; }
  @media (min-width: 480px)  { .hero-img { height: 280px; } }
  @media (min-width: 640px)  { .hero-img { height: 340px; } }
  @media (min-width: 1024px) { .hero-img { height: 420px; } }

  /* stats grid — flex so all stats sit in one row */
  .stats-grid { display: flex; flex-wrap: nowrap; gap: 6px; overflow-x: auto; scrollbar-width: none; }
  .stats-grid::-webkit-scrollbar { display: none; }
  .stats-grid .stat-card { flex: 1 1 0; min-width: 80px; }

  .meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; row-gap: 6px; }

  @media (max-width: 480px) {
    .author-flex { flex-direction: column; align-items: flex-start; }
    .author-avatar { width: 48px !important; height: 48px !important; font-size: 1.25rem !important; }
  }
  @media (max-width: 380px) { .related-img { width: 80px !important; height: 72px !important; } }

  .cta-block { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
  @media (min-width: 640px) { .cta-block { flex-direction: row; align-items: center; justify-content: space-between; } }

  .share-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }

  .mobile-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; padding: 0 0 env(safe-area-inset-bottom, 12px); }
  .mobile-bottom-bar-inner { margin: 0 12px 12px; border-radius: 18px; }
`;

/* ─── READING PROGRESS ─── */
const ReadingProgress = () => {
	const [p, setP] = useState(0);
	useEffect(() => {
		const fn = () => {
			const el = document.documentElement;
			const tot = el.scrollHeight - el.clientHeight;
			setP(tot > 0 ? (el.scrollTop / tot) * 100 : 0);
		};
		window.addEventListener('scroll', fn, { passive: true });
		return () => window.removeEventListener('scroll', fn);
	}, []);
	return <div className="progress-bar" style={{ width: `${p}%` }} />;
};

/* ─── TABLE OF CONTENTS ─── */
const TableOfContents = ({ items, activeSection, onSectionClick }) => {
	const [open, setOpen] = useState(true);
	return (
		<div className="rounded-2xl overflow-hidden mb-5 w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 dark:bg-teal-900/20"
			>
				<span className="flex items-center gap-2 font-semibold text-sm text-gray-800 dark:text-gray-100">
					<List className="w-4 h-4 text-teal-600" /> Table of Contents
				</span>
				<ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
			</button>
			{open && (
				<ol className="px-2 py-2 flex flex-col gap-0.5 bg-white dark:bg-gray-800">
					{items.map((item, i) => {
						const active = activeSection === i;
						return (
							<li key={i}>
								<a
									href={`#section-${i}`}
									onClick={() => onSectionClick?.(i)}
									className={`text-sm flex items-center gap-2 py-2 px-2 rounded-xl transition-all ${
										active
											? 'text-teal-600 font-semibold bg-teal-50 dark:bg-teal-900/20'
											: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
									}`}
									style={active ? { boxShadow: 'inset 3px 0 0 #0d9488' } : {}}
								>
									<span className={`text-[10px] font-bold rounded-md px-1.5 py-0.5 shrink-0 min-w-[26px] text-center ${active ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
										{String(i + 1).padStart(2, '0')}
									</span>
									<span className="leading-snug text-xs">{item}</span>
								</a>
							</li>
						);
					})}
				</ol>
			)}
		</div>
	);
};

/* ─── FAQ ITEM ─── */
const FAQItem = ({ q, a, index }) => {
	const [open, setOpen] = useState(false);
	return (
		<div className={`rounded-2xl overflow-hidden hover-lift border transition-colors duration-300 ${open ? 'border-teal-200 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
			<button
				onClick={() => setOpen((o) => !o)}
				className="w-full text-left flex items-start justify-between gap-3 px-4 py-4"
				aria-expanded={open}
			>
				<div className="flex items-start gap-2">
					<span className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5 ${open ? 'bg-teal-600 text-white' : 'bg-teal-50 dark:bg-teal-900/30 text-teal-600'}`}>
						Q{index + 1}
					</span>
					<span className="font-semibold text-sm leading-snug text-gray-800 dark:text-gray-100">{q}</span>
				</div>
				<ChevronDown className={`w-4 h-4 shrink-0 mt-0.5 text-teal-600 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
			</button>
			{open && (
				<div className="px-4 pb-4 pt-1 faq-body border-t border-teal-200 dark:border-teal-700">
					<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{a}</p>
				</div>
			)}
		</div>
	);
};

/* ─── AUTHOR BIO ─── */
const AuthorBio = ({ author }) => (
	<div className="flex gap-4 items-start p-5 rounded-2xl author-card author-flex mt-10 hover-lift">
		<div
			className="author-avatar w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold text-white display-font"
			style={{ background: '#0d9488' }}
		>
			{author?.name?.charAt(0) || 'A'}
		</div>
		<div>
			<p className="font-bold text-base display-font text-gray-900 dark:text-gray-100">{author?.name}</p>
			<p className="text-xs font-semibold mb-2 uppercase tracking-wider text-teal-600">{author?.role}</p>
			<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
				A trusted voice in India's real estate space, {author?.name?.split(' ')[0]} covers property markets,
				rental trends, and investment insights for InstaMakaan's readers across Noida and Greater Noida.
			</p>
		</div>
	</div>
);

/* ─── RELATED CARD ─── */
const RelatedCard = ({ post }) => {
	const s = getCategoryStyle(post.category);
	return (
		<Link
			to={`/blog/${post.slug || post._id || post.id}`}
			className="group rounded-2xl overflow-hidden flex gap-3 p-3 hover-lift bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
		>
			<div className="related-img w-24 rounded-xl overflow-hidden shrink-0" style={{ height: '80px' }}>
				<img
					src={post.image || post.heroImage}
					alt={post.title}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
				/>
			</div>
			<div className="flex flex-col justify-center min-w-0">
				<span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-1.5 ${s.bg} ${s.text}`}>
					{post.category}
				</span>
				<h4 className="text-sm font-semibold line-clamp-2 leading-snug display-font text-gray-800 dark:text-gray-100">
					{post.title}
				</h4>
				<p className="text-xs mt-1 text-gray-400">{post.date}</p>
			</div>
		</Link>
	);
};

/* ─── KEY STATS ─── */
const STAT_ICON_CYCLE = [MapPin, Banknote, Home, Building2, TrendingUp, Zap];
function getStatIcon(label = '', value = '', idx = 0) {
	const txt = (label + ' ' + value).toLowerCase();
	if (/sector|sec[\s-]|noida|area|greater|location/.test(txt)) return MapPin;
	if (/₹|k\/mo|lakh|cr|rent|price|cost/.test(txt))            return Banknote;
	if (/bhk|flat|apartment|villa|home/.test(txt))               return Home;
	if (/project|building|city|tower|block/.test(txt))           return Building2;
	if (/growth|trend|faster|increase|return/.test(txt))         return TrendingUp;
	return STAT_ICON_CYCLE[idx % STAT_ICON_CYCLE.length];
}

const KeyStats = ({ stats }) => (
	<div className="stats-grid my-4 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
		{stats.map(({ label, value }, idx) => {
			const Icon = getStatIcon(label, value, idx);
			return (
				<div key={label} className="stat-card">
					<div className="flex justify-center mb-1">
						<span className="w-7 h-7 rounded-lg flex items-center justify-center bg-teal-100 dark:bg-teal-900/40">
							<Icon size={14} className="text-teal-600 dark:text-teal-400" />
						</span>
					</div>
					<div className="font-bold text-sm display-font text-teal-600">{value}</div>
					<div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{label}</div>
				</div>
			);
		})}
	</div>
);

/* ─────────────────────────────────────────────
   TABLE SLIDER COMPONENT
   Wraps any table (inline block or prose HTML)
   with a custom drag-to-scroll slider bar.
───────────────────────────────────────────── */
const TableWithSlider = ({ children, caption }) => {
	const viewportRef = useRef(null);
	const sliderRef   = useRef(null);
	const thumbRef    = useRef(null);
	const dragState   = useRef({ active: false, startX: 0, startScroll: 0 });
	const [scrollable, setScrollable] = useState(false);
	const [progress,   setProgress]   = useState(0); // 0–1

	/* Check if scrollable after mount / resize */
	const checkScrollable = useCallback(() => {
		const vp = viewportRef.current;
		if (!vp) return;
		const canScroll = vp.scrollWidth > vp.clientWidth + 2;
		setScrollable(canScroll);
	}, []);

	useEffect(() => {
		checkScrollable();
		const ro = new ResizeObserver(checkScrollable);
		if (viewportRef.current) ro.observe(viewportRef.current);
		return () => ro.disconnect();
	}, [checkScrollable]);

	/* Sync progress from table scroll */
	const onScroll = useCallback(() => {
		const vp = viewportRef.current;
		if (!vp) return;
		const max = vp.scrollWidth - vp.clientWidth;
		setProgress(max > 0 ? vp.scrollLeft / max : 0);
	}, []);

	useEffect(() => {
		const vp = viewportRef.current;
		if (!vp) return;
		vp.addEventListener('scroll', onScroll, { passive: true });
		return () => vp.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	/* Slider bar: click to jump */
	const onTrackClick = useCallback((e) => {
		const bar = sliderRef.current;
		const vp  = viewportRef.current;
		if (!bar || !vp) return;
		// Ignore if clicking the thumb itself
		if (e.target === thumbRef.current) return;
		const rect = bar.getBoundingClientRect();
		// Account for arrow button widths (20px each + 4px padding each side)
		const trackLeft  = rect.left + 24;
		const trackWidth = rect.width - 48;
		const ratio = Math.max(0, Math.min(1, (e.clientX - trackLeft) / trackWidth));
		const max = vp.scrollWidth - vp.clientWidth;
		vp.scrollLeft = ratio * max;
	}, []);

	/* Thumb drag — pointer events for unified mouse/touch */
	const onThumbPointerDown = useCallback((e) => {
		e.preventDefault();
		const vp = viewportRef.current;
		if (!vp) return;
		dragState.current = { active: true, startX: e.clientX, startScroll: vp.scrollLeft };
		e.currentTarget.setPointerCapture(e.pointerId);
	}, []);

	const onThumbPointerMove = useCallback((e) => {
		if (!dragState.current.active) return;
		const vp  = viewportRef.current;
		const bar = sliderRef.current;
		if (!vp || !bar) return;
		const trackWidth = bar.clientWidth - 48;
		const max = vp.scrollWidth - vp.clientWidth;
		const delta = ((e.clientX - dragState.current.startX) / trackWidth) * max;
		vp.scrollLeft = Math.max(0, Math.min(max, dragState.current.startScroll + delta));
	}, []);

	const onThumbPointerUp = useCallback(() => {
		dragState.current.active = false;
	}, []);

	/* Arrow buttons */
	const scroll = useCallback((dir) => {
		const vp = viewportRef.current;
		if (!vp) return;
		vp.scrollBy({ left: dir * 120, behavior: 'smooth' });
	}, []);

	/* Thumb position in % */
	const thumbPct = `${progress * 100}%`;

	return (
		<div className="table-outer">
			{/* Scrollable table viewport */}
			<div ref={viewportRef} className="table-scroll-viewport">
				{children}
			</div>

			{/* Custom slider — hidden when table fits */}
			{scrollable && (
				<div
					ref={sliderRef}
					className="table-slider-bar"
					onClick={onTrackClick}
					role="scrollbar"
					aria-valuenow={Math.round(progress * 100)}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-orientation="horizontal"
				>
					{/* Left arrow */}
					<button
						className="table-slider-arrow"
						onClick={(e) => { e.stopPropagation(); scroll(-1); }}
						aria-label="Scroll table left"
					>
						<ChevronLeft className="w-3 h-3" />
					</button>

					{/* Track */}
					<div className="table-slider-track flex-1 mx-1" style={{ position: 'relative' }}>
						<div className="table-slider-fill" style={{ width: thumbPct }} />
						<div
							ref={thumbRef}
							className="table-slider-thumb"
							style={{ left: thumbPct }}
							onPointerDown={onThumbPointerDown}
							onPointerMove={onThumbPointerMove}
							onPointerUp={onThumbPointerUp}
							onPointerCancel={onThumbPointerUp}
							role="slider"
							tabIndex={0}
							aria-label="Scroll table"
						/>
					</div>

					{/* Right arrow */}
					<button
						className="table-slider-arrow"
						onClick={(e) => { e.stopPropagation(); scroll(1); }}
						aria-label="Scroll table right"
					>
						<ChevronRight className="w-3 h-3" />
					</button>
				</div>
			)}

			{caption && <p className="blog-table-caption">{caption}</p>}
		</div>
	);
};

/* ─── INLINE TABLE BLOCK ─── */
const InlineTable = ({ block }) => (
	<TableWithSlider caption={block.caption}>
		<table className="blog-table">
			<tbody>
				{Array.from({ length: block.rows }, (_, r) => (
					<tr key={r}>
						{Array.from({ length: block.cols }, (_, c) => {
							const cell = block.data?.[r]?.[c] ?? '';
							return r === 0 && block.headerRow ? (
								<th key={c}>{cell}</th>
							) : (
								<td key={c}>{cell}</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	</TableWithSlider>
);

/* ─── INLINE IMAGE BLOCK ─── */
const InlineImage = ({ block }) => (
	<div className="inline-image-wrap">
		<img src={block.url} alt={block.caption || 'Blog image'} loading="lazy" />
		{block.caption && <p className="inline-image-caption">{block.caption}</p>}
	</div>
);

/* ─────────────────────────────────────────────
   PROSE BODY
   Wraps raw HTML from TipTap.
   Every <table> inside gets the slider treatment
   via a React portal-style approach using a
   post-render DOM walk.
───────────────────────────────────────────── */
const ProseBody = ({ html }) => {
	const ref = useRef(null);

	useEffect(() => {
		if (!ref.current) return;

		ref.current.querySelectorAll('table').forEach((table) => {
			/* Already wrapped — skip */
			if (table.closest('.table-outer')) return;

			/* Build outer + viewport */
			const outer    = document.createElement('div');
			outer.className = 'table-outer';

			const viewport = document.createElement('div');
			viewport.className = 'table-scroll-viewport';

			/* Build slider bar */
			const sliderBar = document.createElement('div');
			sliderBar.className = 'table-slider-bar';
			sliderBar.setAttribute('role', 'scrollbar');
			sliderBar.setAttribute('aria-valuemin', '0');
			sliderBar.setAttribute('aria-valuemax', '100');
			sliderBar.setAttribute('aria-orientation', 'horizontal');

			/* Left arrow */
			const leftBtn = document.createElement('button');
			leftBtn.className = 'table-slider-arrow';
			leftBtn.setAttribute('aria-label', 'Scroll table left');
			leftBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

			/* Track */
			const track = document.createElement('div');
			track.className = 'table-slider-track';
			track.style.flex = '1';
			track.style.margin = '0 4px';
			track.style.position = 'relative';

			const fill = document.createElement('div');
			fill.className = 'table-slider-fill';
			fill.style.width = '0%';

			const thumb = document.createElement('div');
			thumb.className = 'table-slider-thumb';
			thumb.style.left = '0%';
			thumb.setAttribute('tabindex', '0');
			thumb.setAttribute('role', 'slider');
			thumb.setAttribute('aria-label', 'Scroll table');

			track.appendChild(fill);
			track.appendChild(thumb);

			/* Right arrow */
			const rightBtn = document.createElement('button');
			rightBtn.className = 'table-slider-arrow';
			rightBtn.setAttribute('aria-label', 'Scroll table right');
			rightBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

			sliderBar.appendChild(leftBtn);
			sliderBar.appendChild(track);
			sliderBar.appendChild(rightBtn);

			/* Wire up DOM */
			table.parentNode.insertBefore(outer, table);
			viewport.appendChild(table);
			outer.appendChild(viewport);
			outer.appendChild(sliderBar);

			/* ── Scroll sync ── */
			const updateSlider = () => {
				const max = viewport.scrollWidth - viewport.clientWidth;
				const isScrollable = max > 2;
				sliderBar.style.display = isScrollable ? 'flex' : 'none';
				if (!isScrollable) return;
				const ratio = max > 0 ? viewport.scrollLeft / max : 0;
				const pct = `${ratio * 100}%`;
				fill.style.width  = pct;
				thumb.style.left  = pct;
				sliderBar.setAttribute('aria-valuenow', Math.round(ratio * 100));
			};

			const ro = new ResizeObserver(updateSlider);
			ro.observe(viewport);
			viewport.addEventListener('scroll', updateSlider, { passive: true });
			updateSlider();

			/* ── Arrow click ── */
			leftBtn.addEventListener('click',  (e) => { e.stopPropagation(); viewport.scrollBy({ left: -120, behavior: 'smooth' }); });
			rightBtn.addEventListener('click', (e) => { e.stopPropagation(); viewport.scrollBy({ left:  120, behavior: 'smooth' }); });

			/* ── Track click to jump ── */
			sliderBar.addEventListener('click', (e) => {
				if (e.target === thumb || e.target === leftBtn || e.target === rightBtn) return;
				const rect = track.getBoundingClientRect();
				const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
				const max = viewport.scrollWidth - viewport.clientWidth;
				viewport.scrollLeft = ratio * max;
			});

			/* ── Thumb drag (pointer events) ── */
			let dragActive = false, startX = 0, startScroll = 0;
			thumb.addEventListener('pointerdown', (e) => {
				e.preventDefault();
				dragActive = true;
				startX = e.clientX;
				startScroll = viewport.scrollLeft;
				thumb.setPointerCapture(e.pointerId);
			});
			thumb.addEventListener('pointermove', (e) => {
				if (!dragActive) return;
				const trackW = track.clientWidth;
				const max = viewport.scrollWidth - viewport.clientWidth;
				const delta = ((e.clientX - startX) / trackW) * max;
				viewport.scrollLeft = Math.max(0, Math.min(max, startScroll + delta));
			});
			thumb.addEventListener('pointerup',     () => { dragActive = false; });
			thumb.addEventListener('pointercancel', () => { dragActive = false; });
		});
	}, [html]);

	return (
		<div
			ref={ref}
			className="prose-body text-base"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
};

/* ─── SKELETON ─── */
const SkeletonDetail = () => (
	<div className="bg-gray-50 dark:bg-gray-900">
		<div className="w-full max-w-[1400px] mx-auto px-4 md:px-10 xl:px-16 py-6 md:py-14 article-body">
			<div className="flex gap-8">
				<div className="flex-1 min-w-0">
					<div className="mb-6 p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
						<div className="skeleton h-4 w-40 mb-4" />
						<div className="skeleton h-7 w-full mb-3" />
						<div className="skeleton h-7 w-3/4 mb-5" />
						<div className="skeleton h-14 w-full" style={{ borderRadius: 12 }} />
					</div>
					<div className="skeleton rounded-3xl mb-3" style={{ height: 220 }} />
					<div className="flex flex-col gap-5 mt-8">
						{[1, 2, 3].map((n) => (
							<div key={n}>
								<div className="skeleton h-5 w-64 mb-3" />
								<div className="skeleton h-4 w-full mb-2" />
								<div className="skeleton h-4 w-5/6" />
							</div>
						))}
					</div>
				</div>
				<aside className="hidden lg:block w-72 xl:w-80 shrink-0">
					<div className="skeleton rounded-2xl" style={{ height: 300 }} />
				</aside>
			</div>
		</div>
	</div>
);

/* ─── MAIN ─── */
const BlogDetailPage = () => {
	const { slug } = useParams();
	const navigate = useNavigate();

	const [post,    setPost]    = useState(null);
	const [related, setRelated] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error,   setError]   = useState(null);

	const [activeSection, setActiveSection] = useState(0);
	const [comment,      setComment]      = useState('');
	const [commentName,  setCommentName]  = useState('');
	const [comments,     setComments]     = useState([]);
	const [commentLoading, setCommentLoading] = useState(false);
	const [showBackTop, setShowBackTop] = useState(false);
	const [copied, setCopied] = useState(false);
	const sectionRefs    = useRef([]);
	const manualClick    = useRef(false);
	const tocSidebarRef  = useRef(null);

	const fetchPost = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await api.get(`/blogs/slug/${slug}`);
			setPost(data);
			try {
				const postId = data._id || data.id;
				const [relRes, cmtRes] = await Promise.allSettled([
					api.get('/blogs', { params: { category: data.category, limit: 3, exclude: postId } }),
					api.get(`/blogs/${postId}/comments`),
				]);
				if (relRes.status === 'fulfilled') {
					const arr = Array.isArray(relRes.value.data) ? relRes.value.data : relRes.value.data.posts || [];
					setRelated(arr.filter((p) => (p._id || p.id) !== postId).slice(0, 3));
				}
				if (cmtRes.status === 'fulfilled') {
					setComments(Array.isArray(cmtRes.value.data) ? cmtRes.value.data : []);
				}
			} catch { /* optional */ }
		} catch (err) {
			const status = err?.response?.status;
			setError(
				status === 404
					? 'Post not found'
					: err?.response?.data?.message || err.message || 'Failed to load post',
			);
		} finally {
			setLoading(false);
		}
	}, [slug]);

	useEffect(() => { window.scrollTo({ top: 0 }); fetchPost(); }, [fetchPost]);

	useEffect(() => {
		const fn = () => setShowBackTop(window.scrollY > 600);
		window.addEventListener('scroll', fn, { passive: true });
		return () => window.removeEventListener('scroll', fn);
	}, []);

	useEffect(() => {
		if (!post) return;
		const obs = new IntersectionObserver(
			(entries) => {
				if (manualClick.current) return;
				entries.forEach((e) => {
					if (e.isIntersecting) {
						const i = sectionRefs.current.indexOf(e.target);
						if (i !== -1) setActiveSection(i);
					}
				});
			},
			{ rootMargin: '-15% 0px -70% 0px' },
		);
		sectionRefs.current.forEach((el) => el && obs.observe(el));
		return () => obs.disconnect();
	}, [post]);

	/* ── JS sticky sidebar ── */
	useEffect(() => {
		if (loading || !post) return;
		const el = tocSidebarRef.current;
		if (!el) return;
		const parent = el.parentElement;
		if (!parent) return;

		const HEADER_H = 88;
		// Cache once — parentAbsTop never changes during scroll, only on resize
		let parentAbsTop = parent.getBoundingClientRect().top + window.scrollY;
		let rafId = null;

		const apply = () => {
			const scrollY = window.scrollY;
			const translate = Math.max(0, scrollY + HEADER_H - parentAbsTop);
			const maxTranslate = Math.max(0, parent.offsetHeight - el.offsetHeight - 20);
			el.style.transform = `translateY(${Math.min(translate, maxTranslate)}px)`;
		};

		const onScroll = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(apply);
		};

		const onResize = () => {
			parentAbsTop = parent.getBoundingClientRect().top + window.scrollY;
			apply();
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });
		apply();

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [post, loading]);

	const handleCopy = () => {
		navigator.clipboard?.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleComment = async () => {
		if (!comment.trim() || !commentName.trim()) return;
		const postId = post?._id || post?.id;
		if (!postId) return;
		setCommentLoading(true);
		try {
			const { data } = await api.post(`/blogs/${postId}/comments`, {
				name: commentName.trim(),
				text: comment.trim(),
			});
			setComments((prev) => [...prev, data]);
			setComment('');
			setCommentName('');
		} catch {
			/* silently fail */
		} finally {
			setCommentLoading(false);
		}
	};

	/* ── Derive SEO fields AFTER post loads ── */
	const postId      = post ? (post._id || post.id) : '';
	const heroImage   = post ? (post.image || post.heroImage || '') : '';
	const authorName  = post ? (post.author?.name || '').trim() : '';
	const authorRole  = post ? (post.author?.role || '').trim() : '';
	const rawExcerpt  = post ? (post.excerpt || '').trim() : '';
	const metaDescription = rawExcerpt.length > 160 ? rawExcerpt.slice(0, 157) + '…' : rawExcerpt;
	const pageTitle   = post?.title ? `${post.title} | InstaMakaan` : 'InstaMakaan Blog';

	/*
	 * ✅ CANONICAL — always the full blog post URL built from post.slug.
	 *    Falls back to postId only if slug is genuinely absent.
	 *    This string is computed ONCE here and used everywhere (canonical, og:url, schema).
	 */
	const canonicalUrl = post
		? `https://instamakaan.com/blog/${post.slug || postId}`
		: '';

	/* JSON-LD schemas */
	const articleSchema = post ? {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
		description: metaDescription,
		image: heroImage,
		author: {
			'@type': 'Person',
			name: authorName,
			jobTitle: authorRole,
			url: 'https://instamakaan.com/about',
		},
		publisher: {
			'@type': 'Organization',
			name: 'InstaMakaan',
			url: 'https://instamakaan.com',
			logo: {
				'@type': 'ImageObject',
				url: 'https://instamakaan.com/logo.png',
				width: 200,
				height: 60,
			},
		},
		datePublished: post.date,
		dateModified: post.updatedAt || post.date,
		mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
	} : null;

	const faqs = post?.faqs || [];
	const faqSchema = faqs.length > 0 ? {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a },
		})),
	} : null;

	const breadcrumbSchema = post ? {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://instamakaan.com' },
			{ '@type': 'ListItem', position: 2, name: 'Blog',  item: 'https://instamakaan.com/blog' },
			{ '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
		],
	} : null;

	const tags = post?.tags?.length
		? post.tags
		: [post?.category, 'Noida', 'Real Estate', 'InstaMakaan'].filter(Boolean);

	/* ✅ useSEO — replaces <Helmet> entirely, no conditional-child bugs */
	useSEO({
		title:       pageTitle,
		description: metaDescription,
		keywords:    post ? `${post.category}, Noida real estate, Greater Noida property, InstaMakaan, ${tags.join(', ')}` : '',
		author:      authorName,
		canonical:   canonicalUrl,
		og: post ? {
			title:         post.title,
			description:   metaDescription,
			image:         heroImage,
			publishedTime: post.date,
			modifiedTime:  post.updatedAt || post.date,
			author:        authorName,
			section:       post.category,
		} : {},
		twitter: post ? {
			title:       post.title,
			description: metaDescription,
			image:       heroImage,
		} : {},
		schemas: {
			article:    articleSchema,
			faq:        faqSchema,
			breadcrumb: breadcrumbSchema,
		},
	});

	/* ── Loading / error states ── */
	if (loading)
		return (
			<Layout>
				<style>{styles}</style>
				<ReadingProgress />
				<div className="pt-20 pb-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
					<div className="w-full max-w-[1400px] mx-auto px-4 md:px-10 xl:px-16">
						<div className="skeleton h-4 w-48" />
					</div>
				</div>
				<SkeletonDetail />
			</Layout>
		);

	if (error)
		return (
			<Layout>
				<style>{styles}</style>
				<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 article-body">
					<AlertCircle className="w-12 h-12 mb-4 text-red-400" />
					<h2 className="text-2xl font-bold mb-2 display-font text-gray-900 dark:text-gray-100">
						{error === 'Post not found' ? 'Article not found' : 'Something went wrong'}
					</h2>
					<p className="mb-6 text-gray-500 text-sm">{error}</p>
					<div className="flex gap-3 flex-wrap justify-center">
						<button
							onClick={fetchPost}
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-teal-600 hover:bg-teal-700 transition-colors"
						>
							<RefreshCw className="w-4 h-4" /> Try again
						</button>
						<Link
							to="/blog"
							className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
						>
							<ArrowLeft className="w-4 h-4" /> Back to Blog
						</Link>
					</div>
				</div>
			</Layout>
		);

	/* ── content blocks ── */
	const blocks = post.blocks?.length
		? post.blocks
		: (post.sections || []).map((s, i) => ({
				type: 'section',
				id: String(i),
				heading: s.heading,
				body: s.body,
			}));

	const sectionBlocks = blocks.filter((b) => b.type === 'section');
	const keyStats = post.keyStats?.length ? post.keyStats : null;

	const toc = post.toc?.length
		? post.toc
		: [
				...sectionBlocks.map((s) => s.heading).filter(Boolean),
				...(faqs.length ? ['FAQs'] : []),
			];

	const catStyle = getCategoryStyle(post.category);

	let sectionRefIdx = -1;

	return (
		<Layout>
			<style>{styles}</style>

			<ReadingProgress />

			{/* BREADCRUMB */}
			<div className="pt-16 pb-2.5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
				<div className="w-full max-w-[1400px] mx-auto px-4 md:px-10 xl:px-16 flex items-center gap-1.5 text-xs flex-wrap article-body text-gray-500">
					<Link to="/" className="hover:text-teal-600 transition-colors flex items-center gap-1">
						<Home className="w-3 h-3" /> Home
					</Link>
					<ChevronRight className="w-3 h-3" />
					<Link to="/blog" className="hover:text-teal-600 transition-colors">Blog</Link>
					<ChevronRight className="w-3 h-3" />
					<span className="truncate max-w-[150px] sm:max-w-xs text-gray-700 dark:text-gray-200">
						{post.title}
					</span>
				</div>
			</div>

			<div className="bg-gray-50 dark:bg-gray-900">
				<div className="w-full max-w-[1400px] mx-auto px-4 md:px-10 xl:px-16 py-5 md:py-14 pb-24 md:pb-14 article-body">
					<div className="flex gap-8 xl:gap-10 items-start" style={{ alignItems: 'flex-start' }}>

						{/* ─── MAIN CONTENT ─── */}
						<div className="flex-1 min-w-0 article-content-col">

							{/* HEADER */}
							<div className="mb-5 py-4 fade-up">
								<div className="meta-row mb-3 fade-up fade-up-1">
									<span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${catStyle.bg} ${catStyle.text}`}>
										<span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
										{post.category}
									</span>
									<span className="text-xs text-gray-500">
										By <strong className="text-gray-800 dark:text-gray-100">{post.author?.name}</strong>
									</span>
									<span className="text-xs text-gray-500 flex items-center gap-1">
										<Clock className="w-3 h-3" /> {post.readTime}
									</span>
									<span className="text-xs text-gray-500 flex items-center gap-1">
										<Eye className="w-3 h-3" /> {post.views || '—'} views
									</span>
									<span className="hidden sm:inline text-xs text-gray-400">{post.date}</span>
								</div>

								<h1 className="text-xl sm:text-2xl md:text-[2rem] leading-tight mb-4 fade-up fade-up-2 display-font text-gray-900 dark:text-gray-50">
									{post.title}
								</h1>

								<div className="meta-row mt-4 pt-4 text-xs text-gray-400 fade-up fade-up-4 border-t border-gray-100 dark:border-gray-700">
									<span className="flex items-center gap-1.5">
										<BookOpen className="w-3.5 h-3.5 text-teal-500" />
										{sectionBlocks.length} sections
									</span>
									<span className="flex items-center gap-1.5">
										<TrendingUp className="w-3.5 h-3.5 text-teal-500" />
										Updated {post.date}
									</span>
									<span className="flex items-center gap-1.5">
										<CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
										Expert verified
									</span>
								</div>
							</div>

							{/* HERO IMAGE */}
							{heroImage && (
								<div className="rounded-2xl overflow-hidden mb-3 relative fade-up">
									<img src={heroImage} alt={post.title} className="hero-img" loading="eager" />
									<div className="hero-overlay absolute inset-0" />
								</div>
							)}

							{/* SHARE ROW */}
							<div className="share-row mb-5 py-3">
								<span className="text-xs font-medium text-gray-400">Share:</span>
								{[
									{ bg: '#1877f2', icon: <Facebook className="w-3.5 h-3.5 text-white" />, label: 'Facebook' },
									{ bg: '#000',    icon: <Twitter   className="w-3.5 h-3.5 text-white" />, label: 'X' },
									{ bg: '#25d366', icon: <MessageCircle className="w-3.5 h-3.5 text-white" />, label: 'WhatsApp' },
								].map(({ bg, icon, label }) => (
									<button
										key={label}
										className="w-8 h-8 rounded-full flex items-center justify-center share-btn"
										style={{ background: bg }}
										aria-label={`Share on ${label}`}
									>
										{icon}
									</button>
								))}
								<button
									onClick={handleCopy}
									className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium share-btn ml-auto border transition-colors ${
										copied
											? 'bg-teal-50 dark:bg-teal-900/20 border-teal-400 text-teal-600'
											: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300'
									}`}
								>
									<Share2 className="w-3 h-3" />
									{copied ? 'Copied!' : 'Copy link'}
								</button>
							</div>

							{/* TOC — mobile only */}
							<div className="lg:hidden">
								<TableOfContents
									items={toc}
									activeSection={activeSection}
									onSectionClick={(i) => {
										manualClick.current = true;
										setActiveSection(i);
										setTimeout(() => { manualClick.current = false; }, 1000);
									}}
								/>
							</div>

							{/* KEY STATS */}
							{keyStats && <KeyStats stats={keyStats} />}

							{/* ─── CONTENT BLOCKS ─── */}
							<article>
								{blocks.map((block, blockIdx) => {
									if (block.type === 'section') {
										sectionRefIdx++;
										const refIdx = sectionRefIdx;
										return (
											<div
												key={block.id || blockIdx}
												id={`section-${refIdx}`}
												ref={(el) => (sectionRefs.current[refIdx] = el)}
												className="scroll-mt-24 mb-7"
											>
												{block.heading && (
													<h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-8 mb-3 section-heading display-font text-gray-900 dark:text-gray-50">
														{block.heading}
													</h2>
												)}
												{block.body?.startsWith('<') ? (
													<ProseBody html={block.body} />
												) : (
													block.body?.split('\n\n').map((p, j) => (
														<p
															key={j}
															className="text-sm sm:text-base leading-relaxed mb-4 text-gray-700 dark:text-gray-300"
															style={{ lineHeight: '1.85' }}
														>
															{p}
														</p>
													))
												)}
											</div>
										);
									}

									if (block.type === 'image') {
										return block.url ? <InlineImage key={block.id || blockIdx} block={block} /> : null;
									}

									if (block.type === 'table') {
										return block.data?.length ? <InlineTable key={block.id || blockIdx} block={block} /> : null;
									}

									return null;
								})}
							</article>

							{/* ─── INTERNAL LINK CTA ─── */}
							<div className="my-8 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
								<div>
									<p className="text-white font-semibold text-base leading-snug">
										Looking for a flat or PG in Noida or Greater Noida?
									</p>
									<p className="text-teal-100 text-sm mt-0.5">
										Browse verified listings — instant contact with owners.
									</p>
								</div>
								<div className="flex gap-2 shrink-0">
									<a
										href="/all-properties"
										className="inline-block bg-white text-teal-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors whitespace-nowrap"
									>
										Browse Rentals
									</a>
									<a
										href="/sell-companies/paradise-city"
										className="inline-block bg-teal-500 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors whitespace-nowrap"
									>
										Buy Plots
									</a>
								</div>
							</div>

							{/* FAQs */}
							{faqs.length > 0 && (
								<div
									id={`section-${sectionBlocks.length}`}
									ref={(el) => (sectionRefs.current[sectionBlocks.length] = el)}
									className="scroll-mt-24 mb-10"
								>
									<h2 className="text-xl font-bold mb-1.5 display-font text-gray-900 dark:text-gray-50">
										Frequently Asked Questions
									</h2>
									<p className="text-sm mb-5 text-gray-500">
										Everything you need to know — answered by our experts.
									</p>
									<div className="flex flex-col gap-3">
										{faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} index={i} />)}
									</div>
								</div>
							)}

							{/* TAGS */}
							<div className="flex flex-wrap items-center gap-2 py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-1">
								<span className="text-xs font-semibold uppercase tracking-wider mr-1 text-gray-400">Tagged:</span>
								{tags.map((tag) => (
									<span
										key={tag}
										className="text-xs px-2.5 py-1 rounded-full cursor-pointer tag-pill border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
									>
										#{tag}
									</span>
								))}
							</div>

							{/* AUTHOR */}
							{post.author && <AuthorBio author={post.author} />}

							{/* RELATED */}
							{related.length > 0 && (
								<div className="mt-8 pt-7 border-t border-gray-200 dark:border-gray-700">
									<h2 className="text-lg font-bold mb-4 display-font text-gray-900 dark:text-gray-50">
										You might also like
									</h2>
									<div className="flex flex-col gap-3">
										{related.map((rp) => <RelatedCard key={rp._id || rp.id} post={rp} />)}
									</div>
								</div>
							)}

							{/* CTA */}
							<div
								className="cta-block mt-8 p-5 sm:p-7 rounded-3xl"
								style={{
									background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
									boxShadow: '0 8px 32px rgba(13,148,136,.25)',
								}}
							>
								<div>
									<h3 className="text-lg font-bold text-white mb-1 display-font">
										Looking for property in Noida?
									</h3>
									<p className="text-sm text-white/80">
										Explore verified listings — transparent pricing, instant response.
									</p>
								</div>
								<Link
									to="/listings"
									className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold hover-lift bg-white text-teal-600 w-full sm:w-auto text-center"
								>
									Browse Listings →
								</Link>
							</div>

							{/* COMMENTS */}
							<div className="mt-8 pt-7 border-t border-gray-200 dark:border-gray-700">
								<h2 className="text-lg font-bold mb-5 display-font text-gray-900 dark:text-gray-50">
									Comments{' '}
									<span className="text-sm font-normal ml-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600">
										{comments.length}
									</span>
								</h2>
								<div className="flex gap-3 mb-5 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
									<div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-teal-50 dark:bg-teal-900/20">
										<User className="w-4 h-4 text-teal-600" />
									</div>
									<div className="flex-1 min-w-0 space-y-2">
										<input
											type="text"
											value={commentName}
											onChange={(e) => setCommentName(e.target.value)}
											placeholder="Your name"
											className="w-full px-3 py-2.5 rounded-xl text-sm comment-input border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400"
										/>
										<input
											type="text"
											value={comment}
											onChange={(e) => setComment(e.target.value)}
											onKeyDown={(e) => e.key === 'Enter' && handleComment()}
											placeholder="Share your thoughts…"
											className="w-full px-3 py-2.5 rounded-xl text-sm comment-input border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400"
										/>
										<div className="flex justify-end">
											<button
												onClick={handleComment}
												disabled={commentLoading || !comment.trim() || !commentName.trim()}
												className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-xl share-btn disabled:opacity-50"
												style={{
													background: 'linear-gradient(135deg, #0d9488, #0f766e)',
													boxShadow: '0 4px 12px rgba(13,148,136,.3)',
												}}
											>
												{commentLoading ? 'Posting…' : <> Post <Send className="w-3 h-3" /> </>}
											</button>
										</div>
									</div>
								</div>
								{comments.length > 0 ? (
									<div className="flex flex-col gap-3">
										{comments.map((c, i) => (
											<div key={c._id || i} className="flex gap-3">
												<div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-sm bg-teal-600">
													{(c.name || 'A')[0].toUpperCase()}
												</div>
												<div className="flex-1 rounded-2xl px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
													<div className="flex items-center gap-2 mb-1">
														<span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.name || 'Anonymous'}</span>
														<span className="text-xs text-gray-400">
															{c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : c.date}
														</span>
													</div>
													<p className="text-sm text-gray-600 dark:text-gray-300">{c.text}</p>
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-center py-7 rounded-2xl text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
										<MessageCircle size={15} className="text-gray-300" /> No comments yet — be the first!
									</p>
								)}
							</div>

							<Link
								to="/blog"
								className="mt-8 inline-flex items-center gap-2 text-sm font-semibold hover:underline text-teal-600"
							>
								<ArrowLeft className="w-4 h-4" /> Back to all posts
							</Link>
						</div>

						{/* ─── STICKY SIDEBAR ─── */}
						<aside
							ref={tocSidebarRef}
							className="hidden lg:block w-72 xl:w-80 shrink-0"
							style={{ alignSelf: 'flex-start' }}
						>
							<div style={{ maxHeight: 'calc(100vh - 108px)', overflowY: 'auto', scrollbarWidth: 'none' }}>
								<TableOfContents
									items={toc}
									activeSection={activeSection}
									onSectionClick={(i) => {
										manualClick.current = true;
										setActiveSection(i);
										setTimeout(() => { manualClick.current = false; }, 1000);
									}}
								/>
								<div className="p-5 rounded-2xl text-center bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 border border-teal-100 dark:border-teal-800">
									<div className="flex justify-center mb-2">
										<span className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-100 dark:bg-teal-900/40">
											<Home size={18} className="text-teal-600" />
										</span>
									</div>
									<p className="font-bold text-sm mb-1 display-font text-gray-800 dark:text-gray-100">Need expert advice?</p>
									<p className="text-xs mb-4 text-gray-500">Our property consultants are available now.</p>
									<Link
										to="/contact"
										className="block w-full py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors"
									>
										Talk to an Expert
									</Link>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>

			{/* BACK TO TOP */}
			{showBackTop && (
				<button
					onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
					className="hidden md:flex fixed bottom-6 left-4 w-10 h-10 rounded-xl items-center justify-center text-white back-top-btn"
					style={{
						background: 'linear-gradient(135deg, #0d9488, #0f766e)',
						boxShadow: '0 4px 16px rgba(13,148,136,.35)',
						zIndex: 100,
					}}
					aria-label="Back to top"
				>
					<ArrowUp className="w-4 h-4" />
				</button>
			)}

			{/* MOBILE BOTTOM BAR */}
			<div className="mobile-bottom-bar md:hidden">
				<div className="mobile-bottom-bar-inner flex justify-around items-center px-4 py-2.5 mobile-bar bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 shadow-xl">
					<button
						onClick={() => navigate('/blog')}
						className="flex flex-col items-center text-[10px] gap-0.5 active:scale-90 text-gray-500 dark:text-gray-300 min-w-[52px]"
					>
						<ArrowLeft className="w-5 h-5" /> Blog
					</button>
					<button
						onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
						className="flex flex-col items-center text-[10px] gap-0.5 font-semibold active:scale-90 text-teal-600 min-w-[52px]"
					>
						<Home className="w-5 h-5" /> Top
					</button>
					<button
						onClick={() => navigate('/contact')}
						className="flex flex-col items-center text-[10px] gap-0.5 active:scale-90 text-gray-500 dark:text-gray-300 min-w-[52px]"
					>
						<Phone className="w-5 h-5" /> Contact
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default BlogDetailPage;