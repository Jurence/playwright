import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import moment from 'moment/moment';
import country from '../../../data/countries.json';
import {
  assertIndividualContractorPersonalDetails,
  assertPersonalAddress,
  assertPostalAddress,
  fillAddress,
  fillContractorPersonalDetails,
  fillSSN,
  openEditPersonalAddress,
  openEditPersonalDetailsPage,
  openEditPhoneNumberModal,
  openEditPostalAddress,
  savePersonalDetails,
  selectDialCode,
  usePersonalAddress,
} from '../../../helpers/platform/account-settings-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { selectDropdownOption } from '../../../helpers/shared-functions/select-options';
import accountSettingsSelectors from '../../../selectors/account-settings/account-settings';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import { password } from '../../../setup/constants';
import Contractor from '../../../setup/models/user-profile/Contractor';
import URLS from '../../../setup/urls';

const { personalDetailsBox, editPersonalDetailsPage, accountAccessSection } = accountSettingsSelectors;

test.describe('Edit personal details for contractor', () => {
  let contractorEmail;
  let contractorData;
  const userData = {
    birthDate: moment().subtract('20', 'years').format('MM/DD/YYYY'),
    country: country.UA.value,
    timezone: country.UA.timezone,
    countryOfResidence: country.UA.label,
    dialCode: country.UA.dialCode[0],
    phoneNumber: faker.helpers.replaceSymbols('98#######'),
  };

  test.beforeAll(async () => {
    contractorData = new Contractor(userData).getContractorIndividualDetailsForEditing();
    contractorEmail = (await createIndividualContractor({ country: country.US.value })).email;
  });

  test.beforeEach('Login and open "Account settings" page', async ({ page, request }) => {
    await loginIntoSpecificPage(page, request, contractorEmail, password, URLS.ACCOUNT_SETTINGS);
  });

  test(`Individual contractor edits personal details and saves the changes @platform-qa-front`, async ({ page }) => {
    await openEditPersonalDetailsPage(page);
    await fillContractorPersonalDetails(page, contractorData);
    await savePersonalDetails(page);

    // Assert personal details after editing
    await assertIndividualContractorPersonalDetails(page, contractorData);
  });

  test(`Individual US contractor edits SSN number and saves the changes @platform-qa-front`, async ({ page }) => {
    const ssnFE = `****${contractorData.personalId.slice(5)}`;
    const usCountry = country.US.label;

    await openEditPersonalDetailsPage(page);
    const countryOfTaxSelector = page.getByTestId(editPersonalDetailsPage.countryOfTaxResidenceTestId);
    await selectDropdownOption(page, countryOfTaxSelector, usCountry);
    await fillSSN(page, contractorData.personalId);
    await savePersonalDetails(page);

    // Assert personal details after editing
    await expect(page.getByTestId(personalDetailsBox.countryOfTaxResidenceTestId)).toContainText(usCountry);
    await expect(page.getByTestId(personalDetailsBox.ssnTestId)).toContainText(ssnFE);
  });

  test(`Individual contractor edits personal address and saves the changes @platform-qa-front`, async ({ page }) => {
    const address = contractorData.personalAddress;
    await openEditPersonalAddress(page);
    await fillAddress(page, address);
    await savePersonalDetails(page);

    // Assert personal address after editing
    await assertPersonalAddress(page, address);
  });

  test(`Individual contractor edits postal address and saves the changes @platform-qa-front`, async ({ page }) => {
    const address = contractorData.postalAddress;
    await openEditPostalAddress(page);
    await usePersonalAddress(page, false);
    await fillAddress(page, address);
    await savePersonalDetails(page);

    // Assert postal address after editing
    await assertPostalAddress(page, address);
  });

  test(`Individual contractor edits phone number and saves the changes @platform-qa-front`, async ({ page }) => {
    await openEditPhoneNumberModal(page);
    await selectDialCode(page, contractorData.dialCode);
    await page.locator(editPersonalDetailsPage.phoneNumberField).fill(contractorData.phoneNumber);
    await savePersonalDetails(page);

    // Assert phone number after saving changes
    await expect(page.getByTestId(accountAccessSection.phoneNumberTestId)).toContainText(contractorData.phoneNumber);
    await expect(page.getByTestId(accountAccessSection.phoneNumberTestId)).toContainText(contractorData.dialCode);
  });
});
