import { expect } from '@playwright/test';
import icTaxFormSelectors from '../../selectors/ic-contracts-core/tax-forms';

/**
 * Open "Tax form flow" for all types and confirm personal details on Step 1
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function openTaxFormFlowAndConfirmPersonalDetails(page) {
  await page.getByRole('button', icTaxFormSelectors.createTaxFormButton).click();
  await page.getByRole('button', icTaxFormSelectors.confirmDetailsButton).click();
  await page.locator(icTaxFormSelectors.continueBtn).click();
}

/**
 * Open Tax form details page for Contractors
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function openTaxFormDetailsPage(page) {
  await page.getByRole('button', icTaxFormSelectors.workSpaceButton).click();
  await page.getByRole('link', icTaxFormSelectors.taxFormTabLink).click();
  await page.getByTestId(icTaxFormSelectors.viewTaxFromDetailsTestId).click();
}

/**
 * Assert W9 Tax form details for Individuals
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Expected data for W9 Tax form
 * @param {Object} selectors - Selectors related to IC Tax forms
 * @returns {Promise<void>}
 */
export async function assertW9TaxDetailsPageIndividuals(page, taxFormdata, selectors) {
  await expect(page.getByRole('heading', selectors.individualTaxPayerHeading)).toHaveText(taxFormdata.individualTaxPayer);
  await expect(page.getByRole('heading', { name: taxFormdata.firstName })).toHaveText(taxFormdata.firstName);
  await expect(page.getByRole('heading', { name: taxFormdata.lastName })).toHaveText(taxFormdata.lastName);
  await expect(page.getByRole('heading', { name: taxFormdata.tin })).toHaveText(`${taxFormdata.tin}`);
  await expect(page.getByRole('heading', selectors.countryUsHeading)).toHaveText(taxFormdata.countryUs);
  await expect(page.getByRole('heading', { name: taxFormdata.city })).toHaveText(taxFormdata.city);
  await expect(page.getByRole('heading', { name: taxFormdata.zipCodeAlaska })).toHaveText(taxFormdata.zipCodeAlaska);
}

/**
 * Assert W9 Tax form details for Entities
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Expected data for W9 Tax form
 * @param {Object} selectors - Selectors related to IC Tax forms
 * @returns {Promise<void>}
 */
export async function assertW9TaxDetailsPageEntities(page, taxFormdata, selectors) {
  await expect(page.locator(selectors.companyTaxPayer)).toHaveText(taxFormdata.entityTaxPayer);
  await expect(page.getByTestId(selectors.firstNameValueTestId)).toHaveText(taxFormdata.firstName);
  await expect(page.getByTestId(selectors.lastNameValueTestId)).toHaveText(taxFormdata.lastName);
  await expect(page.getByTestId(selectors.businessNameValueTestId)).toHaveText(taxFormdata.businessName);
  await expect(page.getByTestId(selectors.countryValueTestId)).toHaveText(taxFormdata.countryUs);
  await expect(page.getByTestId(selectors.cityValueTestId)).toHaveText(taxFormdata.city);
  await expect(page.getByTestId(selectors.zipCodeValueTestId)).toHaveText(taxFormdata.zipCodeAlaska);
  await expect(page.getByTestId(selectors.taxDeliveryEmailTestId)).toContainText(taxFormdata.email);
}

/**
 * Assert W8-BEN Tax form details
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Expected data for W8-BEN Tax form
 * @param {Object} selectors - Selectors related to IC Tax forms
 */
export async function assertW8BenTaxDetailsPageIndividuals(page, taxFormData, selectors) {
  await expect(page.getByRole('heading', selectors.individualTaxPayerHeading)).toHaveText(taxFormData.individualTaxPayer);
  await expect(page.getByRole('heading', { name: taxFormData.firstName })).toHaveText(taxFormData.firstName);
  await expect(page.getByRole('heading', { name: taxFormData.lastName })).toHaveText(taxFormData.lastName);
  await expect(page.getByRole('heading', { name: taxFormData.tin })).toHaveText(`${taxFormData.tin}`);
  await expect(page.getByRole('heading', selectors.countryAlbaniaHeading)).toHaveText(taxFormData.countryAlbania);
  await expect(page.getByRole('heading', { name: taxFormData.expectedDateOfBirth })).toHaveText(taxFormData.expectedDateOfBirth);
}

/**
 * Assert W8-BEN-E Tax form details
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} taxFormDetails - Expected data for W8-BEN-E Tax form
 * @param {Object} selectors - Selectors related to IC Tax forms
 */
export async function assertW8BeneTaxDetailsPageEntities(page, taxFormData, selectors) {
  await expect(page.getByTestId(selectors.organizationNameTestId)).toHaveText(taxFormData.beneficialOwnerOrgName);
  await expect(page.getByTestId(selectors.organizationCountryTestId)).toHaveText(taxFormData.organizationCountryAlbania);
  await expect(page.getByTestId(selectors.entityTypeTestId)).toHaveText(taxFormData.entityTypeComplexTrust);
  await expect(page.getByTestId(selectors.countryValueTestId)).toHaveText(taxFormData.countryAlbania);
  await expect(page.getByTestId(selectors.entityCityTestId)).toContainText(taxFormData.city);
  await expect(page.getByTestId(selectors.factaStatusValue)).toHaveText(taxFormData.factaStatusActiveNffe);
}
