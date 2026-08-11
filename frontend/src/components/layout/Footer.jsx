import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	Facebook,
	Instagram,
	Linkedin,
	Phone,
	Mail,
	MapPin,
	ChevronRight,
} from 'lucide-react';

const navigationLinks = [
	{ name: 'Home', path: '/' },
	{ name: 'Partner with us', path: '/partner' },
	{ name: 'Explore Property', path: '/all-properties' },
	{ name: 'About Us', path: '/about' },
	{ name: 'Contact Us', path: '/contact' },
];

const exploreLinks = [
	{ name: 'Rent', path: '/rent' },
	{ name: 'Buy', path: '/buy' },
	{ name: 'Area Guides', path: '/areas' },
	{ name: 'Society Reviews', path: '/society-reviews' },
	{ name: 'Guides', path: '/guides' },
	{ name: 'Our Services', path: '/services' },
];

const resourceLinks = [
	{ name: 'Blog', path: '/blog' },
	{ name: 'FAQs', path: '/faq' },
	{ name: 'Reviews', path: '/reviews' },
];

const socialLinks = [
	{
		name: 'Facebook',
		icon: Facebook,
		url: 'https://www.facebook.com/share/1DTjmoeU8R/',
	},
	{
		name: 'Instagram',
		icon: Instagram,
		url: 'https://instagram.com/instamakaan',
	},
	{
		name: 'LinkedIn',
		icon: Linkedin,
		url: 'https://www.linkedin.com/company/instamakaan/',
	},
];

const FooterLink = ({ path, name, onClick }) => (
	<li>
		<Link
			to={path}
			onClick={onClick}
			className="group inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
		>
			<ChevronRight className="w-3 h-3 text-teal-500/0 group-hover:text-teal-500/100 -ml-4 group-hover:ml-0 transition-all duration-200" />
			{name}
		</Link>
	</li>
);

const ColumnHeading = ({ children }) => (
	<h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white mb-5 relative inline-block">
		{children}
		<span className="absolute -bottom-2 left-0 h-[2px] w-8 bg-gradient-to-r from-teal-400 to-sky-500 rounded-full" />
	</h3>
);

export const Footer = () => {
	const location = useLocation();

	// ⭐ Universal Scroll-To-Top if already on same page
	const handleSmartScroll = (path) => {
		if (location.pathname === path) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	return (
		<footer className="relative bg-slate-50 dark:bg-[#080f1e] text-slate-900 dark:text-slate-200 transition-colors">
			{/* Top accent line */}
			<div className="h-[3px] w-full bg-gradient-to-r from-teal-400 via-sky-500 to-teal-400" />

			<div className="container-custom pt-14 pb-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<Link
							to="/"
							onClick={() => handleSmartScroll('/')}
							className="flex items-center gap-3 mb-5"
						>
							<img
								src="/images/orglogo.webp"
								alt="InstaMakaan Logo"
								className="w-12 h-12 object-contain shrink-0"
							/>

							<div className="leading-tight">
								<span className="text-xl font-bold text-slate-900 dark:text-white">Insta</span>
								<span className="text-xl font-bold text-slate-900 dark:text-white">Makaan</span>
							</div>
						</Link>

						<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-sm">
							Delivering rental Sukoon to property owners and tenants. Our
							mission is to be the most trusted, professional, and reliable name
							in real estate.
						</p>

						<div className="flex items-center gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.url}
									aria-label={social.name}
									target="_blank"
									rel="noreferrer"
									className="
										w-10 h-10 rounded-xl flex items-center justify-center
										bg-white dark:bg-white/10
										border border-slate-200 dark:border-white/10
										text-slate-600 dark:text-slate-300
										hover:bg-gradient-to-br hover:from-teal-500 hover:to-sky-500 hover:text-white hover:border-transparent
										hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/20
										transition-all duration-300
									"
								>
									<social.icon className="w-4.5 h-4.5" />
								</a>
							))}
						</div>
					</div>

					{/* Navigation */}
					<div>
						<ColumnHeading>Navigation</ColumnHeading>
						<ul className="space-y-3 mt-5">
							{navigationLinks.map((link) => (
								<FooterLink key={link.path} {...link} onClick={() => handleSmartScroll(link.path)} />
							))}
						</ul>
					</div>

					{/* Explore */}
					<div>
						<ColumnHeading>Explore</ColumnHeading>
						<ul className="space-y-3 mt-5">
							{exploreLinks.map((link) => (
								<FooterLink key={link.path} {...link} onClick={() => handleSmartScroll(link.path)} />
							))}
						</ul>
					</div>

					{/* Resources */}
					<div>
						<ColumnHeading>Resources</ColumnHeading>
						<ul className="space-y-3 mt-5">
							{resourceLinks.map((link) => (
								<FooterLink key={link.path} {...link} onClick={() => handleSmartScroll(link.path)} />
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<ColumnHeading>Contact</ColumnHeading>
						<ul className="space-y-4 mt-5">
							<li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
								<span className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
									<Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
								</span>
								<a href="tel:+919771034916" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
									+91 9771034916
								</a>
							</li>

							<li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
								<span className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
									<Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
								</span>
								<a
									href="mailto:support@instamakaan.com"
									className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors break-all"
								>
									support@instamakaan.com
								</a>
							</li>

							<li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
								<span className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0 mt-0.5">
									<MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
								</span>
								<a
									href="https://www.google.com/maps?q=Tower+T2,+Flat+B809,+Amrapali+Dream+Valley,+Greater+Noida"
									target="_blank"
									rel="noreferrer"
									className="leading-relaxed hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
								>
									Tower T2, Flat B809, Tech Zone 4, Plot 17, Amrapali Dream
									Valley,
									<br />
									Greater Noida, Uttar Pradesh 201310
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom */}
			<div className="border-t border-slate-200 dark:border-white/10">
				<div className="container-custom py-6 pb-24 md:pb-6">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 text-center">
						<p>© 2025 InstaMakaan. All Rights Reserved.</p>

						<div className="flex items-center gap-3">
							<Link to="/privacy-policy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
								Privacy Policy
							</Link>

							<span className="opacity-40">|</span>

							<Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
