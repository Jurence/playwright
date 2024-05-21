import { test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  assertEntityAddress,
  assertEntityDetails,
  assertPostalAddress,
  fillAddress,
  fillContractorEntityDetails,
  openEditEntityAddress,
  openEditEntityDetailsPage,
  openEditPostalAddress,
  openEntityTab,
  saveEntityDetails,
  savePersonalDetails,
  useEntityAddress,
} from '../../../helpers/platform/account-settings-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { createEntityContractor } from '../../../setup/commands/create-contractor';
import { password } from '../../../setup/constants';
import Contractor from '../../../setup/models/user-profile/Contractor';
import URLS from '../../../setup/urls';

test.describe('Edit entity details for entity contractor', () => {
  let entityData;
  let entityContractorEmail;
  const userData = {
    country: country.US.value,
    countryOfResidence: country.US.label,
  };

  test.beforeAll(async () => {
    entityData = new Contractor(userData).getEntityDetailsForEditing();
  });

  test.beforeEach('Login and open "Account settings" page', async ({ page, request }) => {
    entityContractorEmail = (await createEntityContractor({ contractorType: 'company', country: country.US.value })).email;
    await loginIntoSpecificPage(page, request, entityContractorEmail, password, URLS.ENTITY_CONTRACTOR_SETTINGS);
  });

  test(`Entity contractor edits entity details and saves the changes @platform-qa-front`, async ({ page }) => {
    await openEditEntityDetailsPage(page);
    await fillContractorEntityDetails(page, entityData);
    await saveEntityDetails(page);
    await openEntityTab(page);

    // Assert entity details after editing
    await assertEntityDetails(page, entityData);
  });

  test(`Entity contractor edits entity address and saves the changes @platform-qa-front`, async ({ page }) => {
    const address = entityData.entityAddress;
    await openEditEntityAddress(page);
    await fillAddress(page, address);
    await savePersonalDetails(page);

    // Assert entity details after editing
    await assertEntityAddress(page, address);
  });

  test(`Entity contractor edits postal address and saves the changes @platform-qa-front`, async ({ page }) => {
    const address = entityData.postalAddress;
    await openEditPostalAddress(page);

    // Turn off "Use entity Address" switch
    await useEntityAddress(page, false);
    await fillAddress(page, address);
    await savePersonalDetails(page);

    // Assert postal address after editing
    await assertPostalAddress(page, address);
  });

  test(`Entity contractor activates "Use Entity Address" for Postal Address and saves the changes @platform-qa-front`, async ({
    page,
  }) => {
    const { postalAddress } = entityData;
    const { entityAddress } = entityData;

    // Edit postal address
    await openEditPostalAddress(page);
    await useEntityAddress(page, false);
    await fillAddress(page, postalAddress);
    await savePersonalDetails(page);

    // Edit entity address
    await openEditEntityAddress(page);
    await fillAddress(page, entityAddress);
    await savePersonalDetails(page);

    // Turn on "Use entity Address" switch
    await openEditPostalAddress(page);
    await useEntityAddress(page, true);
    await savePersonalDetails(page);

    // Assert postal address after editing
    await assertPostalAddress(page, entityAddress);
  });
});
