import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import { loginIntoSpecificPage } from '../../../../helpers/platform/login-ui';
import {
  fillOrganizationName,
  openEditOrganizationDetailsModal,
  saveOrganizationDetails,
} from '../../../../helpers/platform/organization-settings/organization-details-ui';
import orgSettingsSelectors from '../../../../selectors/organization-settings-menu/organization-settings';
import { createClient } from '../../../../setup/commands/create-client';
import { password } from '../../../../setup/constants';
import URLS from '../../../../setup/urls';

const { editOrganizationDetailsModal, organizationDetailsBox } = orgSettingsSelectors.organizationDetails;

test.describe('Edit entity details for entity contractor', () => {
  let client;
  let organizationName;

  test.beforeAll('Create client', async () => {
    client = await createClient();
  });

  test.beforeEach('Login and open Organization details page', async ({ page, request }) => {
    await loginIntoSpecificPage(page, request, client.email, password, URLS.ORGANIZATION_DETAILS);
  });

  test(`Client opens edit organization details modal and asserts organization name @platform-qa-front`, async ({ page }) => {
    organizationName = client.organization.name;

    await openEditOrganizationDetailsModal(page);

    await expect(page.locator(editOrganizationDetailsModal.organizationNameField)).toHaveValue(organizationName);
    await expect(page.getByRole('button', editOrganizationDetailsModal.saveButton)).toBeDisabled();
  });

  test(`Client edits organization name and saves changes @platform-qa-front`, async ({ page }) => {
    const newOrgName = faker.company.name();

    await openEditOrganizationDetailsModal(page);
    await fillOrganizationName(page, newOrgName);
    await saveOrganizationDetails(page);

    await expect(page.getByTestId(organizationDetailsBox.organizationNameTestId)).toContainText(newOrgName);
  });

  test(`Client can't update organization name with already existing organization name @platform-qa-front`, async ({ page }) => {
    const exitingOrgName = (await createClient()).organization.name;
    const nameAlreadyTakenError = 'This name is taken. Please try another';

    await openEditOrganizationDetailsModal(page);
    await fillOrganizationName(page, exitingOrgName);

    await expect(page.getByRole('button', editOrganizationDetailsModal.saveButton)).toBeDisabled();
    await expect(page.locator(editOrganizationDetailsModal.errorText)).toHaveText(nameAlreadyTakenError);
  });
});
