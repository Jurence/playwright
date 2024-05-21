import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  continueNextStep,
  fillUSEntityAddress,
  fillUSEntityDetails,
  fillUSMailingEntityAddress,
  openAddEntityPage,
  verifyEntityDetails,
  verifyMailingEntityDetails,
} from '../../../helpers/platform/entity-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import entitySelectors from '../../../selectors/account-settings/entitySelectors';
import sharedSelectors from '../../../selectors/shared-selectors';
import { createClient } from '../../../setup/commands/create-client';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';

test.describe('Create New Entity', () => {
  const { addEntity } = entitySelectors;
  let clientEmail;
  let entityData;

  test.beforeAll(async () => {
    entityData = {
      countryOfIncorporation: country.US.label,
      legalEntityName: 'US Test Entity(QA)',
      entityType: 'Sole Proprietorship',
      state: faker.location.state(),
      naicsCode: faker.string.numeric(5),
      dialCode: `${country.US.value} ${country.US.dialCode[0]}`,
      phoneNo: country.US.phone.slice(-10),
      vat: faker.string.numeric(9),
      regNo: faker.string.numeric(9),
      industryName: '5300',
      industryCode: '5300',
      city: faker.location.city(),
      street: faker.location.streetAddress(),
      zip: faker.location.zipCode(),
      country: country.US.label,
    };
  });

  test.beforeEach('Login and open entity page', async ({ page, request }) => {
    clientEmail = (await createClient()).email;
    await loginIntoSpecificPage(page, request, clientEmail, password, URLS.ACCOUNT_SETTINGS_ENTITY);
  });

  test(`Client creates a new entity @platform-qa-front`, async ({ page }) => {
    await openAddEntityPage(page);
    await fillUSEntityDetails(page, entityData);
    await fillUSEntityAddress(page, entityData);
    await fillUSMailingEntityAddress(page, entityData);
    await continueNextStep(page);
    await page.getByRole('button', addEntity.addEntityButton).click();

    // Get Modal title text
    const successModalTitle = await page.getByTestId(sharedSelectors.undefinedTitleTestId).textContent();
    await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
    await page.getByText(entityData.legalEntityName).click();

    // Assert
    expect(successModalTitle).toContain(addEntity.entityCreatedModalTitle);
    await verifyEntityDetails(page, entityData);
    await verifyMailingEntityDetails(page, entityData);
  });
});
