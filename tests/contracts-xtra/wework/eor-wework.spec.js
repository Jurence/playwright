import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  addWeworkAccessOnContractPage,
  completeWeworkAccess,
  removeWeworkAccess,
} from '../../../helpers/contracts-xtra/wework-ui';
import { goToEORContractPage, preconditionsForEORFlow } from '../../../helpers/eor/eor-contract-creation-ui';
import fillEorContractDetailsUntilExtrasStep from '../../../helpers/eor/fillEorDetails-ui';
import weworkSelector from '../../../selectors/wework/wework-page';

test.describe('Client and Employee - Wework for EOR contracts', () => {
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
    `Client can add wework access to an EOR contract during creation - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`,
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await fillEorContractDetailsUntilExtrasStep(page, testData);

      await addWeworkAccessOnContractPage(page);
      await completeWeworkAccess(page);

      await expect(page.getByTestId(weworkSelector.addWeworkAccessTestId)).toBeHidden();
      await expect(page.getByLabel(weworkSelector.removeWeworkAccessLabel)).toBeVisible();
    }
  );

  test(
    `Client can remove wework access from an EOR contract during creation - ${testData.homeCountry} to ${testData.workCountry} @xtra-qa-front`,
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await fillEorContractDetailsUntilExtrasStep(page, testData);

      await addWeworkAccessOnContractPage(page);
      await completeWeworkAccess(page);
      await removeWeworkAccess(page);

      await expect(page.getByTestId(weworkSelector.addWeworkAccessTestId)).toBeVisible();
      await expect(page.getByLabel(weworkSelector.removeWeworkAccessLabel)).toBeHidden();
    }
  );
});
