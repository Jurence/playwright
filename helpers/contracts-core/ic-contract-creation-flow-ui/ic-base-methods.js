import icContractCreationSelectors from '../../../selectors/ic-contracts-core/contract-creation';

const { roleDetailsStep, paymentAndDatesStep, complianceStep } = icContractCreationSelectors;

/**
 * Fill Seniority Level
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} seniority - Seniority level
 * @returns {Promise<void>}
 */
export async function fillSeniorityLevel(page, seniority) {
  await page.locator(roleDetailsStep.seniorityLevel).click();
  await page.getByText(seniority).click();
}

/**
 * Fill Scope Of Work
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} sow - Scope Of Work
 * @returns {Promise<void>}
 */
export async function fillScopeOfWork(page, sow) {
  await page.getByLabel(roleDetailsStep.sowInputLabel).fill(sow);
}

/**
 * Select Currency from dropdown
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} currency - Currency
 * @returns {Promise<void>}
 */
export async function fillCurrency(page, currency) {
  await page.locator(paymentAndDatesStep.currencySelector).click();
  await page.getByText(currency).click();
}

/**
 * Fill Payment Rate
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} paymentRate - Amount of Payment Rate
 * @returns {Promise<void>}
 */
export async function fillRate(page, paymentRate) {
  await page.locator(paymentAndDatesStep.contractRate).fill(`${paymentRate}`);
}

/**
 * Fill Special Clause
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} specialClause - Text for Special Clause
 * @returns {Promise<void>}
 */
export async function fillSpecialClause(page, specialClause) {
  await page.getByLabel(complianceStep.specialClauseInput).fill(specialClause);
}

/**
 * Select Invoice Cycle from dropdown
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} invoiceCycle - Invoice Cycle
 * @returns {Promise<void>}
 */
export async function selectInvoiceCycle(page, invoiceCycle) {
  await page.getByTestId(paymentAndDatesStep.invoiceCycleTestId).click();
  await page.getByText(invoiceCycle, { exact: true }).click();
}

/**
 * Select Payment Frequency from dropdown
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} paymentFrequency - Payment Frequency
 * @returns {Promise<void>}
 */
export async function selectPaymentFrequency(page, paymentFrequency) {
  await page.getByLabel(paymentAndDatesStep.paymentFrequencyLabel).click();
  await page.getByText(paymentFrequency).click();
}
