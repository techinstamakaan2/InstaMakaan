import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Key, Handshake, Users, TrendingUp, BadgeCheck, Home, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMode } from '@/context/ModeContext';

const rentStats = [
	{ icon: Building2, value: 50, suffix: '+', label: 'Listings Live Across NCR' },
	{ icon: Key, value: 100, suffix: '+', label: 'Families Helped & Counting' },
	{ icon: Handshake, value: 30, suffix: '+', label: 'Trusted Owner Partners' },
	{ icon: Users, value: 500, suffix: '+', label: 'Members in Our Community' },
];

const buyStats = [
	{ icon: Home, value: 4, suffix: '+', label: 'Premium Projects Featured' },
	{ icon: BadgeCheck, value: 100, suffix: '%', label: 'RERA Verified Properties' },
	{ icon: Search, value: 4, suffix: ' Types', label: 'Office Unit Configurations' },
	{ icon: Users, value: 500, suffix: '+', label: 'Enquiries Handled' },
];

const CountUp = ({ end, duration = 2000, suffix = '' }) => {
	const [count, setCount] = useState(0);
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
			{ threshold: 0.2 },
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!isVisible) return;
		let startTime, frame;
		const animate = (currentTime) => {
			if (!startTime) startTime = currentTime;
			const progress = Math.min((currentTime - startTime) / duration, 1);
			setCount(Math.floor(progress * end));
			if (progress < 1) frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	}, [isVisible, end, duration]);

	return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export const ImpactSection = () => {
	const { mode } = useMode();
	const isBuy = mode === 'buy';
	const stats = isBuy ? buyStats : rentStats;

	const accentGlow = 'from-teal-300/10 via-transparent to-yellow-300/10';
	const iconBg = 'bg-teal-500/10 group-hover:bg-teal-500/20';
	const iconColor = 'text-teal-500 group-hover:text-teal-600';

	return (
		<section className="py-16 md:py-24 bg-white dark:bg-[#0b1220]">
			<div className="container-custom">
				<div data-reveal="fade" className="text-center mb-12 md:mb-16">
					<h2 className="text-3xl md:text-6xl font-extrabold text-slate-900 dark:text-white">
						{isBuy ? 'Your Dream Home Awaits' : 'We Create Real Impact'}
					</h2>
					<p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-3 font-medium">
						{isBuy ? 'Trusted by Thousands of Happy Homeowners' : 'Our Numbers, Your Peace of Mind'}
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4">
					{stats.map((stat, index) => (
						<Card
							key={stat.label}
							data-reveal="scale"
							data-delay={String(index * 100)}
							className={cn(
								'bg-white dark:bg-[#101826] rounded-2xl shadow-xl border-0',
								'transition-all duration-500 hover:scale-[1.04] hover:-translate-y-1 hover:shadow-2xl',
								'relative overflow-hidden cursor-pointer select-none group',
							)}
							style={{ animation: `fadeUp 0.9s ease-out ${index * 0.12}s both` }}
						>
							<div className={`absolute inset-0 bg-gradient-to-br ${accentGlow} opacity-0 group-hover:opacity-100 transition duration-500`} />
							<CardContent className="p-6 md:p-8 text-center relative z-10">
								<div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${iconBg} flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
									<stat.icon className={`w-7 h-7 md:w-8 md:h-8 ${iconColor} transition-colors duration-300`} />
								</div>
								<div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-yellow-600">
									<CountUp end={stat.value} suffix={stat.suffix} />
								</div>
								<p className="text-sm md:text-base text-slate-600 dark:text-slate-400">{stat.label}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
			<style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
		</section>
	);
};
