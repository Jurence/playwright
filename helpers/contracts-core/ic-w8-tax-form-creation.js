import icTaxFormSelectors from '../../selectors/ic-contracts-core/tax-forms';
import sharedSelectors from '../../selectors/shared-selectors';

/**
 * Select W-8BEN-E Tax form on "Form selection" step - Step 2 (Entities)
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function selectW8benETaxForm(page) {
  await page.getByLabel(icTaxFormSelectors.w8BenERadioButtonLabel).check();
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Select W-8BEN Tax form on "Form selection" step - Step 2 (Individuals)
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function selectW8benTaxForm(page) {
  await page.getByLabel(icTaxFormSelectors.w8BenRadioButtonLabel).check();
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Entity information" on Step 3 for W-8BEN-E Tax form
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.beneficialOwnerOrgName - Data for Tax payer's Organisation name (Beneficial Owner)
 * @param {string} taxFormDetails.businessName - Data for Tax payer's business entity name
 * @returns {Promise<void>}
 */
export async function fillEntityInformationForW8benE(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.beneficialOwnerOrgNameLabel).fill(taxFormDetails.beneficialOwnerOrgName);
  await page.getByLabel(icTaxFormSelectors.entityCountryLabel).click();
  await page.getByText(icTaxFormSelectors.entityAlbaniaText).click();
  await page.getByLabel(icTaxFormSelectors.disregardedEntityNameLabel).fill(taxFormDetails.businessName);
  await page.getByLabel(icTaxFormSelectors.entityTypeLabel).click();
  await page.getByText(icTaxFormSelectors.complexTrustOptionText).click();
  await page.getByLabel(icTaxFormSelectors.activeNffeLabel).check();
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Personal Information" on Step 3 for W-8BEN Tax form
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.firstName - Data for Tax payer's first name
 * @param {string} taxFormDetails.lastName - Data for Tax payer's last name
 * @param {string} taxFormDetails.inputDateOfbirth - Data for Tax payer's date of birth
 * @returns {Promise<void>}
 */
export async function fillPersonalInformationForW8ben(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.firstNameLabel).fill(taxFormDetails.firstName);
  await page.getByLabel(icTaxFormSelectors.lastNameLabel).fill(taxFormDetails.lastName);
  await page.getByPlaceholder(icTaxFormSelectors.dateOfBirthPlaceholder).fill(taxFormDetails.inputDateOfbirth);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Address" on Step 4 for W8 Tax forms (W-8BEN and W-8BEN-E)
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.addressLineOne - Data for Tax payer's Address Line 1
 * @param {string} taxFormDetails.city - Data for Tax payer's city (as a part of address)
 * @param {string} taxFormDetails.randomZipCode - Data for Tax payer's random zip code (as a part of address)
 * @returns {Promise<void>}
 */
export async function fillAddressForW8Forms(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.addressLineOneLabel).fill(taxFormDetails.addressLineOne);
  await page.getByLabel(icTaxFormSelectors.cityLabel).fill(taxFormDetails.city);
  await page.getByLabel(icTaxFormSelectors.countryLabel).click();
  await page.locator(icTaxFormSelectors.countryAlbaniaOption).click();
  await page.getByLabel(icTaxFormSelectors.zipCodeLabel).fill(`${taxFormDetails.randomZipCode}`);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Tax details" on Step 5 for W-8BEN-E Tax form
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function fillTaxDetailsForW8benE(page) {
  await page.getByLabel(icTaxFormSelectors.nativeCountryTinLabel).check();
  await page.getByLabel(icTaxFormSelectors.ftinNotRequiredLabel).check();
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Tax details" on Step 5 for W-8BEN Tax form
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Data for filling all required fields
 * @param {string} taxFormDetails.tin - Data for Tax payer's TIN (Tax Identification Number)
 * @returns {Promise<void>}
 */
export async function fillTaxDetailsForW8ben(page, taxFormDetails) {
  await page.getByLabel(icTaxFormSelectors.tinRadioButtonLabel).check();
  await page
    .getByTestId(icTaxFormSelectors.tinNumberFieldTestId)
    .getByLabel(icTaxFormSelectors.usTinLabel)
    .fill(`${taxFormDetails.tin}`);
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Fill "Tax treaty" on Step 6 for W-8BEN Tax form
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */

export async function fillTaxTreatyForW8ben(page) {
  await page.getByLabel(icTaxFormSelectors.proceedToNextStepLabel).check();
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Sign W8 Tax form (W-8BEN or W-8BEN-E)
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */

export async function signW8TaxForm(page) {
  await page.getByLabel(icTaxFormSelectors.mainCerticationCheckboxLabel).check();
  await page.locator(icTaxFormSelectors.continueBtn).click();
  await page.getByLabel(icTaxFormSelectors.signingCerticationCheckboxLabel).check();
  await page.getByRole('button', icTaxFormSelectors.confirmSignatureButton).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}
