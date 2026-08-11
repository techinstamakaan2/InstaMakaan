/**
 * Formats a number to Indian currency format (e.g., ₹1,00,000)
 * and supports large denominations (Lakhs, Crores) for compact display if needed.
 * 
 * @param {number} value - The number to format.
 * @param {boolean} compact - Whether to format as "1.5 Cr" / "50 L" or standard string.
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (value, compact = false) => {
  if (value === undefined || value === null || isNaN(value)) return '₹ 0';
  
  if (compact) {
    if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹ ${(value / 100000).toFixed(2)} L`;
  }
  
  return `₹ ${Math.round(value).toLocaleString('en-IN')}`;
};

/**
 * Parses a formatted currency string back to a number.
 * Removes non-numeric characters (except decimals).
 */
export const parseCurrency = (valueString) => {
  if (!valueString) return 0;
  // Remove anything that isn't a digit or a decimal point
  const cleanStr = valueString.toString().replace(/[^0-9.]/g, '');
  return parseFloat(cleanStr) || 0;
};

/**
 * Formats a number as a percentage.
 */
export const formatPercentage = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(2)}%`;
};
