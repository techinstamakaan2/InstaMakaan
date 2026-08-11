// src/pages/RentListingPage.jsx
// This page handles URLs like:
//   /rent/flats-for-rent-in-noida
//   /rent/2-bhk-flats-for-rent-in-sector-62-noida
//   /rent/3-bhk-flats-for-rent-in-greater-noida-west
//
// It reads the slug, converts it to filters, then redirects to
// your existing AllPropertiesPage with the correct URL params.
// This means ZERO changes to AllPropertiesPage.

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { slugToFilters } from '@/utils/slugUtils';

export default function RentListingPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const filters = slugToFilters(slug || '');

	useEffect(() => {
		// Build the query string for AllPropertiesPage
		const params = new URLSearchParams();
		params.set('tab', 'rent');
		if (filters.location) params.set('search', filters.location); // uses your existing search filter
		if (filters.beds) params.set('bhk', filters.beds);

		// Redirect internally — AllPropertiesPage handles the rest
		navigate(`/all-properties?${params.toString()}`, { replace: true });
	}, [slug]);

	// While redirecting, show a nice SEO-friendly shell
	// (Google sees this before JS runs if you add SSR later)
	const location = filters.location
		? filters.location.replace(/\b\w/g, (c) => c.toUpperCase())
		: 'Noida';
	const bhkText = filters.beds ? `${filters.beds} BHK ` : '';
	const title = `${bhkText}Flats for Rent in ${location} | InstaMakaan`;
	const desc = `Find ${bhkText}flats for rent in ${location}. Verified properties with transparent pricing. Browse now on InstaMakaan.`;

	return (
		<>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content={desc} />
				<link rel="canonical" href={`https://instamakaan.com/rent/${slug}`} />
			</Helmet>
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-400 text-sm">Loading properties...</p>
			</div>
		</>
	);
}
