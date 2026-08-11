import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, Building2, User, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMode } from '@/context/ModeContext';

const rentTestimonials = [
	{
		id: 1,
		headline: 'Hassle-Free Income & Total Peace of Mind',
		quote: 'InstaMakaan changed everything. My property is professionally managed, the rent is always on time, and I never worry about anything.',
		name: 'Mr. Rajesh Kumar',
		role: 'Property Owner',
		location: 'Sector 137 Noida',
		type: 'owner',
		videoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
	},
	{
		id: 2,
		headline: 'Found My Dream Rental in Days',
		quote: 'No fake listings, no stress. InstaMakaan made finding a rental home simple and reliable.',
		name: 'Priya Sharma',
		role: 'Tenant',
		location: 'Sector 62 Noida',
		type: 'tenant',
		videoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
	},
	{
		id: 3,
		headline: 'Professional Service, Every Time',
		quote: 'Managing multiple rental properties is easy now. InstaMakaan handles everything.',
		name: 'Amit Verma',
		role: 'Property Investor',
		location: 'Greater Noida',
		type: 'owner',
		videoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
	},
];

const buyTestimonials = [
	{
		id: 1,
		headline: 'Bought My Dream Home at the Best Price',
		quote: 'InstaMakaan helped me find a verified property with honest pricing. The entire process was smooth and transparent.',
		name: 'Mr. Suresh Mehta',
		role: 'Home Buyer',
		location: 'Sector 150 Noida',
		type: 'tenant',
		videoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
	},
	{
		id: 2,
		headline: 'Found the Perfect 3BHK Without Any Hassle',
		quote: 'All listings were verified. No time-wasters, no middlemen. InstaMakaan delivered exactly what I was looking for.',
		name: 'Neha Gupta',
		role: 'First-Time Buyer',
		location: 'Greater Noida West',
		type: 'tenant',
		videoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
	},
	{
		id: 3,
		headline: 'Best Investment Decision of My Life',
		quote: 'InstaMakaan guided me through my property investment with expert advice and genuine listings. Highly recommended!',
		name: 'Vikram Singh',
		role: 'Property Investor',
		location: 'Noida Extension',
		type: 'owner',
		videoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
	},
];

export const TestimonialsSection = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const { mode } = useMode();
	const isBuy = mode === 'buy';
	const testimonials = isBuy ? buyTestimonials : rentTestimonials;

	// Reset index when mode changes
	useEffect(() => { setCurrentIndex(0); }, [mode]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((p) => (p + 1) % testimonials.length);
		}, 8000);
		return () => clearInterval(interval);
	}, [testimonials.length]);

	const t = testimonials[currentIndex];

	const accent = 'text-teal-500';
	const accentBg = 'bg-teal-500';
	const accentBgLight = 'bg-teal-500/20';
	const accentIcon = 'text-teal-500';
	const navHover = 'hover:bg-teal-500';
	const dotActive = 'bg-teal-500';
	const subtitle = isBuy
		? 'Real stories from happy homeowners who bought with InstaMakaan.'
		: 'Real stories from owners & tenants who trust InstaMakaan.';

	return (
		<section className="py-20 bg-white dark:bg-[#0b1220]">
			<div className="container-custom">
				<div data-reveal="fade" className="text-center mb-14">
					<h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
						What Our Customers Say
					</h2>
					<p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-all duration-500">
						{subtitle}
					</p>
				</div>

				<div className="relative max-w-6xl mx-auto px-4 md:px-0">
					{/* NAV ARROWS */}
					<button
						onClick={() => setCurrentIndex((p) => (p - 1 + testimonials.length) % testimonials.length)}
						aria-label="Previous testimonial"
						className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 ${navHover} text-white transition flex items-center justify-center`}
					>
						<ChevronLeft />
					</button>
					<button
						onClick={() => setCurrentIndex((p) => (p + 1) % testimonials.length)}
						aria-label="Next testimonial"
						className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 ${navHover} text-white transition flex items-center justify-center`}
					>
						<ChevronRight />
					</button>

					<Card className="bg-white dark:bg-[#0f172a] border border-black/10 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden">
						<CardContent className="p-0">
							<div className="grid md:grid-cols-2 min-h-[360px]">
								{/* IMAGE */}
								<div className="relative">
									<img src={t.videoThumbnail} alt={t.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
									<div className="absolute inset-0 bg-black/30 flex items-center justify-center">
										<div className={`w-16 h-16 rounded-full ${accentBg} flex items-center justify-center shadow-lg transition-colors duration-500`}>
											<Play className="ml-1 text-white" />
										</div>
									</div>
								</div>

								{/* TEXT */}
								<div className="relative p-8 md:p-12 flex flex-col justify-center">
									<Quote className={`w-10 h-10 mb-4 transition-colors duration-500 ${accent}`} />
									<h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-4">{t.headline}</h3>
									<p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">"{t.quote}"</p>
									<div className="flex items-center gap-4">
										<div className={`w-12 h-12 rounded-full ${accentBgLight} flex items-center justify-center transition-colors duration-500`}>
											{t.type === 'owner'
												? <Building2 className={`transition-colors duration-500 ${accentIcon}`} />
												: <User className={`transition-colors duration-500 ${accentIcon}`} />}
										</div>
										<div>
											<p className="text-slate-900 dark:text-white font-semibold">{t.name}</p>
											<p className="text-sm text-slate-500 dark:text-slate-400">{t.role}, {t.location}</p>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* DOTS */}
					<div className="flex justify-center mt-6 gap-2">
						{testimonials.map((_, i) => (
							<span
								key={i}
								onClick={() => setCurrentIndex(i)}
								className={cn('h-2 w-2 rounded-full cursor-pointer transition-all duration-300',
									i === currentIndex ? `${dotActive} opacity-100` : 'bg-slate-400 dark:bg-slate-600 opacity-60')}
								style={{ transform: i === currentIndex ? 'scaleX(4)' : 'scaleX(1)', transition: 'transform 0.3s ease, opacity 0.3s ease' }}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
