import { expect, test } from '@playwright/test';
import { milestoneContractData } from '../../../data/contracts-core/contract-creation';
import country from '../../../data/countries.json';
import { contractsCore } from '../../../data/texts';
import {
  fillComplianceStep,
  fillMilestoneRolesAndDates,
  fillPersonalDetailsAsClient,
  fillPersonalDetailsAsContractor,
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
const { personalDetails, roleDetails, paymentAndMilestoneDetails, compliance } = milestoneContractData;
let client;
let contractor;

test.describe('Milestone contract creation', () => {
  test.beforeEach('Create users via API', async () => {
    test.setTimeout(150 * 1000);
    client = await createClient({ country: country.CA.value });
    contractor = await createIndividualContractor({ country: country.ES.value });
    milestoneContractData.personalDetails.firstName = contractor.firstName;
    milestoneContractData.personalDetails.lastName = contractor.lastName;
    milestoneContractData.personalDetails.email = contractor.email;
  });

  test(
    'Client creates Milestone contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Open contract creation flow
      await loginIntoSpecificPage(page, request, client.email, password, URLS.IC_MILESTONE_CREATION);

      // Fill Personal Details - Step 1
      await fillPersonalDetailsAsClient(page, personalDetails);
      await continueToNextStep(page);

      // Fill Role details and dates - Step 2
      await fillMilestoneRolesAndDates(page, roleDetails, paymentAndMilestoneDetails);
      await continueToNextStep(page);

      // Compliance - Step 3
      await fillComplianceStep(page, compliance);
      await continueToNextStep(page);

      // Benefits and extras - Step 4
      await continueToNextStep(page);
      await removeCSATPopup(page);

      // Assert Review and sign page
      await removeCSATPopup(page);
      await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toBeEnabled();
      await expect(page.getByTestId(icReviewAndSignSelectors.contractNameClientTestId)).toHaveText(personalDetails.contractName);
      await expect(page.getByTestId(icReviewAndSignSelectors.contractTypeTestId)).toHaveText(personalDetails.contractType);
      await expect(page.getByTestId(icReviewAndSignSelectors.milestoneCurrencyTestId)).toHaveText(
        paymentAndMilestoneDetails.currency
      );
      await expect(page.locator(icReviewAndSignSelectors.milestoneName)).toHaveText(paymentAndMilestoneDetails.milestoneName);
      const amount = await page.locator(icReviewAndSignSelectors.milestoneAmount).textContent();
      const transformedAmount = transformRate(amount);
      expect(transformedAmount).toEqual(`${paymentAndMilestoneDetails.milestoneAmount}`);
    }
  );

  test(
    'Contractor creates Milestone contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Open contract creation flow
      await loginIntoSpecificPage(page, request, contractor.email, password, URLS.IC_MILESTONE_CREATION);

      // Fill Personal Details - Step 1
      await fillPersonalDetailsAsContractor(page, personalDetails);
      await continueToNextStep(page);

      // Fill Role details and dates - Step 2
      await fillMilestoneRolesAndDates(page, roleDetails, paymentAndMilestoneDetails);
      await continueToNextStep(page);

      // Compliance - Step 3
      await fillComplianceStep(page, compliance);
      await continueToNextStep(page);

      // Assert Review and sign page
      await removeCSATPopup(page);
      await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toBeEnabled();
      await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toHaveText(reviewAndSignInviteClientBtn);
      await expect(page.locator(icReviewAndSignSelectors.contractorReviewAndSignBtn)).toBeDisabled();
      await expect(page.locator(icReviewAndSignSelectors.contractNameContractor)).toHaveText(personalDetails.contractName);
      await expect(page.getByTestId(icReviewAndSignSelectors.contractTypeTestId)).toHaveText(personalDetails.contractType);
      await expect(page.getByTestId(icReviewAndSignSelectors.milestoneCurrencyTestId)).toHaveText(
        paymentAndMilestoneDetails.currency
      );
      await expect(page.locator(icReviewAndSignSelectors.milestoneName)).toHaveText(paymentAndMilestoneDetails.milestoneName);
      const amount = await page.locator(icReviewAndSignSelectors.milestoneAmount).textContent();
      const transformedAmount = transformRate(amount);
      expect(transformedAmount).toEqual(`${paymentAndMilestoneDetails.milestoneAmount}`);
    }
  );
});
