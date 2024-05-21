import icTerminationFlow from '../../selectors/ic-contracts-core/termination';
import sharedSelectors from '../../selectors/shared-selectors';

/**
 * Reactivate terminated IC contract
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */

export default async function reactivateEndedContract(page) {
  await page
    .getByTestId(icTerminationFlow.terminationBannerTestId)
    .getByRole('button', icTerminationFlow.reactivateContractButton)
    .click();
  await page.getByLabel(icTerminationFlow.reactivationCheckboxLabel).check();
  await page.getByRole('button', icTerminationFlow.finishReactivationButton).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}
