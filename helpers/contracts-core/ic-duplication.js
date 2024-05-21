import { expect } from '@playwright/test';
import icDuplicationSelectors from '../../selectors/ic-contracts-core/duplication';
import icReviewAndSignSelectors from '../../selectors/ic-contracts-core/review-and-sign';
import sharedSelectors from '../../selectors/shared-selectors';
import { transformRate } from '../../utils/string-utilities';

/**
 * Open duplication flow for IC
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function openDuplicationFlow(page) {
  await page.getByTestId(icDuplicationSelectors.actionButtonTestId).click();
  await page.getByTestId(icDuplicationSelectors.duplicateContractBtnTestId).click();
}

/**
 * Duplicate Fixed IC contract using Custom Amount for First Payment
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} customAmount - First payment custom amount for the new duplicated contract
 * @returns {Promise<void>}
 */
export async function duplicateFixedContractWithCustomAmount(page, customAmount) {
  await page.getByTestId(sharedSelectors.nextButtonTestId).click();
  await page.getByTestId(icDuplicationSelectors.customAmountTabTestId).click();
  await page.getByLabel(icDuplicationSelectors.customAmountFieldLabel).fill(`${customAmount}`);
  await page.getByTestId(icDuplicationSelectors.finishDuplicationBtnTestId).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}

/**
 * Duplicate PAYG IC contract
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function duplicatePaygContract(page) {
  await page.getByTestId(sharedSelectors.nextButtonTestId).click();
  await page.getByTestId(icDuplicationSelectors.finishDuplicationBtnTestId).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}

/**
 * Duplicate Milestone IC contract
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function duplicateMilestoneContract(page) {
  await page.getByTestId(icDuplicationSelectors.finishDuplicationBtnTestId).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}

/**
 * Assert data of the duplicated Fixed contract
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} contractData - Expected data for the duplicated contract
 * @param {string} contractData.contract.name - Name of the initial and duplicated contract
 * @param {string} contractData.contract.scope - SOW of of the initial and duplicated contract
 * @param {string} contractData.contract.jobTitleName - Job title of the initial and duplicated contract
 * @param {string} contractData.contract.rate - Rate of the initial and duplicated contract
 * @param {string} customAmount - First payment custom amount of the duplicated contract
 * @returns {Promise<void>}
 */
export async function assertDuplicatedFixedContract(page, contractData, customAmount) {
  await expect(page.getByTestId(icReviewAndSignSelectors.contractNameTestId)).toHaveText(`${contractData.contract.name} 2`);
  await expect(page.locator(icReviewAndSignSelectors.scopeText)).toHaveText(contractData.contract.scope);
  await expect(page.getByTestId(icReviewAndSignSelectors.jobTileTestId)).toHaveText(contractData.contract.jobTitleName);

  // Assert total rate
  const amount = await page.getByTestId(icReviewAndSignSelectors.fixedRateTestId).textContent();
  const transformedAmount = transformRate(amount);
  expect(transformedAmount).toEqual(`${contractData.contract.rate}`);

  // Assert First payment amount
  const firtsPaymentAmount = await page.getByTestId(icReviewAndSignSelectors.firstPaymentAmountTestId).textContent();
  const transformedfirtsPaymentAmount = transformRate(firtsPaymentAmount);
  expect(transformedfirtsPaymentAmount).toEqual(`${customAmount}`);
}

/**
 * Assert data of the duplicated PAYG contract
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} contractData - Expected data for the duplicated contract
 * @param {string} contractData.contract.name - Name of the initial and duplicated contract
 * @param {string} contractData.contract.scope - SOW of of the initial and duplicated contract
 * @param {string} contractData.contract.jobTitleName - Job title of the initial and duplicated contract
 * @param {string} contractData.contract.terminationNoticeDays - Notice period of the initial and duplicated contract
 * @param {string} contractData.contract.rate - Rate of the initial and duplicated contract
 * @returns {Promise<void>}
 */
export async function assertDuplicatedPaygContract(page, contractData) {
  await expect(page.getByTestId(icReviewAndSignSelectors.contractNameTestId)).toHaveText(`${contractData.contract.name} 2`);
  await expect(page.locator(icReviewAndSignSelectors.scopeText)).toHaveText(contractData.contract.scope);
  await expect(page.getByTestId(icReviewAndSignSelectors.jobTileTestId)).toHaveText(contractData.contract.jobTitleName);
  await expect(page.getByTestId(icReviewAndSignSelectors.noticePeriodTestId)).toHaveText(
    `${contractData.contract.terminationNoticeDays} Days`
  );

  // Assert total rate
  await expect(page.getByTestId(icReviewAndSignSelectors.fixedRateTestId)).toContainText(`${contractData.contract.rate}`);
}

/**
 * Assert data of the duplicated Milestone contract
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} contractData - Expected data for the duplicated contract
 * @param {string} contractData.contract.name - Name of the initial and duplicated contract
 * @param {string} contractData.contract.scope - SOW of of the initial and duplicated contract
 * @param {string} contractData.contract.jobTitleName - Job title of the initial and duplicated contract
 * @param {string} contractData.contract.currency - Currency of the initial and duplicated contract
 * @param {string} contractData.contract.milestoneAmount - Milestone amount of the initial and duplicated contract
 * @param {string} contractData.contract.milestoneTitle - Milestone name in the initial and duplicated contract
 * @returns {Promise<void>}
 */
export async function assertDuplicatedMilestoneContract(page, contractData) {
  await expect(page.getByTestId(icReviewAndSignSelectors.contractNameTestId)).toHaveText(`${contractData.contract.name} 2`);
  await expect(page.locator(icReviewAndSignSelectors.scopeText)).toHaveText(contractData.contract.scope);
  await expect(page.getByTestId(icReviewAndSignSelectors.jobTileTestId)).toHaveText(contractData.contract.jobTitleName);
  await expect(page.getByTestId(icReviewAndSignSelectors.milestoneCurrencyTestId)).toHaveText(contractData.contract.currency);
  await expect(page.locator(icReviewAndSignSelectors.milestoneAmount)).toContainText(`${contractData.contract.milestoneAmount}`);
  await expect(page.locator(icReviewAndSignSelectors.milestoneName)).toHaveText(contractData.contract.milestoneTitle);
}
