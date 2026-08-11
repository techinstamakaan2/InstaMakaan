/**
 * Validation utilities for calculator inputs.
 */

/**
 * Validates and constraints a numeric input based on min/max bounds.
 * @param {number} value The input value
 * @param {number} min Minimum allowed value
 * @param {number} max Maximum allowed value
 * @returns {number} The constrained value
 */
export const clampValue = (value, min, max) => {
  if (isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

/**
 * Safely parses an input string to a number, applying constraints.
 */
export const validateInput = (rawString, min, max) => {
  if (!rawString && rawString !== 0) return min; // Handle empty
  
  // Remove commas for parsing
  const cleanStr = rawString.toString().replace(/,/g, '');
  const parsed = parseFloat(cleanStr);
  
  if (isNaN(parsed)) return min;
  return clampValue(parsed, min, max);
};
