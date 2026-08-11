import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	MapPin, Building2, Check, ArrowRight, Download,
	Star, Shield, ChevronRight, X, Home,
	Award, Phone, MessageCircle, ChevronLeft,
	ChevronDown, ArrowUp, Layers,
} from 'lucide-react';

/* ─── image base ─── */
const B = '/images/alpg';
const I = {
	heroBg:        `${B}/hero-towers.jpg`,
	logoGaurs:     `${B}/logo-gaurs-hq.png`,
	overview:      `${B}/overview.jpg`,
	lifestyleView: `${B}/lifestyle-view.jpg`,
	livingRoom:    `${B}/living-room.jpg`,
	iconicTower:   `${B}/iconic-tower.jpg`,
	typicalTower:  `${B}/typical-tower.jpg`,
	clubhouse:     `${B}/clubhouse.jpg`,
	pool:          `${B}/swimming-pool.jpg`,
	gym:           `${B}/gym.jpg`,
	indoorGames:   `${B}/indoor-games.jpg`,
	communityHall: `${B}/community-hall.jpg`,
	centralGreens: `${B}/central-greens.jpg`,
	outdoorArea:   `${B}/outdoor-amenities.jpg`,
	masterPlan:    `${B}/master-plan.png`,
	fpIconic4bhk:  `${B}/fp-iconic-4bhk.jpg`,
	fpIconicDuplex:`${B}/fp-iconic-duplex.jpg`,
	fpTypical4bhk: `${B}/fp-typical-4bhk.jpg`,
	fpTypical3bhk: `${B}/fp-typical-3bhk.jpg`,
	developer:     `${B}/developer.jpg`,
};

/* ─── PROJECT DATA ─── */
const PROJECT = {
	name:         'Aspire Leisure Park',
	byLine:       'by GAURS',
	tagline:      'Landmark Luxury Residences',
	location:     'Plot No. 4, Techzone-4, Greater Noida (W), U.P.',
	phone:        '+919771034916',
	phoneDisplay: '+91 97710 34916',
	wa:           'https://wa.aisensy.com/aabbf5',
	brochure:     '/brochures/alpg-brochure.pdf',
};

const STATS = [
	{ label: 'Project Expanse', value: '~7 Acres',      sub: 'Heart of Greater Noida (W)' },
	{ label: 'Towers',          value: '7',              sub: 'Including 33-Floor Iconic Tower' },
	{ label: 'Iconic Tower',    value: '33 Floors',      sub: '2 Exclusive Units per Floor' },
	{ label: 'Clubhouse',       value: '23,960 sq.ft',   sub: '2226 sq.mt · Ultra-Modern' },
	{ label: 'Road Front',      value: '60 & 45 Mtr',   sub: 'Prime Road Connectivity' },
	{ label: 'Parking',         value: '4-Level Podium', sub: 'Podium Style Living' },
];

const UNIT_TYPES = [
	{
		label:   'Iconic Tower — 4 BHK',
		towers:  'Tower 7 (T7, G+33)',
		type:    '4 BHK + Servant Room',
		sqmtr:   '350.19 sq.mt',
		sqft:    3769,
		bsp:     14000,
		carpet:  '177.92 sq.mt / 1915 sq.ft',
		balcony: '60.70 sq.mt / 653 sq.ft',
		builtup: '257.90 sq.mt / 2776 sq.ft',
		fpImg:   I.fpIconic4bhk,
		tag:     'ICONIC',
		gold:    true,
	},
	{
		label:   'Iconic Tower — Duplex',
		towers:  'Tower 7 (T7, G+33)',
		type:    'Duplex 5 BHK + Servant Room',
		sqmtr:   '674.71 sq.mt',
		sqft:    7263,
		bsp:     14000,
		carpet:  '286.91 sq.mt / 3088 sq.ft',
		balcony: '168.85 sq.mt / 1818 sq.ft',
		builtup: '491.06 sq.mt / 5286 sq.ft',
		fpImg:   I.fpIconicDuplex,
		tag:     'PENTHOUSE',
		gold:    true,
	},
	{
		label:   'Typical Tower — 4 BHK',
		towers:  'Tower 1–6 (G+25)',
		type:    '4 BHK + Servant Room',
		sqmtr:   '258.58 sq.mt',
		sqft:    2783,
		bsp:     13000,
		carpet:  '158.78 sq.mt / 1709 sq.ft',
		balcony: '27.20 sq.mt / 293 sq.ft',
		builtup: '203.84 sq.mt / 2194 sq.ft',
		fpImg:   I.fpTypical4bhk,
		tag:     '',
		gold:    false,
	},
	{
		label:   'Typical Tower — 3 BHK',
		towers:  'Tower 1–6 (G+25)',
		type:    '3 BHK + Servant Room',
		sqmtr:   '213.58 sq.mt',
		sqft:    2299,
		bsp:     13000,
		carpet:  '125.76 sq.mt / 1353 sq.ft',
		balcony: '20.70 sq.mt / 223 sq.ft',
		builtup: '161.64 sq.mt / 1740 sq.ft',
		fpImg:   I.fpTypical3bhk,
		tag:     'POPULAR',
		gold:    false,
	},
];

const FLOOR_PLC_ICONIC = [
	{ floor: 'GF – 5th',    plc: 750 }, { floor: '6th – 10th',  plc: 700 },
	{ floor: '11th – 15th', plc: 600 }, { floor: '16th – 20th', plc: 500 },
	{ floor: '21st – 25th', plc: 400 }, { floor: '26th – 31st', plc: 300 },
	{ floor: 'Top Floor',   plc: 0   },
];
const FLOOR_PLC_TYPICAL = [
	{ floor: 'GF – 5th',    plc: 750 }, { floor: '6th – 10th',  plc: 700 },
	{ floor: '11th – 15th', plc: 600 }, { floor: '16th – 20th', plc: 500 },
	{ floor: '21st – 24th', plc: 400 }, { floor: '25th Floor',  plc: 0   },
];
const VIEW_PLC = [
	{ view: 'Park Facing', plc: 250 }, { view: 'Road Facing', plc: 300 }, { view: 'Corner Facing', plc: 200 },
];
const ADD_CHARGES = [
	{ name: '1 Parking Slot',              val: '₹5,50,000' },
	{ name: 'Club Membership',             val: '₹7,00,000' },
	{ name: 'Power Backup (upto 3.5 KVA)', val: '₹2,00,000' },
	{ name: 'Electricity Infrastructure',  val: '₹1,00,000' },
	{ name: 'IFMS',                        val: '₹25 / sq.ft' },
	{ name: 'Lease Rent',                  val: '₹50 / sq.ft' },
	{ name: 'Additional Car Parking',      val: '₹3,50,000 + taxes' },
	{ name: 'Maintenance',                 val: '₹2.99 / sq.ft + GST 18%' },
];

const CLP_ICONIC = [
	{ milestone: 'On Booking',                             pct: 10  },
	{ milestone: 'Within 45 Days from Booking',            pct: 10  },
	{ milestone: 'On Start of Rafting',                    pct: 5   },
	{ milestone: 'On Start of Lower Basement',             pct: 5   },
	{ milestone: 'On Completion of Stilt-1 Floor',         pct: 5   },
	{ milestone: 'On Completion of Ground Floor',          pct: 5   },
	{ milestone: 'On Completion of 4th Floor Roof',        pct: 7.5 },
	{ milestone: 'On Completion of 8th Floor Roof',        pct: 7.5 },
	{ milestone: 'On Completion of 12th Floor Roof',       pct: 7.5 },
	{ milestone: 'On Completion of 16th Floor Roof',       pct: 7.5 },
	{ milestone: 'On Completion of 20th Floor Roof',       pct: 7.5 },
	{ milestone: 'On Completion of 25th Floor Roof',       pct: 5   },
	{ milestone: 'On Completion of Top Floor',             pct: 7.5 },
	{ milestone: 'On Start of MEP / Flooring / Finishing', pct: 5   },
	{ milestone: 'On Offer for Possession',                pct: 5   },
];
const CLP_TYPICAL = [
	{ milestone: 'On Booking',                             pct: 10  },
	{ milestone: 'Within 45 Days from Booking',            pct: 10  },
	{ milestone: 'On Start of Rafting',                    pct: 5   },
	{ milestone: 'On Start of Lower Basement',             pct: 5   },
	{ milestone: 'On Completion of Stilt-1 Floor',         pct: 5   },
	{ milestone: 'On Completion of Ground Floor',          pct: 5   },
	{ milestone: 'On Completion of 4th Floor Roof',        pct: 7.5 },
	{ milestone: 'On Completion of 8th Floor Roof',        pct: 7.5 },
	{ milestone: 'On Completion of 12th Floor Roof',       pct: 7.5 },
	{ milestone: 'On Completion of 16th Floor Roof',       pct: 7.5 },
	{ milestone: 'On Completion of 20th Floor Roof',       pct: 7.5 },
	{ milestone: 'On Completion of Top Floor',             pct: 10  },
	{ milestone: 'On Start of MEP / Flooring / Finishing', pct: 7.5 },
	{ milestone: 'On Offer for Possession',                pct: 5   },
];
const SPECIAL_PLAN = [
	{ milestone: 'On Booking',                              pct: 10  },
	{ milestone: '5% per Month (in 3 months)',              pct: 15  },
	{ milestone: 'On Completion of 20th Floor',             pct: 25  },
	{ milestone: 'On Completion of Top Floor (25th Floor)', pct: 25  },
	{ milestone: 'On Offer for Possession',                 pct: 25  },
];

const AMENITY_ZONES = [
	{
		zone: 'Indoor Clubhouse',
		color: '#166534',
		items: [
			'Swimming Pool','Well-equipped Gymnasium','Community Hall (70–80 capacity)',
			'Indoor Game Area','Cafeteria & Coffee Shop','Pool Table & Board Games',
			'Air Hockey & Foosball',
		],
	},
	{
		zone: 'Outdoor Zone',
		color: '#b45309',
		items: [
			'Open Gym','Two Badminton Courts','Half Basketball Court',
			'Yoga Lawn','Gazebo Seating','Kids\' Play Area',
			'Central Greens','Human Ludo','Park & Water Bodies',
		],
	},
];

