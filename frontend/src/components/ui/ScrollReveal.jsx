import React from 'react';
import { useInView } from '@/hooks/useInView';

/**
 * Wraps any element with a scroll-triggered entrance animation.
 *
 * Props:
 *   direction  — 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'  (default: 'up')
 *   delay      — ms stagger delay (default: 0)
 *   duration   — transition duration ms (default: 600)
 *   distance   — px to travel (default: 36)
 *   threshold  — IntersectionObserver threshold (default: 0.08)
 *   className  — extra classes on the wrapper div
 *   as         — element tag (default: 'div')
 */
const ScrollReveal = ({
	children,
	direction = 'up',
	delay = 0,
	duration = 600,
	distance = 36,
	threshold,
	className = '',
	as: Tag = 'div',
	style: extraStyle = {},
}) => {
	const [ref, inView] = useInView({ threshold });

	const transforms = {
		up:    `translateY(${inView ? 0 : distance}px)`,
		down:  `translateY(${inView ? 0 : -distance}px)`,
		left:  `translateX(${inView ? 0 : -distance}px)`,
		right: `translateX(${inView ? 0 : distance}px)`,
		scale: `scale(${inView ? 1 : 0.9})`,
		none:  'none',
	};

	return (
		<Tag
			ref={ref}
			className={className}
			style={{
				opacity: inView ? 1 : 0,
				transform: transforms[direction] ?? transforms.up,
				transition: `opacity ${duration}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
				willChange: inView ? 'auto' : 'opacity, transform',
				...extraStyle,
			}}
		>
			{children}
		</Tag>
	);
};

export default ScrollReveal;
