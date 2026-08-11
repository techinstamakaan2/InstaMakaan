import { useEffect } from 'react';

/**
 * Mount once at app root.
 * Observes every [data-reveal] element and adds .revealed when it enters the viewport.
 * Uses a single shared IntersectionObserver — zero performance cost.
 */
const ScrollRevealObserver = () => {
	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('revealed');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
		);

		const observe = () => {
			document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => {
				observer.observe(el);
			});
		};

		observe();

		// Re-scan after lazy-loaded sections mount
		const mutation = new MutationObserver(observe);
		mutation.observe(document.body, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
			mutation.disconnect();
		};
	}, []);

	return null;
};

export default ScrollRevealObserver;
