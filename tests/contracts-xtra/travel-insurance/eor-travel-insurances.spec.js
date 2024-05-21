import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import { addTravelInsurance, removeTravelInsurance } from '../../../helpers/contracts-xtra/travel-insurance-ui';
import { goToEORContractPage, preconditionsForEORFlow } from '../../../helpers/eor/eor-contract-creation-ui';
import fillEorContractDetailsUntilExtrasStep from '../../../helpers/eor/fillEorDetails-ui';
import eorEmployeeContractFlowSelectors from '../../../selectors/eor/eor-employee-contract-flow';
import travelInsuranceSelector from '../../../selectors/travel-insurance/travel-insurance-page';
import { removeCSATPopup } from '../../../utils/remove-popups';

const { masterServiceAgreement } = eorEmployeeContractFlowSelectors;

test.describe('Client and Employee - Travel insurances for EOR contracts', () => {
  const yearlyInsuranceFee = '290.00';
  const testData = {
    homeCountry: country.UG.label,
    workCountry: country.UG.label,
    seniority: 'Director',
    jobTitle: 'Area Manager',
    predefinedJobScope: 'Designer',
    compensation: '250000',
  };

  test.beforeEach(async ({ page, request }) => {
    test.setTimeout(150 * 1000);

    await preconditionsForEORFlow(page, request);
    await goToEORContractPage(page);
  });

  test(
    `Client can add travel insurance to an EOR during contract creation - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`,
    {
      tag: ['@devFrontSmoke', '@slowRegression'],
    },
    async ({ page }) => {
      await fillEorContractDetailsUntilExtrasStep(page, testData);

      await addTravelInsurance(page);
      await expect(page.locator(travelInsuranceSelector.confirmTravelInsuranceAddition)).toBeVisible();
      await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).toBeVisible();
      await expect(page.getByRole('heading', { name: yearlyInsuranceFee })).toBeVisible();
      await expect(page.getByText(travelInsuranceSelector.yearlyInsurancePaymentText)).toBeVisible();
    }
  );

  test(
    `Client can remove travel insurance for an EOR during contract creation - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`,
    {
      tag: ['@devFrontSmoke', '@slowRegression'],
    },
    async ({ page }) => {
      await fillEorContractDetailsUntilExtrasStep(page, testData);

      await addTravelInsurance(page);

      await removeTravelInsurance(page);
      await expect(page.getByText(travelInsuranceSelector.travelInsuranceRemovedText)).toBeVisible();
      await expect(page.getByTestId(travelInsuranceSelector.addTravelInsuranceBtnTestId)).toBeVisible();
      await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).not.toBeVisible();
    }
  );

  test(
    `Client can add travel insurance to an EOR at quote review - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`,
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await fillEorContractDetailsUntilExtrasStep(page, testData);

      // Generate Quote
      await removeCSATPopup(page);
      await page.getByTestId(eorEmployeeContractFlowSelectors.generateQuoteTestId).first().click();
      await page.getByRole('heading', masterServiceAgreement.msaCardHeading).waitFor();

      // Add Travel Insurance
      await addTravelInsurance(page);
      await expect(page.locator(travelInsuranceSelector.confirmTravelInsuranceAddition)).toBeVisible();
      await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).toBeVisible();
      await expect(page.getByRole('heading', { name: yearlyInsuranceFee })).toBeVisible();
      await expect(page.getByText(travelInsuranceSelector.yearlyInsurancePaymentText)).toBeVisible();
    }
  );

  test(
    `Client can remove travel insurance from an EOR at quote review - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`,
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await fillEorContractDetailsUntilExtrasStep(page, testData);

      // Generate Quote
      await removeCSATPopup(page);
      await page.getByTestId(eorEmployeeContractFlowSelectors.generateQuoteTestId).first().click();
      await page.getByRole('heading', masterServiceAgreement.msaCardHeading).waitFor();

      // Add Travel Insurance
      await addTravelInsurance(page);

      // Remove Travel insurance
      await removeTravelInsurance(page);
      await expect(page.getByText(travelInsuranceSelector.travelInsuranceRemovedText)).toBeVisible();
      await expect(page.getByTestId(travelInsuranceSelector.addTravelInsuranceBtnTestId)).toBeVisible();
      await expect(page.getByTestId(travelInsuranceSelector.removeTravelInsuranceTestId)).not.toBeVisible();
    }
  );
});
