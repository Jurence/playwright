import { blockPopups } from './remove-popups';
import setToken from './set-token';

/**
 * Configures a web page by setting a token and blocking popups.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object to be configured.
 * @param {string} token - The token to be set on the page.
 */
export default async function configPage(page, token) {
  await setToken(page, token);
  await blockPopups(page);
}
