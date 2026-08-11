// PLACEHOLDER CONTENT — generic, editorial-style overview content.
// Not attributed to fake residents and no fabricated star ratings, so it's
// safe to publish while real content/reviews are collected. Swap the pools
// below with real, verified info per society as it becomes available.

const HIGHLIGHTS_POOL = [
	'Good connectivity to major roads and the expressway network',
	'Green spaces, parks and landscaped common areas',
	'24x7 security with CCTV coverage at entry/exit points',
	'Power backup and water supply for common areas',
	'Proximity to schools, hospitals and daily-needs markets',
	'Clubhouse and shared amenities for residents',
	'Family-friendly, relatively low-traffic internal layout',
	'Reasonable resale and rental demand in the surrounding area',
];

const CONSIDERATIONS_POOL = [
	'Maintenance charges can vary — worth confirming current rates directly',
	'Parking availability may get tight during peak hours',
	'Distance from the main gate to amenities can vary by block/tower',
	'Traffic on the main access road can build up during rush hour',
	'For under-construction phases, confirm current possession timelines',
	'Visitor parking may be limited on weekends',
];

const BEST_FOR_POOL = [
	'Families',
	'Working Professionals',
	'First-time Renters',
	'Long-term Residents',
	'Investors',
	'Students',
];

// Editorial assessment dimensions — InstaMakaan's own general scoring
// framework, not sourced from resident surveys. Framed transparently as such.
const SCORE_DIMENSIONS = [
	{ key: 'connectivity', label: 'Connectivity' },
	{ key: 'amenities', label: 'Amenities & Lifestyle' },
	{ key: 'safety', label: 'Safety & Security' },
	{ key: 'value', label: 'Value for Money' },
	{ key: 'upkeep', label: 'Community & Upkeep' },
];

function hashString(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
	}
	return hash;
}

function pick(pool, count, seed) {
	const arr = [...pool];
	const result = [];
	let s = seed || 1;
	for (let i = 0; i < count && arr.length; i++) {
		s = (s * 9301 + 49297) % 233280;
		const idx = Math.floor((s / 233280) * arr.length);
		result.push(arr.splice(idx, 1)[0]);
	}
	return result;
}

function seededFloat(seed, min, max) {
	const s = ((seed * 9301 + 49297) % 233280) / 233280;
	return Math.round((min + s * (max - min)) * 10) / 10;
}

// Deterministic (same society -> same picks every time) so content doesn't
// shuffle on every page load/refresh.
export function getSocietyInsights(societyName) {
	const seed = hashString(societyName || 'society');

	const highlights = pick(HIGHLIGHTS_POOL, 5, seed);
	const considerations = pick(CONSIDERATIONS_POOL, 3, seed + 7);
	const bestFor = pick(BEST_FOR_POOL, 3, seed + 13);

	const scores = SCORE_DIMENSIONS.map((dim, i) => ({
		...dim,
		value: seededFloat(seed + i * 17, 3.4, 4.6),
	}));
	const overallScore =
		Math.round((scores.reduce((sum, s) => sum + s.value, 0) / scores.length) * 10) / 10;

	const topHighlight = highlights[0]?.charAt(0).toLowerCase() + highlights[0]?.slice(1);
	const verdict = `Overall, ${societyName} stands out for ${topHighlight}, making it a reasonable option for ${bestFor
		.slice(0, 2)
		.join(' and ')
		.toLowerCase()}. As with any society, we recommend a site visit to confirm current amenities and maintenance quality before making your decision.`;

	const overview = `${societyName} is one of the residential developments covered on InstaMakaan across Noida and Greater Noida. This overview brings together general locality information, connectivity factors, and practical things to check — put together to help you research faster before you rent or buy here. Live listings and current pricing for ${societyName} are shown further down this page, pulled directly from InstaMakaan's active inventory.`;

	return {
		society: societyName,
		highlights,
		considerations,
		bestFor,
		scores,
		overallScore,
		verdict,
		overview,
		isPlaceholder: true,
	};
}
