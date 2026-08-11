import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	ShieldCheck,
	Users,
	Lock,
	FileText,
	Globe,
	Cookie,
	Mail,
	Search,
	CreditCard,
	Globe2,
	Baby,
	RefreshCcw,
} from 'lucide-react';

const sections = [
	{
		id: 'objective',
		label: 'Objective & Scope',
		icon: <ShieldCheck size={16} />,
	},
	{ id: 'collect', label: 'Information We Collect', icon: <Users size={16} /> },
	{
		id: 'account',
		label: 'Account & Profile Info',
		icon: <FileText size={16} />,
	},
	{
		id: 'payment',
		label: 'Payment Information',
		icon: <CreditCard size={16} />,
	},
	{ id: 'cookies', label: 'Cookies & Tracking', icon: <Cookie size={16} /> },
	{ id: 'use', label: 'How We Use Information', icon: <Globe size={16} /> },
	{ id: 'sharing', label: 'Sharing of Information', icon: <Users size={16} /> },
	{ id: 'retention', label: 'Data Retention', icon: <FileText size={16} /> },
	{ id: 'security', label: 'Data Security', icon: <Lock size={16} /> },
	{ id: 'rights', label: 'User Rights', icon: <ShieldCheck size={16} /> },
	{
		id: 'international',
		label: 'International Transfers',
		icon: <Globe2 size={16} />,
	},
	{ id: 'age', label: 'Age Restrictions', icon: <Baby size={16} /> },
	{ id: 'amendments', label: 'Amendments', icon: <RefreshCcw size={16} /> },
	{ id: 'contact', label: 'Contact Information', icon: <Mail size={16} /> },
];

