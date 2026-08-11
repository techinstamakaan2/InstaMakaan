import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
	{
		step: '01',
		title: 'Search Your Space',
		desc: 'Filter by locality, budget, BHK & move-in date. 100% verified listings.',
		glow: 'shadow-teal-400/25',
		ring: 'ring-teal-100 dark:ring-teal-900/30',
		pill: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
		checks: ['Transparent pricing', 'Verified listings', 'Smart filters'],
		video: '/videos/how-it-works-search.mp4',
		accentBar: 'from-teal-500 to-teal-400',
	},
	{
		step: '02',
		title: 'Schedule a Visit',
		desc: 'Book a free site visit. Our agent confirms within 30 minutes.',
		glow: 'shadow-amber-400/25',
		ring: 'ring-amber-100 dark:ring-amber-900/30',
		pill: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
		checks: ['Free visits', 'Expert guidance', 'Flexible timing'],
		video: '/videos/how-it-works-visit.mp4',
		accentBar: 'from-amber-500 to-amber-400',
	},
	{
		step: '03',
		title: 'Move In, Stress-Free',
		desc: 'Digital agreement, zero paperwork hassle — just show up with your bags.',
		glow: 'shadow-teal-400/25',
		ring: 'ring-teal-100 dark:ring-teal-900/30',
		pill: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
		checks: ['Digital agreement', 'Instant possession', '24/7 support'],
		video: '/videos/how-it-works-movein.mp4',
		accentBar: 'from-teal-500 to-teal-400',
	},
];

export const HowItWorksSection = () => {
	const navigate = useNavigate();

	return (
		<section className="py-16 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-[#0c1528] dark:to-[#0b1220] overflow-hidden">
			<div className="container-custom">

				{/* Header */}
				<div className="text-center mb-14" data-reveal="fade">
					<p className="text-[11px] font-bold tracking-[0.3em] uppercase text-teal-500 dark:text-teal-400 mb-2">Simple & Transparent</p>
					<h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">How It Works</h2>
					<p className="text-slate-500 dark:text-slate-400 mt-3 text-sm md:text-base max-w-sm mx-auto">
						From first search to keys in hand — three steps, zero hassle.
					</p>
					<div className="mx-auto mt-4 h-[2px] w-12 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" />
				</div>

				{/* Steps */}
				<div className="space-y-8 md:space-y-6">
					{STEPS.map(({ step, title, desc, glow, ring, pill, checks, video, accentBar }, i) => (
						<div
							key={step}
							data-reveal={i % 2 === 0 ? 'left' : 'right'}
							data-delay={String(i * 100)}
							className={`grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/8 shadow-xl ${glow} bg-white dark:bg-[#111827] ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
						>
							{/* Video panel */}
							<div className={`${i % 2 === 1 ? 'md:[direction:ltr]' : ''} relative overflow-hidden min-h-[240px] md:min-h-[300px]`}>
								{/* Accent gradient bar at top */}
								<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentBar} z-10`} />

								<video
									src={video}
									autoPlay
									loop
									muted
									playsInline
									className="absolute inset-0 w-full h-full object-cover"
								/>
							</div>

							{/* Content panel */}
							<div className={`${i % 2 === 1 ? 'md:[direction:ltr]' : ''} flex flex-col justify-center p-8 md:p-10`}>
								<span className={`inline-flex self-start text-[11px] font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full mb-4 ${pill}`}>
									Step {step}
								</span>
								<h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3">
									{title}
								</h3>
								<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
									{desc}
								</p>
								<ul className="space-y-2.5">
									{checks.map((c) => (
										<li key={c} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
											<CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
											{c}
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>

				{/* CTA */}
				<div className="text-center mt-12" data-reveal="scale" data-delay="200">
					<button
						onClick={() => navigate('/all-properties')}
						className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-teal-500/25 transition-all hover:shadow-teal-500/40 hover:-translate-y-0.5 text-sm"
					>
						Start Searching Now <ArrowRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</section>
	);
};