const CONNECTIVITY = [
	{ dist: 'Adjacent', place: 'D-Mart' },
	{ dist: '1.5 kms',  place: 'Ryan International School' },
	{ dist: '2 kms',    place: 'Gaur Chowk (Upcoming Metro)' },
	{ dist: '2 kms',    place: 'Gaur City Mall' },
	{ dist: '2.5 kms',  place: 'The Gaurs Sarovar Premiere' },
	{ dist: '3 kms',    place: 'Mulberry Chowk' },
	{ dist: '4 kms',    place: 'Noida' },
	{ dist: '4.5 kms',  place: 'Gaurs International School' },
	{ dist: '4.5 kms',  place: 'Sarvodya Hospital' },
	{ dist: '7.5 kms',  place: 'Ghaziabad Railway Station' },
	{ dist: '8 kms',    place: 'Sector 51 Metro, Noida' },
	{ dist: '41 kms',   place: 'IGI Airport, Delhi' },
];

const GAURS_MILESTONES = [
	{ val: '3 Decades',  label: 'of Unfaltering Commitment' },
	{ val: '70+',        label: 'Delivered Projects' },
	{ val: '75,000+',    label: 'Delivered Units' },
	{ val: '3,00,000+',  label: 'Happy Customers' },
];

const BANK = {
	name:    'UCO Bank',
	account: 'Receiver AMP New Unit Sale of Leisure Park Phase – III Account',
	branch:  'Supreme Court, Tilak Marg, New Delhi – 110001',
	accNo:   '02070210004722',
	ifsc:    'UCBA0000207',
};


const GAURS_DELIVERY = [
	{ num:'35', label:'Delivered Residential Projects' },
	{ num:'30', label:'Delivered Commercial Projects' },
	{ num:'3',  label:'Township Projects', sub:'Gaur Yamuna City · Gaur City · Crossings Republic' },
	{ num:'4',  label:'Schools', sub:'GAURS International School & more' },
	{ num:'2',  label:'Retail Malls', sub:'Gaur City Mall · Gaur Central' },
	{ num:'2',  label:'Hotels', sub:'Radisson Blu · Gaur Sarovar Premiere' },
];

const GAURS_AWARDS = [
	{ year:'2024', title:'Best Selling Project of the Year', project:'GAUR NYC Residences', award:'Realty+ Conclave & Excellence Awards North' },
	{ year:'2024', title:'Themed Project of the Year', project:'GAUR NYC Residences', award:'Realty+ Conclave & Excellence Awards North' },
	{ year:'2023', title:'Ultra Luxury Lifestyle Project of the Year', project:'The Islands by GAURS', award:'Realty+ Excellence Awards North' },
	{ year:'2023', title:'Excellence in Delivery', project:'GAUR World Smartstreet', award:'Realty+ Excellence Awards North' },
	{ year:'2022', title:'Luxury Project of the Year', project:'The Islands by GAURS', award:'Realty+ Excellence Awards North' },
	{ year:'2022', title:'Best Mall – Leisure & Entertainment, Delhi NCR', project:'GAUR City Mall', award:'MAPIC India Shopping Center Awards' },
	{ year:'2020', title:'Best Smart City Developer of the Year', project:'GAURSONS India', award:'Smart City Empowering India Awards' },
	{ year:'2019', title:'Best Real Estate Developer of the Year', project:'GAURSONS India', award:'Times Business Awards' },
];

const RERA_PROJECTS = [
	{ name:'Gaur Mulberry Mansions', location:'Gr. Noida (W)', rera:'UPRERAPRJ7057 / PRJ4897' },
	{ name:'Gaur Aero Mall & Passport Studios', location:'Ghaziabad', rera:'UPRERAPRJ663149' },
	{ name:'7th Avenue Phase-II, Gaur City', location:'Gr. Noida (W)', rera:'UPRERAPRJ6695' },
	{ name:'Gaur Aero Heights', location:'Ghaziabad', rera:'UPRERAPRJ941355' },
	{ name:'14th Avenue Phase-II, Gaur City-2', location:'Gr. Noida (W)', rera:'UPRERAPRJ8742' },
	{ name:'Trecento Residences by GAURS', location:'Greater Noida', rera:'UPRERAPRJ283531' },
	{ name:'Gaurs Runway Suites, Gaur Yamuna City', location:'Yamuna Expressway', rera:'UPRERAPRJ51477' },
	{ name:'Gaur HYC Residences', location:'DMXP', rera:'UPRERAPRJ188811' },
	{ name:'Gaur City Center Ph.II', location:'Gr. Noida (W)', rera:'UPRERAPRJ4780' },
	{ name:'Legacy By GAURS', location:'Greater Noida', rera:'UPRERAPRJ888399' },
	{ name:'The Islands by GAURS', location:'Greater Noida (W)', rera:'UPRERAPRJ734509' },
];

const AMENITY_SLIDES = [
	{
		img: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1400&q=85',
		caption: 'Ultra-Modern Clubhouse — An Icon of Leisure',
		label: 'Clubhouse',
	},
	{
		img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85',
		caption: 'Lavish Swimming Pool — A Rejuvenating Splash of Luxury',
		label: 'Swimming Pool',
	},
	{
		img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85',
		caption: 'Mind, Body & Soul Zone — State-of-the-Art Gymnasium',
		label: 'Gymnasium',
	},
	{
		img: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1400&q=85',
		caption: 'Indoor Gaming Redefined — Billiards, Boards & Beyond',
		label: 'Indoor Games',
	},
	{
		img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85',
		caption: 'Grand Community Hall — From Meetups to Memories',
		label: 'Community Hall',
	},
	{
		img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=85',
		caption: 'Breathe Fresh Air — Central Greens & Gazebo Seating',
		label: 'Central Greens',
	},
	{
		img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=85',
		caption: 'Open Gym & Sports — Fresh Air, Freer Living',
		label: 'Outdoor Zone',
	},
	{
		img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85',
		caption: 'Expansive Balconies — Panoramic Views Every Morning',
		label: 'Balcony View',
	},
];

