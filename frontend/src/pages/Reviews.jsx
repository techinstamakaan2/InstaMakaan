import React from 'react';
import { Layout } from '@/components/layout/Layout';
import HeroSection from '@/components/reviews/HeroSection';
import TestimonialsVideos from '@/components/reviews/TestimonialsVideos';
import CustomerStories from '@/components/reviews/CustomerStories';
import ReviewCards from '@/components/reviews/ReviewCards';
import { ArrowLeft, Phone, MessageCircle, PlayCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import PageFAQSection from '@/components/home/PageFAQSection';

const REVIEWS_FAQS = [
	{
		question: 'Are the reviews on InstaMakaan genuine?',
		answer:
			'Yes. All reviews on InstaMakaan are from real tenants and property owners who have used our platform. We verify each reviewer\'s account before their review is published to prevent fake or misleading feedback.',
	},
	{
		question: 'How do I leave a review for InstaMakaan?',
		answer:
			'If you have rented a property or used our services, log in to your account and visit the Reviews section. You can rate your experience and write a detailed review about your renting journey, the property, or our team.',
	},
	{
		question: 'Can I leave a review for a specific property?',
		answer:
			'Yes, you can review individual properties you have rented through InstaMakaan. Your review helps other tenants make informed decisions and encourages owners to maintain high standards.',
	},
	{
		question: 'What if I had a negative experience?',
		answer:
			'We take all feedback seriously. If you had a negative experience, please share it honestly in your review and also contact our support team at support@instamakaan.com. We will investigate and work to resolve the issue.',
	},
	{
		question: 'How is the overall rating calculated?',
		answer:
			'Our overall rating is an average across multiple dimensions including property condition, owner communication, value for money, and how smoothly the move-in process went. Higher ratings reflect consistently positive experiences across all these factors.',
	},
];
export default function HeroReviews() {
	const navigate = useNavigate();

	// 📞 CALL
	const handleCall = () => {
		window.location.href = 'tel:+919771034916';
	};

	// 💬 WHATSAPP (AiSensy)
	const handleWhatsApp = () => {
		window.open('https://wa.aisensy.com/aabbf5', '_blank');
	};

	// 🎥 SCROLL TO VIDEOS
	const scrollToVideos = () => {
		const el = document.getElementById('videos-section');
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<Layout>
			<Helmet>
				<title>Customer Reviews & Testimonials | InstaMakaan Noida & Greater Noida</title>
				<meta name="description" content="Read real customer reviews and testimonials for InstaMakaan. See how we help tenants and property owners in Noida, Greater Noida, Noida Extension and Ghaziabad." />
				<meta name="keywords" content="instamakaan reviews, property reviews noida, rental service testimonials, pg reviews greater noida" />
				<link rel="canonical" href="https://instamakaan.com/reviews" />
				<meta property="og:title" content="Customer Reviews & Testimonials | InstaMakaan Noida" />
				<meta property="og:description" content="Real customer reviews for InstaMakaan — helping tenants and property owners in Noida, Greater Noida and Ghaziabad." />
				<meta property="og:url" content="https://instamakaan.com/reviews" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://instamakaan.com/images/orglogo.webp" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Customer Reviews & Testimonials | InstaMakaan Noida" />
				<meta name="twitter:description" content="Real customer reviews for InstaMakaan — helping tenants and property owners in Noida and Greater Noida." />
				<meta name="twitter:image" content="https://instamakaan.com/images/orglogo.webp" />
			</Helmet>
			<HeroSection />
			<h1 className="sr-only">
				Customer Reviews & Testimonials for Rental Properties in Noida, Greater
				Noida & Ghaziabad
			</h1>
			{/* 👇 IMPORTANT: ID add karo */}
			<div id="videos-section">
				<TestimonialsVideos />
			</div>

			<CustomerStories />
			<ReviewCards />
<PageFAQSection faqs={REVIEWS_FAQS} title="Reviews & Ratings — FAQs" />

			{/* 🔥 MOBILE BOTTOM BAR */}
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

					{/* WATCH */}
					<button
						onClick={scrollToVideos}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<PlayCircle className="w-5 h-5 mb-1" />
						Watch
					</button>

					{/* CALL */}
					<button
						onClick={handleCall}
						className="flex flex-col items-center text-[11px] text-gray-600 dark:text-gray-300 active:scale-90 transition"
					>
						<Phone className="w-5 h-5 mb-1" />
						Call
					</button>

					{/* WHATSAPP */}
					<button
						onClick={handleWhatsApp}
						className="flex flex-col items-center text-[11px] text-green-600"
					>
						<MessageCircle className="w-5 h-5 mb-1" />
						WhatsApp
					</button>
				</div>
			</div>
		</Layout>
	);
}
