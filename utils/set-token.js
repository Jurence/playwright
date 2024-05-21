/**
 * Sets the token in the local storage of the specified page.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} token - The token to be set.
 * @returns {Promise<void>} - A promise that resolves when the token is set.
 */
export default async function setToken(page, token) {
  await page.addInitScript((tokenPage) => {
    localStorage.setItem('token', tokenPage);
  }, token);
}
