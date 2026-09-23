import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ObfuscatedEmail from '@/components/ObfuscatedEmail';
import {
	ShieldCheck,
	FileText,
	CreditCard,
	XCircle,
	AlertCircle,
	Clock,
	CheckCircle2,
	RefreshCcw,
	Mail,
	Search,
	Home,
	HelpCircle,
	Phone,
} from 'lucide-react';

const sections = [
	{
		id: 'overview',
		label: 'Overview & Scope',
		icon: <ShieldCheck size={16} />,
	},
	{
		id: 'service-fee',
		label: 'Service Fee Structure',
		icon: <CreditCard size={16} />,
	},
	{
		id: 'cancellation-before',
		label: 'Cancellation Before Signing',
		icon: <XCircle size={16} />,
	},
	{
		id: 'post-signing',
		label: 'Post-Signing Refund Policy',
		icon: <FileText size={16} />,
	},
	{
		id: 'property-discrepancy',
		label: 'Property Not as Described',
		icon: <CheckCircle2 size={16} />,
	},
	{
		id: 'security-deposit',
		label: 'Security & Token Deposits',
		icon: <Home size={16} />,
	},
	{
		id: 'timelines',
		label: 'Refund Timelines & Mode',
		icon: <Clock size={16} />,
	},
	{
		id: 'request-process',
		label: 'How to Request a Refund',
		icon: <HelpCircle size={16} />,
	},
	{
		id: 'amendments',
		label: 'Policy Amendments',
		icon: <RefreshCcw size={16} />,
	},
	{
		id: 'contact',
		label: 'Contact & Dispute Support',
		icon: <Mail size={16} />,
	},
];

