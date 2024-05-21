import { expect } from '@playwright/test';
import moment from 'moment/moment';
import accountSettings from '../../selectors/account-settings/account-settings';
import accountSettingsSecurity from '../../selectors/account-settings/account-settings-security';
import { selectDropdownOption } from '../shared-functions/select-options';

const {
  personalDetailsBox,
  editPersonalDetailsPage,
  addressBox,
  editAddressModal,
  accountAccessSection,
  entityDetailsBox,
  editEntityDetailsBox,
} = accountSettings;

const { accountSecurityBox, changePasswordModal, otpModal } = accountSettingsSecurity;

/**
 * Click on Edit button on Personal details box
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEditPersonalDetailsPage(page) {
  await page.getByTestId(personalDetailsBox.editButtonTestId).click();
}

/**
 * Click on Edit button on Entity details box
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEditEntityDetailsPage(page) {
  await page.getByTestId(entityDetailsBox.editButtonTestId).click();
}

/**
 * Select Dial Code from dropdown in Edit personal details page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} dialCode - Dial code of country
 * @returns {Promise<void>}
 */
export async function selectDialCode(page, dialCode) {
  await page.locator(editPersonalDetailsPage.dialCodeSelector).click();
  await page.getByText(dialCode).click();
}

/**
 * Select Timezone from dropdown in Edit personal details page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} timezone - timezone in format "Region - City"
 * @returns {Promise<void>}
 */
export async function selectTimeZone(page, timezone) {
  await page.getByTestId(editPersonalDetailsPage.timezoneTestId).click();
  await page.getByText(timezone).click();
}

/**
 * Select Date Of birth of tax residence from dropdown in Edit personal details page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} dateOfBirth - Date in format MM/DD/YYYY
 * @returns {Promise<void>}
 */
export async function selectDateOfBirth(page, dateOfBirth) {
  await page.locator(editPersonalDetailsPage.dateOfBirthField).click();
  await page.locator(editPersonalDetailsPage.dateOfBirthField).fill(dateOfBirth);
  await page.getByTestId('birthDate').getByRole('button').last().click();
}

/**
 * Click on Save button on Edit Personal details page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function savePersonalDetails(page) {
  await page.getByRole('button', editPersonalDetailsPage.saveButton).first().click();
}

/**
 * Click on Done button on Edit Entity details page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function saveEntityDetails(page) {
  await page.getByTestId(editEntityDetailsBox.doneButtonTestId).click();
}

/**
 * Fill client personal details
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} client - Data for filling client personal details
 * @returns {Promise<void>}
 */
export async function fillClientPersonalDetails(page, client) {
  await page.locator(editPersonalDetailsPage.firstNameField).fill(client.firstName);
  await page.locator(editPersonalDetailsPage.lastNameField).fill(client.lastName);
  await page.locator(editPersonalDetailsPage.preferredNameField).fill(client.preferredName);

  await selectDateOfBirth(page, client.birthDate);

  const citizenSelector = page.getByTestId(editPersonalDetailsPage.citizenOfTestId);
  await selectDropdownOption(page, citizenSelector, client.citizen);

  await selectDialCode(page, client.dialCode);
  await page.locator(editPersonalDetailsPage.phoneNumberField).fill(client.phoneNumber);

  await selectTimeZone(page, client.timezone);
  const countryTaxResidenceSelector = page.getByTestId(editPersonalDetailsPage.countryOfTaxResidenceTestId);
  await selectDropdownOption(page, countryTaxResidenceSelector, client.countryOfResidence);
}

/**
 * Fill contractor personal details
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} contractor - Data for filling contractor personal details
 * @returns {Promise<void>}
 */
export async function fillContractorPersonalDetails(page, contractor) {
  await page.locator(editPersonalDetailsPage.preferredNameField).fill(contractor.preferredName);

  await selectDateOfBirth(page, contractor.birthDate);

  const citizenSelector = page.getByTestId(editPersonalDetailsPage.citizenOfTestId);
  await selectDropdownOption(page, citizenSelector, contractor.citizen);

  await selectTimeZone(page, contractor.timezone);
  const countryTaxResidenceSelector = page.getByTestId(editPersonalDetailsPage.countryOfTaxResidenceTestId);
  await selectDropdownOption(page, countryTaxResidenceSelector, contractor.countryOfResidence);

  await page.locator(editPersonalDetailsPage.personalIdField).fill(contractor.personalId);
  await page.locator(editPersonalDetailsPage.taxIdField).fill(contractor.taxId);
  await page.locator(editPersonalDetailsPage.vatIdField).fill(contractor.vatId);

  const legalStatusSelector = page.getByTestId(editPersonalDetailsPage.legalStatusTestId);
  await selectDropdownOption(page, legalStatusSelector, contractor.legalStatus);
}

