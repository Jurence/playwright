import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';
import moment from 'moment/moment';
import country from '../../../data/countries.json';
import {
  assertClientPersonalDetails,
  fillClientPersonalDetails,
  openEditPersonalDetailsPage,
  savePersonalDetails,
} from '../../../helpers/platform/account-settings-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { createClient } from '../../../setup/commands/create-client';
import { password } from '../../../setup/constants';
import Client from '../../../setup/models/user-profile/Client';
import URLS from '../../../setup/urls';

test.describe('Edit personal details for client', () => {
  let clientEmail;
  let clientData;
  const userData = {
    birthDate: moment().subtract('20', 'years').format('MM/DD/YYYY'),
    country: country.UA.label,
    dialCode: country.UA.dialCode[0],
    phoneNumber: faker.helpers.replaceSymbols('98#######'),
    timezone: country.UA.timezone,
    countryOfResidence: country.UA.label,
  };

  test.beforeEach(async ({ page, request }) => {
    clientData = new Client(userData).getClientPersonalDetailsForEditing();
    clientEmail = (await createClient()).email;
    await loginIntoSpecificPage(page, request, clientEmail, password, URLS.ACCOUNT_SETTINGS);
  });

  test(`Client edits personal details and saves the changes @platform-qa-front`, async ({ page }) => {
    await openEditPersonalDetailsPage(page);
    await fillClientPersonalDetails(page, clientData);
    await savePersonalDetails(page);

    // Assert personal details after editing
    await assertClientPersonalDetails(page, clientData);
  });
});
