import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Home, Building2, Search } from 'lucide-react';

export default function NotFoundPage() {
	return (
		<Layout>
			<Helmet>
				<title>Page Not Found | InstaMakaan</title>
				<meta name="robots" content="noindex, follow" />
			</Helmet>
			<div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
				<h1 className="text-7xl font-bold text-teal-600 mb-2">404</h1>
				<p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
					Page Not Found
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md">
					The page you're looking for doesn't exist or may have been moved.
				</p>
				<div className="flex flex-wrap items-center justify-center gap-3">
					<Link
						to="/"
						className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
					>
						<Home className="w-4 h-4" /> Go Home
					</Link>
					<Link
						to="/all-properties"
						className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
					>
						<Building2 className="w-4 h-4" /> Browse Properties
					</Link>
					<Link
						to="/contact"
						className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
					>
						<Search className="w-4 h-4" /> Contact Us
					</Link>
				</div>
			</div>
		</Layout>
	);
}
