import equitySelector from '../../selectors/equities/equity-selectors';
import sharedSelectors from '../../selectors/shared-selectors';
import {
  confirmEquityAddition,
  continueToNextStep,
  fillAdditionalInformationDetails,
  fillEquityFinalStepDetails,
  fillGrantInformationDetails,
} from './equities-ui';

/**
 * Initiate the equity addition flow and completes the entire process
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Object} grantInformationDetails - Data for filling grant information fields
 * @param {Object} additionalInformationDetails - Data for filling additional information fields
 * @param {Object} finalInformationDetails - Data for filling final step fields
 * @returns {Promise<void>} - Promise that resolves when equity is added
 */
export async function addEquity(page, grantInformationDetails, additionalInformationDetails, finalInformationDetails) {
  await page.getByTestId(equitySelector.addEquityBtnTestId).click();
  await page.getByTestId(equitySelector.equityEducationalModal.rootTestId).waitFor();
  await page.getByText(equitySelector.equityEducationalModal.nextBtnText).click();
  await page.getByText(equitySelector.addEquityOfferText).click();

  await fillGrantInformationDetails(page, grantInformationDetails);
  await continueToNextStep(page);

  // Fill Equity Additional Information
  await fillAdditionalInformationDetails(page, additionalInformationDetails);
  await continueToNextStep(page);

  // Fill Equity Final Information
  await fillEquityFinalStepDetails(page, finalInformationDetails);
  await continueToNextStep(page);

  // Click to continue with the next step
  await continueToNextStep(page);
  await confirmEquityAddition(page);
}

/**
 * Initiates the equity deletion flow
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - Promise that resolves when equity is deleted
 */
export async function deleteEquity(page) {
  await page.locator(equitySelector.removeEquityIcon).click();
  await page.getByTestId(sharedSelectors.dialogTestId).waitFor();
  await page.locator(equitySelector.deleteEquityModal.deleteEquityBtn).click();
}
