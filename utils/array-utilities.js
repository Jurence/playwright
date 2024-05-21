/**
 * The purpose of this file is to provide functions for handling arrays.
 */

/**
 * Checks if an array of strings is ordered alphabetically.
 *
 * Creates a copy of the provided array and sorts it alphabetically. Then, it compares each element
 * of the original array with the corresponding one in the sorted array. The function returns `true`
 * if all elements match in the same order, indicating that the original array is alphabetically ordered.
 * Otherwise, it returns `false`.
 *
 * @param {Array<string>} array - The array of strings to be checked.
 * @returns {boolean} `true` if the array is alphabetically ordered, otherwise `false`.
 */
export default function isOrderedAlphabetically(array) {
  const sortedArray = [...array].sort((a, b) => a.localeCompare(b));

  return array.every((value, index) => value === sortedArray[index]);
}
