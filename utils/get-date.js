import moment from 'moment';

/**
 * Return today's date in a given format.
 *
 * @param {string} format - The format in which the date should be returned.
 * @returns {string} - The formatted date.
 */
export default function getTodayDate(format) {
  /**
   * Some possible format examples are:
   * 'MMMM Do YYYY, h:mm:ss a' - November 28th 2023, 3:21:20 pm
   * 'dddd' - Tuesday
   * 'MMM Do YY' - Nov 28th 23
   * for more information on formats, see https://momentjs.com/docs/#/displaying/format/
   */
  return moment().format(format);
}

/**
 * Return the first day of the current month in UTC and in a given format with a specified separator. e.g:
 * getFirstDayOfCurrentMonthAsString() = This returns the first day of the current month in the default format 'YYYY-MM-DD', such as '2024-01-01'.
 * getFirstDayOfCurrentMonthAsString('DD-MM-YYYY') = This will return the first day of the current month in the format 'DD-MM-YYYY', such as '01-01-2024'.
 * getFirstDayOfCurrentMonthAsString('DD-MM-YYYY', '/') = This will return the first day of the current month in the format 'DD/MM/YYYY', such as '01/01/2024'.
 * getFirstDayOfCurrentMonthAsString('YYYY-MM-DD', '/') = This will return the first day of the current month in the format 'YYYY/MM/DD', such as '2024/01/01'.
 * getFirstDayOfMonthAsString('YYYY-MM-DD', '/', 1) = This will return the first day of next month in the format 'YYYY/MM/DD', such as '2024/02/01'.
 * getFirstDayOfMonthAsString('DD-MM-YYYY', '-', -1) = This will return the first day of the previous month in the format 'DD/MM/YYYY', such as '2023-12-01'.
 *
 * @param {string} format - The format in which the date should be returned.
 * @param {string} [separator='-'] - The separator to use in the date string. Default is '-'.
 * @param {number} [monthsAhead=0] - The number of months ahead (or behind if negative) for which to get the first day. Default is 0 for the current month.
 * @returns {string} - The formatted first day of the month in UTC.
 */
export function getFirstDayOfAMonthAsString(format = 'YYYY-MM-DD', separator = '-', monthsAhead = 0) {
  return moment.utc().add(monthsAhead, 'months').startOf('month').format(format).replace(/-/g, separator);
}

/**
 * Return the last day of the current month in UTC and in a given format with a specified separator.
 * getLastDayOfCurrentMonthAsString() = This returns the last day of the current month in the default format 'YYYY-MM-DD', such as '2024-01-31'.
 * getLastDayOfCurrentMonthAsString('DD-MM-YYYY') = This will return the last day of the current month in the format 'DD-MM-YYYY', such as '31-01-2024'.
 * getLastDayOfCurrentMonthAsString('DD-MM-YYYY', '/') = This will return the last day of the current month in the format 'DD/MM/YYYY', such as '31/01/2024'.
 * getLastDayOfCurrentMonthAsString('YYYY-MM-DD', '/') = This will return the last day of the current month in the format 'YYYY/MM/DD', such as '2024/01/31'.
 * getFirstDayOfMonthAsString('YYYY-MM-DD', '/', 1) = This will return the first day of next month in the format 'YYYY/MM/DD', such as '2024/02/01'.
 * getFirstDayOfMonthAsString('DD-MM-YYYY', '-', -1) = This will return the last day of the previous month in the format 'DD/MM/YYYY', such as '01-12-2023'.
 *
 * @param {string} format - The format in which the date should be returned.
 * @param {string} [separator='-'] - The separator to use in the date string. Default is '-'.
 * @param {number} [monthsAhead=0] - The number of months ahead (or behind if negative) for which to get the first day. Default is 0 for the current month.
 * @returns {string} - The formatted last day of the month in UTC.
 */
export function getLastDayOfAMonthAsString(format = 'YYYY-MM-DD', separator = '-', monthsAhead = 0) {
  return moment.utc().add(monthsAhead, 'months').endOf('month').format(format).replace(/-/g, separator);
}

/**
 * Calculate a future weekday date by adding a specified number of days to the current date.
 * If the calculated date falls on a weekend, it is adjusted to the next Monday.
 * The resulting date is returned in 'DD/MM/YYYY' format.
 *
 * @param {number} daysToAddToCurrentDate - The number of days to add to the current date.
 * @returns {string} The future weekday date in 'DD/MM/YYYY' format.
 */
export function getFutureWeekdayDate(daysToAddToCurrentDate) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysToAddToCurrentDate);

  // Check if the new date falls on a weekend
  const dayOfWeek = futureDate.getDay();

  if (dayOfWeek === 6) {
    // If it's Saturday, add 2 days to make it Monday
    futureDate.setDate(futureDate.getDate() + 2);
  } else if (dayOfWeek === 0) {
    // If it's Sunday, add 1 day to make it Monday
    futureDate.setDate(futureDate.getDate() + 1);
  }

  // Format the date in DD/MM/YYYY format
  const yearFuture = futureDate.getFullYear();
  let monthFuture = futureDate.getMonth() + 1; // getMonth() is 0-indexed
  monthFuture = monthFuture.toString().padStart(2, '0');
  const dateFuture = futureDate.getDate().toString().padStart(2, '0');

  return `${dateFuture}/${monthFuture}/${yearFuture}`;
}

/**
 * Return the current Unix timestamp in seconds as a string (number of seconds since January 1, 1970).
 *
 * @returns {string} The current Unix timestamp.
 */
export function getCurrentUnixTimestampAsString() {
  return Math.floor(Date.now() / 1000).toString(); // Divide by 1000 to convert from milliseconds to seconds
}

export function getNextMonthFirstAndLastDay() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1; // Add 1 to get next month

  // Handle December as a special case (month becomes 0 for January in the next year)
  if (month === 12) {
    month = 0;
    year += 1;
  }

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // 0 represents the last day of the previous month

  return {
    firstDay: firstDay.toISOString().split('T')[0], // Get YYYY-MM-DD format
    lastDay: lastDay.toISOString().split('T')[0],
  };
}