const RefundPolicy = () => {
	const [search, setSearch] = useState('');
	const [activeId, setActiveId] = useState('overview');

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
				<title>Refund &amp; Cancellation Policy | InstaMakaan</title>
				<meta
					name="description"
					content="Read InstaMakaan's Refund & Cancellation Policy regarding service fee terms, cancellations before and after agreement signing, 7-10 business days processing, and dispute resolution in Noida, Greater Noida, and Ghaziabad."
				/>
				<link rel="canonical" href="https://instamakaan.com/refund-policy" />
			</Helmet>

			<style>{`
				.rp-fade {
					opacity: 0;
					transform: translateY(24px);
					animation: rpFadeUp 0.5s ease forwards;
				}
				@keyframes rpFadeUp {
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
						Refund &amp; Cancellation Policy
					</h1>
					<p className="text-white/70 text-sm">
						Clear, transparent guidelines on service fees, cancellations, and refund processing
					</p>
					<div className="flex flex-wrap gap-2 mt-4">
						{[
							'Last Updated: September 2026',
							'Noida · Greater Noida · Ghaziabad',
							'7-10 Days Processing',
							'Fair Dispute Resolution',
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
							id="overview"
							icon={<ShieldCheck className="text-teal-600" size={18} />}
							title="1. Overview & Scope"
						>
							<p className="mb-3">
								InstaMakaan is a specialized real estate rental platform dedicated to connecting prospective tenants with verified property owners across <span className="font-semibold text-gray-800 dark:text-gray-200">Noida, Greater Noida, and Ghaziabad</span>. Our mission is to deliver rental peace of mind (&ldquo;Sukoon&rdquo;) by simplifying the property discovery, physical visit, documentation, and moving experience.
							</p>
							<p className="mb-3">
								This Refund &amp; Cancellation Policy sets forth the terms under which cancellations may be initiated, how service fees are charged and evaluated, and under what conditions refunds are granted.
							</p>
							<ul className="rp-list">
								<li>
									Applies to all tenants, prospective renters, and property seekers transacting or engaging with InstaMakaan services.
								</li>
								<li>
									Covers platform service fees, booking verification procedures, cancellation rights, and dispute escalation protocols.
								</li>
								<li>
									By utilizing our platform or availing our assisted rental services, you agree to abide by the terms stated herein.
								</li>
							</ul>
						</Section>

						<Section
							id="service-fee"
							icon={<CreditCard className="text-teal-600" size={18} />}
							title="2. Service Fee Structure & Charging Model"
						>
							<p className="mb-3">
								At InstaMakaan, we believe in complete transparency with zero hidden surprises. Our service fee structure is designed around value delivery:
							</p>
							<ul className="rp-list">
								<li>
									<strong className="text-gray-800 dark:text-gray-200">When the fee is charged:</strong> A one-time service fee is charged to tenants exclusively upon the successful finalization of a rental transaction, specifically at the time the formal rental agreement is signed between the tenant and the property owner.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">What the service fee covers:</strong> Dedicated field assistance, verified on-site property walkthroughs, owner negotiation coordination, background checks, standardized rental agreement drafting, and move-in support.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Upfront browsing & site visits:</strong> Browsing verified listings, scheduling visits, and viewing properties with our area specialists incurs no advance brokerage commitment until you decide to rent a home and proceed to agreement execution.
								</li>
							</ul>
						</Section>

						<Section
							id="cancellation-before"
							icon={<XCircle className="text-teal-600" size={18} />}
							title="3. Cancellation Prior to Agreement Signing"
						>
							<div className="flex items-center gap-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl px-4 py-3 mb-4">
								<CheckCircle2 size={18} className="text-teal-600 flex-shrink-0" />
								<p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
									Zero cancellation penalty prior to rental agreement signing.
								</p>
							</div>
							<p className="mb-3">
								We understand that circumstances may shift during your home search. If you decide to cancel before any rental agreement is formally executed:
							</p>
							<ul className="rp-list">
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Tenant-Initiated Cancellation:</strong> If a tenant decides not to proceed with a shortlisted property prior to signing the rental agreement, no service fee is charged. Any advance platform token or processing fee collected by InstaMakaan is 100% refundable without deductions.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Owner-Initiated Cancellation:</strong> If a property owner withdraws the property, modifies key agreed-upon terms, or fails to execute the lease before agreement signing, the prospective tenant is entitled to an immediate full refund or may opt to transfer the credit toward finding another property with priority assistance.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">No Obligation:</strong> You retain the full freedom to explore other properties across Noida, Greater Noida, and Ghaziabad without penalty if a deal does not proceed to the documentation stage.
								</li>
							</ul>
						</Section>

						<Section
							id="post-signing"
							icon={<FileText className="text-teal-600" size={18} />}
							title="4. Post-Signing Service Fee Policy"
						>
							<div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-4">
								<AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
								<p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
									The service fee is non-refundable once the rental agreement has been signed by both parties, subject only to property discrepancy guarantees.
								</p>
							</div>
							<p className="mb-3">
								Upon mutual signing and execution of the rental agreement, InstaMakaan&rsquo;s core matchmaking, verification, negotiation, and documentation services are deemed completely rendered.
							</p>
							<ul className="rp-list">
								<li>
									Once the rental agreement is executed, the service fee is non-refundable because administrative, operational, and documentation resources have been fully deployed.
								</li>
								<li>
									If either the tenant or the landlord decides to terminate the tenancy prematurely, vacate prior to the completion of the agreed lock-in period, or cancel post-move-in for personal reasons, InstaMakaan will not refund the platform service fee.
								</li>
								<li>
									Subsequent tenant-landlord operational matters post-handover remain subject to the terms of your bilateral lease agreement.
								</li>
							</ul>
						</Section>

						<Section
							id="property-discrepancy"
							icon={<CheckCircle2 className="text-teal-600" size={18} />}
							title="5. Full Refund Guarantee (Property Not as Described)"
						>
							<div className="flex items-center gap-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl px-4 py-3 mb-4">
								<ShieldCheck size={18} className="text-teal-600 flex-shrink-0" />
								<p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
									100% Full Refund Guarantee: If the verified property physically differs substantially from the listing representation or agreement conditions.
								</p>
							</div>
							<p className="mb-3">
								We stand behind the truthfulness of our property listings. If a tenant signs an agreement and discovers that the rented property materially deviates from what was promised and documented, InstaMakaan guarantees a <span className="font-semibold text-gray-900 dark:text-white">100% full refund of the service fee</span>.
							</p>
							<p className="font-medium text-gray-800 dark:text-gray-200 mb-2">
								Eligible grounds for full refund include:
							</p>
							<ul className="rp-list mb-3">
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Material Misrepresentation:</strong> Significant variance in square footage, room layout, or major missing fixtures/furnishings explicitly listed in the verified agreement inventory.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Undisclosed Severe Defects:</strong> Major unrectified structural damage, severe water leakage/seepage, faulty electrical circuitry, or plumbing issues that compromise safety and habitability.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Inability to Deliver Possession:</strong> Landlord fails to hand over physical possession or legal keys on the agreed occupancy date.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Society/RWA Restrictions:</strong> Undisclosed society rules or RWA restrictions that disallow the tenant from taking possession (e.g., pet policies, bachelor policies, or parking constraints not stated prior).
								</li>
							</ul>
							<p className="text-xs text-gray-500 dark:text-gray-400 italic">
								* Discrepancy claims must be submitted within 48 hours of possession or the scheduled move-in date along with supporting photographs or documentation to enable prompt field verification.
							</p>
						</Section>

						<Section
							id="security-deposit"
							icon={<Home className="text-teal-600" size={18} />}
							title="6. Owner Token & Security Deposit Clarification"
						>
							<p className="mb-3">
								It is important to distinguish between InstaMakaan platform service fees and financial exchanges made directly between the tenant and the landlord:
							</p>
							<ul className="rp-list">
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Direct Landlord Payments:</strong> Token booking advances, monthly rental charges, and security deposits are paid directly by the tenant to the property owner under the bilateral rental contract.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">No Deposit Custody:</strong> InstaMakaan does not hold, custody, or manage tenant security deposits on its balance sheet.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Mediation Support:</strong> In the event of a dispute over token advance or security deposit return between tenant and owner, InstaMakaan provides dedicated mediation and advisory assistance to facilitate a prompt, fair resolution in accordance with the signed agreement.
								</li>
							</ul>
						</Section>

						<Section
							id="timelines"
							icon={<Clock className="text-teal-600" size={18} />}
							title="7. Refund Processing Timelines & Payment Mode"
						>
							<div className="flex items-center gap-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl px-4 py-3 mb-4">
								<Clock size={18} className="text-teal-600 flex-shrink-0" />
								<p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
									Approved refunds are processed within 7 to 10 business days.
								</p>
							</div>
							<ul className="rp-list">
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Processing Window:</strong> Once a refund request is reviewed and officially approved by our compliance team, the disbursement is initiated within <span className="font-semibold text-teal-700 dark:text-teal-400">7 to 10 business days</span>.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Original Payment Method:</strong> All refunds are automatically credited back to the original source account or payment method utilized during the initial transaction (UPI, Debit Card, Credit Card, or Net Banking).
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Banking Turnaround:</strong> Depending on the recipient&rsquo;s bank or card-issuing institution, funds typically reflect in your bank account statement within 2 to 4 additional business days after bank transfer initiation.
								</li>
								<li>
									<strong className="text-gray-800 dark:text-gray-200">Zero Administrative Fee:</strong> InstaMakaan does not levy any cancellation processing fees on eligible, approved refunds.
								</li>
							</ul>
						</Section>

						<Section
							id="request-process"
							icon={<HelpCircle className="text-teal-600" size={18} />}
							title="8. Step-by-Step Refund Request Process"
						>
							<p className="mb-4">
								To ensure seamless handling of your cancellation or refund request, please follow these four simple steps:
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
								<div className="p-3.5 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-800/60">
									<div className="text-xs font-bold text-teal-600 mb-1">STEP 1</div>
									<h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Initiate Request</h4>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Reach out via our Contact page or call +91 9771034916 with your booking or property reference number.
									</p>
								</div>

								<div className="p-3.5 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-800/60">
									<div className="text-xs font-bold text-teal-600 mb-1">STEP 2</div>
									<h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Submit Proof</h4>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Provide transaction details and, if claiming a property discrepancy, clear photos/videos and description.
									</p>
								</div>

								<div className="p-3.5 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-800/60">
									<div className="text-xs font-bold text-teal-600 mb-1">STEP 3</div>
									<h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Verification (24-48h)</h4>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Our support team verifies details with our field executive and relevant parties within 24 to 48 hours.
									</p>
								</div>

								<div className="p-3.5 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-800/60">
									<div className="text-xs font-bold text-teal-600 mb-1">STEP 4</div>
									<h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Refund Credited</h4>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Upon approval, the refund is initiated and credited within 7-10 business days directly to your source account.
									</p>
								</div>
							</div>
						</Section>

						<Section
							id="amendments"
							icon={<RefreshCcw className="text-teal-600" size={18} />}
							title="9. Amendments & Policy Updates"
						>
							<p className="mb-3">
								InstaMakaan reserves the right to review, modify, or update this Refund &amp; Cancellation Policy from time to time in response to evolving business practices, legal frameworks, or platform operational improvements.
							</p>
							<p>
								Any modifications become effective immediately upon posting to this URL. The &ldquo;Last Updated&rdquo; date at the top of this document indicates the latest revision date. We encourage users to periodically check this page for updates.
							</p>
						</Section>

						<Section
							id="contact"
							icon={<Mail className="text-teal-600" size={18} />}
							title="10. Contact & Dispute Support"
						>
							<p className="mb-4">
								If you have any questions, require assistance with a cancellation, or wish to dispute a transaction, our customer grievance and support desk is available to assist you:
							</p>

							<div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6 text-center border border-gray-100 dark:border-neutral-700">
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
									Dedicated Rental Support &amp; Grievance Redressal
								</p>

								<div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-2">
									<span className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-base">
										<Mail size={16} />
										<ObfuscatedEmail className="hover:underline" />
									</span>
									<span className="hidden sm:inline text-gray-300 dark:text-neutral-600">|</span>
									<a
										href="tel:+919771034916"
										className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-base hover:underline"
									>
										<Phone size={16} />
										+91 9771034916
									</a>
								</div>

								<div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
									<p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
										InstaMakaan Office Address:
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
										Tower T2, Flat B809, Tech Zone 4, Plot 17,
										<br />
										Amrapali Dream Valley, Greater Noida, Uttar Pradesh 201310
									</p>
								</div>

								<div className="mt-4">
									<Link
										to="/contact"
										className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-300 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
									>
										Visit Help &amp; Contact Page
									</Link>
								</div>
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
		className="rp-fade bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 scroll-mt-28"
	>
		<div className="flex items-center gap-3 mb-4">
			<div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
				{icon}
			</div>
			<h2 className="text-base font-semibold text-gray-900 dark:text-white">
				{title}
			</h2>
		</div>
		<div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed [&_.rp-list]:space-y-2 [&_.rp-list_li]:flex [&_.rp-list_li]:gap-2 [&_.rp-list_li]:items-start [&_.rp-list_li]:before:content-[''] [&_.rp-list_li]:before:w-1.5 [&_.rp-list_li]:before:h-1.5 [&_.rp-list_li]:before:rounded-full [&_.rp-list_li]:before:bg-teal-500 [&_.rp-list_li]:before:mt-1.5 [&_.rp-list_li]:before:flex-shrink-0">
			{children}
		</div>
	</div>
);

export default RefundPolicy;
