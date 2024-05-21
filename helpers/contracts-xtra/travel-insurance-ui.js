import sharedSelectors from '../../selectors/shared-selectors';
import travelInsuranceSelector from '../../selectors/travel-insurance/travel-insurance-page';

const { addTravelInsurancePopup } = travelInsuranceSelector;

/**
 * Adds travel insurance to an EOR contract during the contract creation step.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function addTravelInsurance(page) {
  await page.getByTestId(travelInsuranceSelector.addTravelInsuranceBtnTestId).click();
  await page.getByTestId(sharedSelectors.undefinedModalTitleTestId).waitFor();
  await page.getByText(travelInsuranceSelector.nextBtnText).click();
  await page.getByTestId(sharedSelectors.undefinedModalTitleTestId).waitFor();
  await page.getByText(travelInsuranceSelector.nextBtnText).click();
  await page.getByTestId(travelInsuranceSelector.addTravelInsuranceModalTestId).waitFor();
  await page.locator(addTravelInsurancePopup.addYearlyInsurance).click();
  await page.locator(addTravelInsurancePopup.acceptTermsCheckbox).click();
  await page.getByText(addTravelInsurancePopup.addInsuranceBtnText).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}

/**
 * Removes travel insurance from an EOR contract during the contract creation flow.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function removeTravelInsurance(page) {
  await page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId).click();
  await page.getByTestId(travelInsuranceSelector.removeTravelInsuranceModalTestId).waitFor();
  await page.getByTestId(travelInsuranceSelector.confirmTravelInsuranceRemovalTestId).click();
}
