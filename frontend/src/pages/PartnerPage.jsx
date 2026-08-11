import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Phone, Handshake } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import PageFAQSection from '@/components/home/PageFAQSection';

const PARTNER_FAQS = [
	{
		question: 'How do I list my property on InstaMakaan?',
		answer:
			'Visit our website and click "List Your Property". Fill in property details — photos, rent, location, amenities — and submit. Our team will verify the listing and make it live within 24 hours. You can also call us at +91 9771034916 and we will help you list it over the phone.',
	},
	{
		question: 'Is listing my property on InstaMakaan free?',
		answer:
			'Yes, listing your property is completely free for owners. We charge a service fee from tenants only after a successful rental agreement is signed. You pay nothing upfront and nothing unless your property is rented.',
	},
	{
		question: 'How does InstaMakaan screen and verify tenants?',
		answer:
			'Every tenant on InstaMakaan goes through a KYC verification process including identity proof, employment or income verification, and background checks. Only verified tenants can contact you, so you always deal with serious and genuine renters.',
	},
	{
		question: 'How long does it typically take to find a tenant?',
		answer:
			'Most properties are matched with a suitable tenant within 2–4 weeks. Properties in high-demand areas like Greater Noida West, Techzone 4, and Sector 1 often receive inquiries within a few days of listing, depending on rent and condition.',
	},
	{
		question: 'Can I list multiple properties under one account?',
		answer:
			'Yes, you can list multiple properties under a single account. Our owner dashboard lets you manage all your listings, track inquiries, update availability, and communicate with interested tenants — all from one place.',
	},
	{
		question: 'What happens if there is a dispute between me and a tenant?',
		answer:
			'InstaMakaan has a dedicated support team to help mediate disputes between owners and tenants. We also assist with rental agreement documentation to minimize disputes from the start. Contact us at support@instamakaan.com and we will step in promptly.',
	},
	{
		question: 'What documents do I need to list my property?',
		answer:
			'You will need basic property details and good-quality photos to create a listing. For verification, we may request a copy of your ownership document or possession letter. Our team guides you through every step to make the process quick and easy.',
	},
];

/* ================= HERO SLIDES ================= */
const heroSlides = [
	{
		headline: 'List Your Property. Find the Right Tenant. Fast.',
		desktop: '/images/owner-1.webp',
		mobile: '/images/owner-1-mobile.webp',
	},
	{
		headline: 'Verified Tenants. Transparent Fees. Zero Hassle.',
		desktop: '/images/owner-2.webp',
		mobile: '/images/owner-2-mobile.webp',
	},
	{
		headline: 'Your Property Listed. Your Tenant Found.',
		desktop: '/images/owner-3.webp',
		mobile: '/images/owner-3-mobile.webp',
	},
	{
		headline: 'Get Your Flat Rented Faster Than Ever.',
		desktop: '/images/owner-4.webp',
		mobile: '/images/owner-4-mobile.webp',
	},
];

/* ================= SERVICES ================= */
const services = [
	{
		id: 'listing',
		headline: 'List Your Flat in Minutes.',
		video: '/videos/rent.mp4',
		features: [
			'Free property listing on InstaMakaan.',
			'Reach thousands of verified tenants.',
			'Photos, details & availability — all in one place.',
			'Get inquiries directly from interested renters.',
		],
		cta: 'List Your Property Now',
		floatIcons: ['🏠', '✓'],
	},
	{
		id: 'tenant',
		headline: 'Only Serious, Verified Tenants.',
		video: '/videos/tenant.mp4',
		features: [
			'Every tenant is KYC-verified before contact.',
			'Background & employment checks done.',
			'No random walk-ins or time-wasters.',
			'Wide network of genuine renters across Noida.',
		],
		cta: 'Connect With Verified Tenants',
		floatIcons: ['✓', '✓'],
	},
	{
		id: 'rental',
		headline: 'Rent Faster, Earn More.',
		video: '/videos/income.mp4',
		features: [
			'Get the best rental price for your area.',
			'Minimal vacancy — tenants are always searching.',
			'100% transparent process, no hidden fees.',
			'You stay in full control of your property.',
		],
		cta: 'Get Your Free Rental Estimate',
		floatIcons: ['₹', '₹'],
	},
];

