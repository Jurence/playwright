import { expect } from '@playwright/test';
import { contractsCore } from '../../data/texts';
import icReviewAndSignSelectors from '../../selectors/ic-contracts-core/review-and-sign';
import sharedSelectors from '../../selectors/shared-selectors';

/**
 * Invite another client to sign the contract
 *
 * @param {import('@playwright/test').Page} page
 * @param clientName - The client name which will be assigned to sign the contract
 * @returns {Promise<void>}
 */
export async function inviteMemberToSign(page, clientName) {
  await page.getByText(icReviewAndSignSelectors.inviteMemberToSignText).click();
  await page.getByRole('heading', { name: clientName }).click();
  await page.getByRole('button', { name: icReviewAndSignSelectors.inviteMemberToSignPopup.reviewInvitationButton }).click();
  await page.getByRole('button', { name: icReviewAndSignSelectors.inviteMemberToSignPopup.sendInvitationButton }).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}

/**
 * Invite contractor to sign the contract
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function inviteContractor(page) {
  await page.getByRole('button', icReviewAndSignSelectors.inviteContactorButton).click();
  await page.getByTestId(icReviewAndSignSelectors.sendInviteButtonTestId).click();
  await page.getByTestId(icReviewAndSignSelectors.sendInviteButtonTestId).waitFor({ state: 'hidden' });
}

/**
 * Review and sign contract
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function reviewAndSign(page) {
  await page.getByRole('button', icReviewAndSignSelectors.reviewAndSignBtn).click();
  await page.getByTestId(icReviewAndSignSelectors.agreeAndSignButtonTestId).click();
}

/**
 * Switch signing order
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function switchSigningOrder(page) {
  await page.getByRole('button', icReviewAndSignSelectors.switchSigningOrderButton).click();
  await page.getByRole('progressbar').waitFor({ state: 'hidden' });
}

/**
 * Get invitation link
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function getInvitationLink(page) {
  return page.getByText(icReviewAndSignSelectors.copyInvitationLinkText).getAttribute('aria-label');
}

/**
 * Get email of invited contractor
 *
 * @param {import('@playwright/test').Page} page
 * @returnsimport sharedSelectors from '../../../selectors/shared-selectors';
 {Promise<void>}
 */
export async function getInvitedUserEmail(page) {
  return page.getByTestId(icReviewAndSignSelectors.invitedUserTestId).textContent();
}

/**
 * Cancel unsigned contract from Signing page
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function cancelContractFromSigningPage(page) {
  await page.getByTestId(icReviewAndSignSelectors.actionButtonTestId).click();
  await page.getByText(icReviewAndSignSelectors.cancelContractText).click();
  await page.getByTestId(icReviewAndSignSelectors.confirmCancelContractTestId).click();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}

/**
 * Assert that the canceled contract is in the right status and cannot be signed, but can be returned to "Active" status again
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function assertContractCanceledByClient(page) {
  await expect(page.locator(icReviewAndSignSelectors.clientReviewAndSignBtn)).toBeDisabled();
  await expect(page.locator(icReviewAndSignSelectors.reinstateBannerHeader)).toHaveText(contractsCore.reinstateBannerHeader);
  await expect(page.getByTestId(icReviewAndSignSelectors.reinstateBannerDeleteBtnTestId)).toBeEnabled();
  await expect(page.getByTestId(icReviewAndSignSelectors.reinstateBannerReinstateBtnTestId)).toBeEnabled();
  await expect(page.getByText(icReviewAndSignSelectors.canceledContractChipText)).toBeVisible();
}
