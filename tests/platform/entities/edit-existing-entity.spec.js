import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  continueNextStep,
  fillUSEntityAddress,
  fillUSEntityDetails,
  openEditEntityPage,
  verifyEntityDetails,
} from '../../../helpers/platform/entity-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import entitySelectors from '../../../selectors/account-settings/entitySelectors';
import sharedSelectors from '../../../selectors/shared-selectors';
import { createClient } from '../../../setup/commands/create-client';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';

test.describe('Edit Entity', () => {
  const { editEntity } = entitySelectors;
  let entityData;

  test.beforeAll(async () => {
    entityData = {
      countryOfIncorporation: country.US.label,
      legalEntityName: 'US Test Entity(Edited)',
      entityType: 'General partnership',
      state: 'Alabama',
      naicsCode: faker.string.numeric(5),
      dialCode: `${country.US.value} ${country.US.dialCode[0]}`,
      phoneNo: country.US.phone.slice(-10),
      vat: faker.string.numeric(9),
      regNo: faker.string.numeric(9),
      industryName: '5300',
      industryCode: '5300',
      city: faker.location.city(),
      street: faker.location.streetAddress(),
      zip: '35013',
    };
  });

  test.beforeEach('Login and open the entity details page', async ({ page, request }) => {
    const { email, legalEntityId } = await createClient();
    const url = `${URLS.ACCOUNT_SETTINGS_ENTITY}/${legalEntityId}/details`;
    await loginIntoSpecificPage(page, request, email, password, url);
  });

  test(`Client edits an existing entity @platform-qa-front`, async ({ page }) => {
    await openEditEntityPage(page);
    await fillUSEntityDetails(page, entityData, false);
    await fillUSEntityAddress(page, entityData);
    await continueNextStep(page);
    await page.getByRole('button', editEntity.editEntityButton).click();

    // Get Modal title text
    const successModalTitle = await page.getByTestId(sharedSelectors.undefinedTitleTestId).textContent();
    await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();

    // Assert
    expect(successModalTitle).toContain(editEntity.entityEditedModalTitle);
    await verifyEntityDetails(page, entityData);
  });
});
