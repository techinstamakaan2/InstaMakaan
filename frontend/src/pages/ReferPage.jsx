import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	User, Share2, Wallet, Trophy, ArrowRight,
	Key, ArrowLeft, Info, Gift, Building2, CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageFAQSection from '@/components/home/PageFAQSection';

const REFER_FAQS = [
	{
		question: 'How does the InstaMakaan referral program work?',
		answer:
			'Log in to get your unique referral link, share it with anyone looking for a rental home or property to buy, and earn a reward every time they successfully move in or close a deal through your link. There is no cap on how many people you can refer.',
	},
	{
		question: 'How much do I earn for a rental referral?',
		answer:
			'You earn ₹2,000 for every person who successfully moves into a rental property through your referral link. The reward is credited to your account within 7–10 working days after the confirmed move-in.',
	},
	{
		question: 'How much do I earn for a property purchase referral?',
		answer:
			'You earn ₹25,000 when someone you refer successfully books a residential or commercial property through InstaMakaan. This reward is credited after the deal is officially confirmed.',
	},
	{
		question: 'When will I receive my referral reward?',
		answer:
			'Rewards are processed within 7–10 working days after the referred person\'s move-in or property booking is confirmed. You will receive a notification as soon as the reward is credited to your account.',
	},
	{
		question: 'Is there a limit on how many people I can refer?',
		answer:
			'No limit at all. You can refer as many people as you like and earn a reward for every successful conversion. The more you refer, the more you earn — there is no cap.',
	},
	{
		question: 'Do I need to be an existing customer to refer someone?',
		answer:
			'You need a free InstaMakaan account to generate your referral link. Creating one takes less than a minute. Once registered, you can start sharing your link and earning immediately.',
	},
	{
		question: 'How do I track my referrals and rewards?',
		answer:
			'Log in to your InstaMakaan account and visit the Refer & Earn section. You will see a dashboard showing your active referrals, successful conversions, and the status of pending or paid rewards.',
	},
];

const TABS = [
	{ id: 'rent', label: 'Rent' },
	{ id: 'buy', label: 'Buy' },
];

const tabContent = {
	rent: {
		kicker: 'For Renters & Owners',
		headline: 'Refer a Tenant. Get ₹2,000!',
		desc: 'Know someone looking for a rental home? Refer them to InstaMakaan and earn ₹2,000 every time they successfully move in.',
		bullets: [
			'Share your referral link with anyone looking for a flat',
			'They find & rent a verified home through InstaMakaan',
			'You get ₹2,000 credited after successful move-in',
		],
		reward: '₹2,000',
		rewardLabel: 'Per Successful Move-in',
		image: '/images/rent refer.png',
		color: 'teal',
	},
	buy: {
		kicker: 'For Property Buyers',
		headline: 'Refer a Buyer. Get ₹25,000!',
		desc: 'Know someone looking to invest in commercial or residential property? Refer them and earn big when they close a deal.',
		bullets: [
			'Share your referral link with potential property buyers',
			'They enquire and visit a project through InstaMakaan',
			'You earn ₹25,000 on every successful property booking',
		],
		reward: '₹25,000',
		rewardLabel: 'Per Property Booking',
		image: '/images/buy refer.png',
		color: 'amber',
	},
};

const steps = [
	{ icon: User,   title: 'Get Your Link',         desc: 'Log in to generate your unique referral link in seconds.' },
	{ icon: Share2, title: 'Share It',               desc: 'Send it to friends, family, or anyone who needs a home or property.' },
	{ icon: Wallet, title: 'Earn Rewards',           desc: 'We notify you when your referral converts and process your reward.' },
];

const leaderboard = [
	{ rank: 1, name: 'Sagar',        earnings: '₹75,000', referrals: 15 },
	{ rank: 2, name: 'Nitin',        earnings: '₹60,000', referrals: 12 },
	{ rank: 3, name: 'Priya Kapoor', earnings: '₹45,000', referrals: 9 },
];

const ReferPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('rent');
	const content = tabContent[activeTab];
	const isBuy = activeTab === 'buy';

	const scrollToSteps = () => {
		document.getElementById('steps-section')?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({ title: 'Earn with InstaMakaan', text: 'Refer & Earn with InstaMakaan 🚀', url: window.location.href });
		}
	};

	return (
		<Layout>
			<Helmet>
				<title>Refer & Earn | InstaMakaan — Earn up to ₹25,000 per Referral</title>
				<meta name="description" content="Earn money by referring tenants and buyers to InstaMakaan. Get ₹2,000 per rental referral and ₹25,000 per property booking in Noida, Greater Noida and Ghaziabad." />
				<link rel="canonical" href="https://instamakaan.com/refer" />
			</Helmet>

			{/* ── Hero ── */}
			<section className="relative overflow-hidden pt-16 pb-10 md:pt-24 md:pb-16 bg-gradient-to-br from-teal-50 via-white to-amber-50 dark:from-[#0b1220] dark:via-[#0b1220] dark:to-[#0f1f2e]">
				<div className="absolute -top-20 -left-20 w-72 h-72 bg-teal-400/15 blur-3xl rounded-full pointer-events-none" />
				<div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-400/15 blur-3xl rounded-full pointer-events-none" />
				<div className="container-custom text-center relative z-10">
					<p className="text-[11px] font-bold tracking-[0.3em] uppercase text-teal-600 dark:text-teal-400 mb-3">Referral Program</p>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
						Refer & Earn
					</h1>
					<p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-base">
						Share InstaMakaan. Earn real money — every time someone rents or buys through your link.
					</p>
				</div>
			</section>

			{/* ── Tabs + Content ── */}
			<section className="py-10 md:py-16 bg-white dark:bg-[#0b1220]">
				<div className="container-custom">

					{/* Tab bar */}
					<div className="flex justify-center mb-10">
						<div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
							{TABS.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`px-8 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
										activeTab === tab.id
											? 'bg-teal-600 text-white shadow-md shadow-teal-500/30'
											: 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
									}`}
								>
									{tab.label}
								</button>
							))}
						</div>
					</div>

					{/* Content grid */}
					<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto px-2 md:px-0">

						{/* Left — image */}
						<div className="flex items-center justify-center">
							<img
								key={activeTab}
								src={content.image}
								alt={content.headline}
								className="w-full max-w-sm"
							/>
						</div>

						{/* Right — content */}
						<div key={activeTab}>
							<p className="text-[11px] font-bold tracking-[0.25em] uppercase text-teal-600 dark:text-teal-400 mb-2">{content.kicker}</p>
							<h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">{content.headline}</h2>
							<p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">{content.desc}</p>

							<ul className="space-y-3 mb-8">
								{content.bullets.map((b) => (
									<li key={b} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
										<CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
										{b}
									</li>
								))}
							</ul>

							{/* Reward badge */}
							<div className={`inline-flex items-center gap-4 px-5 py-3 rounded-2xl mb-6 border ${isBuy ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/30' : 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700/30'}`}>
								<div>
									<p className={`text-2xl font-black ${isBuy ? 'text-amber-600 dark:text-amber-400' : 'text-teal-600 dark:text-teal-400'}`}>{content.reward}</p>
									<p className="text-xs text-slate-500 dark:text-slate-400">{content.rewardLabel}</p>
								</div>
								<Gift className={`w-8 h-8 ${isBuy ? 'text-amber-400' : 'text-teal-400'}`} />
							</div>

							<div className="flex flex-wrap gap-3">
								<button
									onClick={scrollToSteps}
									className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all shadow-lg shadow-teal-500/20"
								>
									How It Works <ArrowRight className="w-4 h-4" />
								</button>
								<button
									onClick={() => navigate('/login')}
									className="flex items-center gap-2 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
								>
									Login to Earn
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ── How It Works ── */}
			<section id="steps-section" className="py-14 md:py-20 bg-slate-50 dark:bg-[#0c1528]">
				<div className="container-custom">
					<div className="text-center mb-10">
						<p className="text-[11px] font-bold tracking-[0.3em] uppercase text-teal-500 dark:text-teal-400 mb-2">Simple Process</p>
						<h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Earn in 3 Steps</h2>
					</div>
					<div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						{steps.map((step, i) => (
							<div key={step.title} className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-100 dark:border-white/8 shadow-sm text-center">
								<div className="relative inline-flex mb-4">
									<div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
										<step.icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
									</div>
									<span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
								</div>
								<h3 className="font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
								<p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Leaderboard ── */}
			<section className="py-14 md:py-20 bg-white dark:bg-[#0b1220]">
				<div className="container-custom">
					<div className="text-center mb-10">
						<p className="text-[11px] font-bold tracking-[0.3em] uppercase text-teal-500 dark:text-teal-400 mb-2">Top Earners</p>
						<h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
							<Trophy className="w-7 h-7 text-amber-500" /> Referral Champions
						</h2>
					</div>

					<div className="max-w-2xl mx-auto bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-white/8 shadow-md overflow-hidden">
						<div className="grid grid-cols-4 px-5 py-3 bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-400">
							<span>Rank</span><span>Name</span><span className="text-right">Earned</span><span className="text-right">Referrals</span>
						</div>
						{leaderboard.map((e) => (
							<div key={e.name} className="grid grid-cols-4 px-5 py-3.5 border-t border-slate-100 dark:border-white/8 items-center">
								<span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${e.rank === 1 ? 'bg-amber-400 text-white' : e.rank === 2 ? 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white' : e.rank === 3 ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>{e.rank}</span>
								<span className="font-medium text-slate-800 dark:text-white text-sm">{e.name}</span>
								<span className="text-right font-bold text-teal-600 dark:text-teal-400 text-sm">{e.earnings}</span>
								<span className="text-right text-slate-500 dark:text-slate-400 text-sm">{e.referrals}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			<PageFAQSection faqs={REFER_FAQS} title="Referral Program — FAQs" />

			{/* Mobile bottom bar */}
			<div className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
				<div className="flex justify-around items-center px-4 py-2 rounded-2xl bg-white/90 dark:bg-[#0b1220]/90 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl">
					<button onClick={() => navigate(-1)} className="flex flex-col items-center text-[10px] text-slate-500 dark:text-slate-400">
						<ArrowLeft className="w-5 h-5 mb-0.5" />Back
					</button>
					<button onClick={scrollToSteps} className="flex flex-col items-center text-[10px] text-slate-500 dark:text-slate-400">
						<Info className="w-5 h-5 mb-0.5" />Steps
					</button>
					<button onClick={() => navigate('/login')} className="flex flex-col items-center text-[10px] font-bold text-teal-600 dark:text-teal-400">
						<Gift className="w-5 h-5 mb-0.5" />Refer
					</button>
					<button onClick={handleShare} className="flex flex-col items-center text-[10px] text-slate-500 dark:text-slate-400">
						<Share2 className="w-5 h-5 mb-0.5" />Share
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default ReferPage;