/**
 * Assert individual contractor personal details after editing
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} contractor - Data for checking contractor personal details
 * @returns {Promise<void>}
 */
export async function assertIndividualContractorPersonalDetails(page, contractor) {
  const dobFE = moment(new Date(contractor.birthDate)).format('MMM Do, YYYY');
  await expect(page.getByTestId(personalDetailsBox.preferredNameTestId)).toContainText(contractor.preferredName);
  await expect(page.getByTestId(personalDetailsBox.citizenOfTestId)).toContainText(contractor.citizen);
  await expect(page.getByTestId(personalDetailsBox.countryOfTaxResidenceTestId)).toContainText(contractor.countryOfResidence);
  await expect(page.getByTestId(personalDetailsBox.dateOfBirthTestId)).toContainText(dobFE);
  await expect(page.getByTestId(personalDetailsBox.legalStatusTestId)).toContainText(contractor.legalStatus);
  await expect(page.getByTestId(personalDetailsBox.passportIdTestId)).toContainText(contractor.personalId);
  await expect(page.getByTestId(personalDetailsBox.vatIdTestId)).toContainText(contractor.vatId);
  await expect(page.getByTestId(personalDetailsBox.taxIdTestId)).toContainText(contractor.taxId);
}

/**
 * Assert client personal details after editing
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} client - Data for checking client personal details
 * @returns {Promise<void>}
 */
export async function assertClientPersonalDetails(page, client) {
  const phoneWithDialCode = `${client.dialCode} ${client.phoneNumber}`;
  const dobFE = moment(new Date(client.birthDate)).format('MMM Do, YYYY');
  await expect(page.getByTestId(personalDetailsBox.firstNameTestId)).toContainText(client.firstName);
  await expect(page.getByTestId(personalDetailsBox.lastNameTestId)).toContainText(client.lastName);
  await expect(page.getByTestId(personalDetailsBox.preferredNameTestId)).toContainText(client.preferredName);
  await expect(page.getByTestId(personalDetailsBox.citizenOfTestId)).toContainText(client.citizen);
  await expect(page.getByTestId(personalDetailsBox.phoneNumberTestId)).toContainText(phoneWithDialCode);
  await expect(page.getByTestId(personalDetailsBox.countryOfTaxResidenceTestId)).toContainText(client.countryOfResidence);
  await expect(page.getByTestId(personalDetailsBox.dateOfBirthTestId)).toContainText(dobFE);
}

/**
 * Fill SSN on Edit personal details page
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} socialNumber - contractor SSN
 * @returns {Promise<void>}
 */
export async function fillSSN(page, socialNumber) {
  await page.locator(editPersonalDetailsPage.ssnField).fill(socialNumber);
}

/**
 * Click on Edit button for Personal address
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEditPersonalAddress(page) {
  await page.getByTestId(addressBox.editPersonalAddressTestId).click();
}

/**
 * Fill contractor personal address
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} address - Data for filling contractor address
 * @returns {Promise<void>}
 */
export async function fillAddress(page, address) {
  const countrySelector = page.getByTestId(editAddressModal.countryTestId);
  await selectDropdownOption(page, countrySelector, address.country);

  if (address.province && address.province !== '') {
    const provinceSelector = page.getByTestId(editAddressModal.provinceSelectorTestId).first();
    await selectDropdownOption(page, provinceSelector, address.province);
  }
  await page.locator(editAddressModal.streetField).fill(address.street);
  await page.locator(editAddressModal.cityField).fill(address.city);
  await page.locator(editAddressModal.zipField).fill(address.zip);
}

/**
 * Click on Edit button for Postal address
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEditPostalAddress(page) {
  await page.getByTestId(addressBox.editPostalAddressTestId).click();
}

/**
 * Disable "Use Personal address" switch
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Boolean} state - the state of switch
 * @returns {Promise<void>}
 */
export async function usePersonalAddress(page, state) {
  await page.getByLabel('Use personal address').setChecked(state);
}

/**
 * Disable "Use Entity address" switch
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Boolean} state - the state of switch
 * @returns {Promise<void>}
 */
export async function useEntityAddress(page, state) {
  await page.getByLabel('Use entity address').setChecked(state);
}

/**
 * Click on edit Phone number icon in Account access section
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEditPhoneNumberModal(page) {
  await page.getByTestId(accountAccessSection.editPhoneNumberBtnTestId).click();
}

/**
 * Fill entity details
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for filling contractor entity details
 * @returns {Promise<void>}
 */
