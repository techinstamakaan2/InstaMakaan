import React, { lazy, Suspense, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { PropertiesSection } from '@/components/properties/PropertiesSection';
import { Search, Building2, Phone, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMode } from '@/context/ModeContext';

// Below-fold sections — lazy loaded to reduce initial bundle
const ImpactSection = lazy(() => import('@/components/home/ImpactSection').then(m => ({ default: m.ImpactSection })));
const PropertyOwnerSection = lazy(() => import('@/components/home/PropertyOwnerSection').then(m => ({ default: m.PropertyOwnerSection })));
const CommunitySection = lazy(() => import('@/components/home/CommunitySection').then(m => ({ default: m.CommunitySection })));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const InstagramSection = lazy(() => import('@/components/home/InstagramSection').then(m => ({ default: m.InstagramSection })));
const CompanyTieUpsSection = lazy(() => import('@/components/home/CompanyTieUpsSection').then(m => ({ default: m.CompanyTieUpsSection })));
const LocationLinksSection = lazy(() => import('@/components/home/LocationLinksSection').then(m => ({ default: m.LocationLinksSection })));
const HomeFAQSection = lazy(() => import('@/components/home/HomeFAQSection'));
const HowItWorksSection = lazy(() => import('@/components/home/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));
const EMICalculatorSection = lazy(() => import('@/components/home/EMICalculatorSection').then(m => ({ default: m.EMICalculatorSection })));

const HomePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const searchRef = React.useRef(null);
	const { mode, setMode } = useMode();
	const isBuy = mode === 'buy';

	// /buy and / both render this page — keep mode in sync with the URL
	// so the right content shows immediately, and it's shareable/indexable.
	useEffect(() => {
		setMode(location.pathname.startsWith('/buy') ? 'buy' : 'rent');
	}, [location.pathname, setMode]);

	const scrollToSearch = () => {
		if (searchRef.current) {
			searchRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const handleCall = () => {
		window.location.href = 'tel:+919771034916';
	};

	const handleWhatsApp = () => {
		window.open('https://wa.aisensy.com/aabbf5', '_blank');
	};

	return (
		<Layout>
			<Helmet>
				<title>
					{isBuy
						? 'Buy Property in Noida, Greater Noida & Ghaziabad | InstaMakaan'
						: 'Rental Properties in Noida, Greater Noida & Ghaziabad | Flats, PG & Co-Living | InstaMakaan'}
				</title>
				<meta
					name="description"
					content={isBuy
						? 'Sell your property in Noida, Greater Noida, and Ghaziabad with InstaMakaan. Connect with verified buyers, get the best price, and close deals fast.'
						: 'Find affordable rental flats, PGs, and co-living spaces in Noida, Greater Noida, Noida Extension, and Ghaziabad with InstaMakaan. Verified listings, easy booking, and hassle-free experience.'}
				/>
				<meta
					name="keywords"
					content={isBuy
						? 'buy property noida, buy flat greater noida, property for sale ghaziabad, buy house noida extension'
						: 'flats in noida, pg in greater noida, rental properties ghaziabad, co living noida extension'}
				/>
				<link rel="canonical" href={`https://instamakaan.com${isBuy ? '/buy' : '/'}`} />
			</Helmet>
			<HeroSection ref={searchRef} />
			<div data-reveal><PropertiesSection /></div>
			<div className="container-custom -mt-4 mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
				<Link
					to={isBuy ? '/guides/buying-a-property-in-noida' : '/guides/renting-a-property-in-noida'}
					className="text-[11px] sm:text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline whitespace-nowrap"
				>
					{isBuy
						? 'New to buying property? Read our complete buying guide →'
						: 'First time renting? Read our complete renting guide →'}
				</Link>
				<Link
					to="/areas"
					className="text-[11px] sm:text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline whitespace-nowrap"
				>
					Explore Noida &amp; Greater Noida area guides →
				</Link>
			</div>
			{!isBuy && (
				<div data-reveal>
					<Suspense fallback={null}><HowItWorksSection /></Suspense>
				</div>
			)}
			{isBuy && (
				<div data-reveal>
					<Suspense fallback={null}><EMICalculatorSection /></Suspense>
				</div>
			)}
			<div data-reveal>
				<Suspense fallback={null}><ImpactSection /></Suspense>
			</div>
			<div data-reveal>
				<Suspense fallback={null}><PropertyOwnerSection /></Suspense>
			</div>
			<div data-reveal>
				<Suspense fallback={null}><CommunitySection /></Suspense>
			</div>
			<div data-reveal>
				<Suspense fallback={null}><TestimonialsSection /></Suspense>
			</div>
			<div data-reveal>
				<Suspense fallback={null}><InstagramSection /></Suspense>
			</div>
			<div data-reveal>
				<Suspense fallback={null}><CompanyTieUpsSection /></Suspense>
			</div>
			<div data-reveal>
				<Suspense fallback={null}><HomeFAQSection /></Suspense>
			</div>
			{!isBuy && (
				<div data-reveal>
					<Suspense fallback={null}><LocationLinksSection /></Suspense>
				</div>
			)}
			{/* MOBILE BOTTOM BAR */}
			<div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
				<div
					className="flex justify-around items-center px-4 py-2 rounded-2xl 
	bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-lg 
	border border-gray-200 dark:border-white/10 
	shadow-xl"
				>
					<button
						onClick={scrollToSearch}
						className="flex flex-col items-center text-[11px] "
					>
						<Search className="w-5 h-5 mb-1" />
						Search
					</button>

					<button
						onClick={() => navigate('/all-properties')}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300"
					>
						<Building2 className="w-5 h-5 mb-1" />
						Properties
					</button>

					<button
						onClick={handleCall}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300"
					>
						<Phone className="w-5 h-5 mb-1" />
						Call
					</button>

					<button
						onClick={handleWhatsApp}
						className="flex flex-col items-center text-[11px] text-green-700"
					>
						<MessageCircle className="w-5 h-5 mb-1" />
						WhatsApp
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default HomePage;
