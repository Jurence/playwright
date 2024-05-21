import equityData from '../../data/contracts-xtra/equity';
import eorEquityServiceSelectors from '../../selectors/admin/equity-service/eor-equity-service';
import equitySelector from '../../selectors/equities/equity-selectors';
import sharedSelectors from '../../selectors/shared-selectors';
import { uploadFileWithoutWaitFor } from '../shared-functions/upload-file';
import {
  fillAdditionalGrantRequirements,
  fillEquityGrantDate,
  fillEquityGrantExpirationDate,
  fillEquityGrantName,
  fillGrantCurrency,
  fillGrantExerciseCurrency,
  fillGrantExercisePrice,
  fillGrantQuantity,
  fillGrantStatus,
  fillGrantValue,
  fillVestingEffectiveDate,
  selectDocumentType,
} from './equity-base-methods';

const { finalDetailsStep, additionalInformationStep, documentDetailsStep } = equitySelector;
const { additionalInformationDetails } = equityData;
const documentToUpload = 'data/dummy-doc.pdf';

/**
 * Filling the 1st step of equity addition flow - "Grant information"
 *
 * @param {Object} grantInformationDetails - Data for filling grantInformationDetails fields
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function fillGrantInformationDetails(page, grantInformationDetails) {
  await fillEquityGrantName(page, grantInformationDetails.equityGrantName);

  // TODO Remove comment when https://letsdeel.atlassian.net/browse/XTR-3009 is fixed
  // await fillEquityType(page, grantInformationDetails.equityTypeText);
  // await fillGrantType(page, grantInformationDetails.equityGrantTypeText);
  await fillGrantStatus(page, grantInformationDetails.equityGrantStatusText);
  await fillGrantValue(page, grantInformationDetails.equityGrantValue);
  await fillGrantCurrency(page, grantInformationDetails.equityGrantCurrencyText);
  await fillGrantQuantity(page, grantInformationDetails.equityGrantQuantity);
  await fillEquityGrantDate(page, grantInformationDetails.equityGrantDate);
  await fillGrantExercisePrice(page, grantInformationDetails.equityGrantExercisePrice);
  await fillGrantExerciseCurrency(page, grantInformationDetails.equityGrantExerciseCurrencyText);
  await fillEquityGrantExpirationDate(page, grantInformationDetails.equityGrantExpirationDate);
  await fillAdditionalGrantRequirements(page, grantInformationDetails.equityAdditionalGrantRequirements);
}

/**
 * Filling the 2nd step of the equity addition flow - "Additional Information"
 *
 * @param {import('@playwright/test').Page} page
 * @param additionalInformation - Data for filling additionalInformationDetails fields
 * @returns {Promise<void>}
 */
export async function fillAdditionalInformationDetails(page, additionalInformation) {
  await fillVestingEffectiveDate(page, additionalInformation.vestingEffectiveDate);
  await page
    .getByLabel(additionalInformationStep.vestingDurationLabel)
    .fill(additionalInformationDetails.vestingDuration.toString());
  await page
    .getByLabel(additionalInformationStep.vestingIntervalsLabel)
    .fill(additionalInformationDetails.vestingIntervals.toString());
  await page.getByLabel(additionalInformationStep.cliffPeriodLabel).fill(additionalInformationDetails.cliffPeriod.toString());
}

/**
 * Filling the 3rd step of the equity addition flow - "Final Step"
 *
 * @param {import('@playwright/test').Page} page
 * @param finalInformationDetails - Data for filling finalInformationDetails fields
 * @returns {Promise<void>}
 */
export async function fillEquityFinalStepDetails(page, finalInformationDetails) {
  await page
    .getByLabel(finalDetailsStep.additionalInformationLabel)
    .fill(finalInformationDetails.equityFinalAdditionalInformation);
}

/**
 * Click Continue button for moving to the next step
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function continueToNextStep(page) {
  await page.getByTestId(equitySelector.continueBtnTestId).click();
}

/**
 * Confirms the equity addition modal is displayed.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
export async function confirmEquityAddition(page) {
  await page.getByTestId(equitySelector.equityAddedModalTestId).waitFor();
  await page.getByTestId(equitySelector.okBtnTestId).click();
}

/**
 * Filter for inactive organizations to activate the EOR equity service
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function filterForInactiveOrganization(page) {
  await page.getByTestId(eorEquityServiceSelectors.statusTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.activatedOrganizationsTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.deactivatedOrganizationsTestId).click();
  await page.getByText(sharedSelectors.showResultsText).click();
}

/**
 * Activate the Direct Grant EOR equity service for an organization
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when organization is activated.
 */
export async function activateEquityDirectGrantForOrganization(page) {
  await page.getByRole('heading', eorEquityServiceSelectors.organizationOverviewHeading).waitFor();
  await page.locator(eorEquityServiceSelectors.activateOrganizationForEquityBtn).click();
  await page.getByRole('heading', eorEquityServiceSelectors.activateDirectGrant).click();
  await page.getByTestId(eorEquityServiceSelectors.activateOrganizationTestId).click();
  await page.getByText(eorEquityServiceSelectors.organizationActivatedText).waitFor();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}

/**
 * Activate the Grant through deel EOR equity service for an organization
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when organization is activated.
 */