export async function fillContractorEntityDetails(page, entityData) {
  await page.locator(editEntityDetailsBox.legalEntityNameField).fill(entityData.legalEntityName);
  await page.locator(editEntityDetailsBox.registrationNumberField).fill(entityData.registrationNumber);
  await page.locator(editEntityDetailsBox.vatIdField).fill(entityData.vatId);
  await page.locator(editEntityDetailsBox.taxIdField).fill(entityData.taxId);

  const countryTaxResidenceSelector = page.getByTestId(editEntityDetailsBox.countryOfTaxResidenceTestId);
  await selectDropdownOption(page, countryTaxResidenceSelector, entityData.countryOfResidence);

  const entityTypeSelector = page.getByTestId(editEntityDetailsBox.entityTypeTestId);
  await selectDropdownOption(page, entityTypeSelector, entityData.entityType);
}

/**
 * Assert entity details for contractor after editing
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} entityData - Data for checking entity details for contractor
 * @returns {Promise<void>}
 */
export async function assertEntityDetails(page, entityData) {
  await expect(page.getByTestId(entityDetailsBox.legalEntityNameTestId)).toContainText(entityData.legalEntityName);
  await expect(page.getByTestId(entityDetailsBox.registrationNumberTestId)).toContainText(entityData.registrationNumber);
  await expect(page.getByTestId(entityDetailsBox.taxIdTestId)).toContainText(entityData.taxId);
  await expect(page.getByTestId(entityDetailsBox.vatIdTestId)).toContainText(entityData.vatId);
  await expect(page.getByTestId(entityDetailsBox.countryOfTaxResidenceTestId)).toContainText(entityData.countryOfResidence);
  await expect(page.getByTestId(entityDetailsBox.entityTypeTestId)).toContainText(entityData.entityType);
}

/**
 * Click on Entity tab
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEntityTab(page) {
  await page.getByTestId(accountSettings.entityTabTestId).click();
}

/**
 * Click on Edit button on Entity Address box
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEditEntityAddress(page) {
  await page.getByTestId(addressBox.editEntityAddressTestId).click();
}

/**
 * Assert entity address for contractor after editing
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} address - Data for checking entity address for contractor
 * @returns {Promise<void>}
 */
export async function assertEntityAddress(page, address) {
  await expect(page.getByTestId(addressBox.entityAddressTestId)).toContainText(address.country);
  await expect(page.getByTestId(addressBox.entityAddressTestId)).toContainText(address.street);
  await expect(page.getByTestId(addressBox.entityAddressTestId)).toContainText(address.city);
  await expect(page.getByTestId(addressBox.entityAddressTestId)).toContainText(address.zip);

  if (address.province !== '') {
    await expect(page.getByTestId(addressBox.entityAddressTestId)).toContainText(address.province);
  }
}

/**
 * Assert postal address for contractor after editing
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} address - Data for checking entity address for contractor
 * @returns {Promise<void>}
 */
export async function assertPostalAddress(page, address) {
  await expect(page.getByTestId(addressBox.postalAddressTestId)).toContainText(address.country);
  await expect(page.getByTestId(addressBox.postalAddressTestId)).toContainText(address.street);
  await expect(page.getByTestId(addressBox.postalAddressTestId)).toContainText(address.city);
  await expect(page.getByTestId(addressBox.postalAddressTestId)).toContainText(address.zip);

  if (address.province !== '') {
    await expect(page.getByTestId(addressBox.postalAddressTestId)).toContainText(address.province);
  }
}

/**
 * Assert personal address for contractor after editing
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {Object} address - Data for checking entity address for contractor
 * @returns {Promise<void>}
 */
export async function assertPersonalAddress(page, address) {
  await expect(page.getByTestId(addressBox.personalAddressTestId)).toContainText(address.country);
  await expect(page.getByTestId(addressBox.personalAddressTestId)).toContainText(address.street);
  await expect(page.getByTestId(addressBox.personalAddressTestId)).toContainText(address.city);
  await expect(page.getByTestId(addressBox.personalAddressTestId)).toContainText(address.zip);

  if (address.province !== '') {
    await expect(page.getByTestId(addressBox.personalAddressTestId)).toContainText(address.province);
  }
}

/**
 * Click on Change Password card on Account Security box
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openChangePasswordModal(page) {
  await page.getByTestId(accountSecurityBox.changePasswordCellTestId).click();
}

/**
 * Fill the current and new password
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export async function fillPasswordForm(page, currentPassword, newPassword) {
  await page.locator(changePasswordModal.currentPasswordField).fill(currentPassword);
  await page.locator(changePasswordModal.newPasswordField).fill(newPassword);
  await page.getByTestId(changePasswordModal.changePasswordButtonTestId).click();
}

/**
 * Enter Verification code
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function enterVerificationCode(page) {
  const otp = '0';

  for await (const field of otpModal.otpFields) {
    await page.getByTestId(field).fill(otp);
  }
}
