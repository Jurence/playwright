import { expect } from '@playwright/test';
import entitySelectors from '../../selectors/account-settings/entitySelectors';
import sharedSelectors from '../../selectors/shared-selectors';
import { selectDropdownOption } from '../shared-functions/select-options';
import uploadFile from '../shared-functions/upload-file';

const { addEntity, viewEntity } = entitySelectors;
const filePath = 'data/dummy-doc.pdf';

/**
 * Click on Create Entity button on Entity page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openAddEntityPage(page) {
  await page.getByRole('button', entitySelectors.createEntityButton).click();
}

/**
 * Click on Edit button on Entity Details page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEditEntityPage(page) {
  await page.getByRole('button', viewEntity.editEntityButton).click();

  // To ensure the current entity data has been loaded on the form
  const countryIncorporationSelector = page.getByTestId(addEntity.countryOfIncTestId);
  await countryIncorporationSelector.hover();
  await countryIncorporationSelector.getByLabel(addEntity.clearCountryOfIncLabel).click();
}

/**
 * Step 1: Fill Entity Details
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @param {boolean} addFlag - Indicates whether the file should be uploaded.
 * @returns {Promise<void>}
 */
export async function fillUSEntityDetails(page, entityData, addFlag = true) {
  await fillLegalDetails(page, entityData);

  const stateIncorporationSelector = page.getByTestId(addEntity.stateOfIncTestId);
  await selectDropdownOption(page, stateIncorporationSelector, entityData.state);

  // Check if user is adding or editing
  if (addFlag) {
    await uploadFile(page, sharedSelectors.uploadFileDropzone, filePath);
    await page.getByLabel(addEntity.usPayrollCheckbox).check();
  }

  await page.getByLabel(addEntity.naicsCodeLabel).fill(entityData.naicsCode);
  await fillIdentificationDetails(page, entityData);
  await continueNextStep(page);
}

/**
 * Step 1: Fill Entity Details | Legal Details
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @returns {Promise<void>}
 */
export async function fillLegalDetails(page, entityData) {
  const countryIncorporationSelector = page.getByTestId(addEntity.countryOfIncTestId);
  await selectDropdownOption(page, countryIncorporationSelector, entityData.countryOfIncorporation);

  await page.locator(addEntity.legalEntityNameField).fill(entityData.legalEntityName);

  const entityTypeSelector = page.getByTestId(addEntity.entityTypeTestId);
  await selectDropdownOption(page, entityTypeSelector, entityData.entityType);
}

/**
 * Step 1: Fill Entity Details | Identification details
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @returns {Promise<void>}
 */
export async function fillIdentificationDetails(page, entityData) {
  await page.getByLabel(addEntity.dialCodeLabel).fill(entityData.dialCode);
  await page.getByText(entityData.dialCode).click();

  await page.getByLabel(addEntity.phoneNumberLabel).fill(entityData.phoneNo);

  await page.locator(addEntity.vatField).fill(entityData.vat);

  await page.locator(addEntity.regNoField).fill(entityData.regNo);

  await page.locator(addEntity.sicDropdown).fill(entityData.industryCode);
  await page.getByRole('heading', { name: entityData.industryName }).click();
}

/**
 * Step 2: Fill Entity Address
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @returns {Promise<void>}
 */
export async function fillUSEntityAddress(page, entityData) {
  const stateSelector = page.getByTestId(addEntity.stateTestId).first();
  await selectDropdownOption(page, stateSelector, entityData.state);

  await fillEntityAddress(page, entityData);
}

/**
 * Step 2: Fill Entity Address
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @returns {Promise<void>}
 */
export async function fillEntityAddress(page, entityData) {
  await page.locator(addEntity.cityField).fill(entityData.city);
  await page.locator(addEntity.streetField).fill(entityData.street);
  await page.locator(addEntity.zipCodeField).fill(entityData.zip);
}

/**
 * Step 3: Verify Entity Details
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @returns {Promise<void>}
 */
export async function verifyEntityDetails(page, entityData) {
  const entityDetailBox = page.getByTestId(viewEntity.entityDetailsBoxTestId);
  const registeredAddressBox = page.getByTestId(viewEntity.registeredAddressTestId);

  await expect(entityDetailBox.getByText(entityData.legalEntityName)).toBeVisible();
  await expect(entityDetailBox.getByText(entityData.entityType)).toBeVisible();
  await expect(entityDetailBox.getByText(entityData.phoneNo)).toBeVisible();
  await expect(entityDetailBox.getByText(entityData.vat)).toBeVisible();
  await expect(entityDetailBox.getByText(entityData.regNo)).toBeVisible();
  await expect(entityDetailBox.getByText(entityData.industryCode)).toBeVisible();
  await expect(registeredAddressBox.getByText(entityData.city)).toBeVisible();
  await expect(registeredAddressBox.getByText(entityData.street)).toBeVisible();
  await expect(registeredAddressBox.getByText(entityData.zip)).toBeVisible();
}

/**
 * Verify Mailing Entity Details
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @returns {Promise<void>}
 */
export async function verifyMailingEntityDetails(page, entityData) {
  const mailingAddressBox = page.getByTestId(viewEntity.mailingAddressTestId);

  await expect(mailingAddressBox.getByText(entityData.country)).toBeVisible();
  await expect(mailingAddressBox.getByText(entityData.city)).toBeVisible();
  await expect(mailingAddressBox.getByText(entityData.street)).toBeVisible();
  await expect(mailingAddressBox.getByText(entityData.zip)).toBeVisible();
}

/**
 * Step 2: Fill US Mailing Entity Address
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @returns {Promise<void>}
 */
export async function fillUSMailingEntityAddress(page, entityData) {
  const countrySelect = page.getByTestId(addEntity.countryTestId).last();
  await selectDropdownOption(page, countrySelect, entityData.country);
  const stateSelector = page.getByTestId(addEntity.stateTestId).last();
  await selectDropdownOption(page, stateSelector, entityData.state);
  await fillMailingEntityAddress(page, entityData);
}

/**
 * Step 2: Fill Mailing Entity Address
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling client entity details
 * @returns {Promise<void>}
 */
export async function fillMailingEntityAddress(page, entityData) {
  await page.locator(addEntity.cityPostalAddress).fill(entityData.city);
  await page.locator(addEntity.addressPostalAddress).fill(entityData.street);
  await page.locator(addEntity.zipPostalAddress).fill(entityData.zip);
}

/**
 * Click on Continue
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function continueNextStep(page) {
  await page.getByRole('button', addEntity.continueButton).click();
}
