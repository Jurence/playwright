import icContractAmendmentSelectors from '../../selectors/ic-contracts-core/amendment-contract';

/**
 * Sign amendment
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function signAmendment(page) {
  await page.getByTestId(icContractAmendmentSelectors.signAmendmentBtnTestId).first().click();
  await page.getByTestId(icContractAmendmentSelectors.confirmSignBtnTestId).click();
  await page.getByRole('button', icContractAmendmentSelectors.okBtn).click();
}

/**
 * Click "Review Adn Sign" amendment from contract view
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function reviewAndSignAmendment(page) {
  await page.getByRole('button', icContractAmendmentSelectors.reviewAndSignAmendmentBtn).click();
}

/**
 * Click exit button
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function exitFromAmendment(page) {
  await page.locator(icContractAmendmentSelectors.exitButton).first().click();
  await page.getByRole('button', icContractAmendmentSelectors.okBtn).click();
}
