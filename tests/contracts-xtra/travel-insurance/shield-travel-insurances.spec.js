import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import continueWithNextStep, {
  fillContractorRoleDetailsStep,
  fillPersonalDetailsStep,
  goToFixedContractPage,
} from '../../../helpers/contracts-core/ic-contract-creation-ui';
import { addTravelInsurance, removeTravelInsurance } from '../../../helpers/contracts-xtra/travel-insurance-ui';
import { selectCountry } from '../../../helpers/shared-functions/select-options';
import addShieldProtection from '../../../helpers/shield/shield-protection-ui';
import fixedContractFlowSelectors from '../../../selectors/ic/fixed-ic-contract-flow';
import travelInsuranceSelector from '../../../selectors/travel-insurance/travel-insurance-page';
import preconditionsForContractorsFlow from '../../../setup/commands/ic-contracts-core/ic-contract-creation';

const { personalDetailsStep, paymentAndDatesStep } = fixedContractFlowSelectors;

test.describe(
  'Travel insurances for shielded contracts',
  {
    tag: ['@devFrontSmoke'],
  },
  () => {
    const yearlyInsuranceFee = '290.00';
    const testData = {
      taxResidenceCountry: country.UG.label,
      seniorityLevel: 'Senior (Individual Contributor Level 3)',
      predefinedJobScope: 'Designer',
      paymentRate: '15000',
    };

    test.beforeEach('Generate new Client and go to the Fixed Contract Page', async ({ page, request }) => {
      test.setTimeout(150 * 1000);
      await preconditionsForContractorsFlow(page, request);
      await goToFixedContractPage(page);
    });

    test(
      `Client should be able to add travel insurance to a shield contract @xtra-qa-front`,
      {
        tag: ['@slowRegression'],
      },
      async ({ page }) => {
        // Fill Personal details from Step 1
        await fillPersonalDetailsStep(page);

        // Select contractor tax residence
        await selectCountry(
          page,
          testData.taxResidenceCountry,
          personalDetailsStep.contractorTaxResidenceLabel,
          personalDetailsStep.contractorTaxResidenceTestId
        );
        await continueWithNextStep(page);

        // Fill Role details information from Step 2
        await fillContractorRoleDetailsStep(page, testData.predefinedJobScope, testData.seniorityLevel);
        await continueWithNextStep(page);
        await page.getByLabel(paymentAndDatesStep.paymentRateLabel).fill(testData.paymentRate);
        await continueWithNextStep(page);

        // Select Add shield protection from Step 4
        await addShieldProtection(page);
        await continueWithNextStep(page);

        // Add travel insurance from Step 5
        await addTravelInsurance(page);
        await expect(page.locator(travelInsuranceSelector.confirmTravelInsuranceAddition)).toBeVisible();
        await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).toBeVisible();
        await expect(page.getByRole('heading', { name: yearlyInsuranceFee })).toBeVisible();
        await expect(page.getByText(travelInsuranceSelector.yearlyInsurancePaymentText)).toBeVisible();
      }
    );

    test(
      `Client should be able to remove travel insurance to a shield contract @xtra-qa-front`,
      {
        tag: ['@slowRegression'],
      },
      async ({ page }) => {
        // Fill Personal details from Step 1
        await fillPersonalDetailsStep(page);

        // Select contractor tax residence
        await selectCountry(
          page,
          testData.taxResidenceCountry,
          personalDetailsStep.contractorTaxResidenceLabel,
          personalDetailsStep.contractorTaxResidenceTestId
        );
        await continueWithNextStep(page);

        // Fill Role details information from Step 2
        await fillContractorRoleDetailsStep(page, testData.predefinedJobScope, testData.seniorityLevel);
        await continueWithNextStep(page);
        await page.getByLabel(paymentAndDatesStep.paymentRateLabel).fill(testData.paymentRate);
        await continueWithNextStep(page);

        // Select Add shield protection from Step 4
        await addShieldProtection(page);
        await continueWithNextStep(page);

        // Add travel insurance from Step 5
        await addTravelInsurance(page);

        await removeTravelInsurance(page);
        await expect(page.getByText(travelInsuranceSelector.travelInsuranceRemovedText)).toBeVisible();
        await expect(page.getByTestId(travelInsuranceSelector.addTravelInsuranceBtnTestId)).toBeVisible();
        await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).not.toBeVisible();
      }
    );
  }
);
