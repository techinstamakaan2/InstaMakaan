import { useState, useEffect, useRef } from 'react';

/**
 * Fires once when the element enters the viewport.
 * Uses native IntersectionObserver — zero deps, GPU-safe.
 */
export const useInView = (options = {}) => {
	const ref = useRef(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Respect user's reduced-motion preference — mark as visible immediately
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setInView(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.unobserve(el);
				}
			},
			{ threshold: options.threshold ?? 0.08, rootMargin: options.rootMargin ?? '0px 0px -40px 0px' }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return [ref, inView];
};
