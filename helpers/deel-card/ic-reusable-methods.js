import icDeelCardConfirmDetails from '../../selectors/deel-card/card-confirm-details';
import icDeelCardEducationModal from '../../selectors/deel-card/card-educational-modal';
import icDeelCardLandingPage from '../../selectors/deel-card/card-landing-page';
import icDeelCardSelectCardType from '../../selectors/deel-card/card-select-card-type';
import icDeelCardDetaislAndPoaUpload from '../../selectors/deel-card/card-upload-poa';

/**
 * Click the "Get Deel Card" button to proceed to the Select a card flow
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function clearsOnboardingModal(page) {
  await page.getByText(icDeelCardEducationModal.getDeelCardBtn).click();
}

/**
 * Click the virtual deel card button to proceed to the next step
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function selectVirtualDeelCard(page) {
  await page.getByRole('button', icDeelCardSelectCardType.selectVirtualCardButton).click();
}

/**
 * Click the physical deel card button to proceed to the next step
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function selectPhysicalDeelCard(page) {
  await page.getByRole('button', icDeelCardSelectCardType.selectPhysicalCardButton).click();
}

/**
 * Randomly selects either bank statement or utility bill radio button.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when the radio button is selected.
 */
export async function selectProofOfAddressRadioButton(page) {
  const randomIndex = Math.floor(Math.random() * 2); // Randomly selects 0 or 1
  const radioButtons = [
    icDeelCardDetaislAndPoaUpload.bankStatementRadioButton,
    icDeelCardDetaislAndPoaUpload.utilityBillRadioButton,
  ];

  const selectedRadioButton = radioButtons[randomIndex];
  await page.getByLabel(selectedRadioButton).click();
}

/**
 * Performs the action to confirm details in the Deel Card creation process, by clicking the "Confirm Details" button.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when the action is performed.
 */
export async function confirmDeelCardDetails(page) {
  const confirmDetailsButton = page.getByRole('button', icDeelCardConfirmDetails.confirmDetailsBtn);
  await confirmDetailsButton.click();
}

/**
 * Performs the action to dismiss the success modal after card creation, by clicking the "OK" button.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when the action is performed.
 */
export async function dismissSuccessCardCreationModal(page) {
  const okCardCreationSuccessModalButton = page.getByRole(
    'button',
    icDeelCardLandingPage.cardCreationSuccessModal.successCardCreationModalBtn
  );
  await okCardCreationSuccessModalButton.click();
}

/**
 * Sets a date in a calendar or date selector.
 *
 * @param {import('@playwright/test').Page} page - The page object representing the web page.
 * @param {import icDeelCardSelectCardType from '../../../selectors/deel-card/card-select-card-type';
 * string} locimport icDeelCardDetaislAndPoaUpload from '../../../selectors/deel-card/card-upload-poa';
ator - The locator of the date input element.
 * @param {string} date - The date to set (in format MM/DD/YYYY).
 * @param {string} dateOfIssueInput - Clicks the date field to reveal the calendar.
 * @param {string} anyLocator - Clicks the any locator outside the date picker to close the calendar.
 * @param {string} waitForSelector - The selector to wait for after the date is selected.
 * @returns {Promise<void>} - A promise that resolves when the date is set.
 */
// TODO: Refactor this function to make it more robust and reusable
export async function setDateInCalendar(page, dateOfIssueInput, date, anyLocator, waitForSelector) {
  const inputElement = await page.waitForSelector(dateOfIssueInput);
  await inputElement.click();
  await inputElement.fill(date);
  const anyElement = await page.waitForSelector(anyLocator);
  await anyElement.click();
  await page.waitForSelector(waitForSelector);
}
