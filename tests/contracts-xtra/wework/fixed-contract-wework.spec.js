import { expect, test } from '@playwright/test';
import { fixedContractData } from '../../../data/contracts-core/contract-creation';
import country from '../../../data/countries.json';
import {
  fillComplianceStep,
  fillFixedPaymentAndDates,
  fillPersonalDetailsAsClient,
  fillRoleDetails,
} from '../../../helpers/contracts-core/ic-contract-creation-flow-ui/ic-contracts-core-contract-creation-ui';
import {
  addWeworkAccessOnContractPage,
  completeWeworkAccess,
  removeWeworkAccess,
} from '../../../helpers/contracts-xtra/wework-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { continueToNextStep } from '../../../helpers/shared-functions/form-functions';
import weworkSelector from '../../../selectors/wework/wework-page';
import { createClient } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';
import { removeCSATPopup } from '../../../utils/remove-popups';

const { personalDetails, roleDetails, paymentDetails } = fixedContractData;
let client;
let contractor;

test.describe('Client - Wework for Fixed contracts', () => {
  test.beforeEach('Create users via API', async ({ page, request }) => {
    test.setTimeout(120 * 1000);
    client = await createClient({ country: country.CA.value });
    contractor = await createIndividualContractor({ country: country.ES.value });
    fixedContractData.personalDetails.firstName = contractor.firstName;
    fixedContractData.personalDetails.lastName = contractor.lastName;
    fixedContractData.personalDetails.email = contractor.email;

    // Open contract creation flow
    await loginIntoSpecificPage(page, request, client.email, password, URLS.IC_FIXED_CREATION);

    // Fill Personal Details - Step 1
    await fillPersonalDetailsAsClient(page, personalDetails);
    await continueToNextStep(page);

    // Fill Role Details - Step 2
    await fillRoleDetails(page, roleDetails);
    await continueToNextStep(page);

    // Fill Payment and dates - Step 3
    await fillFixedPaymentAndDates(page, paymentDetails);
    await continueToNextStep(page);

    // Compliance - Step 4
    await fillComplianceStep(page, fixedContractData.compliance);
    await continueToNextStep(page);
  });

  test(
    'Client can add wework access to a fixed contract during creation @xtra-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      // At the benefits and extras step
      await addWeworkAccessOnContractPage(page);
      await completeWeworkAccess(page);

      await expect(page.getByLabel(weworkSelector.removeWeworkAccessLabel)).toBeVisible();
      await expect(page.getByTestId(weworkSelector.addWeworkAccessTestId)).toBeHidden();
    }
  );

  test(
    'Client can remove wework access from a fixed contract during creation @xtra-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      // At the benefits and extras step
      await addWeworkAccessOnContractPage(page);
      await completeWeworkAccess(page);
      await removeWeworkAccess(page);

      await expect(page.getByTestId(weworkSelector.addWeworkAccessTestId)).toBeVisible();
      await expect(page.getByLabel(weworkSelector.removeWeworkAccessLabel)).toBeHidden();
    }
  );

  test(
    'Client can add wework access to a fixed contract during review @xtra-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      // At the benefits and extras - Step 5
      await continueToNextStep(page);

      // Check that contract is created
      await removeCSATPopup(page);
      await addWeworkAccessOnContractPage(page);
      await completeWeworkAccess(page);

      await expect(page.getByLabel(weworkSelector.removeWeworkAccessLabel)).toBeVisible();
      await expect(page.getByTestId(weworkSelector.addWeworkAccessTestId)).toBeHidden();
    }
  );

  test(
    'Client can remove wework access from a fixed contract during review @xtra-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      // Benefits and extras - Step 5
      await continueToNextStep(page);

      // Check that contract is created
      await removeCSATPopup(page);
      await addWeworkAccessOnContractPage(page);
      await completeWeworkAccess(page);
      await removeWeworkAccess(page);

      await expect(page.getByTestId(weworkSelector.addWeworkAccessTestId)).toBeVisible();
      await expect(page.getByLabel(weworkSelector.removeWeworkAccessLabel)).toBeHidden();
    }
  );
});
