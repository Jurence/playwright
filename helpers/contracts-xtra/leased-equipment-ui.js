import { expect } from '@playwright/test';
import equipmentSelector from '../../selectors/leased-equipment/leased-equipment-page';

/**
 * Add lease equipment
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param hofyDevice - The device to be selected from list of options
 * @returns {Promise<void>} - Promise that resolves when leased equipment is added
 */
export async function addLeaseEquipment(page, hofyDevice) {
  await page.getByTestId(equipmentSelector.addEquipmentTestId).click();
  await page.getByTestId(equipmentSelector.equipmentEducationalModalTestId).waitFor();
  await page.getByTestId(equipmentSelector.equipmentEducationalModalNextTestId).click();
  await page.getByRole('heading', equipmentSelector.leaseEquipmentHeading).click();
  await page.getByRole('button', equipmentSelector.continueBtn).click();
  await page.getByTestId(equipmentSelector.hofyInfoModalTestId).waitFor();
  await page.getByTestId(equipmentSelector.hofyInfoModalNextBtnTestId).click();
  await page.getByText(hofyDevice.type).click();
  await page.getByTestId(equipmentSelector.continueAddingEquipmentTestId).click();
  await page.getByText(hofyDevice.name).click();
  await page.getByTestId(equipmentSelector.continueAddingEquipmentTestId).click();
  await page.getByLabel(equipmentSelector.termsAndConditionsLabel).click();
  await page.getByTestId(equipmentSelector.confirmTestId).click();
  await page.getByTestId(equipmentSelector.hofyEquipmentAddedModalTestId).waitFor();
  await page.getByTestId(equipmentSelector.noTestId).click();
}

/**
 * Remove lease equipment
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - Promise that resolves when leased equipment is removed
 */
export async function removeLeasedEquipment(page) {
  await page.getByLabel(equipmentSelector.removeHofyEquipmentLabel).click();
  await page.getByTestId(equipmentSelector.removeHofyEquipmentTestId).click();
}

/**
 * Assert leased equipment is removed
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>} - Promise that resolves when the assertion succeeds
 */
export async function assertLeasedEquipmentRemoval(page) {
  await expect(page.getByTestId(equipmentSelector.addEquipmentTestId)).toBeVisible();
  await expect(page.getByRole('heading', equipmentSelector.leasedEquipmentHeading)).toBeHidden();
  await expect(page.getByTestId(equipmentSelector.viewHofyEquipmentTestId)).toBeHidden();
  await expect(page.getByLabel(equipmentSelector.removeHofyEquipmentLabel)).toBeHidden();
  await expect(page.getByTestId(equipmentSelector.addMoreEquipmentTestId)).toBeHidden();
}

/**
 * Assert leased equipment is added
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>} - Promise that resolves when the assertion succeeds
 */
export async function assertLeasedEquipmentAddition(page) {
  await expect(page.getByRole('heading', equipmentSelector.leasedEquipmentHeading)).toBeVisible();
  await expect(page.getByTestId(equipmentSelector.viewHofyEquipmentTestId)).toBeVisible();
  await expect(page.getByLabel(equipmentSelector.removeHofyEquipmentLabel)).toBeVisible();
  await expect(page.getByTestId(equipmentSelector.addMoreEquipmentTestId)).toBeVisible();
}