/* ── helpers ── */
const fmtINR = (n) =>
	n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr*` : `₹${(n / 100000).toFixed(0)} L*`;

/* ══════════════════════════════════════════════
   ANIMATION SYSTEM (same prefix as ACP to avoid conflicts)
══════════════════════════════════════════════ */
const GLOBAL_CSS = `
	@keyframes alpgKenburns { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
	@keyframes alpgFadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
	@keyframes alpgFadeIn { from { opacity: 0; } to { opacity: 1; } }
	@keyframes alpgZoomIn { from { opacity: 0; transform: scale(.94) translateY(12px); } to { opacity: 1; transform: none; } }
	@keyframes alpgShine { 0% { left: -90%; } 60%,100% { left: 130%; } }
	@keyframes alpgFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
	@keyframes alpgBounce { 0%,100% { transform: translateY(0); opacity:.9; } 50% { transform: translateY(7px); opacity:.4; } }

	.alpg-anim { opacity:0; animation: alpgFadeUp .85s cubic-bezier(.22,1,.36,1) forwards; }
	.alpg-kb   { animation: alpgKenburns 22s ease-out forwards; }
	.alpg-float{ animation: alpgFloat 4.5s ease-in-out infinite; }
	.alpg-bounce{ animation: alpgBounce 2s ease-in-out infinite; }
	.alpg-zoom { animation: alpgZoomIn .35s cubic-bezier(.22,1,.36,1) both; }
	.alpg-fade { animation: alpgFadeIn .3s ease both; }

	.alpg-shine { position:relative; overflow:hidden; }
	.alpg-shine::after {
		content:''; position:absolute; top:0; left:-90%;
		width:45%; height:100%;
		background: linear-gradient(105deg,transparent,rgba(255,255,255,.32),transparent);
		transform: skewX(-20deg);
		animation: alpgShine 3.4s ease-in-out infinite;
		pointer-events:none;
	}
	.alpg-img { transition: transform .7s cubic-bezier(.22,1,.36,1); }
	.group:hover .alpg-img { transform: scale(1.06); }
	.alpg-lift { transition: transform .3s ease, box-shadow .3s ease; }
	.alpg-lift:hover { transform: translateY(-4px); box-shadow: 0 16px 36px -10px rgba(22,101,52,.22); }
	.alpg-sb::-webkit-scrollbar { display:none; }
	.alpg-sb { -ms-overflow-style:none; scrollbar-width:none; }
	section[id] { scroll-margin-top: 84px; }
	@media (max-width: 767px) { #aisensy-wa-widget { display: none !important; } }
	@media (prefers-reduced-motion:reduce) {
		.alpg-anim,.alpg-kb,.alpg-float,.alpg-bounce,.alpg-zoom,.alpg-fade { animation:none!important; opacity:1!important; transform:none!important; }
		.alpg-shine::after { animation:none!important; display:none; }
	}
`;

const prefRed = () =>
	typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches;

const useInView = (t = 0.15) => {
	const ref = useRef(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const el = ref.current; if (!el) return;
		if (prefRed() || !window.IntersectionObserver) { setVis(true); return; }
		const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: t, rootMargin: '0px 0px -40px 0px' });
		ob.observe(el);
		return () => ob.disconnect();
	}, [t]);
	return [ref, vis];
};

const Reveal = ({ children, delay = 0, y = 26, className = '' }) => {
	const [ref, vis] = useInView();
	return (
		<div ref={ref} className={className}
			style={{ opacity: vis?1:0, transform: vis?'none':`translateY(${y}px)`, transition:`opacity .7s ease ${delay}ms,transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`, willChange:'opacity,transform' }}>
			{children}
		</div>
	);
};

const Counter = ({ text, duration = 1500 }) => {
	const m = String(text).match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
	const [ref, vis] = useInView(0.4);
	const target = m ? parseFloat(m[2].replace(/,/g,'')) : 0;
	const [val, setVal] = useState(0);
	useEffect(() => {
		if (!vis || !m) return;
		if (prefRed()) { setVal(target); return; }
		let raf; const t0 = performance.now();
		const tick = t => { const p = Math.min(1,(t-t0)/duration); setVal(target*(1-Math.pow(1-p,3))); if (p<1) raf=requestAnimationFrame(tick); };
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [vis]); // eslint-disable-line
	if (!m) return <span>{text}</span>;
	const display = m[2].includes('.')? val.toFixed(2) : Math.round(val).toLocaleString('en-IN');
	return <span ref={ref}>{m[1]}{display}{m[3]}</span>;
};

const ScrollProgress = () => {
	const [p,setP] = useState(0);
	useEffect(() => {
		const fn = () => { const h=document.documentElement; setP(h.scrollHeight-h.clientHeight>0?h.scrollTop/(h.scrollHeight-h.clientHeight):0); };
		fn(); window.addEventListener('scroll',fn,{passive:true});
		return () => window.removeEventListener('scroll',fn);
	},[]);
	return <div className="fixed top-0 left-0 z-[60] h-[3px] bg-gradient-to-r from-green-900 via-green-500 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,.5)]" style={{width:`${p*100}%`,transition:'width .1s linear'}}/>;
};


const GoldDivider = ({ center=true }) => (
	<div className={`flex items-center gap-3 my-4 ${center?'justify-center':''}`}>
		<div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c4a84f]"/>
		<div className="w-1.5 h-1.5 rounded-full bg-[#c4a84f]"/>
		<div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c4a84f]"/>
	</div>
);

const SectionHeading = ({ kicker, title, sub, center=true, light=false }) => (
	<Reveal>
		<div className={`mb-8 md:mb-12 ${center?'text-center':''}`}>
			{kicker && <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-2 text-[#c4a84f]">{kicker}</p>}
			<h2 className={`text-2xl md:text-3xl font-bold ${light?'text-white':'text-slate-900 dark:text-white'}`}>{title}</h2>
			<GoldDivider center={center}/>
			{sub && <p className={`text-sm leading-relaxed max-w-2xl ${center?'mx-auto':''} ${light?'text-white/70':'text-slate-600 dark:text-slate-400'}`}>{sub}</p>}
		</div>
	</Reveal>
);

/* Lead form */
const ALPG_UNITS = [
	'3 BHK + Servant — 2299 sq.ft (Typical Tower)',
	'4 BHK + Servant — 2783 sq.ft (Typical Tower)',
	'4 BHK + Servant — 3769 sq.ft (Iconic Tower)',
	'Duplex 5 BHK + Servant — 7263 sq.ft (Iconic Tower)',
];

const LeadForm = ({ dark=false, compact=false }) => {
	const [form,setForm] = useState({name:'',phone:'',query:''});
	const [sent,setSent] = useState(false);
	const [submitting,setSubmitting] = useState(false);
	const [err,setErr] = useState('');
	const [ddOpen,setDdOpen] = useState(false);
	const ddRef = useRef(null);

	useEffect(()=>{
		if(!ddOpen) return;
		const h = e => { if(ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
		document.addEventListener('mousedown',h);
		return ()=>document.removeEventListener('mousedown',h);
	},[ddOpen]);

	const submit = async e => {
		e.preventDefault();
		setSubmitting(true); setErr('');
		try {
			await api.post('/inquiries/',{
				name: form.name,
				phone: form.phone,
				preferred_property_type: form.query || null,
				inquiry_type: 'SELL_ENQUIRY',
				source_page: 'aspire-leisure-park',
				whatsapp_opt_in: false,
			});
			setSent(true);
			setTimeout(()=>{ setSent(false); setForm({name:'',phone:'',query:''}); },4000);
		} catch {
			setErr('Something went wrong. Please try again.');
		} finally { setSubmitting(false); }
	};

	if (sent) return (
		<div className={`py-8 text-center rounded-2xl alpg-zoom ${dark?'bg-white/5':'bg-green-50'}`}>
			<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
				<Check className="text-green-700" size={22}/>
			</div>
			<p className={`font-bold ${dark?'text-white':'text-slate-900'}`}>Thank you!</p>
			<p className={`text-sm mt-1 ${dark?'text-white/60':'text-slate-600'}`}>InstaMakaan team will call you shortly.</p>
		</div>
	);

	const inp = dark
		? 'w-full bg-transparent border-b border-white/30 px-0 py-2.5 text-sm text-white placeholder-white/50 focus:border-green-400 focus:outline-none transition'
		: 'w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600/20 transition';

	return (
		<form onSubmit={submit} className="space-y-3">
			<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your Full Name" className={inp}/>
			<div className={`flex items-center ${dark?'border-b border-white/30':'border border-slate-200 rounded-lg bg-white'}`}>
				<span className={`pl-3 pr-2 text-sm ${dark?'text-white/70':'text-slate-600'}`}>🇮🇳 +91</span>
				<input required type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone Number"
					className={`flex-1 px-2 py-2.5 text-sm bg-transparent focus:outline-none ${dark?'text-white placeholder-white/50':'text-slate-900 placeholder-slate-400'}`}/>
			</div>
			{!compact && (
				<div ref={ddRef} className="relative">
					<button type="button" onClick={()=>setDdOpen(o=>!o)}
						className={`w-full flex items-center justify-between gap-2 cursor-pointer text-left ${dark
							? 'border-b border-white/30 px-0 py-2.5 text-sm bg-transparent'
							: 'border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white'
						}`}>
						<span className={form.query?(dark?'text-white':'text-slate-900'):(dark?'text-white/50':'text-slate-400')}>
							{form.query || 'Select Unit Type'}
						</span>
						<ChevronDown size={15} className={`flex-shrink-0 transition-transform duration-200 ${ddOpen?'rotate-180':''} ${dark?'text-white/50':'text-slate-400'}`}/>
					</button>
					{ddOpen && (
						<div className={`absolute z-50 top-full mt-1 left-0 right-0 rounded-xl overflow-hidden shadow-2xl border ${dark?'border-white/10':'border-slate-200'}`}
							style={{background: dark?'#0d2614':'#fff'}}>
							{ALPG_UNITS.map(u=>(
								<button key={u} type="button"
									onClick={()=>{ setForm({...form,query:u}); setDdOpen(false); }}
									className={`w-full text-left px-4 py-3 text-sm transition-colors ${
										form.query===u
											? (dark?'bg-green-900/50 text-green-300 font-semibold':'bg-green-50 text-green-700 font-semibold')
											: (dark?'text-white/80 hover:bg-white/5':'text-slate-700 hover:bg-slate-50')
									}`}>
									{u}
								</button>
							))}
						</div>
					)}
				</div>
			)}
			{err && <p className="text-red-400 text-xs">{err}</p>}
			<p className={`text-[10px] leading-tight ${dark?'text-white/40':'text-slate-400'}`}>
				By submitting, I authorise InstaMakaan to contact me via call/SMS/WhatsApp.
			</p>
			<button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-green-800 to-green-600 hover:from-green-900 hover:to-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-700/25 transition alpg-shine">
				{submitting ? 'Sending…' : <><span>Enquire via InstaMakaan</span><ArrowRight size={15}/></>}
			</button>
		</form>
	);
};

const PopupModal = ({ open, onClose }) => {
	useEffect(() => {
		if (!open) return;
		const h = e=>{ if(e.key==='Escape') onClose(); };
		document.addEventListener('keydown',h);
		return ()=>document.removeEventListener('keydown',h);
	},[open,onClose]);
	if (!open) return null;
	return (
		<div onClick={onClose} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 alpg-fade">
			<div onClick={e=>e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative alpg-zoom">
				<button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-green-800 hover:bg-green-900 text-white flex items-center justify-center transition hover:rotate-90">
					<X size={18}/>
				</button>
				<div className="h-44 overflow-hidden relative bg-[#071a0e]">
					<img src={I.heroBg} alt="" className="w-full h-full object-cover opacity-50"/>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
						<p className="text-[10px] font-bold tracking-[0.3em] text-green-400 uppercase mb-1">Aspire</p>
						<p className="text-2xl font-black text-white">LEISURE PARK</p>
						<p className="text-xs text-green-300 mt-1">by GAURS · Techzone-4, Gr. Noida (W)</p>
					</div>
				</div>
				<div className="p-6">
					<p className="text-xs text-slate-500 text-center mb-5">₹13,000–₹14,000/sq.ft · 3 &amp; 4 BHK Landmark Luxury Residences</p>
					<LeadForm compact/>
				</div>
			</div>
		</div>
	);
};

const Lightbox = ({ images, idx, onClose, onNav }) => {
	const tsX = useRef(null);
	useEffect(() => {
		if (idx===null) return;
		const h = e=>{ if(e.key==='Escape') onClose(); else if(e.key==='ArrowLeft') onNav((idx-1+images.length)%images.length); else if(e.key==='ArrowRight') onNav((idx+1)%images.length); };
		document.addEventListener('keydown',h);
		return ()=>document.removeEventListener('keydown',h);
	},[idx,images.length,onClose,onNav]);
	if (idx===null) return null;
	return (
		<div onClick={onClose} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 alpg-fade"
			onTouchStart={e=>{tsX.current=e.touches[0].clientX;}}
			onTouchEnd={e=>{ if(!tsX.current) return; const d=tsX.current-e.changedTouches[0].clientX; if(Math.abs(d)>50) onNav(d>0?(idx+1)%images.length:(idx-1+images.length)%images.length); tsX.current=null; }}>
			<button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition hover:rotate-90"><X size={20}/></button>
			<div onClick={e=>e.stopPropagation()} className="max-w-5xl w-full alpg-zoom">
				<img src={images[idx]} className="w-full max-h-[82vh] object-contain rounded-xl" alt=""/>
				<div className="flex justify-center gap-3 mt-4">
					<button onClick={()=>onNav((idx-1+images.length)%images.length)} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"><ChevronLeft size={16}/></button>
					<span className="px-4 py-2 text-white/60 text-sm">{idx+1}/{images.length}</span>
					<button onClick={()=>onNav((idx+1)%images.length)} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"><ChevronRight size={16}/></button>
				</div>
			</div>
		</div>
	);
};

/* Amenity Slider — left photo, right text */
const AmenitySlider = ({ slides }) => {
	const [idx,setIdx] = useState(0);
	const [paused,setPaused] = useState(false);
	const go = useCallback(n=>setIdx((n+slides.length)%slides.length),[slides.length]);
	const next = useCallback(()=>go(idx+1),[idx,go]);
	useEffect(()=>{ if(paused) return; const t=setInterval(next,4500); return ()=>clearInterval(t); },[next,paused]);
	const s = slides[idx];
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-[#c4a84f]/20"
			onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>

			{/* Left: Image */}
			<div className="relative overflow-hidden" style={{minHeight:'clamp(220px,50vw,340px)'}}>
				{slides.map((sl,i)=>(
					<div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===idx?'opacity-100':'opacity-0'}`}>
						<img src={sl.img} alt={sl.label} className="w-full h-full object-cover"/>
					</div>
				))}
				{/* slide counter badge */}
				<div className="absolute top-4 left-4 z-10 bg-black/55 backdrop-blur-sm border border-white/15 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
					{String(idx+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}
				</div>
				{/* prev/next */}
				<button onClick={()=>go(idx-1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-[#c4a84f] text-white flex items-center justify-center transition-colors"><ChevronLeft size={18}/></button>
				<button onClick={()=>go(idx+1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-[#c4a84f] text-white flex items-center justify-center transition-colors"><ChevronRight size={18}/></button>
			</div>

			{/* Right: Text content */}
			<div className="flex flex-col justify-between p-8 lg:p-10" style={{background:'linear-gradient(135deg,#071a0e 0%,#0a2214 100%)'}}>
				<div>
					<p className="text-[#c4a84f] text-[9px] font-bold tracking-[0.3em] uppercase mb-4">Aspire Leisure Park · Amenities</p>
					<div className="h-[1px] w-12 bg-gradient-to-r from-[#c4a84f] to-transparent mb-6"/>
					<h3 className="text-2xl lg:text-3xl font-bold text-white leading-snug mb-5">{s.caption}</h3>
					<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4a84f]/12 border border-[#c4a84f]/35 text-[#c4a84f] text-xs font-bold uppercase tracking-widest">
						<span className="w-1.5 h-1.5 rounded-full bg-[#c4a84f]"/>
						{s.label}
					</span>
				</div>

				{/* Dot navigation + hint */}
				<div className="mt-8">
					<div className="flex gap-2 mb-4">
						{slides.map((_,i)=>(
							<button key={i} onClick={()=>go(i)}
								className="rounded-full transition-all duration-300"
								style={{width:i===idx?28:7,height:7,background:i===idx?'#c4a84f':'rgba(255,255,255,0.18)'}}/>
						))}
					</div>
					<p className="text-white/25 text-[10px]">Hover to pause · Arrows to navigate</p>
				</div>
			</div>
		</div>
	);
};

/* Floor Plan Viewer — Premium redesign */
const FloorPlanViewer = ({ units, onEnquire }) => {
	const [sel,setSel] = useState(0);
	const [zoom,setZoom] = useState(1);
	const [pan,setPan] = useState({x:0,y:0});
	const [panning,setPanning] = useState(false);
	const dragStart = useRef({x:0,y:0});
	const pinchRef = useRef(null);
	const cRef = useRef(null);
	const reset = i=>{ setSel(i); setZoom(1); setPan({x:0,y:0}); };
	const onDown = e=>{ if(zoom<=1) return; setPanning(true); dragStart.current={x:e.clientX-pan.x,y:e.clientY-pan.y}; };
	const onMove = e=>{ if(!panning) return; const el=cRef.current; const mx=el?(el.offsetWidth*(zoom-1))/2:999; const my=el?(el.offsetHeight*(zoom-1))/2:999; setPan({x:Math.max(-mx,Math.min(mx,e.clientX-dragStart.current.x)),y:Math.max(-my,Math.min(my,e.clientY-dragStart.current.y))}); };
	const onUp = ()=>setPanning(false);
	const onTS = e=>{ if(e.touches.length===1&&zoom>1){setPanning(true);dragStart.current={x:e.touches[0].clientX-pan.x,y:e.touches[0].clientY-pan.y};}else if(e.touches.length===2){const dx=e.touches[0].clientX-e.touches[1].clientX;const dy=e.touches[0].clientY-e.touches[1].clientY;pinchRef.current={dist:Math.hypot(dx,dy),zoom};} };
	const onTM = e=>{ e.preventDefault(); if(e.touches.length===1&&panning){const el=cRef.current;const mx=el?(el.offsetWidth*(zoom-1))/2:999;const my=el?(el.offsetHeight*(zoom-1))/2:999;setPan({x:Math.max(-mx,Math.min(mx,e.touches[0].clientX-dragStart.current.x)),y:Math.max(-my,Math.min(my,e.touches[0].clientY-dragStart.current.y))});}else if(e.touches.length===2&&pinchRef.current){const dx=e.touches[0].clientX-e.touches[1].clientX;const dy=e.touches[0].clientY-e.touches[1].clientY;const dist=Math.hypot(dx,dy);setZoom(Math.max(1,Math.min(3,+(pinchRef.current.zoom*dist/pinchRef.current.dist).toFixed(1))));} };
	const onTE = ()=>{ setPanning(false); pinchRef.current=null; };
	const u = units[sel];
	const sqft = u.sqft.toLocaleString('en-IN');

	return (
		<Reveal>
		<div className="max-w-5xl mx-auto">

			{/* ── Unit selector pills ── */}
			<div className="flex gap-2 mb-5">
				{units.map((unit,i)=>(
					<button key={i} onClick={()=>reset(i)}
						className={`flex-1 min-w-0 flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
							sel===i
								? 'bg-[#c4a84f]/12 border-[#c4a84f]/55 shadow-lg'
								: 'bg-white/4 border-white/8 hover:border-white/22 hover:bg-white/7'
						}`}>
						<span className={`text-[9px] font-bold tracking-widest uppercase ${sel===i?'text-[#c4a84f]':'text-white/35'}`}>{unit.towers.split('(')[0].trim()}</span>
						<span className={`text-sm font-black leading-tight ${sel===i?'text-white':'text-white/40'}`}>{unit.type.replace(' + Servant Room','')}</span>
						<div className="flex items-center gap-1.5 mt-1">
							<span className={`text-[10px] font-semibold ${sel===i?'text-white/60':'text-white/25'}`}>{unit.sqft.toLocaleString('en-IN')} sq.ft</span>
							{unit.tag&&<span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${sel===i?'bg-[#c4a84f] text-[#071a0e]':'bg-white/8 text-white/40'}`}>{unit.tag}</span>}
						</div>
					</button>
				))}
			</div>

			{/* ── Main layout: floor plan + details panel ── */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

				{/* Floor plan image (2/3 width on desktop) */}
				<div className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#c4a84f]/20 shadow-2xl shadow-black/40 flex flex-col">
					{/* Image top bar */}
					<div className="bg-[#071a0e] px-4 py-2.5 flex items-center justify-between border-b border-[#c4a84f]/15">
						<div>
							<p className="text-[#c4a84f] text-[9px] font-bold tracking-[0.25em] uppercase">{u.towers}</p>
							<p className="text-white text-sm font-bold leading-tight mt-0.5">{u.type}</p>
						</div>
						<div className="flex items-center gap-1 bg-white/6 border border-white/10 rounded-lg overflow-hidden">
							<button onClick={()=>setZoom(z=>{const n=Math.max(1,+(z-.5).toFixed(1));if(n===1)setPan({x:0,y:0});return n;})} disabled={zoom<=1}
								className="px-3 py-1.5 text-white/50 hover:text-[#c4a84f] disabled:opacity-20 font-bold text-sm leading-none transition">−</button>
							<span className="text-white/35 text-[10px] font-mono w-8 text-center select-none">{zoom.toFixed(1)}×</span>
							<button onClick={()=>setZoom(z=>Math.min(3,+(z+.5).toFixed(1)))} disabled={zoom>=3}
								className="px-3 py-1.5 text-white/50 hover:text-[#c4a84f] disabled:opacity-20 font-bold text-sm leading-none transition">+</button>
						</div>
					</div>

					{/* Image viewport */}
					<div ref={cRef} className="relative overflow-hidden"
						style={{height:'clamp(240px,40vw,420px)',flexShrink:0,cursor:zoom>1?(panning?'grabbing':'grab'):'default',touchAction:'none',background:'radial-gradient(ellipse at center, #e8e2d4 0%, #d8d0c0 100%)'}}
						onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
						onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}>
						<div className="w-full h-full flex items-center justify-center p-3 select-none"
							style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:'center',transition:panning?'none':'transform 0.25s ease'}}>
							<img key={sel} src={u.fpImg} alt={u.label} className="w-full h-full object-contain pointer-events-none drop-shadow-xl"/>
						</div>
						{zoom>1&&(
							<button onClick={()=>{setZoom(1);setPan({x:0,y:0});}}
								className="absolute bottom-3 left-3 bg-[#071a0e]/90 border border-[#c4a84f]/40 text-[#c4a84f] text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur">
								↺ Reset
							</button>
						)}
						{zoom===1&&(
							<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white/50 text-[9px] px-3 py-1 rounded-full pointer-events-none">
								Pinch or use +/− to zoom
							</div>
						)}
					</div>

					{/* Quick stats strip */}
					<div className="bg-[#071a0e] px-4 py-2.5 flex flex-1 items-center gap-0 border-t border-[#c4a84f]/15 overflow-x-auto alpg-sb">
						{[['Built-up',`${sqft} sq.ft`],['Carpet',u.carpet],['Balcony',u.balcony]].map(([k,v],i)=>(
							<div key={k} className="flex items-center flex-shrink-0">
								{i>0&&<span className="text-white/12 mx-3 text-base">|</span>}
								<span className="text-white/35 text-[9px] uppercase tracking-wider mr-1.5 whitespace-nowrap">{k}</span>
								<span className="text-[#c4a84f] text-[11px] font-bold whitespace-nowrap">{v}</span>
							</div>
						))}
					</div>
				</div>

				{/* Details panel (1/3 width on desktop) */}
				<div className="flex flex-col gap-3 justify-between">

					{/* Price card */}
					<div className="relative rounded-2xl border border-[#c4a84f]/35 overflow-hidden" style={{background:'linear-gradient(135deg,#0a2214 0%,#071a0e 100%)'}}>
						<div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c4a84f]/60 to-transparent"/>
						<div className="px-5 py-5 text-center">
							<p className="text-[#c4a84f] text-[9px] font-bold tracking-[0.3em] uppercase mb-2">Starting Price</p>
							<p className="text-4xl font-black text-white leading-none">{fmtINR(u.sqft*u.bsp)}</p>
							<p className="text-white/40 text-xs mt-2">BSP ₹{u.bsp.toLocaleString('en-IN')}/sq.ft</p>
							<div className="mt-3 h-px bg-gradient-to-r from-transparent via-[#c4a84f]/25 to-transparent"/>
							<p className="text-white/35 text-[10px] mt-3">{sqft} sq.ft Super Built-up</p>
						</div>
					</div>

					{/* Stat grid */}
					<div className="grid grid-cols-2 gap-2">
						{[
							{label:'Carpet',value:u.carpet.split('/')[1]?.trim()||u.carpet,icon:'📐'},
							{label:'Balcony',value:u.balcony.split('/')[1]?.trim()||u.balcony,icon:'🌿'},
							{label:'Built-up',value:u.builtup.split('/')[1]?.trim()||u.builtup,icon:'🏠'},
							{label:'BSP Rate',value:`₹${u.bsp.toLocaleString('en-IN')}/sqft`,icon:'💰'},
						].map(({label,value,icon})=>(
							<div key={label} className="bg-white/5 border border-white/8 hover:border-[#c4a84f]/30 rounded-xl p-3 transition-colors">
								<p className="text-[#c4a84f] text-[8px] font-bold tracking-widest uppercase mb-1.5">{label}</p>
								<p className="text-white text-[11px] font-bold leading-tight">{value}</p>
							</div>
						))}
					</div>

					{/* Tower info */}
					<div className="bg-white/4 border border-white/8 rounded-xl px-4 py-3 space-y-2.5">
						<p className="text-[#c4a84f] text-[9px] font-bold tracking-[0.25em] uppercase">Unit Details</p>
						{[
							['Tower',u.towers.split('(')[0].trim()],
							['Configuration',u.type.replace(' + Servant Room','+ Serv.')],
							['Floor Height',u.towers.includes('G+33')?'G+33 Floors':'G+25 Floors'],
						].map(([k,v])=>(
							<div key={k} className="flex items-baseline justify-between gap-2">
								<span className="text-white/35 text-[10px] flex-shrink-0">{k}</span>
								<span className="text-white/85 text-[11px] font-semibold text-right leading-tight">{v}</span>
							</div>
						))}
					</div>

					{/* CTA */}
					<button onClick={onEnquire}
						className="alpg-shine w-full bg-gradient-to-r from-[#0d3d1a] to-[#166534] border border-[#c4a84f]/30 hover:border-[#c4a84f]/60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-black/30">
						Request Site Visit <ArrowRight size={14}/>
					</button>
					<a href={`tel:+919771034916`}
						className="w-full bg-white/5 border border-white/10 hover:border-[#c4a84f]/25 hover:bg-white/8 text-white/70 hover:text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all">
						<Phone size={13}/> Call Expert
					</a>
				</div>
			</div>
		</div>
		</Reveal>
	);
};

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function AlpgPage() {
	const [popup,setPopup] = useState(false);
	const [lbIdx,setLbIdx] = useState(null);
	const [activeZone,setActiveZone] = useState(0);
	const [payTab,setPayTab] = useState('clp-typical');

	const gallery = [I.heroBg, I.overview, I.iconicTower, I.typicalTower, I.clubhouse, I.pool, I.gym, I.centralGreens, I.masterPlan, I.lifestyleView, I.livingRoom];


	/* Full-page scroll snap — mounts on this page only */
	useEffect(() => {
		const html = document.documentElement;
		html.style.scrollSnapType = 'y proximity';
		html.style.scrollBehavior = 'smooth';
		return () => { html.style.scrollSnapType = ''; html.style.scrollBehavior = ''; };
	}, []);

	const dl = ()=>{ const a=document.createElement('a'); a.href=PROJECT.brochure; a.download='Aspire-Leisure-Park-Brochure.pdf'; a.target='_blank'; a.click(); };

	/* colour tokens for light sections */
	const L = 'bg-[#0d2818]';

	return (
		<Layout>
			<style>{GLOBAL_CSS}</style>
			<ScrollProgress/>
			<Helmet>
				<title>Aspire Leisure Park by GAURS | 3 & 4 BHK Luxury Residences · Techzone-4, Greater Noida</title>
				<meta name="description" content="Aspire Leisure Park by Gaursons India — Supreme Court Monitored luxury residences. 3 BHK from Rs.2.99 Cr* | 4 BHK from Rs.3.62 Cr*. 7 Acres, 7 Towers, 33-floor Iconic Tower. Techzone-4, Greater Noida (W)." />
				<link rel="canonical" href="https://instamakaan.com/sell-companies/aspire-leisure-park" />
				<meta property="og:title" content="Aspire Leisure Park by GAURS | 3 & 4 BHK Luxury Residences · Techzone-4, Greater Noida" />
				<meta property="og:description" content="Supreme Court Monitored luxury residences. 3 BHK from Rs.2.99 Cr* | 4 BHK from Rs.3.62 Cr*. 7 Acres, 7 Towers. Techzone-4, Greater Noida West." />
				<meta property="og:url" content="https://instamakaan.com/sell-companies/aspire-leisure-park" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Aspire Leisure Park by GAURS | 3 & 4 BHK Luxury Residences · Greater Noida" />
				<meta name="twitter:description" content="Supreme Court Monitored luxury residences. 3 BHK from Rs.2.99 Cr*. Techzone-4, Greater Noida West." />
				<meta name="twitter:image" content="https://instamakaan.com/images/orglogo.webp" />
				<script type="application/ld+json">{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "RealEstateListing",
					"name": "Aspire Leisure Park — Luxury Residences, Techzone-4 Greater Noida West",
					"description": "Supreme Court Monitored luxury residences by Gaursons India. 3 & 4 BHK apartments at Techzone-4, Greater Noida West.",
					"url": "https://instamakaan.com/sell-companies/aspire-leisure-park",
					"address": { "@type": "PostalAddress", "streetAddress": "Techzone-4", "addressLocality": "Greater Noida", "addressRegion": "Uttar Pradesh", "postalCode": "201306", "addressCountry": "IN" }
				})}</script>
			</Helmet>

			{/* ═══ MOBILE BOTTOM NAV ═══ */}
			<div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-green-100 dark:border-green-900/30 shadow-2xl">
				<div className="flex items-center justify-around px-2 py-2">
					{[
						{href:'#overview',icon:<Home size={19}/>,label:'Overview'},
						{href:'#floor-plans',icon:<Building2 size={19}/>,label:'Plans'},
						{href:'#pricing',icon:<Star size={19}/>,label:'Price'},
						{href:'#location',icon:<MapPin size={19}/>,label:'Location'},
					].map(({href,icon,label})=>(
						<a key={href} href={href} className="flex flex-col items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 px-2">
							{icon}{label}
						</a>
					))}
					<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer"
						className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-green-700 dark:text-green-400">
						<MessageCircle size={19}/>WhatsApp
					</a>
				</div>
			</div>

<PopupModal open={popup} onClose={()=>setPopup(false)}/>
			<Lightbox images={gallery} idx={lbIdx} onClose={()=>setLbIdx(null)} onNav={setLbIdx}/>

			{/* ═══════════════════════════════════════
			    §1  HERO
			═══════════════════════════════════════ */}
			<section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{scrollSnapAlign:'start'}}>
				<img src={I.heroBg} alt="Aspire Leisure Park Towers" className="absolute inset-0 w-full h-full object-cover alpg-kb"/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/65 to-black/25"/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"/>
				{/* top accent line */}
				<div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent"/>

				<div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 py-8 pb-24 md:pb-14">
					<div className="lg:col-span-3 text-white">
						{/* Logo text mark */}
						<div className="mb-5 alpg-anim" style={{animationDelay:'0ms'}}>
							<div className="inline-flex flex-col">
								<span className="text-green-400 text-[11px] font-bold tracking-[0.35em] uppercase">Aspire</span>
								<span className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">LEISURE PARK</span>
								<span className="text-white/60 text-sm font-light mt-0.5">by <span className="text-white font-semibold">GAURS</span> · Landmark Luxury Residences</span>
							</div>
						</div>

						{/* Trust badges */}
						<div className="flex flex-wrap gap-2 mb-5 alpg-anim" style={{animationDelay:'150ms'}}>
							<span className="flex items-center gap-1.5 bg-green-500/15 border border-green-400/40 backdrop-blur-sm text-green-400 text-[11px] font-bold px-3 py-1 rounded-full">
								<Shield size={11}/> Supreme Court Monitored
							</span>
							<span className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
								<Award size={11}/> NBCC India Ltd. Executed
							</span>
							<span className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full">
								<Star size={11}/> New Launch · 2026
							</span>
						</div>

						{/* Bullet highlights */}
						<ul className="space-y-2 mb-7 max-w-xl alpg-anim" style={{animationDelay:'270ms'}}>
							{[
								'~7 Acres · 7 Towers · 33-Floor Iconic Tower — 2 Exclusive Units per Floor',
								'3 BHK + Servant: 2299 sq.ft · 4 BHK + Servant: 2783 sq.ft (Typical Towers)',
								'Iconic Tower 4 BHK: 3769 sq.ft · Duplex 5 BHK: 7263 sq.ft',
								'BSP ₹13,000/sq.ft (Typical) · ₹14,000/sq.ft (Iconic Tower)',
								'23,960 sq.ft Ultra-Modern Clubhouse · Podium Style Living · Central Greens',
							].map((b,i)=>(
								<li key={i} className="flex items-start gap-2.5 text-white/90 text-xs md:text-sm">
									<div className="w-4 h-4 rounded-full bg-[#c4a84f]/20 border border-[#c4a84f]/50 flex items-center justify-center flex-shrink-0 mt-0.5">
										<Check size={9} className="text-[#c4a84f]"/>
									</div>
									{b}
								</li>
							))}
						</ul>

						<div className="flex flex-wrap gap-3 alpg-anim" style={{animationDelay:'380ms'}}>
							<button onClick={dl} className="alpg-shine bg-gradient-to-r from-green-800 to-green-600 hover:from-green-900 hover:to-green-700 text-white font-bold px-7 py-3.5 rounded-lg flex items-center gap-2 shadow-xl shadow-green-700/30 transition">
								<Download size={15}/> Download Brochure
							</button>
							<button onClick={()=>setPopup(true)} className="bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-lg flex items-center gap-2 transition">
								Enquire Now <ArrowRight size={14}/>
							</button>
						</div>
					</div>

					{/* Hero lead form */}
					<div className="hidden lg:block lg:col-span-2 bg-black/50 backdrop-blur-md border border-green-800/50 rounded-2xl p-6">
						<img src={I.logoGaurs} alt="GAURS your own world" className="h-10 w-auto object-contain mb-3 opacity-90"/>
						<h3 className="text-white text-lg font-bold">Register Your Interest</h3>
						<p className="text-green-400 text-base font-bold mb-1">Get Exclusive Pre-Launch Pricing</p>
						<p className="text-white/50 text-xs mb-4">InstaMakaan · Official Channel Partner</p>
						<LeadForm dark/>
					</div>
				</div>

				{/* scroll hint */}
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 alpg-bounce hidden md:block">
					<ChevronDown size={24} className="text-white/40"/>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §2  STATS STRIP
			═══════════════════════════════════════ */}
			<section className="bg-[#0d2818] border-y border-[#c4a84f]/20" style={{scrollSnapAlign:'start'}}>
				<div className="container-custom py-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
					{STATS.map((s,i)=>(
						<div key={i} className="text-center py-3 px-2 border-r last:border-r-0 border-[#c4a84f]/15 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r md:[&:nth-child(2n)]:border-r">
							<p className="text-[9px] uppercase tracking-widest text-[#c4a84f] font-bold mb-1">{s.label}</p>
							<p className="text-lg md:text-xl font-bold text-white leading-tight"><Counter text={s.value}/></p>
							<p className="text-[10px] text-white/50 mt-0.5 leading-tight">{s.sub}</p>
						</div>
					))}
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §3  OPENER — hero lifestyle image
			═══════════════════════════════════════ */}
			<section id="overview" className="relative overflow-hidden" style={{scrollSnapAlign:'start'}}>
				<img src={I.overview} alt="Aspire Leisure Park" className="w-full object-cover" style={{maxHeight:420,objectPosition:'center 35%'}}/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent flex items-center">
					<div className="container-custom text-white py-12">
						<p className="text-[#c4a84f] text-xs tracking-[0.3em] uppercase font-bold mb-2">Techzone-4 · Greater Noida (W)</p>
						<h2 className="text-3xl md:text-5xl font-bold leading-tight mb-2">Leisurely Life in<br/>the Heart of the City</h2>
						<p className="text-xl md:text-2xl font-light italic text-white/75 mb-4">A Masterpiece at a Master Location</p>
						<p className="text-xs text-white/50 uppercase tracking-widest">
							Approved by Hon'ble Supreme Court · Executed through NBCC India Ltd.
						</p>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §4  PROJECT HIGHLIGHTS
			═══════════════════════════════════════ */}
			<section className={`${L} py-12 md:py-16`} style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">

						{/* Left — compact image card */}
						<Reveal className="lg:col-span-2">
							<div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#c4a84f]/25" style={{height:'clamp(300px,40vw,460px)'}}>
								<img src={I.iconicTower} alt="Aspire Leisure Park"
									className="w-full h-full object-cover object-center"/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"/>

								{/* SC badge */}
								<div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur border border-[#c4a84f]/45 rounded-lg px-2.5 py-1.5">
									<Shield size={12} className="text-[#c4a84f]"/>
									<span className="text-[10px] font-bold text-white">SC Monitored</span>
								</div>

								{/* Tower badge */}
								<div className="absolute bottom-4 left-4 right-4">
									<div className="flex items-center gap-3 bg-black/70 backdrop-blur border border-[#c4a84f]/40 rounded-xl px-4 py-3">
										<div className="w-9 h-9 rounded-lg bg-[#c4a84f] flex items-center justify-center flex-shrink-0">
											<Building2 size={16} className="text-[#071a0e]"/>
										</div>
										<div>
											<p className="text-[8px] uppercase tracking-widest text-[#c4a84f] font-bold">Iconic Tower T7</p>
											<p className="text-base font-black text-white leading-tight">G+33 · 2 Units/Floor</p>
										</div>
										<div className="ml-auto text-right">
											<p className="text-[8px] text-white/40">Executed by</p>
											<p className="text-[10px] font-bold text-white">NBCC India</p>
										</div>
									</div>
								</div>
							</div>
						</Reveal>

						{/* Right — heading + 2×4 grid */}
						<div className="lg:col-span-3">
							<Reveal>
								<p className="text-[#c4a84f] text-[9px] font-bold tracking-[0.35em] uppercase mb-2">Luxury Living Close to Everywhere</p>
								<h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-1">Why Aspire Leisure Park?</h2>
								<div className="flex items-center gap-3 mb-6">
									<div className="h-[2px] w-8 bg-[#c4a84f] rounded-full"/>
									<div className="h-[1px] w-16 bg-[#c4a84f]/25 rounded-full"/>
								</div>
							</Reveal>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
								{[
									{ icon:<Shield size={14}/>,   title:'SC Monitored',         desc:'Approved by Hon\'ble Supreme Court through LD. Court Receiver' },
									{ icon:<Building2 size={14}/>, title:'NBCC Executed',         desc:'Aspire is a Section 8 Company executed through NBCC India Ltd.' },
									{ icon:<Layers size={14}/>,   title:'7 Premium Towers',      desc:'6 Typical (G+25) + 1 Iconic G+33 with 2 exclusive units/floor' },
									{ icon:<MapPin size={14}/>,   title:'~7 Acres · Dual Roads',  desc:'60 Mtr. & 45 Mtr. road front — prime Greater Noida West location' },
									{ icon:<Star size={14}/>,     title:'23,960 sq.ft Clubhouse', desc:'Pool, gym, courts, community hall, café & 20+ luxury amenities' },
									{ icon:<Home size={14}/>,     title:'Podium Style Living',    desc:'4-Level basement/podium parking — car-free garden podium deck' },
									{ icon:<Award size={14}/>,    title:'Central Greens',         desc:'Lush open greens, water bodies & gazebo seating at the core' },
									{ icon:<MapPin size={14}/>,   title:'Prime Connectivity',     desc:'D-Mart adjacent · Ryan Intl. School 1.5 km · Metro 2 km' },
								].map(({icon,title,desc},i)=>(
									<Reveal key={title} delay={i*50}>
										<div className="group flex items-start gap-3 bg-white/4 hover:bg-[#c4a84f]/8 border border-[#c4a84f]/12 hover:border-[#c4a84f]/40 rounded-xl px-3.5 py-3 transition-all cursor-default">
											<div className="w-7 h-7 rounded-lg bg-[#c4a84f]/12 group-hover:bg-[#c4a84f]/22 border border-[#c4a84f]/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#c4a84f] transition-colors">
												{icon}
											</div>
											<div className="min-w-0">
												<p className="text-white font-bold text-xs leading-tight mb-0.5">{title}</p>
												<p className="text-white/45 text-[10px] leading-relaxed">{desc}</p>
											</div>
										</div>
									</Reveal>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §5  TOWERS — ICONIC vs TYPICAL
			═══════════════════════════════════════ */}
			<section className={`${L} py-16`} style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">
					<SectionHeading kicker="The Towers" title="Iconic & Typical — Both Extraordinary" light/>
					<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
						{[
							{img:I.iconicTower,  name:'Iconic Tower',    sub:'Tower 7 · G+33 · 2 Units/Floor', badge:'ICONIC', chips:['4 BHK','Duplex 5 BHK','3769–7263 sqft'], color:'bg-green-700', textColor:'text-green-400', delay:0, lbI:2},
							{img:I.typicalTower, name:'Typical Towers',  sub:'Towers 1–6 · G+25 · Sunlit Units',badge:'T1–T6',  chips:['3 BHK','4 BHK','2299–2783 sqft'], color:'bg-amber-600',  textColor:'text-amber-400',  delay:100, lbI:3},
						].map(({img,name,sub,badge,chips,color,textColor,delay,lbI})=>(
							<Reveal key={name} delay={delay}>
								<div className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer" onClick={()=>setLbIdx(lbI)}>
									<img src={img} alt={name} className="w-full h-72 object-cover alpg-img"/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>
									<div className="absolute top-3 left-3">
										<span className={`${color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>{badge}</span>
									</div>
									<div className="absolute bottom-0 left-0 right-0 p-5">
										<h3 className="text-xl font-black text-white mb-1">{name}</h3>
										<p className="text-white/60 text-sm mb-3">{sub}</p>
										<div className="flex flex-wrap gap-1.5">
											{chips.map(t=>(
												<span key={t} className={`text-[10px] bg-white/10 border border-white/20 ${textColor} px-2 py-0.5 rounded-full`}>{t}</span>
											))}
										</div>
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §6  CLUBHOUSE CALLOUT
			═══════════════════════════════════════ */}
			<section className="relative bg-[#0a2214] py-14 overflow-hidden" style={{scrollSnapAlign:'start'}}>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,_rgba(196,168,79,0.08)_0%,_transparent_70%)] pointer-events-none"/>
				<div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c4a84f]/40 to-transparent"/>
				<div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c4a84f]/40 to-transparent"/>
				<div className="container-custom relative text-center">
					<p className="text-[#c4a84f] text-xs font-bold tracking-[0.3em] uppercase mb-3">Ultra-Modern Clubhouse · 23,960 sq.ft</p>
					<h3 className="text-4xl md:text-5xl font-bold text-white mb-2">Where Leisure</h3>
					<p className="text-3xl md:text-4xl font-bold text-[#c4a84f] mb-5">Meets Luxury.</p>
					<div className="mx-auto h-[1px] w-24 bg-gradient-to-r from-transparent via-[#c4a84f] to-transparent rounded-full mb-8"/>
					<div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
						{['Swimming Pool','Gymnasium','Community Hall','Indoor Games','Cafeteria','Open Gym','Badminton Courts','Basketball Court','Yoga Lawn','Central Greens','Gazebo','Human Ludo'].map((item,i)=>(
							<span key={i} className="flex items-center gap-2 bg-white/6 hover:bg-white/10 border border-[#c4a84f]/25 hover:border-[#c4a84f]/60 text-white/85 hover:text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-default">
								<span className="w-1.5 h-1.5 rounded-full bg-[#c4a84f] flex-shrink-0"/>
								{item}
							</span>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §7  AMENITIES SLIDER + ZONES
			═══════════════════════════════════════ */}
			<section id="amenities" className={`${L} py-16`} style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">
					<SectionHeading kicker="Lifestyle Amenities" title="23,960 sq.ft of World-Class Living" sub="Immerse yourself in an ultra-modern clubhouse — a sanctuary of unmatched amenities." light/>
					<div className="mb-10">
						<AmenitySlider slides={AMENITY_SLIDES}/>
					</div>
					<div className="flex flex-wrap justify-center gap-2 mb-6">
						{AMENITY_ZONES.map((z,i)=>(
							<button key={i} onClick={()=>setActiveZone(i)}
								className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeZone===i?'text-white shadow-lg':'bg-white/8 border border-[#c4a84f]/20 text-white/60 hover:text-white hover:bg-white/12 hover:border-[#c4a84f]/40'}`}
								style={activeZone===i?{background:z.color}:{}}>
								{z.zone}
							</button>
						))}
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
						{AMENITY_ZONES[activeZone].items.map((item,i)=>(
							<div key={i} className="bg-white/6 border border-[#c4a84f]/15 hover:border-[#c4a84f]/45 hover:bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2 transition-all">
								<div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center bg-[#c4a84f]/15">
									<Check size={11} className="text-[#c4a84f]"/>
								</div>
								<p className="text-xs text-white/80 font-medium leading-tight">{item}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §8  FLOOR PLANS
			═══════════════════════════════════════ */}
			<section id="floor-plans" className={`${L} py-16 md:py-20`} style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">
					<SectionHeading kicker="Floor Plans" title="Expansive Layouts for a Leisurely Lifestyle" sub="Intelligently designed for natural light and ventilation — spacious homes in both Iconic and Typical towers." light/>
					<FloorPlanViewer units={UNIT_TYPES} onEnquire={()=>setPopup(true)}/>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §9  MASTER PLAN
			═══════════════════════════════════════ */}
			<section className={`${L} py-16`} style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">
					<SectionHeading kicker="Site Layout" title="Master Plan" light/>
					<Reveal>
						<div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[#c4a84f]/25 cursor-zoom-in" onClick={()=>setLbIdx(8)}>
							<img src={I.masterPlan} alt="Master Plan" className="w-full object-contain bg-[#0a1e10]"/>
							<div className="absolute top-3 right-3 bg-[#071a0e]/90 border border-[#c4a84f]/30 text-[#c4a84f] text-xs font-bold px-3 py-1 rounded-full backdrop-blur">Click to enlarge</div>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §10  CONNECTIVITY
			═══════════════════════════════════════ */}
			<section className="relative bg-[#0a2214] py-16 overflow-hidden" style={{scrollSnapAlign:'start'}}>
				{/* Decorative rings — behind everything */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{zIndex:0}}>
					<div className="w-[500px] h-[500px] rounded-full border border-[#c4a84f]/6 absolute"/>
					<div className="w-[750px] h-[750px] rounded-full border border-[#c4a84f]/4 absolute"/>
					<div className="w-[1000px] h-[1000px] rounded-full border border-[#c4a84f]/2 absolute"/>
				</div>
				<div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#c4a84f]/30 to-transparent" style={{zIndex:0}}/>
				{/* Content — solid bg cards so rings don't bleed through */}
				<div className="container-custom relative" style={{zIndex:2}}>
					<div className="text-center mb-10">
						<p className="text-[#c4a84f] text-xs font-bold tracking-[0.3em] uppercase mb-3">Pinned to Perfection</p>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-3">The Region's Finest Location</h2>
						<div className="mx-auto h-[1px] w-20 bg-gradient-to-r from-transparent via-[#c4a84f] to-transparent rounded-full mb-4"/>
						<p className="text-white/55 text-sm max-w-xl mx-auto leading-relaxed">Greater Noida West offers unmatched connectivity — D-Mart adjacent, Gaur Chowk 2 kms, Noida 4 kms, IGI Airport 41 kms.</p>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
						{CONNECTIVITY.map((c,i)=>(
							<div key={i} className="group border border-[#c4a84f]/20 hover:border-[#c4a84f]/55 rounded-2xl px-3 py-5 text-center transition-all duration-300" style={{background:'#0a2214'}}>
								<p className="text-[#c4a84f] font-bold text-xl leading-none mb-2 group-hover:scale-110 transition-transform duration-200">{c.dist}</p>
								<div className="h-[1px] w-8 bg-[#c4a84f]/30 mx-auto mb-2 rounded-full"/>
								<p className="text-white/60 text-[11px] leading-tight">{c.place}</p>
							</div>
						))}
					</div>
					<p className="text-center text-white/25 text-[10px] mt-6">* All distances are approximate.</p>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §11  LOCATION
			═══════════════════════════════════════ */}
			<section id="location" className={`${L} py-16`} style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">
					<SectionHeading kicker="Where Everything is Within Reach" title="Location & Address" light/>
					<div className="flex items-center justify-center gap-3 mb-10 bg-white/5 border border-[#c4a84f]/25 rounded-2xl px-6 py-4 max-w-lg mx-auto">
						<div className="w-10 h-10 rounded-full bg-[#c4a84f]/15 border border-[#c4a84f]/35 flex items-center justify-center flex-shrink-0">
							<MapPin size={18} className="text-[#c4a84f]"/>
						</div>
						<div>
							<p className="font-bold text-white text-sm leading-tight">Plot No. 4, Techzone-4</p>
							<p className="text-white/60 text-sm">Greater Noida (W), Uttar Pradesh</p>
						</div>
					</div>
					<div className="text-center">
						<a href="https://maps.google.com/?q=Techzone+4+Greater+Noida+West" target="_blank" rel="noopener noreferrer"
							className="inline-flex items-center gap-2 bg-[#0d2818] hover:bg-[#071a0e] border border-[#c4a84f]/40 hover:border-[#c4a84f]/70 text-[#c4a84f] font-bold px-7 py-3 rounded-lg text-sm transition shadow-lg">
							<MapPin size={15}/> View on Google Maps
						</a>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §12  PRICING
			═══════════════════════════════════════ */}
			<section id="pricing" className="py-16 md:py-24 bg-[#071a0e] dark:bg-[#050e08]" style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">
					<SectionHeading kicker="Pricing" title="Transparent Pricing — W.E.F. 21st January 2026" light/>

					{/* BSP Highlight */}
					<Reveal>
						<div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
							{[
								{tower:'Iconic Tower',bsp:'₹14,000',floors:'33 Floors · Tower 7',border:'border-yellow-400/30 bg-yellow-400/5'},
								{tower:'Typical Towers',bsp:'₹13,000',floors:'25 Floors · Towers 1–6',border:'border-green-400/30 bg-green-400/5'},
							].map(({tower,bsp,floors,border})=>(
								<div key={tower} className={`border rounded-2xl p-6 text-center ${border}`}>
									<p className="text-white/60 text-xs uppercase tracking-widest mb-2">{tower}</p>
									<p className="text-3xl font-black text-white">{bsp}</p>
									<p className="text-white/40 text-xs mt-1">per sq.ft · BSP</p>
									<p className="text-green-400 text-xs mt-2">{floors}</p>
								</div>
							))}
						</div>
					</Reveal>

					{/* PLC + Additional Charges */}
					<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
						<Reveal>
							<div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
								<div className="bg-yellow-500/10 border-b border-yellow-400/20 px-4 py-3">
									<p className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Iconic Tower PLC</p>
								</div>
								<div className="p-4 space-y-2">
									{FLOOR_PLC_ICONIC.map(({floor,plc})=>(
										<div key={floor} className="flex justify-between items-center">
											<span className="text-white/60 text-xs">{floor}</span>
											<span className={`text-xs font-bold ${plc===0?'text-green-400':'text-white'}`}>{plc===0?'Nil':`₹${plc}/sqft`}</span>
										</div>
									))}
								</div>
							</div>
						</Reveal>
						<Reveal delay={100}>
							<div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
								<div className="bg-green-500/10 border-b border-green-400/20 px-4 py-3">
									<p className="text-green-400 text-xs font-bold uppercase tracking-widest">Typical Tower PLC</p>
								</div>
								<div className="p-4 space-y-2">
									{FLOOR_PLC_TYPICAL.map(({floor,plc})=>(
										<div key={floor} className="flex justify-between items-center">
											<span className="text-white/60 text-xs">{floor}</span>
											<span className={`text-xs font-bold ${plc===0?'text-green-400':'text-white'}`}>{plc===0?'Nil':`₹${plc}/sqft`}</span>
										</div>
									))}
									<div className="border-t border-white/10 pt-3 mt-3">
										<p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2">View PLC</p>
										{VIEW_PLC.map(({view,plc})=>(
											<div key={view} className="flex justify-between items-center mb-1.5">
												<span className="text-white/60 text-xs">{view}</span>
												<span className="text-white text-xs font-bold">₹{plc}/sqft</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</Reveal>
						<Reveal delay={200}>
							<div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
								<div className="bg-slate-500/10 border-b border-slate-400/20 px-4 py-3">
									<p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Additional Charges</p>
								</div>
								<div className="p-4 space-y-2">
									{ADD_CHARGES.map(({name,val})=>(
										<div key={name} className="flex justify-between items-start gap-2">
											<span className="text-white/50 text-[10px] leading-tight">{name}</span>
											<span className="text-white/80 text-[10px] font-semibold whitespace-nowrap">{val}</span>
										</div>
									))}
								</div>
							</div>
						</Reveal>
					</div>

					{/* Payment Plan */}
					<Reveal>
						<div className="max-w-4xl mx-auto">
							<div className="flex justify-center gap-2 mb-6 flex-wrap">
								{[
									{key:'clp-typical',label:'CLP · Typical Tower'},
									{key:'clp-iconic', label:'CLP · Iconic Tower'},
									{key:'special',    label:'Special Plan'},
								].map(t=>(
									<button key={t.key} onClick={()=>setPayTab(t.key)}
										className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${payTab===t.key?'bg-green-700 text-white border-green-700':'border-white/20 text-white/60 hover:border-green-400/40 hover:text-white'}`}>
										{t.label}
									</button>
								))}
							</div>
							<div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden alpg-fade" key={payTab}>
								<div className="px-5 py-3 border-b border-white/10">
									<p className="text-green-400 text-xs font-bold uppercase tracking-widest">
										{payTab==='clp-typical'&&'Construction Linked Plan — Typical Towers (T1–T6)'}
										{payTab==='clp-iconic' &&'Construction Linked Plan — Iconic Tower (T7)'}
										{payTab==='special'    &&'Special Payment Plan — All Sizes (Limited Period)'}
									</p>
								</div>
								<div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
									{(payTab==='clp-typical'?CLP_TYPICAL:payTab==='clp-iconic'?CLP_ICONIC:SPECIAL_PLAN).map(({milestone,pct},i)=>(
										<div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
											<div className="w-10 h-10 rounded-full flex-shrink-0 bg-green-700/20 border border-green-600/20 flex items-center justify-center">
												<span className="text-green-400 text-xs font-black">{pct}%</span>
											</div>
											<span className="text-white/70 text-xs leading-tight">{milestone}</span>
										</div>
									))}
								</div>
							</div>
							{payTab==='special'&&<p className="text-white/40 text-xs text-center mt-3">* Valid for a limited period only</p>}
						</div>
					</Reveal>

					{/* Bank Details */}
					<Reveal delay={200}>
						<div className="max-w-lg mx-auto mt-10 bg-white/5 border border-white/10 rounded-2xl p-5">
							<p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">Bank Details</p>
							{[['Bank',BANK.name],['Account',BANK.account],['Branch',BANK.branch],['Account No.',BANK.accNo],['IFSC',BANK.ifsc]].map(([k,v])=>(
								<div key={k} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2 border-b border-white/5 last:border-0">
									<span className="text-white/40 text-[11px] sm:w-24 flex-shrink-0">{k}</span>
									<span className="text-white/80 text-xs font-medium">{v}</span>
								</div>
							))}
						</div>
					</Reveal>
				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §13  DEVELOPER
			═══════════════════════════════════════ */}
			<section className={`${L} py-16 md:py-20`} style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">

					{/* GAURS logo + heading */}
					<div className="flex flex-col items-center mb-10">
						<img src={I.logoGaurs} alt="GAURS" className="h-12 w-auto object-contain brightness-0 invert opacity-80 mb-4"/>
						<SectionHeading kicker="Developer" title="3 Decades of Trust &amp; Triumphs" light/>
					</div>

					{/* Top milestone numbers */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
						{GAURS_MILESTONES.map(({val,label},i)=>(
							<Reveal key={label} delay={i*80}>
								<div className="alpg-lift text-center bg-white/6 border border-[#c4a84f]/20 rounded-2xl p-5 hover:border-[#c4a84f]/50 hover:bg-white/10 transition-all">
									<p className="text-2xl font-black text-[#c4a84f] mb-1"><Counter text={val}/></p>
									<p className="text-[11px] text-white/55 leading-tight">{label}</p>
								</div>
							</Reveal>
						))}
					</div>

					{/* Milestone breakdown grid */}
					<Reveal>
						<div className="mb-12">
							<p className="text-[#c4a84f] text-[9px] font-bold tracking-[0.3em] uppercase text-center mb-5">Milestone Breakdown</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
								{GAURS_DELIVERY.map(({num,label,sub},i)=>(
									<div key={i} className="flex items-start gap-3 bg-white/5 border border-[#c4a84f]/15 hover:border-[#c4a84f]/40 rounded-2xl px-4 py-4 transition-all group">
										<span className="text-3xl font-black text-[#c4a84f] leading-none flex-shrink-0 group-hover:scale-110 transition-transform">{num}</span>
										<div>
											<p className="text-white text-xs font-bold leading-snug">{label}</p>
											{sub&&<p className="text-white/35 text-[9px] mt-0.5 leading-tight">{sub}</p>}
										</div>
									</div>
								))}
							</div>
						</div>
					</Reveal>

					{/* Awards */}
					<Reveal delay={100}>
						<div className="mb-12">
							<p className="text-[#c4a84f] text-[9px] font-bold tracking-[0.3em] uppercase text-center mb-5">Awards &amp; Accolades</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
								{GAURS_AWARDS.map(({year,title,project,award},i)=>(
									<div key={i} className="flex items-start gap-3 bg-white/5 border border-[#c4a84f]/12 hover:border-[#c4a84f]/35 rounded-xl px-4 py-3 transition-all">
										<div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#c4a84f]/12 border border-[#c4a84f]/25 flex flex-col items-center justify-center">
											<span className="text-[#c4a84f] text-[8px] font-black leading-none">🏆</span>
											<span className="text-[#c4a84f] text-[9px] font-black mt-0.5">{year}</span>
										</div>
										<div className="min-w-0">
											<p className="text-white text-[11px] font-bold leading-snug mb-0.5">{title}</p>
											<p className="text-[#c4a84f] text-[10px] font-semibold truncate">{project}</p>
											<p className="text-white/30 text-[9px] leading-tight mt-0.5">{award}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</Reveal>

					{/* Ongoing RERA Projects */}
					<Reveal delay={150}>
						<div>
							<p className="text-[#c4a84f] text-[9px] font-bold tracking-[0.3em] uppercase text-center mb-5">Ongoing RERA Registered Projects</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-5xl mx-auto">
								{RERA_PROJECTS.map(({name,location,rera},i)=>(
									<div key={i} className="bg-white/4 border border-[#c4a84f]/10 hover:border-[#c4a84f]/30 rounded-xl px-4 py-3 transition-all">
										<p className="text-white text-xs font-bold leading-snug mb-1">{name}</p>
										<p className="text-white/50 text-[10px] mb-1.5">{location}</p>
										<p className="text-[#c4a84f]/60 text-[9px] font-mono">{rera}</p>
									</div>
								))}
							</div>
						</div>
					</Reveal>

				</div>
			</section>

			{/* ═══════════════════════════════════════
			    §14  CTA / ENQUIRY
			═══════════════════════════════════════ */}
			<section className="py-16 md:py-24 bg-[#071a0e]" style={{scrollSnapAlign:'start'}}>
				<div className="container-custom">
					<div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
						<Reveal>
							<div>
								<p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#c4a84f] mb-3">Get in Touch</p>
								<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Interested in<br/><span className="text-[#c4a84f]">Aspire Leisure Park?</span></h2>
								<GoldDivider center={false}/>
								<p className="text-white/60 text-sm leading-relaxed mt-4 mb-6">Our InstaMakaan experts guide you through unit selection, pricing, and site visits — get exclusive insights on this SC-monitored luxury project.</p>
								<div className="space-y-3">
									<a href={`tel:${PROJECT.phone}`} className="flex items-center gap-3 text-white hover:text-green-400 transition group">
										<div className="w-10 h-10 rounded-full bg-[#c4a84f]/10 border border-[#c4a84f]/25 flex items-center justify-center group-hover:bg-[#c4a84f]/20 transition">
											<Phone size={16} className="text-[#c4a84f]"/>
										</div>
										<span className="font-semibold">{PROJECT.phoneDisplay}</span>
									</a>
									<a href={PROJECT.wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white hover:text-green-400 transition group">
										<div className="w-10 h-10 rounded-full bg-[#c4a84f]/10 border border-[#c4a84f]/25 flex items-center justify-center group-hover:bg-[#c4a84f]/20 transition">
											<MessageCircle size={16} className="text-[#c4a84f]"/>
										</div>
										<span className="font-semibold">WhatsApp Us</span>
									</a>
									<button onClick={dl} className="flex items-center gap-3 text-white hover:text-green-400 transition group">
										<div className="w-10 h-10 rounded-full bg-[#c4a84f]/10 border border-[#c4a84f]/25 flex items-center justify-center group-hover:bg-[#c4a84f]/20 transition">
											<Download size={16} className="text-[#c4a84f]"/>
										</div>
										<span className="font-semibold">Download Brochure</span>
									</button>
								</div>
							</div>
						</Reveal>
						<Reveal delay={150}>
							<div className="bg-[#0a1e10] rounded-2xl p-6 shadow-2xl border border-[#c4a84f]/30">
								<p className="text-white font-bold mb-1">Enquire via InstaMakaan</p>
								<p className="text-white/50 text-xs mb-5">Our team will connect with you within 30 minutes</p>
								<LeadForm dark/>
							</div>
						</Reveal>
					</div>
				</div>
			</section>

			<div className="pb-16 md:pb-0"/>
		</Layout>
	);
}
