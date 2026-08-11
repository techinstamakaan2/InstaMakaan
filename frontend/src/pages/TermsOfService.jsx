import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import {
	ShieldCheck,
	Users,
	Lock,
	FileText,
	Globe,
	Mail,
	Search,
	AlertCircle,
	CreditCard,
	UserCheck,
	RefreshCcw,
} from 'lucide-react';

const sections = [
	{
		id: 'acceptance',
		label: 'Acceptance of Terms',
		icon: <FileText size={16} />,
	},
	{ id: 'eligibility', label: 'Eligibility', icon: <UserCheck size={16} /> },
	{ id: 'services', label: 'Our Services', icon: <ShieldCheck size={16} /> },
	{ id: 'accounts', label: 'User Accounts', icon: <Lock size={16} /> },
	{ id: 'payments', label: 'Payments & Fees', icon: <CreditCard size={16} /> },
	{ id: 'conduct', label: 'User Conduct', icon: <AlertCircle size={16} /> },
	{
		id: 'liability',
		label: 'Limitation of Liability',
		icon: <ShieldCheck size={16} />,
	},
	{ id: 'termination', label: 'Termination', icon: <AlertCircle size={16} /> },
	{ id: 'governing', label: 'Governing Law', icon: <Globe size={16} /> },
	{ id: 'changes', label: 'Changes to Terms', icon: <RefreshCcw size={16} /> },
	{ id: 'contact', label: 'Contact Information', icon: <Mail size={16} /> },
];

