import setupAuthenticatorSelectors from '../../selectors/login/setup-authenticator';

const { suggestionModal } = setupAuthenticatorSelectors;

/**
 * Click on "Continue without setup" button in Setup Authenticator page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function continueWithoutSetup(page) {
  await page.getByRole('button', setupAuthenticatorSelectors.continueWithoutSetupButton).click();
}

/**
 * Click on "Continue without setup" button in Suggestion modal
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function skipSuggestionModal(page) {
  await page.locator(suggestionModal.rootElement).getByRole('button', suggestionModal.continueWithoutSetupButton).click();
}