/* ================= INLINE ANIMATIONS ================= */
const PageAnimations = () => (
	<style>{`
    @keyframes phoneFloat {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes iconFloat {
      0%,100% { opacity:.6; transform: translateY(0); }
      50% { opacity:1; transform: translateY(-10px); }
    }
    @keyframes glowAnim {
      0%,100% { opacity:.35; }
      50% { opacity:.7; }
    }
    @keyframes waveMove {
      0%,100% { transform: translateX(0); }
      50% { transform: translateX(30px); }
    }
.fade-up {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s ease;
}

.fade-up.show {
  opacity: 1;
  transform: translateY(0);
}
    .animate-phone { animation: phoneFloat 4s ease-in-out infinite; }
    .animate-icon { animation: iconFloat 4s ease-in-out infinite; }
    .animate-glow { animation: glowAnim 6s ease-in-out infinite; }
    .animate-wave { animation: waveMove 10s ease-in-out infinite; }
  `}</style>
);

const PartnerPage = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [videoVisible, setVideoVisible] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		heroSlides.forEach((slide) => {
			const imgDesktop = new Image();
			imgDesktop.src = slide.desktop;

			const imgMobile = new Image();
			imgMobile.src = slide.mobile;
		});
	}, []);

	useEffect(() => {
		const elements = document.querySelectorAll('.fade-up');

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('show');
					}
				});
			},
			{ threshold: 0.2 },
		);

		elements.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	/* HERO AUTO SLIDER */
	useEffect(() => {
		const i = setInterval(
			() => setCurrentSlide((p) => (p + 1) % heroSlides.length),
			4500,
		);
		return () => clearInterval(i);
	}, []);

	return (
		<Layout>
			<Helmet>
				<title>
					List Your Property With InstaMakaan | Rent Your Flat in Noida, Greater
					Noida & Ghaziabad
				</title>

				<meta
					name="description"
					content="List your flat on InstaMakaan and connect with verified tenants in Noida, Greater Noida, Noida Extension and Ghaziabad. Transparent pricing, fast tenant placement, 100% verified listings."
				/>

				<meta
					name="keywords"
					content="list property noida, rent flat noida, verified tenants greater noida, rent house ghaziabad, property listing noida extension"
				/>

				<link rel="canonical" href="https://instamakaan.com/partner" />
			</Helmet>
			<PageAnimations />

			{/* ================= HERO ================= */}
			<section className="relative min-h-screen overflow-hidden -mt-14">
				<h1 className="sr-only">
					List Your Property &amp; Find Verified Tenants in Noida, Greater Noida
					&amp; Ghaziabad
				</h1>
				<img
					src={
						isMobile
							? heroSlides[currentSlide].mobile
							: heroSlides[currentSlide].desktop
					}
					alt="hero"
					loading="eager"
					fetchpriority="high"
					width="1920"
					height="1080"
					className="absolute inset-0 w-full h-full object-cover scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 dark:from-[#0b1220]/90 dark:via-[#0b1220]/85 dark:to-[#0b1220]/95 " />

				<div className="relative z-10 min-h-screen flex items-center justify-center text-center px-4 sm:px-6">
					<div className="max-w-5xl">
						<h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold text-teal-500 dark:text-white whitespace-normal sm:whitespace-nowrap leading-tight">
							Are You a Property{' '}
							<span className="text-yellow-500 dark:text-teal-400 font-bold ml-2">
								Owner?
							</span>
						</h1>

						<h2 className="text-2xl sm:text-2xl md:text-3xl mb-4 mt-6 text-gray-700">
							{heroSlides[currentSlide].headline}
						</h2>

						{heroSlides[currentSlide].description && (
							<p className="text-lg text-muted-foreground mb-8">
								{heroSlides[currentSlide].description}
							</p>
						)}

						<Button variant="yellow" size="lg" asChild>
							<Link to="/contact">List Your Property Free</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* ================= SERVICES ================= */}
			{services.map((service) => (
				<section
					id={service.id}
					key={service.id}
					className="py-14 md:py-20 bg-slate-50 dark:bg-[#0f172a]"
				>
					<div className="container-custom">
						<Card className="relative rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-[#0b1220]">
							<CardContent className="grid md:grid-cols-2 gap-8 md:gap-10 items-center p-4 sm:p-6 md:p-10">
								{/* ================= MOBILE ONLY ORDER (Heading -> Video -> Text) ================= */}
								<div className="md:hidden space-y-5">
									{/* HEADING FIRST */}
									<h3 className="text-[18px] text-center font-extrabold whitespace-nowrap text-slate-900 dark:text-white">
										{service.headline}
									</h3>

									{/* VIDEO SECOND */}
									<div className="relative flex justify-center items-center w-full py-2">
										{/* Glow */}
										<div className="absolute w-[240px] h-[280px] bg-gradient-to-br from-teal-400/40 via-cyan-300/30 to-yellow-300/30 rounded-full blur-3xl animate-glow" />

										{/* Wave */}
										<svg
											className="absolute w-[320px] opacity-40 animate-wave"
											viewBox="0 0 400 200"
											fill="none"
										>
											<path
												d="M0 120 C80 30 160 210 240 120 320 30 400 150 400 150"
												stroke="#32d1c0"
												strokeWidth="22"
												strokeLinecap="round"
											/>
										</svg>

										{/* Floating Icons */}
										{service.floatIcons.map((ic, i) => (
											<span
												key={i}
												className="absolute text-2xl font-bold text-teal-500 animate-icon"
												style={{
													top: i === 0 ? '-10px' : '82%',
													left: i === 0 ? '75%' : '-8px',
												}}
											>
												{ic}
											</span>
										))}

										{/* Phone */}
										<div className="relative z-10 w-[210px] aspect-[9/19] rounded-[38px] shadow-2xl overflow-hidden animate-phone">
											{videoVisible && (
												<video
													src={service.video}
													autoPlay
													muted
													loop
													playsInline
													preload="none"
													className="w-full h-full object-cover"
												/>
											)}
										</div>
									</div>

									{/* TEXT LAST */}
									<div className="relative fade-up overflow-hidden rounded-3xl p-5 w-full">
										<div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-50 via-white to-yellow-50 dark:from-[#0f1f2e] dark:via-[#0b1220] dark:to-[#1a1405]" />

										<span className="absolute top-6 left-6 w-3 h-3 bg-teal-400 rounded-full animate-icon" />
										<span className="absolute bottom-10 right-10 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-icon" />

										<svg
											className="absolute -z-10 bottom-0 right-0 w-[260px] opacity-30 animate-wave"
											viewBox="0 0 400 200"
											fill="none"
										>
											<path
												d="M0 140 C120 60 240 220 400 120"
												stroke="#2dd4bf"
												strokeWidth="18"
												strokeLinecap="round"
											/>
										</svg>

										<ul className="space-y-3 mb-6">
											{service.features.map((f, i) => (
												<li key={i} className="flex gap-3">
													<CheckCircle2 className="text-teal-500 mt-1" />
													<span>{f}</span>
												</li>
											))}
										</ul>

										<Button variant="teal" asChild className="w-full">
											<Link to="/contact" className="justify-center">
												{service.cta}
												<ArrowRight className="ml-2 w-4 h-4" />
											</Link>
										</Button>
									</div>
								</div>

								{/* ================= DESKTOP ONLY  ================= */}
								<>
									{/* PHONE / VIDEO */}
									<div className="hidden md:flex relative justify-center items-center">
										<div className="absolute w-[260px] h-[320px] sm:w-[360px] sm:h-[440px] bg-gradient-to-br from-teal-400/40 via-cyan-300/30 to-yellow-300/30 rounded-full blur-3xl animate-glow" />

										<svg
											className="absolute w-[360px] sm:w-[500px] opacity-40 animate-wave"
											viewBox="0 0 400 200"
											fill="none"
										>
											<path
												d="M0 120 C80 30 160 210 240 120 320 30 400 150 400 150"
												stroke="#32d1c0"
												strokeWidth="22"
												strokeLinecap="round"
											/>
										</svg>

										{service.floatIcons.map((ic, i) => (
											<span
												key={i}
												className="absolute text-3xl font-bold text-teal-500 animate-icon"
												style={{
													top: i === 0 ? '-18px' : '82%',
													left: i === 0 ? '75%' : '-14px',
												}}
											>
												{ic}
											</span>
										))}

										<div className="relative z-10 w-[210px] xs:w-[230px] sm:w-[260px] md:w-[300px] aspect-[9/19] rounded-[40px] sm:rounded-[45px] shadow-2xl animate-phone overflow-hidden">
											{videoVisible && (
												<video
													src={service.video}
													autoPlay
													muted
													loop
													playsInline
													preload="none"
													className="w-full h-full object-cover"
												/>
											)}
										</div>
									</div>

									{/* TEXT */}
									<div className="hidden md:block relative fade-up overflow-hidden rounded-3xl p-5 w-full max-w-none">
										<div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-50 via-white to-yellow-50 dark:from-[#0f1f2e] dark:via-[#0b1220] dark:to-[#1a1405]" />

										<span className="absolute top-6 left-6 w-3 h-3 bg-teal-400 rounded-full animate-icon" />
										<span className="absolute bottom-10 right-10 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-icon" />

										<svg
											className="absolute -z-10 bottom-0 right-0 w-[320px] opacity-30 animate-wave"
											viewBox="0 0 400 200"
											fill="none"
										>
											<path
												d="M0 140 C120 60 240 220 400 120"
												stroke="#2dd4bf"
												strokeWidth="18"
												strokeLinecap="round"
											/>
										</svg>

										<h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-5 sm:mb-6 whitespace-normal">
											{service.headline}
										</h3>

										<ul className="space-y-3 mb-6">
											{service.features.map((f, i) => (
												<li key={i} className="flex gap-3">
													<CheckCircle2 className="text-teal-500 mt-1" />
													<span>{f}</span>
												</li>
											))}
										</ul>

										<Button variant="teal" asChild>
											<Link to="/contact">
												{service.cta}
												<ArrowRight className="ml-2 w-4 h-4" />
											</Link>
										</Button>
									</div>
								</>
							</CardContent>
						</Card>
					</div>
				</section>
			))}

			{/* ================= OWNER TESTIMONIALS ================= */}
			<section className="py-16 sm:py-20 bg-white dark:bg-[#0b1220]">
				<div className="container-custom">
					<div className="text-center mb-10 sm:mb-14">
						<h2 className="text-3xl sm:text-4xl font-extrabold text-teal-600 dark:text-teal-400">
							What Property Owners Say
						</h2>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card className="rounded-3xl border-0 shadow-card bg-white dark:bg-[#0f172a]">
							<CardContent className="p-6">
								<div className="flex gap-1 mb-4">
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
								</div>

								<p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
									"I listed my flat on InstaMakaan and got a verified tenant
									within 10 days. No broker, no drama — just a genuine renter."
								</p>

								<div className="mt-6">
									<p className="font-semibold text-slate-900 dark:text-white">
										Rajesh Kumar
									</p>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Property Owner, Sector 62 Noida
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className="rounded-3xl border-0 shadow-card bg-white dark:bg-[#0f172a]">
							<CardContent className="p-6">
								<div className="flex gap-1 mb-4">
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
								</div>

								<p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
									"The tenants I got through InstaMakaan were all KYC-verified.
									The whole process was smooth and completely free for me."
								</p>

								<div className="mt-6">
									<p className="font-semibold text-slate-900 dark:text-white">
										Priya Sharma
									</p>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Flat Owner, Greater Noida West
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className="rounded-3xl border-0 shadow-card bg-white dark:bg-[#0f172a]">
							<CardContent className="p-6">
								<div className="flex gap-1 mb-4">
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
									<span className="text-yellow-400">★</span>
								</div>

								<p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
									"My flat in Ghaziabad was vacant for 2 months. Listed on
									InstaMakaan and found the right tenant in under 2 weeks."
								</p>

								<div className="mt-6">
									<p className="font-semibold text-slate-900 dark:text-white">
										Amit Verma
									</p>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Property Owner, Ghaziabad
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<PageFAQSection faqs={PARTNER_FAQS} title="Listing Your Property — FAQs" />

			{/* MOBILE BOTTOM BAR */}
			<div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
				<div
					className="flex justify-around items-center px-4 py-2 rounded-2xl 
	bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-lg 
	border border-gray-200 dark:border-white/10 
	shadow-xl"
				>
					{/* BACK */}
					<button
						onClick={() => navigate(-1)}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<ArrowLeft className="w-5 h-5 mb-1" />
						Back
					</button>

					{/* LIST PROPERTY */}
					<button
						onClick={() => navigate('/contact')}
						className="flex flex-col items-center text-[11px] text-teal-600 active:scale-90 transition"
					>
						<Handshake className="w-5 h-5 mb-1" />
						List Now
					</button>

					{/* CALL */}
					<a
						href="tel:+919999999999"
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<Phone className="w-5 h-5 mb-1" />
						Call
					</a>
				</div>
			</div>
		</Layout>
	);
};

export default PartnerPage;
