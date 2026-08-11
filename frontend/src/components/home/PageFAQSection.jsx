import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus } from 'lucide-react';

const PageFAQSection = ({ faqs = [], title = 'Frequently Asked Questions' }) => {
	const [openIndex, setOpenIndex] = useState(null);
	const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

	const faqJsonLd = faqs.length
		? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: { '@type': 'Answer', text: faq.answer },
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
				<div className="text-center mb-12">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
						{title}
					</h2>
				</div>
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
			</div>
		</section>
	);
};

export default PageFAQSection;