const TermsOfService = () => {
	const [search, setSearch] = useState('');
	const [activeId, setActiveId] = useState('acceptance');

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
				<title>Terms of Service | InstaMakaan Legal Terms & Conditions</title>
				<meta
					name="description"
					content="Read InstaMakaan's Terms of Service to understand user responsibilities, platform rules, payments, and legal conditions for rental and property services."
				/>
				<link rel="canonical" href="https://instamakaan.com/terms" />
			</Helmet>

			<style>{`
				.tos-fade {
					opacity: 0;
					transform: translateY(20px);
					animation: tosFadeUp 0.5s ease forwards;
				}
				@keyframes tosFadeUp {
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
						Terms of Service
					</h1>
					<p className="text-white/70 text-sm">
						Please read these terms carefully before using our platform
					</p>
					<div className="flex flex-wrap gap-2 mt-4">
						{[
							'Effective: Jan 2025',
							'Governed by Indian Law',
							'Greater Noida, UP',
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
							id="acceptance"
							icon={<FileText className="text-teal-600" size={18} />}
							title="Acceptance of Terms"
						>
							<p>
								By accessing or using InstaMakaan, you agree to be bound by
								these Terms of Service and all applicable laws and regulations.
								If you do not agree with any of these terms, you are prohibited
								from using or accessing this platform.
							</p>
						</Section>

						<Section
							id="eligibility"
							icon={<UserCheck className="text-teal-600" size={18} />}
							title="Eligibility"
						>
							<ul className="tos-list">
								<li>
									You must be at least 18 years of age to use our services
								</li>
								<li>
									You must be legally capable of entering into binding contracts
								</li>
								<li>
									You must not be barred from using our services under
									applicable law
								</li>
							</ul>
						</Section>

						<Section
							id="services"
							icon={<ShieldCheck className="text-teal-600" size={18} />}
							title="Our Services"
						>
							<ul className="tos-list">
								<li>
									Verified rental property listings across Noida, Greater Noida
									& Ghaziabad
								</li>
								<li>
									Tenant onboarding, KYC verification and agreement management
								</li>
								<li>Property management services for owners</li>
								<li>Maintenance coordination and support</li>
							</ul>
						</Section>

						<Section
							id="accounts"
							icon={<Lock className="text-teal-600" size={18} />}
							title="User Accounts"
						>
							<ul className="tos-list">
								<li>
									You are responsible for maintaining the confidentiality of
									your account credentials
								</li>
								<li>
									All activities under your account are your responsibility
								</li>
								<li>
									Notify us immediately of any unauthorised use of your account
								</li>
								<li>
									Providing false information may result in account termination
								</li>
							</ul>
						</Section>

						<Section
							id="payments"
							icon={<CreditCard className="text-teal-600" size={18} />}
							title="Payments & Fees"
						>
							<ul className="tos-list">
								<li>
									All payments are processed through secure, encrypted gateways
								</li>
								<li>
									Service fees are clearly disclosed before any transaction
								</li>
								<li>
									Refund policy is governed by individual property agreements
								</li>
								<li>
									Token amounts are adjustable but may be non-refundable as per
									terms
								</li>
							</ul>
						</Section>

						<Section
							id="conduct"
							icon={<AlertCircle className="text-teal-600" size={18} />}
							title="User Conduct"
						>
							<p className="mb-3">
								Users agree not to engage in any of the following:
							</p>
							<ul className="tos-list">
								<li>Fraudulent, misleading or deceptive activity</li>
								<li>
									Any illegal or unlawful activity on or through the platform
								</li>
								<li>
									Misuse, reverse-engineering or tampering with our systems
								</li>
								<li>
									Posting false property listings or inaccurate information
								</li>
								<li>Harassment or abusive behaviour toward other users</li>
							</ul>
						</Section>

						<Section
							id="liability"
							icon={<ShieldCheck className="text-teal-600" size={18} />}
							title="Limitation of Liability"
						>
							<p className="mb-3">
								To the maximum extent permitted by law, InstaMakaan shall not be
								liable for:
							</p>
							<ul className="tos-list">
								<li>Any indirect, incidental or consequential damages</li>
								<li>Loss of data, revenue or business opportunities</li>
								<li>Disputes between tenants and property owners</li>
								<li>Third-party service failures or interruptions</li>
							</ul>
						</Section>

						<Section
							id="termination"
							icon={<AlertCircle className="text-teal-600" size={18} />}
							title="Termination"
						>
							<ul className="tos-list">
								<li>
									We may suspend or terminate accounts that violate these terms
								</li>
								<li>
									You may close your account at any time by contacting support
								</li>
								<li>
									Termination does not affect any existing legal obligations
								</li>
							</ul>
						</Section>

						<Section
							id="governing"
							icon={<Globe className="text-teal-600" size={18} />}
							title="Governing Law"
						>
							<p>
								These Terms of Service are governed by and construed in
								accordance with the laws of India. Any disputes arising under
								these terms shall be subject to the exclusive jurisdiction of
								the courts located in Greater Noida, Uttar Pradesh.
							</p>
						</Section>

						<Section
							id="changes"
							icon={<RefreshCcw className="text-teal-600" size={18} />}
							title="Changes to Terms"
						>
							<p>
								We reserve the right to update or modify these Terms at any
								time. We will notify registered users of significant changes via
								email or in-app notification. Continued use of the platform
								after changes constitutes your acceptance of the revised Terms.
							</p>
						</Section>

						<Section
							id="contact"
							icon={<Mail className="text-teal-600" size={18} />}
							title="Contact Information"
						>
							<div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 text-center">
								<p className="text-sm text-gray-500 mb-1">
									For any legal queries or concerns
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
		className="tos-fade bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 scroll-mt-28"
	>
		<div className="flex items-center gap-3 mb-4">
			<div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
				{icon}
			</div>
			<h2 className="text-base font-semibold text-gray-900 dark:text-white">
				{title}
			</h2>
		</div>
		<div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed [&_.tos-list]:space-y-2 [&_.tos-list_li]:flex [&_.tos-list_li]:gap-2 [&_.tos-list_li]:items-start [&_.tos-list_li]:before:content-[''] [&_.tos-list_li]:before:w-1.5 [&_.tos-list_li]:before:h-1.5 [&_.tos-list_li]:before:rounded-full [&_.tos-list_li]:before:bg-teal-500 [&_.tos-list_li]:before:mt-1.5 [&_.tos-list_li]:before:flex-shrink-0">
			{children}
		</div>
	</div>
);

export default TermsOfService;
