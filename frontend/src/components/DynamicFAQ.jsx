import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';

const VISIBLE_COUNT = 3;

/**
 * DynamicFAQ — reusable accordion FAQ with JSON-LD schema injection.
 * Shows the first 3 questions by default with a "Show more" toggle for the rest.
 *
 * Props:
 *   faqs     : [{ question: string, answer: string }]
 *   heading  : string (optional) — section heading
 *   className: string (optional)
 */
const DynamicFAQ = ({ faqs = [], heading = 'Frequently Asked Questions', className = '' }) => {
	const [openIndex, setOpenIndex] = useState(null);
	const [showAll, setShowAll] = useState(false);

	if (!faqs.length) return null;

	const hasMore = faqs.length > VISIBLE_COUNT;
	const visibleFaqs = showAll ? faqs : faqs.slice(0, VISIBLE_COUNT);

	// Full list always included in schema, regardless of what's expanded in the UI
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.question,
			acceptedAnswer: { '@type': 'Answer', text: f.answer },
		})),
	};

	return (
		<section className={`py-14 bg-white dark:bg-[#0b1220] ${className}`}>
			<Helmet>
				<script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
			</Helmet>

			<div className="container-custom max-w-3xl">
				<h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 text-center truncate">
					{heading}
				</h2>

				<div className="space-y-2.5">
					{visibleFaqs.map((faq, i) => (
						<div
							key={i}
							onClick={() => setOpenIndex(openIndex === i ? null : i)}
							className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 cursor-pointer hover:border-teal-400 dark:hover:border-teal-600 transition-all"
						>
							<div className="flex items-center justify-between gap-3">
								<p className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
									{faq.question}
								</p>
								<div className="shrink-0 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow">
									{openIndex === i ? (
										<Minus className="w-3 h-3" />
									) : (
										<Plus className="w-3 h-3" />
									)}
								</div>
							</div>

							<div
								className={`overflow-hidden transition-all duration-300 ${
									openIndex === i
										? 'max-h-[400px] opacity-100 mt-3'
										: 'max-h-0 opacity-0'
								}`}
							>
								<p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
									{faq.answer}
								</p>
							</div>
						</div>
					))}
				</div>

				{hasMore && (
					<button
						onClick={() => setShowAll((v) => !v)}
						className="mt-4 mx-auto flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
					>
						{showAll ? (
							<>
								Show less <ChevronUp className="w-3.5 h-3.5" />
							</>
						) : (
							<>
								Show {faqs.length - VISIBLE_COUNT} more <ChevronDown className="w-3.5 h-3.5" />
							</>
						)}
					</button>
				)}
			</div>
		</section>
	);
};

export default DynamicFAQ;


/* ─────────────────────────────────────────────────────────────────
 * FAQ GENERATORS
 * ───────────────────────────────────────────────────────────────── */

const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

/**
 * Generate FAQs for a single property detail page.
 * @param {object} property — the full property object from the API
 */
export function generatePropertyFAQs(property) {
	if (!property) return [];

	const rent = fmt(property.monthly_rent_amount || property.price);
	const deposit = property.deposit
		? property.deposit
		: rent
		? `₹${fmt(Number((property.monthly_rent_amount || 0) * 2))} (approx. 2 months)`
		: 'As per agreement';
	const location = [property.location, property.city].filter(Boolean).join(', ');
	const furnishing = property.furnishing || 'as per listing';
	const beds = property.beds;
	const baths = property.baths;
	const area = property.area;
	const isManaged = property.is_managed;
	const preferred = property.preferred_tenant || 'Any';

	const faqs = [];

	faqs.push({
		question: `Is "${property.title}" currently available for rent?`,
		answer: `Yes, this property is currently listed as available on InstaMakaan. Contact us to schedule a free site visit or get more details directly from the owner.`,
	});

	if (rent) {
		faqs.push({
			question: `What is the monthly rent for this property?`,
			answer: `The monthly rent for this property is ₹${rent}. This may vary based on negotiation with the owner. Contact InstaMakaan for the latest pricing.`,
		});
	}

	faqs.push({
		question: `What is the security deposit for this property?`,
		answer: `The security deposit for this property is ${deposit}. The deposit is fully refundable at the time of vacating, subject to property condition.`,
	});

	if (beds) {
		faqs.push({
			question: `What BHK configuration is this property?`,
			answer: `This is a ${beds} BHK${baths ? `, ${baths} bathroom` : ''} property${area ? ` with an area of ${area}` : ''}. It is ${furnishing}.`,
		});
	}

	faqs.push({
		question: `Is this property furnished?`,
		answer: `This property is ${furnishing}. For a detailed list of what is included (furniture, appliances, fixtures), please check the amenities section above or contact us.`,
	});

	if (location) {
		faqs.push({
			question: `Where exactly is this property located?`,
			answer: `This property is located in ${location}. It is well-connected to major roads, schools, hospitals, and shopping centres in the area.`,
		});
	}

	faqs.push({
		question: `Is this an InstaMakaan managed property?`,
		answer: isManaged
			? `Yes, this is an InstaMakaan Managed Home. That means we handle tenant verification, maintenance coordination, and rent collection — giving the owner complete peace of mind.`
			: `This property is owner-managed. You will deal directly with the owner for maintenance and rent. InstaMakaan facilitates the introduction and agreement.`,
	});

	faqs.push({
		question: `Who can rent this property?`,
		answer: `This property is preferred for: ${preferred} tenants. For any specific requirements, please contact the owner via InstaMakaan before visiting.`,
	});

	faqs.push({
		question: `How do I book a site visit for this property?`,
		answer: `You can book a free site visit by clicking the "Book Visit" or "Contact" button on this page. Our team will coordinate a convenient time with the owner. No advance payment is required to visit.`,
	});

	return faqs;
}

