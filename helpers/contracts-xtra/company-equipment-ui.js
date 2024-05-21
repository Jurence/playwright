import { faker } from '@faker-js/faker';
import companyEquipmentSelector from '../../selectors/company-equipment/company-equipment-page';
import sharedSelectors from '../../selectors/shared-selectors';

/**
 * Add company provided equipment
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} deviceType - The type of device to be added.
 * @returns {Promise<void>} - Promise that resolves when company provided equipment is added
 */
export default async function addCompanyEquipment(page, deviceType) {
  const equipmentModel = 'Equipment Model';
  const serialNumber = faker.string.alphanumeric({ length: 10 });
  await page.getByTestId(companyEquipmentSelector.addEquipmentTestId).click();
  await page.getByTestId(companyEquipmentSelector.equipmentEducationalModalTestId).waitFor();
  await page.getByTestId(companyEquipmentSelector.equipmentEducationalModalNextTestId).click();
  await page.getByRole('heading', companyEquipmentSelector.companyEquipmentHeading).click();
  await page.getByRole('button', companyEquipmentSelector.continueBtn).click();
  await page.getByRole('button', companyEquipmentSelector.addNewBtn).click();
  await page.getByLabel(companyEquipmentSelector.equipmentTypeLabel).click();
  await page.getByText(deviceType).click();
  await page.getByLabel(companyEquipmentSelector.modelLabel).fill(equipmentModel);
  await page.getByLabel(companyEquipmentSelector.serialNumberLabel).fill(serialNumber);
  await page.locator(companyEquipmentSelector.equipmentCondition).click();
  await page.getByText(companyEquipmentSelector.equipmentConditionText).click();
  await page.getByRole('button', companyEquipmentSelector.addNewDeviceBtn).click();
  await page.getByRole('heading', companyEquipmentSelector.equipmentInventoryHeading).waitFor();
  await page.getByRole('button', companyEquipmentSelector.continueBtn).click();
  await page.getByRole('heading', companyEquipmentSelector.deliveryMethodHeading).waitFor();
  await page.getByLabel(companyEquipmentSelector.sendByCourierLabel).click();
  await page.getByLabel(companyEquipmentSelector.pendingShippingLabel).click();
  await page.getByRole('button', companyEquipmentSelector.continueBtn).click();
  await page.getByRole('heading', companyEquipmentSelector.equipmentAgreementHeading).waitFor();
  await page.getByRole('button', companyEquipmentSelector.continueBtn).click();
  await page.getByRole('button', companyEquipmentSelector.confirmBtn).click();
  await page.getByTestId(sharedSelectors.undefinedTitleTestId).waitFor();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}
