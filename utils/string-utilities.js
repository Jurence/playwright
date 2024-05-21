/**
 * The purpose of this file is to provide functions for handling strings.
 */

/**
 * The function to transform the rate/amount on a page like "€1,882.00" to "1882" format
 *
 * @param {string} rate - The initial format of rate on signing page
 * @returns {string} - The transformed value without unneeded symbols
 */
export function transformRate(rate) {
  const removeUnneededSymbols = rate.slice(1, -3).replace(',', '');

  return removeUnneededSymbols;
}

/**
 * Sanitize a string by removing all non-numeric characters.
 *
 * @param {string} inputString - The string to be sanitized.
 * @returns {string} The sanitized string.
 */

export function sanitizeString(inputString) {
  return inputString.replace(/[^0-9.]/g, '');
}
