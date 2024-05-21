import sharedSelectors from '../../selectors/shared-selectors';
import weworkSelector from '../../selectors/wework/wework-page';

/**
 * Add Wework access from Contract Page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - Promise that resolves when the button is clicked
 */
export async function addWeworkAccessOnContractPage(page) {
  await page.getByTestId(weworkSelector.addWeworkAccessTestId).click();
}

/**
 * Add Wework access from Coworking Page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - Promise that resolves when the button is clicked
 */
export async function addWeworkAccessOnCoworkingPage(page) {
  await page.getByRole('button', weworkSelector.addWeworkAccessButton).click();
}

/**
 * Complete we work Modal
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - Promise that resolves when wework access is added
 */
export async function completeWeworkAccess(page) {
  await page.getByTestId(sharedSelectors.undefinedModalTitleTestId).waitFor();
  await page.getByTestId(weworkSelector.weworkPassDetailTestId).waitFor();
  await page.getByRole('button', weworkSelector.addWeworkAccessBtn).click();
  await page.getByTestId(weworkSelector.weworkAddedModalTestId).waitFor();
  await page.getByTestId(weworkSelector.weworkAddedModalOkBtnTestId).click();
}

/**
 * Remove Wework access
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - Promise that resolves when wework access is removed
 */
export async function removeWeworkAccess(page) {
  await page.getByLabel(weworkSelector.removeWeworkAccessLabel).click();
  await page.getByTestId(weworkSelector.removeWeworkAccessModalTestId).waitFor();
  await page.getByTestId(weworkSelector.removeWeworkAccessTestId).click();
}

/**
 * Open coworking page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - Promise that resolves when wework page is opened
 */
export async function openCoworkingPage(page) {
  await page.getByTestId(sharedSelectors.contractsBreadcrumbTestId).click();
  await page.getByTestId(weworkSelector.coworkingTestId).click();
  await page.getByRole('link', weworkSelector.coworkingSubscriptionsLink).waitFor();
}