const PrivacyPolicy = () => {
	const [search, setSearch] = useState('');
	const [activeId, setActiveId] = useState('objective');

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) setActiveId(e.target.id);
				});
			},
			{ threshold: 0.4 },
		);
		sections.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	}, []);

	const scrollToSection = (id) => {
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		setActiveId(id);
	};

	const filtered = sections.filter((s) =>
		s.label.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<Layout>
			<Helmet>
				<title>
					Privacy Policy | InstaMakaan Data Protection & User Privacy
				</title>
				<meta
					name="description"
					content="Read InstaMakaan's privacy policy to understand how we collect, use, store and protect your personal data."
				/>
				<link rel="canonical" href="https://instamakaan.com/privacy-policy" />
			</Helmet>

			<style>{`
				.pp-fade {
					opacity: 0;
					transform: translateY(24px);
					animation: ppFadeUp 0.5s ease forwards;
				}
				@keyframes ppFadeUp {
					to { opacity: 1; transform: translateY(0); }
				}
			`}</style>

			{/* HERO */}
			<div className="bg-gradient-to-br from-teal-700 to-teal-900 px-6 py-14 text-white">
				<div className="container-custom max-w-5xl">
					<span className="inline-block text-xs bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
						InstaMakaan · Legal
					</span>
					<h1 className="text-3xl sm:text-4xl font-bold mb-2">
						Privacy Policy
					</h1>
					<p className="text-white/70 text-sm">
						How we collect, use and protect your information
					</p>
					<div className="flex flex-wrap gap-2 mt-4">
						{[
							'Effective: Jan 2025',
							'India Data Protection Compliant',
							'GDPR-aligned',
						].map((tag) => (
							<span
								key={tag}
								className="text-xs bg-white/10 border border-white/15 rounded-full px-3 py-1 text-white/80"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* BODY */}
			<div className="container-custom max-w-5xl py-10">
				<div className="flex gap-8 items-start">
					{/* STICKY SIDEBAR */}
					<aside className="hidden lg:block w-[240px] flex-shrink-0 sticky top-24 self-start">
						<div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm">
							<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
								Contents
							</p>

							{/* SEARCH */}
							<div className="relative mb-3">
								<Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
								<input
									type="text"
									placeholder="Search..."
									className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 outline-none focus:ring-1 focus:ring-teal-500"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>

							<ul className="space-y-0.5">
								{filtered.map((item) => (
									<li key={item.id}>
										<button
											onClick={() => scrollToSection(item.id)}
											className={`w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-lg text-xs transition-all
												${
													activeId === item.id
														? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium'
														: 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-800 dark:hover:text-gray-200'
												}`}
										>
											<span
												className={
													activeId === item.id
														? 'text-teal-600'
														: 'text-gray-400'
												}
											>
												{item.icon}
											</span>
											{item.label}
										</button>
									</li>
								))}
							</ul>
						</div>
					</aside>

					{/* CONTENT */}
					<div className="flex-1 min-w-0 space-y-5">
						<Section
							id="objective"
							icon={<ShieldCheck className="text-teal-600" size={18} />}
							title="Objective, Scope and Applicability"
						>
							<ul className="pp-list">
								<li>
									Applies to visitors, registered users, landlords, tenants &
									service partners.
								</li>
								<li>
									Governs collection, usage, storage and sharing of information.
								</li>
								<li>Using InstaMakaan means you consent to this Policy.</li>
							</ul>
						</Section>

						<Section
							id="collect"
							icon={<Users className="text-teal-600" size={18} />}
							title="Information We Collect"
						>
							<ul className="pp-list">
								<li>
									Personally Identifiable Information (name, phone, email)
								</li>
								<li>Sensitive Personal Information for KYC</li>
								<li>Non-Personal Information (usage, device data)</li>
								<li>Identity Verification documents</li>
								<li>Communication records with our team</li>
							</ul>
						</Section>

						<Section
							id="account"
							icon={<FileText className="text-teal-600" size={18} />}
							title="Account and Profile Information"
						>
							<p>
								We collect your name, contact details and preferences when you
								create an account. This is used to personalise your experience
								and match you with relevant properties across Noida, Greater
								Noida and Ghaziabad.
							</p>
						</Section>

						<Section
							id="payment"
							icon={<CreditCard className="text-teal-600" size={18} />}
							title="Payment Information"
						>
							<ul className="pp-list">
								<li>
									All transactions processed via secure encrypted gateways
								</li>
								<li>We do not store full card details on our servers</li>
								<li>KYC may be required for certain transactions</li>
							</ul>
						</Section>

						<Section
							id="cookies"
							icon={<Cookie className="text-teal-600" size={18} />}
							title="Cookies and Tracking Technologies"
						>
							<p>
								We use cookies and similar technologies to improve your
								experience, remember your preferences, and analyse site usage.
								You can control cookie settings through your browser.
							</p>
						</Section>

						<Section
							id="use"
							icon={<Globe className="text-teal-600" size={18} />}
							title="How We Use Information"
						>
							<ul className="pp-list">
								<li>Create and manage user accounts</li>
								<li>Process payments and booking requests</li>
								<li>Connect tenants with verified property listings</li>
								<li>Improve our platform based on usage patterns</li>
							</ul>
						</Section>

						<Section
							id="sharing"
							icon={<Users className="text-teal-600" size={18} />}
							title="Sharing of Information"
						>
							<div className="flex items-center gap-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl px-4 py-3 mb-4">
								<ShieldCheck
									size={18}
									className="text-teal-600 flex-shrink-0"
								/>
								<p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
									We do NOT sell your personal information — ever.
								</p>
							</div>
							<ul className="pp-list">
								<li>
									Data shared with property owners only to facilitate bookings
								</li>
								<li>
									Service partners under strict confidentiality agreements
								</li>
								<li>Law enforcement only when required by applicable law</li>
							</ul>
						</Section>

						<Section
							id="retention"
							icon={<FileText className="text-teal-600" size={18} />}
							title="Data Retention"
						>
							<p>
								Your data is stored only as long as required to provide services
								or comply with legal obligations. You may request deletion
								subject to applicable laws.
							</p>
						</Section>

						<Section
							id="security"
							icon={<Lock className="text-teal-600" size={18} />}
							title="Data Security"
						>
							<p>
								Your data is protected using industry-standard encryption,
								secure servers and access controls. We conduct regular security
								audits to safeguard your information against unauthorised
								access.
							</p>
						</Section>

						<Section
							id="rights"
							icon={<ShieldCheck className="text-teal-600" size={18} />}
							title="User Rights"
						>
							<ul className="pp-list">
								<li>Access the personal data we hold about you</li>
								<li>Request corrections to inaccurate information</li>
								<li>
									Ask for deletion of your data (subject to legal obligations)
								</li>
								<li>Withdraw consent for optional data processing</li>
							</ul>
						</Section>

						<Section
							id="international"
							icon={<Globe2 className="text-teal-600" size={18} />}
							title="International Transfers"
						>
							<p>
								Your data is primarily stored and processed in India. Any
								international transfer will comply with applicable data
								protection laws and adequate safeguards.
							</p>
						</Section>

						<Section
							id="age"
							icon={<Baby className="text-teal-600" size={18} />}
							title="Age Restrictions"
						>
							<p>
								Our services are not directed at children under 18. We do not
								knowingly collect personal information from minors. If you
								believe a minor has provided data, please contact us
								immediately.
							</p>
						</Section>

						<Section
							id="amendments"
							icon={<RefreshCcw className="text-teal-600" size={18} />}
							title="Amendments"
						>
							<p>
								We may update this policy from time to time. We will notify
								registered users of significant changes via email or in-app
								notification. Continued use of our platform after changes
								constitutes acceptance.
							</p>
						</Section>

						<Section
							id="contact"
							icon={<Mail className="text-teal-600" size={18} />}
							title="Contact Information"
						>
							<div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 text-center">
								<p className="text-sm text-gray-500 mb-1">
									For any privacy-related queries
								</p>
								<a
									href="mailto:support@instamakaan.com"
									className="text-teal-600 font-semibold text-base hover:underline"
								>
									support@instamakaan.com
								</a>
								<p className="text-xs text-gray-400 mt-3">
									Tower T2, Flat B809, Tech Zone 4,
									<br />
									Amrapali Dream Valley, Greater Noida 201310
								</p>
							</div>
						</Section>
					</div>
				</div>
			</div>
		</Layout>
	);
};

/* ── REUSABLE SECTION CARD ── */
const Section = ({ id, icon, title, children }) => (
	<div
		id={id}
		className="pp-fade bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 scroll-mt-28"
	>
		<div className="flex items-center gap-3 mb-4">
			<div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
				{icon}
			</div>
			<h2 className="text-base font-semibold text-gray-900 dark:text-white">
				{title}
			</h2>
		</div>
		<div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed [&_.pp-list]:space-y-2 [&_.pp-list_li]:flex [&_.pp-list_li]:gap-2 [&_.pp-list_li]:items-start [&_.pp-list_li]:before:content-[''] [&_.pp-list_li]:before:w-1.5 [&_.pp-list_li]:before:h-1.5 [&_.pp-list_li]:before:rounded-full [&_.pp-list_li]:before:bg-teal-500 [&_.pp-list_li]:before:mt-1.5 [&_.pp-list_li]:before:flex-shrink-0">
			{children}
		</div>
	</div>
);

export default PrivacyPolicy;
