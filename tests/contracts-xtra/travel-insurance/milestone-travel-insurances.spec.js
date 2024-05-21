import { expect, test } from '@playwright/test';
import { milestoneContractData } from '../../../data/contracts-core/contract-creation';
import country from '../../../data/countries.json';
import {
  fillComplianceStep,
  fillMilestoneRolesAndDates,
  fillPersonalDetailsAsClient,
  fillPersonalDetailsAsContractor,
} from '../../../helpers/contracts-core/ic-contract-creation-flow-ui/ic-contracts-core-contract-creation-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { continueToNextStep } from '../../../helpers/shared-functions/form-functions';
import icReviewAndSignSelectors from '../../../selectors/ic-contracts-core/review-and-sign';
import travelInsuranceSelector from '../../../selectors/travel-insurance/travel-insurance-page';
import { createClient } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';
import { removeCSATPopup } from '../../../utils/remove-popups';

test.describe('Client and Contractor - Travel insurances for Milestone contracts', () => {
  const { personalDetails, roleDetails, paymentAndMilestoneDetails, compliance } = milestoneContractData;
  let client;
  let contractor;
  test.beforeEach('Create users via API', async () => {
    contractor = await createIndividualContractor({ country: country.KE.value });
    client = await createClient({ country: country.UG.value });
    milestoneContractData.personalDetails.firstName = contractor.firstName;
    milestoneContractData.personalDetails.lastName = contractor.lastName;
    milestoneContractData.personalDetails.email = contractor.email;
  });

  test(
    'Client should not add travel insurance for a milestone contract at creation @xtra-qa-front',
    {
      tag: ['@devFrontSmoke'],
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

      // Fill compliance details - Step 3
      await fillComplianceStep(page, compliance);
      await continueToNextStep(page);

      // Benefits and extras - Step 4
      await expect(page.getByText(travelInsuranceSelector.businessTravelInsuranceText)).not.toBeVisible();
      await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).not.toBeVisible();
      await expect(page.getByText(travelInsuranceSelector.yearlyInsurancePaymentText)).not.toBeVisible();
    }
  );

  test('Contractor cannot add travel insurance for milestone contracts at contract creation @xtra-qa-front', async ({
    page,
    request,
  }) => {
    await loginIntoSpecificPage(page, request, contractor.email, password, URLS.IC_MILESTONE_CREATION);

    // Fill Personal Details - Step 1
    await fillPersonalDetailsAsContractor(page, personalDetails);
    await continueToNextStep(page);

    // Fill Role details and dates - Step 2
    await fillMilestoneRolesAndDates(page, roleDetails, paymentAndMilestoneDetails);
    await continueToNextStep(page);

    // Fill compliance details - Step 3
    await fillComplianceStep(page, compliance);
    await continueToNextStep(page);

    // Benefits and extras - Step 4
    await expect(page.getByText(travelInsuranceSelector.businessTravelInsuranceText)).not.toBeVisible();
    await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).not.toBeVisible();
    await expect(page.getByText(travelInsuranceSelector.yearlyInsurancePaymentText)).not.toBeVisible();
  });

  // TODO: There is a possible bug, Xtra team need to investigate.
  test.skip('Client cannot add travel insurance for milestone contracts at contract review @xtra-qa-front', async ({
    page,
    request,
  }) => {
    // Open contract creation flow
    await loginIntoSpecificPage(page, request, client.email, password, URLS.IC_MILESTONE_CREATION);

    // Fill Personal Details - Step 1
    await fillPersonalDetailsAsClient(page, personalDetails);
    await continueToNextStep(page);

    // Fill Role details and dates - Step 2
    await fillMilestoneRolesAndDates(page, roleDetails, paymentAndMilestoneDetails);
    await continueToNextStep(page);

    // Fill compliance details - Step 3
    await fillComplianceStep(page, compliance);
    await continueToNextStep(page);

    // At the benefits and extras - Step 4
    await continueToNextStep(page);

    // Assert Review and sign page
    await removeCSATPopup(page);
    await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toBeEnabled();
    await expect(page.getByText(travelInsuranceSelector.businessTravelInsuranceText)).toBeHidden();
    await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).toBeHidden();
    await expect(page.getByText(travelInsuranceSelector.yearlyInsurancePaymentText)).toBeHidden();
  });
});
