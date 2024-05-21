import sharedSelectors from '../../selectors/shared-selectors';
import { THREE_MINUTES_TIMEOUT, TWO_MINUTES_TIMEOUT } from '../../setup/constants';

/**
 * Check if the loading screen is hidden. Wait for the loading screen to appear and disappear
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function loadingScreenIsHidden(page) {
  await page.getByTestId(sharedSelectors.loadingScreenTestId).first().waitFor({ timeout: THREE_MINUTES_TIMEOUT });
  await page
    .getByTestId(sharedSelectors.loadingScreenTestId)
    .first()
    .waitFor({ state: 'hidden' }, { timeout: THREE_MINUTES_TIMEOUT });
}

/**
 * Skip the setup of an authenticator after login into Deel App.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object to skip the authenticator setup on.
 * @returns {Promise<void>}
 */
export const skipSettingUpAuthenticator = async (page) => {
  await page
    .getByRole('button', { name: 'Continue without setup', timeout: TWO_MINUTES_TIMEOUT })
    .click({ timeout: TWO_MINUTES_TIMEOUT });
  await page.getByRole('button', { name: 'Set Up Authenticator' }).waitFor();
  await page.getByRole('button', { name: 'Continue without setup' }).click();
};

/**
 * Retrieve a new page after performing a click action on the current page.
 *
 * @param {import('playwright').Page} currentPage - The current page object.
 * @param {string} clickSelector - The selector of the element to click on.
 * @returns {Promise<import('playwright').Page>} The new page object.
 */
export async function getNewPageFromClick(currentPage, clickSelector) {
  const context = await currentPage.context();
  const pagePromise = context.waitForEvent('page');
  await currentPage.locator(clickSelector).click();
  const newPage = await pagePromise;
  await newPage.waitForLoadState();

  return newPage;
}

/**
 * Close Onboarding Widget
 *
 * @param {Object} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function closeOnboardingWidget(page) {
  // TODO: We will improve this by creating a new function to skip the onboarding widget
  await page.getByRole('button', sharedSelectors.viewOnboardingChecklistButton).click();
  await page.locator(sharedSelectors.closeOnboardingWidget).click();
}
