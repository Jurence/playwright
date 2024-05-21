import { test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  addLeaseEquipment,
  assertLeasedEquipmentAddition,
  assertLeasedEquipmentRemoval,
  removeLeasedEquipment,
} from '../../../helpers/contracts-xtra/leased-equipment-ui';
import { goToEORContractPage, preconditionsForEORFlow } from '../../../helpers/eor/eor-contract-creation-ui';
import fillEorContractDetailsUntilExtrasStep from '../../../helpers/eor/fillEorDetails-ui';
import eorEmployeeContractFlowSelectors from '../../../selectors/eor/eor-employee-contract-flow';
import { removeCSATPopup } from '../../../utils/remove-popups';

test.describe('Client - Leased equipment for EOR contracts', () => {
  const { masterServiceAgreement } = eorEmployeeContractFlowSelectors;
  const testData = {
    homeCountry: country.UG.label,
    workCountry: country.UG.label,
    seniority: 'Director',
    jobTitle: 'Area Manager',
    predefinedJobScope: 'Designer',
    compensation: '250000',
    hofyDevice: {
      type: 'Laptops',
      name: 'Apple MacBook Pro 14.2", 10C',
    },
  };

  test.beforeEach(async ({ page, request }) => {
    test.setTimeout(90 * 1000);

    await preconditionsForEORFlow(page, request);
    await goToEORContractPage(page);
  });

  test(`Client can add leased equipment to an EOR contract during creation - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`, async ({
    page,
  }) => {
    await fillEorContractDetailsUntilExtrasStep(page, testData);

    await addLeaseEquipment(page, testData.hofyDevice);

    await assertLeasedEquipmentAddition(page);
  });

  test(`Client can remove leased equipment from an EOR contract during creation - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`, async ({
    page,
  }) => {
    await fillEorContractDetailsUntilExtrasStep(page, testData);

    await addLeaseEquipment(page, testData.hofyDevice);
    await removeLeasedEquipment(page);

    await assertLeasedEquipmentRemoval(page);
  });

  test(`Client can add leased equipment to an EOR contract at quote review - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`, async ({
    page,
  }) => {
    await fillEorContractDetailsUntilExtrasStep(page, testData);

    // Generate Quote
    await removeCSATPopup(page);
    await page.getByTestId(eorEmployeeContractFlowSelectors.generateQuoteTestId).first().click();
    await page.getByRole('heading', masterServiceAgreement.msaCardHeading).waitFor();

    // Add Lease equipment
    await addLeaseEquipment(page, testData.hofyDevice);

    await assertLeasedEquipmentAddition(page);
  });

  test(`Client can remove leased equipment from an EOR contract at quote review - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`, async ({
    page,
  }) => {
    await fillEorContractDetailsUntilExtrasStep(page, testData);

    // Generate Quote
    await removeCSATPopup(page);
    await page.getByTestId(eorEmployeeContractFlowSelectors.generateQuoteTestId).first().click();
    await page.getByRole('heading', masterServiceAgreement.msaCardHeading).waitFor();

    // Add Lease Equipment
    await addLeaseEquipment(page, testData.hofyDevice);

    // Remove Leased Equipment
    await removeLeasedEquipment(page);

    await assertLeasedEquipmentRemoval(page);
  });
});
