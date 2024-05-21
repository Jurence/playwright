import icInvoiceImmutabilitySelectors from '../../selectors/ic-contracts-core/invoice-immutability';
import sharedSelectors from '../../selectors/shared-selectors';

/**
 * Finalize early the invoice with the due date in the future
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function finalizeInvoiceEarly(page) {
  await page.getByRole('button', icInvoiceImmutabilitySelectors.finalizeEarlyButton).click();
  await page.getByTestId(sharedSelectors.undefinedModalCloseButtonTestId).click();
}

/**
 * Remove payment item from finalized invoice
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function removePaymentItem(page) {
  await page.locator(icInvoiceImmutabilitySelectors.paymentItemCheckBox).check();
  await page.getByTestId(icInvoiceImmutabilitySelectors.removeAllItemsBtnTestId).click();
  await page.getByRole('button', icInvoiceImmutabilitySelectors.confirmRemoveButton).click();
}
