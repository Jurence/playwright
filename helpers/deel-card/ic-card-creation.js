import { expect } from '@playwright/test';
import { deelCard } from '../../data/texts';
import icDeelCardLandingPage from '../../selectors/deel-card/card-landing-page';
import icDeelCardShippingAddress from '../../selectors/deel-card/card-shipping-address';
import icDeelCardTos from '../../selectors/deel-card/card-tos';
import icDeelCardDetaislAndPoaUpload from '../../selectors/deel-card/card-upload-poa';
import uploadFile from '../shared-functions/upload-file';

const { deelCardLandingPageTexts } = deelCard;

/**
 * Uploads the proof of address document.
 *
 * @param {import('@playwright/test').Page} page - The page object representing the web page.
 * @param {string} fileUploadFieldLocator - The locator for the file upload field.
 * @param {string} filePath - The path to the file to upload.
 * @returns {Promise<void>} - A promise that resolves when the file is uploaded.
 */
// TODO It seems this function just calls another function, I recommend to use this directly:await uploadFile(page, fileUploadFieldLocator, filePath);
export async function uploadPoaDoc(page, fileUploadFieldLocator, filePath) {
  await uploadFile(page, fileUploadFieldLocator, filePath);
}

/**
 * Fills in the reference number input field.
 *
 * @param {import('@playwright/test').Page} page - The page object representing the web page.
 * @param {string} referenceNumber - The reference number to fill in.
 * @returns {Promise<void>} - A promise that resolves when the reference number is filled in.
 */
export async function fillReferenceNumber(page, referenceNumber) {
  const referenceNumberInput = page.locator(icDeelCardDetaislAndPoaUpload.referenceNumberInput);
  await referenceNumberInput.fill(referenceNumber);
}

/**
 * Clicks the checkbox for agreeing to the Terms and Conditions.
 *
 * @param {import('@playwright/test').Page} page - The page object representing the web page.
 * @returns {Promise<void>} - A promise that resolves when the checkbox is clicked.
 */
export async function agreeTermsOfService(page) {
  await page.waitForSelector(icDeelCardTos.tosIframe);
  await page.getByText(icDeelCardTos.tosCheckboxAndText).click();
}

/**
 * Helper function to assert elements on the Deel Card creation page for virtual card.
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {import icDeelCardTos from '../../../selectors/deel-card/card-tos';
object} selectors - Selectors for page elements.
 * @param {object} texts - Texts to be matched for assertion.
 */
export async function assertVirtualDeelCardCreation(page) {
  await expect(page.getByRole('link', icDeelCardLandingPage.deelCardLandingPage.dashboardLink)).toHaveText(
    deelCardLandingPageTexts.dashboardLink
  );
  await expect(page.getByRole('link', icDeelCardLandingPage.deelCardLandingPage.settingsLink)).toHaveText(
    deelCardLandingPageTexts.settingsLink
  );
  await expect(page.getByRole('button', icDeelCardLandingPage.deelCardLandingPage.addFundsBtn)).toBeVisible();
  await expect(page.getByRole('button', icDeelCardLandingPage.deelCardLandingPage.withdrawBtn)).toBeVisible();
  await expect(page.getByText(icDeelCardLandingPage.deelCardLandingPage.verifyMessagegetByText)).toHaveText(
    deelCardLandingPageTexts.alertMessageText
  );
  await expect(page.getByRole('link', icDeelCardLandingPage.deelCardLandingPage.learnMoreLink)).toHaveAttribute(
    'href',
    deelCardLandingPageTexts.learnMoreLink
  );
  await expect(page.getByRole('button', icDeelCardLandingPage.deelCardLandingPage.viewRestrictionsBtn)).toBeVisible();
  await expect(page.getByRole('heading', icDeelCardLandingPage.deelCardLandingPage.allCardsHeading)).toHaveText(
    deelCardLandingPageTexts.allCardsHeading
  );
  await expect(page.getByRole('heading', icDeelCardLandingPage.deelCardLandingPage.noTransactionsText)).toBeVisible();
}

/**
 * Helper function to assert elements on the Deel Card creation page for physical card.
 * 
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {import icDeelCardTos from '../../../selectors/deel-card/card-tos';
object} selectors - Selectors for page elements.
 * @param {object} texts - Texts to be matched for assertion.
 */
export async function assertPhysicalDeelCardCreation(page) {
  const { deelCardLandingPage } = icDeelCardLandingPage;

  await expect(page.getByRole('link', deelCardLandingPage.dashboardLink)).toHaveText(deelCardLandingPageTexts.dashboardLink);
  await expect(page.getByRole('link', deelCardLandingPage.settingsLink)).toHaveText(deelCardLandingPageTexts.settingsLink);
  await expect(page.getByRole('button', deelCardLandingPage.addFundsBtn)).toBeVisible();
  await expect(page.getByRole('button', deelCardLandingPage.withdrawBtn)).toBeVisible();
  await expect(page.getByText(deelCardLandingPageTexts.alertMessageText)).toBeVisible();
  await expect(page.getByRole('link', deelCardLandingPage.learnMoreLink)).toHaveAttribute(
    'href',
    deelCardLandingPageTexts.learnMoreLink
  );
  await expect(page.getByRole('button', deelCardLandingPage.viewRestrictionsBtn)).toBeVisible();
  await expect(page.getByRole('heading', deelCardLandingPage.noTransactionsText)).toBeVisible();
  await expect(page.getByRole('button', deelCardLandingPage.activateButton)).toBeVisible();
  await expect(page.getByText(deelCardLandingPageTexts.confirmedHeadingBodyText)).toBeVisible();
}

/**
 * Click the checkbox to agree to use the billing address.
 *
 * @param {import('@playwright/test').Page} page - The page object representing the web page.
 * @returns {Promise<void>} - A promise that resolves when the checkbox is clicked.
 */
export async function agreeUsingBillingAddress(page) {
  await page.getByText(icDeelCardShippingAddress.billingAddressCheckBox).click();
}

/**
 * Fill in the phone number input field in shipping address.
 *
 * @param {import('@playwright/test').Page} page - The page object representing the web page.
 * @param {string} phoneNumber - The phone number to fill in.
 * @returns {Promise<void>} - A promise that resolves when the reference number is filled in.
 */
export async function fillPhoneNumber(page, phoneNumber) {
  const phoneNumberInput = page.getByLabel(icDeelCardShippingAddress.phoneNumberLabel);
  await phoneNumberInput.fill(phoneNumber);
}
