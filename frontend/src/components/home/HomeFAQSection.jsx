import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/api';
import { Plus, Minus } from 'lucide-react';

const STATIC_FAQS = [
	{
		question: 'How do I find a rental flat in Greater Noida?',
		answer:
			'Browse our verified listings on InstaMakaan — filter by BHK, budget, or locality. All properties are verified before listing, so you can be confident every flat you see is genuine and available.',
	},
	{
		question: 'Are the properties on InstaMakaan verified?',
		answer:
			'Yes. Every property listed on InstaMakaan is verified by our team before going live. We check property details, photos, and ownership documents to ensure you are looking at real, available homes.',
	},
	{
		question: 'What documents do I need to rent a flat?',
		answer:
			'Typically you will need Aadhaar card, PAN card, and proof of employment or income such as a salary slip or offer letter. InstaMakaan handles the KYC process digitally, making it fast and paperless.',
	},
	{
		question: 'Does InstaMakaan charge any fees from tenants?',
		answer:
			'InstaMakaan charges a transparent service fee from tenants when a rental agreement is signed. The fee is clearly disclosed before you commit — no hidden charges or surprise deductions.',
	},
	{
		question: 'Which areas in Greater Noida does InstaMakaan cover?',
		answer:
			'We cover all major residential areas including Greater Noida West, Techzone 4, Sector 1, Amrapali Dream Valley, Gaur City, and more. We are continuously adding new localities to our platform.',
	},
];

const HomeFAQSection = () => {
	const navigate = useNavigate();
	const [faqs, setFaqs] = useState(STATIC_FAQS);
	const [openIndex, setOpenIndex] = useState(null);

	useEffect(() => {
		const fetch = async () => {
			try {
				const { data } = await api.get('/faqs');
				const cats = Array.isArray(data) ? data : [];
				const all = cats.flatMap((c) => c.faqs || []);
				if (all.length > 0) setFaqs(all.slice(0, 5));
			} catch (err) {
				// keep static fallback
			}
		};
		fetch();
	}, []);

	const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

	const faqJsonLd = faqs.length
		? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: faq.answer,
					},
				})),
			}
		: null;

	return (
		<section className="py-16 md:py-24 bg-white dark:bg-[#0b1220]">
			{faqJsonLd && (
				<Helmet>
					<script type="application/ld+json">
						{JSON.stringify(faqJsonLd)}
					</script>
				</Helmet>
			)}
			<div className="container-custom max-w-3xl">
				{/* HEADING */}
				<div className="text-center mb-12">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
						Frequently Asked Questions
					</h2>
				</div>

				{/* FAQ LIST */}
				<div className="space-y-3">
					{faqs.map((faq, i) => (
						<div
							key={i}
							onClick={() => toggle(i)}
							className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl px-6 py-5 cursor-pointer hover:border-teal-300 dark:hover:border-teal-700 transition-all"
						>
							<div className="flex items-center justify-between gap-4">
								<p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
									{faq.question}
								</p>
								<div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow">
									{openIndex === i ? (
										<Minus className="w-4 h-4" />
									) : (
										<Plus className="w-4 h-4" />
									)}
								</div>
							</div>

							{/* ANSWER */}
							<div
								className={`overflow-hidden transition-all duration-300 ${
									openIndex === i
										? 'max-h-[500px] opacity-100 mt-4'
										: 'max-h-0 opacity-0'
								}`}
							>
								<p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
									{faq.answer}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* LOAD MORE → FAQ PAGE */}
				<div className="flex justify-center mt-10">
					<button
						onClick={() => navigate('/faq')}
						className="flex items-center gap-2 border-2 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 font-semibold px-10 py-3.5 rounded-full hover:border-teal-500 hover:text-teal-600 transition-all text-sm"
					>
						Load More
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</section>
	);
};

export default HomeFAQSection;