export async function activateOrganizationEquityGrantThroughDeel(page) {
  await page.getByRole('heading', eorEquityServiceSelectors.organizationOverviewHeading).waitFor();
  await page.locator(eorEquityServiceSelectors.activateOrganizationForEquityBtn).click();
  await page.getByRole('heading', eorEquityServiceSelectors.activateGrantThroughDeel).click();
  await page.getByTestId(eorEquityServiceSelectors.activateOrganizationTestId).click();
  await page.getByText(eorEquityServiceSelectors.organizationActivatedText).waitFor();
  await page.getByTestId(sharedSelectors.undefinedButtonOkTestId).click();
}

/**
 * Trigger the document upload flow for equity internal storage
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when upload modal appears
 */
export async function uploadInternalStorageDocument(page) {
  await page.getByRole('heading', eorEquityServiceSelectors.organizationOverviewHeading).waitFor();
  await page.getByRole('button', eorEquityServiceSelectors.uploadInternalStorageDocumentBtn).click();
  await page.getByTestId(sharedSelectors.staticModalHeaderTestId).waitFor();
}

/**
 * Confirm internal document upload
 *
 * @param {import('playwright').Page} page - The Playwright page object
 * @returns {Promise<void>}
 */
export async function confirmInternalDocumentUpload(page) {
  await page.getByRole('button', eorEquityServiceSelectors.uploadBtn).click();
}

/**
 * Fill the agreement effective date
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function fillAgreementEffectiveDate(page) {
  await page.getByLabel(documentDetailsStep.agreementEffectiveDateLabel).click();
  await page
    .getByLabel(documentDetailsStep.agreementEffectiveDateLabel)
    .getByPlaceholder(documentDetailsStep.dateFormatPlaceholder);
  await page.locator(equitySelector.dateSelector).click();
}

/**
 * Trigger the equity agreement upload flow
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when agreement upload flow is shown
 */
export async function sendEquityAgreement(page) {
  await page.getByTestId(eorEquityServiceSelectors.sendEquityAgreementTestId).click();
  await page.getByRole('heading', eorEquityServiceSelectors.sendEquityAgreementHeading).waitFor();
}

/**
 * Send signed equity agreement
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Object} documentDetails - Data for filling document details
 * @returns {Promise<void>} - A promise that resolves when signed agreement is sent
 */
export async function sendSignedEquityAgreement(page, documentDetails) {
  await page.getByTestId(eorEquityServiceSelectors.uploadSignedEquityAgreementTestId).click();
  await uploadFileWithoutWaitFor(page, sharedSelectors.uploadFileDropzone, documentToUpload);
  await page.getByTestId(eorEquityServiceSelectors.continueBtnTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.documentDetailsStepTestId).waitFor();
  await selectDocumentType(page, documentDetails.documentType);
  await fillAgreementEffectiveDate(page, documentDetails.equityAgreementEffectiveDate);
  await page.getByTestId(eorEquityServiceSelectors.uploadEquityAgreementTestId).click();
}

/**
 * Send unsigned custom equity agreement
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when signed agreement is sent
 */
export async function sendUnsignedCustomEquityAgreement(page) {
  await page.getByTestId(eorEquityServiceSelectors.uploadUnsignedEquityAgreementTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.deelGrantAddendumTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.customDeelGrantAddendumTestId).click();
  await uploadFileWithoutWaitFor(page, sharedSelectors.uploadFileDropzone, documentToUpload);
  await page.getByTestId(eorEquityServiceSelectors.continueBtnTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.reviewAndSendStepTestId).waitFor();
  await page.getByTestId(eorEquityServiceSelectors.sendUnsignedEquityAgreementTestId).click();
}

/**
 * Upload equity agreement
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when signed standard agreement is sent
 */
export async function confirmAgreementUpload(page) {
  await page.getByRole('heading', eorEquityServiceSelectors.uploadAgreementsText).waitFor();
  await page.getByTestId(eorEquityServiceSelectors.uploadOnlyTestId).click();
}

/**
 * Confirm sending standard agreement
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when signed agreement is sent
 */
export async function confirmSendingStandardAgreement(page) {
  await page.getByTestId(eorEquityServiceSelectors.agreementSentTestId).waitFor();
  await page.getByTestId(eorEquityServiceSelectors.agreementSentOkTestId).click();
}

/**
 * Upload/Send unsigned equity agreement
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when unsigned agreement is sent
 */
export async function confirmAgreementIsSent(page) {
  await page.getByTestId(eorEquityServiceSelectors.equityAgreementSentTestId).waitFor();
  await page.getByTestId(eorEquityServiceSelectors.equityAgreementOkTestId).click();
}

/**
 * Cancel agreement sign invitation
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when unsigned agreement is sent
 */
export async function cancelSignInvitation(page) {
  await page.getByTestId(eorEquityServiceSelectors.cancelInvitationTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.cancelAgreementInvitationTestId).click();
}

/**
 * Delete signed equity agreement
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when agreement is deleted
 */
export async function deleteAgreement(page) {
  await page.getByRole('button', eorEquityServiceSelectors.deleteAgreementBtn).click();
  await page.getByRole('heading', eorEquityServiceSelectors.deleteAgreementText).waitFor();
  await page.getByRole('button', eorEquityServiceSelectors.deleteBtn).click();
}
