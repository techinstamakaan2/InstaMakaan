// src/utils/slugUtils.js

// ─── RENT LISTING SLUGS ───────────────────────────────────────────

// "2-bhk-flats-for-rent-in-sector-62-noida"
// → { beds: "2", location: "sector 62 noida" }
export function slugToFilters(slug) {
	if (!slug) return {};
	const filters = {};

	const bhkMatch = slug.match(/^(\d+)-bhk/);
	if (bhkMatch) filters.beds = bhkMatch[1];

	// Extract price BEFORE location so it doesn't pollute location string
	const priceMatch = slug.match(/-below-(\d+)$/);
	if (priceMatch) {
		filters.maxPrice = priceMatch[1];
		slug = slug.replace(/-below-\d+$/, '');
	}

	const locationMatch = slug.match(/-in-(.+)$/);
	if (locationMatch) filters.location = locationMatch[1].replace(/-/g, ' ');

	return filters;
}

// { beds: "2", location: "sector 62 noida", maxPrice: "15000" }
// → "2-bhk-flats-for-rent-in-sector-62-noida-below-15000"
export function filtersToSlug({ beds, location, maxPrice }) {
	const parts = [];
	if (beds) parts.push(`${beds}-bhk`);
	parts.push('flats-for-rent');
	if (location)
		parts.push('in-' + location.toLowerCase().trim().replace(/\s+/g, '-'));
	if (maxPrice)
		parts.push(`below-${maxPrice}`);
	return parts.join('-');
}

// ─── PROPERTY DETAIL SLUGS ───────────────────────────────────────
// UUID wala URL → SEO friendly URL
//
// property = { id: "d72c9a69-...", title: "Furnished Studio Room in Golden-I", city: "Greater Noida West" }
// → "furnished-studio-room-golden-i-greater-noida-west--d72c9a69"
//
// ID ka last part bhi rakhte hain taaki duplicate titles mein confusion na ho
// aur property fetch karne ke liye ID milti rahe

export function propertyToSlug(property) {
	if (!property) return '';

	const titlePart = (property.title || '')
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '') // special chars remove
		.trim()
		.replace(/\s+/g, '-'); // spaces → dashes

	const cityPart = (property.city || property.location || '')
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '')
		.trim()
		.replace(/\s+/g, '-');

	// ID ka short version (pehle 8 characters) — unique rehne ke liye
	const idShort = (property.id || '').substring(0, 8);

	const parts = [titlePart, cityPart, idShort].filter(Boolean);
	return parts.join('-');
}

// "furnished-studio-room-golden-i-greater-noida-west--d72c9a69"
// → "d72c9a69"  (ye backend se property fetch karne ke liye use hoga)
export function slugToPropertyId(slug) {
	if (!slug) return '';
	// Last part extract karo (8 char ID)
	const parts = slug.split('-');
	return parts[parts.length - 1];
}
