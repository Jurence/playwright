import sharedSelectors from '../../selectors/shared-selectors';

/**
 * Click the "Done" button and sends the form.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves once the button is clicked and the form is sent.
 */
export async function sendForm(page) {
  await page.getByRole('button', sharedSelectors.doneButton).first().click();
}

/**
 * Click the "Continue" button and navigates to the next page.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when the button is clicked.
 */
export async function continueToNextStep(page) {
  await page.getByRole('button', sharedSelectors.continueButton).first().click();
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Clicks the "Next" button and navigates to the next page.
 *
 * @param {import('@playwright/test').Page} page - The page object representing the web page.
 * @returns {Promise<void>}
 */
export async function nextStep(page) {
  await page.getByRole('button', sharedSelectors.nextButton).first().click();
  await page.waitForLoadState('domcontentloaded');
}
