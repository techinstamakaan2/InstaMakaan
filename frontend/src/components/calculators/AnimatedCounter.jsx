import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedCounter
 * Smoothly animates a number from 0 to its target value.
 * Lightweight alternative to framer-motion.
 */
export const AnimatedCounter = ({ value, formatter, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef(null);
  const reqRef = useRef(null);
  const startValueRef = useRef(0);
  const endValueRef = useRef(value);

  // Easing function: easeOutExpo
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  useEffect(() => {
    // If the value changes, start a new animation
    startValueRef.current = displayValue;
    endValueRef.current = value;
    startTimeRef.current = null;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const progress = time - startTimeRef.current;
      const percent = Math.min(progress / duration, 1);
      
      const easedPercent = easeOutExpo(percent);
      const currentVal = startValueRef.current + (endValueRef.current - startValueRef.current) * easedPercent;
      
      setDisplayValue(currentVal);

      if (percent < 1) {
        reqRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValueRef.current);
      }
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(reqRef.current);
  }, [value, duration]);

  return <span>{formatter ? formatter(displayValue) : Math.round(displayValue)}</span>;
};
