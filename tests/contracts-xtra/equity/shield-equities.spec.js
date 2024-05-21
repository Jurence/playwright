import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import continueWithNextStep, {
  fillContractorRoleDetailsStep,
  fillPersonalDetailsStep,
  goToFixedContractPage,
} from '../../../helpers/contracts-core/ic-contract-creation-ui';
import { selectCountry } from '../../../helpers/shared-functions/select-options';
import addShieldProtection from '../../../helpers/shield/shield-protection-ui';
import equitySelector from '../../../selectors/equities/equity-selectors';
import fixedContractFlowSelectors from '../../../selectors/ic/fixed-ic-contract-flow';
import preconditionsForContractorsFlow from '../../../setup/commands/ic-contracts-core/ic-contract-creation';

const { personalDetailsStep, paymentAndDatesStep } = fixedContractFlowSelectors;

test.describe(
  'Equities for shielded contracts',
  {
    tag: ['@devFrontSmoke'],
  },
  () => {
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
      `Client should not be able to add equity to a shield contract @xtra-qa-front`,
      {
        tag: ['@devFrontSmoke, @slowRegression'],
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

        // Confirm equity is not add-able from Step 5
        await expect(page.getByTestId(equitySelector.addEquityBtnTestId)).not.toBeVisible();
        await expect(page.locator(equitySelector.removeEquityIcon)).not.toBeVisible();
        await expect(page.getByText(equitySelector.equityStatusText)).not.toBeVisible();
      }
    );
  }
);
