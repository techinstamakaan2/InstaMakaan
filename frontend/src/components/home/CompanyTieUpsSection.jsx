import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const companies = [
	{ name: 'UKG', logo: '/images/ukg.jpg' },
	{ name: 'Formula Group', logo: '/images/formula-group.jpg' },
];

export const CompanyTieUpsSection = () => {
	const [isPaused, setIsPaused] = useState(false);

	const disableMarquee = companies.length < 3;

	return (
		<section className="py-16 md:py-20 bg-slate-50 dark:bg-[#0b1220] overflow-hidden">
			{/* HEADER */}
			<div className="container-custom mb-12">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-4">
					Where Working Professionals Find Their Homes
				</h2>

				<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
					A growing community of professionals in Noida & Greater Noida use
					InstaMakaan to explore verified rental homes.
				</p>
			</div>

			{/* LOGO WRAPPER */}
			<div
				className={cn(
					'relative w-full overflow-hidden',
					disableMarquee && 'flex justify-center',
				)}
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<div
					className={cn(
						'flex items-center',
						!disableMarquee && 'animate-marquee',
						isPaused && !disableMarquee && 'pause-animation',
						disableMarquee && 'gap-8 sm:gap-12',
					)}
				>
					{(disableMarquee
						? companies
						: [...companies, ...companies, ...companies]
					) // 🔥 reduced duplication
						.map((company, index) => (
							<div
								key={`${company.name}-${index}`} // ✅ FIXED KEY
								className="
								flex-shrink-0
								w-[140px] sm:w-[180px] md:w-[220px] lg:w-[260px]
								px-5
							"
							>
								<div
									className="
									h-[90px] sm:h-[100px] md:h-[110px] lg:h-[120px]
									bg-white dark:bg-white/5
									border border-gray-200 dark:border-white/10
									rounded-2xl shadow-md
									flex flex-col items-center justify-center
									transition-all duration-500
									hover:shadow-xl hover:-translate-y-1
								"
								>
									<img
										src={company.logo}
										alt={company.name}
										loading="lazy"
										className="max-h-12 sm:max-h-14 md:max-h-16 object-contain"
									/>

									<div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
										{company.name}
									</div>
								</div>
							</div>
						))}
				</div>

				{/* Fade edges */}
				{!disableMarquee && (
					<>
						<div className="pointer-events-none absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent dark:from-[#0b1220] dark:via-[#0b1220]/90" />
						<div className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent dark:from-[#0b1220] dark:via-[#0b1220]/90" />
					</>
				)}
			</div>

			<style>{`
				@keyframes marquee {
					0% { transform: translateX(0); }
					100% { transform: translateX(-25%); }
				}
				.animate-marquee {
					animation: marquee 30s linear infinite;
					width: max-content;
				}
				.pause-animation {
					animation-play-state: paused;
				}
			`}</style>
		</section>
	);
};
