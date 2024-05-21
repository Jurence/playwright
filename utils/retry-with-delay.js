/**
 * Retry a function with a delay and maximum number of retries.
 *
 * @param {function} fn - The function to be retried.
 * @param {number} delay - The delay in milliseconds between retries.
 * @param {number} maxRetries - The maximum number of retries.
 * @returns {Promise} A promise that resolves when the function succeeds or rejects when the maximum number of retries is reached.
 */
export default async function retryWithDelay(fn, delay, maxRetries) {
  try {
    return await fn();
  } catch (error) {
    if (maxRetries <= 0) {
      throw error;
    }
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, delay));

    return retryWithDelay(fn, delay, maxRetries - 1);
  }
}
