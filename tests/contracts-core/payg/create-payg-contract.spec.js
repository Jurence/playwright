import { expect, test } from '@playwright/test';
import { paygContractData } from '../../../data/contracts-core/contract-creation';
import country from '../../../data/countries.json';
import { contractsCore } from '../../../data/texts';
import {
  fillComplianceStep,
  fillPAYGPaymentAndDatesForFixedRate,
  fillPAYGPaymentAndDatesForPerTask,
  fillPersonalDetailsAsClient,
  fillPersonalDetailsAsContractor,
  fillRoleDetails,
} from '../../../helpers/contracts-core/ic-contract-creation-flow-ui/ic-contracts-core-contract-creation-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { continueToNextStep } from '../../../helpers/shared-functions/form-functions';
import icReviewAndSignSelectors from '../../../selectors/ic-contracts-core/review-and-sign';
import { createClient } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';
import { removeCSATPopup } from '../../../utils/remove-popups';
import { transformRate } from '../../../utils/string-utilities';

const { reviewAndSignInviteClientBtn } = contractsCore;
const { personalDetails, roleDetails, paymentDetails, compliance } = paygContractData;
let client;
let contractor;

test.describe('PAYG contract creation', () => {
  test.beforeEach('Create users via API', async () => {
    test.setTimeout(120 * 1000);
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClient({ country: country.CA.value });
    paygContractData.personalDetails.firstName = contractor.firstName;
    paygContractData.personalDetails.lastName = contractor.lastName;
    paygContractData.personalDetails.email = contractor.email;
  });

  test(
    'Client creates PAYG Fixed Rate contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
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

      // Benefits and extras - Step 5
      await continueToNextStep(page);

      // Check that contract is created
      await removeCSATPopup(page);
      await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toBeEnabled();
      await expect(page.getByTestId(icReviewAndSignSelectors.contractNameClientTestId)).toHaveText(personalDetails.contractName);
      await expect(page.getByTestId(icReviewAndSignSelectors.contractTypeTestId)).toHaveText(personalDetails.contractType);
      await expect(page.locator(icReviewAndSignSelectors.paymentFrequency)).toHaveText(paymentDetails.paymentFrequencyText);

      const amount = await page.locator(icReviewAndSignSelectors.paymentRate).textContent();
      const transformedAmount = transformRate(amount);
      expect(transformedAmount).toEqual(`${paymentDetails.paymentRate}`);
    }
  );

  test(
    'Contractor creates PAYG Fixed Rate contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Open contract creation flow
      await loginIntoSpecificPage(page, request, contractor.email, password, URLS.IC_PAYG_CREATION);

      // Fill Personal Details - Step 1
      await fillPersonalDetailsAsContractor(page, paygContractData.personalDetails);
      await continueToNextStep(page);

      // Fill Role Details - Step 2
      await fillRoleDetails(page, paygContractData.roleDetails);
      await continueToNextStep(page);

      // Fill Payment and dates - Step 3
      await fillPAYGPaymentAndDatesForFixedRate(page, paygContractData.paymentDetails);
      await continueToNextStep(page);

      // Compliance - Step 4
      await fillComplianceStep(page, paygContractData.compliance);
      await continueToNextStep(page);

      // Check that contract is created
      await removeCSATPopup(page);
      await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toBeEnabled();
      await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toHaveText(reviewAndSignInviteClientBtn);
      await expect(page.locator(icReviewAndSignSelectors.contractorReviewAndSignBtn)).toBeDisabled();
      await expect(page.locator(icReviewAndSignSelectors.contractNameContractor)).toHaveText(personalDetails.contractName);
      await expect(page.getByTestId(icReviewAndSignSelectors.contractTypeTestId)).toHaveText(personalDetails.contractType);
      await expect(page.locator(icReviewAndSignSelectors.paymentFrequency)).toHaveText(paymentDetails.paymentFrequencyText);

      const amount = await page.locator(icReviewAndSignSelectors.paymentRate).textContent();
      const transformedAmount = transformRate(amount);
      expect(transformedAmount).toEqual(`${paymentDetails.paymentRate}`);
    }
  );

  test(
    'Client creates PAYG Task Type contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Open contract creation flow
      await loginIntoSpecificPage(page, request, client.email, password, URLS.IC_PAYG_CREATION);

      // Fill Personal Details - Step 1
      await fillPersonalDetailsAsClient(page, personalDetails);
      await continueToNextStep(page);

      // Fill Role Details - Step 2
      await fillRoleDetails(page, roleDetails);
      await continueToNextStep(page);

      // Fill Payment and dates - Step 3
      await fillPAYGPaymentAndDatesForPerTask(page, paymentDetails);
      await continueToNextStep(page);

      // Compliance - Step 4
      await fillComplianceStep(page, compliance);
      await continueToNextStep(page);

      // Benefits and extras - Step 5
      await continueToNextStep(page);

      // Check that contract is created
      await removeCSATPopup(page);
      await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toBeEnabled();
      await expect(page.getByTestId(icReviewAndSignSelectors.contractNameClientTestId)).toHaveText(personalDetails.contractName);
      await expect(page.getByTestId(icReviewAndSignSelectors.contractTypeTestId)).toHaveText(personalDetails.contractType);
      await expect(page.locator(icReviewAndSignSelectors.paymentFrequency)).not.toBeVisible();
    }
  );
});
