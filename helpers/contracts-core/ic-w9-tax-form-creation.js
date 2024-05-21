import icTaxFormSelectors from '../../selectors/ic-contracts-core/tax-forms';
import sharedSelectors from '../../selectors/shared-selectors';

/**
 * Fill "Personal information" on Step 2 for W9 Tax form (Individuals)
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.firstName - Data for Tax payer's first name
 * @param {string} taxFormDetails.lastName - Data for Tax payer's last name
 * @returns {Promise<void>}
 */
export async function fillPersonalInformationForW9Individuals(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.firstNameLabel).fill(taxFormDetails.firstName);
  await page.getByLabel(icTaxFormSelectors.lastNameLabel).fill(taxFormDetails.lastName);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Personal information" on Step 2 for W9 Tax form (Entities)
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.firstName - Data for Tax payer's first name
 * @param {string} taxFormDetails.lastName - Data for Tax payer's last name
 * @param {string} taxFormDetails.businessName - Data for Tax payer's business entity name
 * @returns {Promise<void>}
 */
export async function fillPersonalInformationForW9Entities(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.firstNameLabel).fill(taxFormDetails.firstName);
  await page.getByLabel(icTaxFormSelectors.lastNameLabel).fill(taxFormDetails.lastName);
  await page.getByLabel(icTaxFormSelectors.businessNameLabel).fill(taxFormDetails.businessName);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Address" on Step 3 for W9 Tax forms (Individuals and Entities)
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.addressLineOne - Data for Tax payer's Address Line 1
 * @param {string} taxFormDetails.city - Data for Tax payer's city (as a part of address)
 * @param {string} taxFormDetails.zipCodeAlaska - Data for Tax payer's Alaska zip code (as a part of address)
 * @returns {Promise<void>}
 */
export async function fillAddressForW9Forms(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.addressLineOneLabel).fill(taxFormDetails.addressLineOne);
  await page.getByLabel(icTaxFormSelectors.cityLabel).fill(taxFormDetails.city);
  await page.getByLabel(icTaxFormSelectors.countryLabel).click();
  await page.locator(icTaxFormSelectors.countryUsOption).click();
  await page.getByLabel(icTaxFormSelectors.provinceBtnLabel).click();
  await page.locator(icTaxFormSelectors.provinceAlaskaOption).click();
  await page.getByLabel(icTaxFormSelectors.zipCodeLabel).fill(taxFormDetails.zipCodeAlaska);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Tax details" on Step 4 for W9 Tax form (Individuals)
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.tin - Data for Tax payer's TIN (Tax Identification Number)
 * @returns {Promise<void>}
 */
export async function fillTaxDetailsForW9Individuals(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.usTinLabel).fill(`${taxFormDetails.tin}`);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Tax details" on Step 4 for W9 Tax form (Entities)
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.tin - Data for Tax payer's TIN (Tax Identification Number)
 * @returns {Promise<void>}
 */
export async function fillTaxDetailsForW9Entities(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.fedTaxClassificationLabel).click();
  await page.locator(icTaxFormSelectors.singleMemberLlcOption).click();
  await page.getByLabel(icTaxFormSelectors.ssnLabel).check();
  await page.getByLabel(icTaxFormSelectors.usTinLabel).fill(`${taxFormDetails.tin}`);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "1099 Delivery preferences" on Step 5 for W9 Tax form (Individuals)
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function fill1099DeliveryPreferencesForW9Individuals(page) {
  await page.getByLabel(icTaxFormSelectors.mailDeliveryLabel).check();
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "1099 Delivery preferences" on Step 5 for W9 Tax form (Entities)
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.email - Data for Tax payer's email
 * @returns {Promise<void>}
 */
export async function fill1099DeliveryPreferencesForW9Entities(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.emailDeliveryLabel).check();
  await page.getByPlaceholder(icTaxFormSelectors.inputEmailPlaceholder).fill(taxFormDetails.email);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Sign W9 Tax form (Individuals or Entities)
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */

export async function signW9TaxForm(page) {
  await page.locator(icTaxFormSelectors.continueBtn).click();
  await page.getByRole('button', icTaxFormSelectors.confirmSignatureButton).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}
