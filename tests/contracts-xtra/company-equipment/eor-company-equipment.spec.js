import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import addCompanyEquipment from '../../../helpers/contracts-xtra/company-equipment-ui';
import { goToEORContractPage, preconditionsForEORFlow } from '../../../helpers/eor/eor-contract-creation-ui';
import fillEorContractDetailsUntilExtrasStep from '../../../helpers/eor/fillEorDetails-ui';
import companyEquipmentSelector from '../../../selectors/company-equipment/company-equipment-page';

test.describe('Client - Company equipment for EOR contracts', () => {
  const testData = {
    homeCountry: country.UG.label,
    workCountry: country.UG.label,
    seniority: 'Director',
    jobTitle: 'Area Manager',
    predefinedJobScope: 'Designer',
    compensation: '250000',
  };

  test.beforeEach(async ({ page, request }) => {
    test.setTimeout(90 * 1000);

    await preconditionsForEORFlow(page, request);
    await goToEORContractPage(page);
  });

  test(`Client can add company owned equipment to an EOR contract during creation - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`, async ({
    page,
  }) => {
    await fillEorContractDetailsUntilExtrasStep(page, testData);

    await addCompanyEquipment(page, 'Tablet');

    await expect(page.getByTestId(companyEquipmentSelector.addEquipmentTestId)).toBeVisible();
    await expect(page.getByRole('heading', companyEquipmentSelector.companyOwnedEquipmentHeading)).toBeVisible();
    await expect(page.getByRole('button', companyEquipmentSelector.editBtn)).toBeVisible();
  });
});