/**
 * Generate FAQs for a locality/area landing page.
 * @param {string} locationName — display name like "Gaur City"
 * @param {Array}  properties   — array of property objects for this locality
 */
export function generateLocalityFAQs(locationName, properties = []) {
	if (!locationName) return [];

	const count = properties.length;
	const managed = properties.filter((p) => p.is_managed).length;
	const furnished = properties.filter((p) =>
		p.furnishing?.toLowerCase().includes('furnished'),
	).length;
	const bhks = [...new Set(properties.map((p) => p.beds).filter(Boolean))].sort();
	const rents = properties
		.map((p) => Number(p.monthly_rent_amount || p.price) || 0)
		.filter((n) => n > 0);
	const avgRent =
		rents.length > 0
			? Math.round(rents.reduce((a, b) => a + b, 0) / rents.length)
			: null;
	const minRent = rents.length > 0 ? Math.min(...rents) : null;

	const faqs = [];

	faqs.push({
		question: `How many flats are available for rent in ${locationName}?`,
		answer:
			count > 0
				? `Currently, ${count} verified rental propert${count === 1 ? 'y is' : 'ies are'} listed in ${locationName} on InstaMakaan. New properties are added regularly, so check back often.`
				: `We are actively adding verified rental properties in ${locationName}. You can register your interest and we will notify you when new listings are available.`,
	});

	if (avgRent) {
		faqs.push({
			question: `What is the average rent in ${locationName}?`,
			answer: `The average monthly rent for flats in ${locationName} listed on InstaMakaan is around ₹${fmt(avgRent)}${minRent ? `, starting from ₹${fmt(minRent)}` : ''}. Rents vary based on BHK type, furnishing, floor, and amenities.`,
		});
	}

	if (bhks.length > 0) {
		faqs.push({
			question: `What BHK options are available for rent in ${locationName}?`,
			answer: `In ${locationName}, InstaMakaan has ${bhks.join(' BHK, ')} BHK flats available for rent. You can filter by BHK type using the buttons above to find the right match for your needs.`,
		});
	}

	faqs.push({
		question: `Are managed homes available for rent in ${locationName}?`,
		answer:
			managed > 0
				? `Yes, ${managed} out of ${count} properties in ${locationName} are InstaMakaan Managed Homes — meaning maintenance, tenant verification, and move-in support are all handled professionally.`
				: `We are adding managed homes in ${locationName} soon. In the meantime, all listed properties are owner-verified and go through InstaMakaan's quality check.`,
	});

	if (furnished > 0) {
		faqs.push({
			question: `Are furnished flats available in ${locationName}?`,
			answer: `Yes, ${furnished} out of ${count} listed properties in ${locationName} are fully or semi-furnished. Furnished flats include furniture, appliances, and fixtures — ideal for professionals and students who prefer a ready-to-move home.`,
		});
	}

	faqs.push({
		question: `Is ${locationName} a good area to rent in Greater Noida?`,
		answer: `${locationName} is one of the well-developed residential localities in the Greater Noida and Noida region. It offers good connectivity to major IT hubs, schools, hospitals, and expressways. Many families and working professionals choose ${locationName} for its infrastructure and affordability.`,
	});

	faqs.push({
		question: `How do I find a verified flat for rent in ${locationName}?`,
		answer: `Browse verified listings on InstaMakaan for ${locationName} on this page. Every listing is owner-verified before publishing. You can filter by BHK type, contact the owner, and book a free site visit — all without any advance payment.`,
	});

	faqs.push({
		question: `What documents are required to rent a flat in ${locationName}?`,
		answer: `To rent a flat in ${locationName}, you will typically need: Aadhaar card or government ID, PAN card, last 3 months' salary slips or employment letter, and passport-size photos. Some owners may ask for a police verification form. InstaMakaan can guide you through the documentation process.`,
	});

	return faqs;
}
