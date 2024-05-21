import { expect, test } from '@playwright/test';
import { paygContractData } from '../../../data/contracts-core/contract-creation';
import equityData from '../../../data/contracts-xtra/equity';
import country from '../../../data/countries.json';
import {
  fillComplianceStep,
  fillPAYGPaymentAndDatesForFixedRate,
  fillPersonalDetailsAsClient,
  fillRoleDetails,
} from '../../../helpers/contracts-core/ic-contract-creation-flow-ui/ic-contracts-core-contract-creation-ui';
import { addEquity, deleteEquity } from '../../../helpers/contracts-xtra/equity-flow-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { continueToNextStep } from '../../../helpers/shared-functions/form-functions';
import equitySelector from '../../../selectors/equities/equity-selectors';
import { createClient } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';
import { removeCSATPopup } from '../../../utils/remove-popups';

const { personalDetails, roleDetails, paymentDetails, compliance } = paygContractData;
const { grantInformationDetails, additionalInformationDetails, finalInformationDetails } = equityData;
let client;
let contractor;

test.describe('Equities for PAYG contracts', () => {
  test.beforeEach('Create users via API', async ({ page, request }) => {
    test.setTimeout(120 * 1000);
    contractor = await createIndividualContractor({ country: country.UG.value });
    client = await createClient({ country: country.UG.value });
    paygContractData.personalDetails.firstName = contractor.firstName;
    paygContractData.personalDetails.lastName = contractor.lastName;
    paygContractData.personalDetails.email = contractor.email;

    // Open contract creation flow
    await loginIntoSpecificPage(page, request, client.email, password, URLS.IC_PAYG_CREATION);

    // Fill Personal Details - Step 1
    await fillPersonalDetailsAsClient(page, personalDetails);
    await continueToNextStep(page);

    // Fill Role Details - Step 2
    await fillRoleDetails(page, roleDetails);
    await continueToNextStep(page);

    // Fill Payment and dates - Step 3
    await fillPAYGPaymentAndDatesForFixedRate(page, paymentDetails);
    await continueToNextStep(page);

    // Compliance - Step 4
    await fillComplianceStep(page, compliance);
    await continueToNextStep(page);
  });

  test(
    'Client should be able to add equity to a payg contract at contract creation @xtra-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      // At the Benefits and extras step
      // Add equity
      await addEquity(page, grantInformationDetails, additionalInformationDetails, finalInformationDetails);

      await expect(page.getByText(equitySelector.equitySnackBarText)).toBeVisible();
      await expect(page.locator(equitySelector.removeEquityIcon)).toBeVisible();
      await expect(page.getByText(equitySelector.equityStatusText)).toBeVisible();
    }
  );

  test(
    'Client should be able to remove equity from a payg contract at contract creation @xtra-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      // At the Benefits and extras step
      // Add equity
      await addEquity(page, grantInformationDetails, additionalInformationDetails, finalInformationDetails);

      // Remove equity
      await deleteEquity(page);

      await expect(page.locator(equitySelector.removeEquityIcon)).toBeHidden();
      await expect(page.getByText(equitySelector.equityStatusText)).toBeHidden();
    }
  );

  test(
    'Client should be able to add equity to a payg contract at contract review @xtra-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await removeCSATPopup(page);
      await continueToNextStep(page);
      await page.waitForURL('**/contracts/**');

      // Add equity
      await addEquity(page, grantInformationDetails, additionalInformationDetails, finalInformationDetails);

      await expect(page.getByText(equitySelector.equitySnackBarText)).toBeVisible();
      await expect(page.locator(equitySelector.removeEquityIcon)).toBeVisible();
      await expect(page.getByText(equitySelector.equityStatusText)).toBeVisible();
    }
  );

  test(
    'Client should be able to remove equity from a payg contract at contract review @xtra-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await removeCSATPopup(page);
      await continueToNextStep(page);
      await page.waitForURL('**/contracts/**');

      // Add equity
      await addEquity(page, grantInformationDetails, additionalInformationDetails, finalInformationDetails);

      // Remove equity
      await deleteEquity(page);

      await expect(page.locator(equitySelector.removeEquityIcon)).toBeHidden();
      await expect(page.getByText(equitySelector.equityStatusText)).toBeHidden();
    }
  );
});
