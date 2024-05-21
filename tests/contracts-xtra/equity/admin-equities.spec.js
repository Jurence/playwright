import { expect, test } from '@playwright/test';
import equityData from '../../../data/contracts-xtra/equity';
import {
  activateEquityDirectGrantForOrganization,
  activateOrganizationEquityGrantThroughDeel,
  cancelSignInvitation,
  confirmAgreementIsSent,
  confirmAgreementUpload,
  confirmInternalDocumentUpload,
  confirmSendingStandardAgreement,
  deleteAgreement,
  sendEquityAgreement,
  sendSignedEquityAgreement,
  sendUnsignedCustomEquityAgreement,
  uploadInternalStorageDocument,
} from '../../../helpers/contracts-xtra/equities-ui';
import { sendUnsignedStandardEquityAgreement } from '../../../helpers/contracts-xtra/equity-base-methods';
import { loginAsAdminIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { uploadFileWithoutWaitFor } from '../../../helpers/shared-functions/upload-file';
import { ADMIN_TOKEN } from '../../../playwright.config';
import eorEquityServiceSelectors from '../../../selectors/admin/equity-service/eor-equity-service';
import sharedSelectors from '../../../selectors/shared-selectors';
import getInactiveOrganisationByStatusFromAdminEquityList from '../../../setup/endpoints/admin/contracts-xtra/admin-equity';
import URLS from '../../../setup/urls';
import { createRequestContextWithAuthToken } from '../../../utils/add-extra-http-headers';

const { documentDetails } = equityData;

test.describe('Managing Equities in Admin', () => {
  let adminContext;
  const documentToUpload = 'data/dummy-doc.pdf';

  test.beforeAll(async () => {
    adminContext = await createRequestContextWithAuthToken(ADMIN_TOKEN);
  });

  test.beforeEach('Filter for inactive organisation and open it', async ({ page, request }) => {
    const status = 'false';
    const organizationId = await getInactiveOrganisationByStatusFromAdminEquityList(adminContext, status);
    const urlToGo = `${URLS.EOR_EQUITY_SERVICE}/organizations/${organizationId}/overview`;
    await loginAsAdminIntoSpecificPage(request, page, urlToGo);
  });

  test('Admin can activate the direct grant equity service for an organization @xtra-qa-front', async ({ page }) => {
    // Activate the Direct Grant EOR equity service for an organization
    await activateEquityDirectGrantForOrganization(page);

    await expect(page.locator(eorEquityServiceSelectors.activateOrganizationForEquityBtn)).toBeHidden();
    await expect(page.getByTestId(eorEquityServiceSelectors.manageOrganizationEquityTestId)).toBeVisible();
    await expect(page.getByTestId(eorEquityServiceSelectors.directGrantContainerTestId)).toBeVisible();
  });

  test('Admin can activate the grant through deel equity service for an organization @xtra-qa-front', async ({ page }) => {
    // Activate the Grant through Deel EOR equity service for an organization
    await activateOrganizationEquityGrantThroughDeel(page);

    await expect(page.locator(eorEquityServiceSelectors.activateOrganizationForEquityBtn)).toBeHidden();
    await expect(page.getByTestId(eorEquityServiceSelectors.manageOrganizationEquityTestId)).toBeVisible();
    await expect(page.getByTestId(eorEquityServiceSelectors.grantThroughDeelContainerTestId)).toBeVisible();
  });

  test('Admin can upload a document for the equity internal document storage @xtra-qa-front', async ({ page }) => {
    // Upload Internal Storage Document
    await uploadInternalStorageDocument(page);
    await uploadFileWithoutWaitFor(page, sharedSelectors.uploadFileDropzone, documentToUpload);
    await confirmInternalDocumentUpload(page);

    await expect(page.getByText(eorEquityServiceSelectors.documentUploadedText)).toBeVisible();
  });

  test('Admin can upload an already signed equity agreement @xtra-qa-front', async ({ page }) => {
    // Send/Upload an already signed equity agreement
    await sendEquityAgreement(page);
    await sendSignedEquityAgreement(page, documentDetails);
    await confirmAgreementUpload(page);

    await expect(page.getByText(eorEquityServiceSelectors.agreementDocumentUploadedText)).toBeVisible();
    await expect(page.getByTestId(eorEquityServiceSelectors.serviceAgreementTestId)).toBeVisible();
  });

  test('Admin can delete an equity agreement @xtra-qa-front', async ({ page }) => {
    // Send/Upload an already signed equity agreement
    await sendEquityAgreement(page);
    await sendSignedEquityAgreement(page, documentDetails);
    await confirmAgreementUpload(page);

    // Delete equity agreement
    await deleteAgreement(page);

    await expect(page.getByText(eorEquityServiceSelectors.agreementDocumentDeletedText)).toBeHidden();
    await expect(page.getByTestId(eorEquityServiceSelectors.serviceAgreementTestId)).toBeHidden();
  });

  test('Admin can send an unsigned custom equity agreement @xtra-qa-front', async ({ page }) => {
    // Send/Upload an unsigned custom equity agreement
    await sendEquityAgreement(page);
    await sendUnsignedCustomEquityAgreement(page, documentDetails);
    await confirmAgreementIsSent(page);

    await expect(page.getByTestId(eorEquityServiceSelectors.cancelInvitationTestId)).toBeVisible();
    await expect(page.getByTestId(eorEquityServiceSelectors.agreementPendingSignatureTestId)).toBeVisible();
  });

  test('Admin can cancel sign invitation for equity agreement @xtra-qa-front', async ({ page }) => {
    // Send/Upload an unsigned custom equity agreement
    await sendEquityAgreement(page);
    await sendUnsignedCustomEquityAgreement(page, documentDetails);
    await confirmAgreementIsSent(page);
    await cancelSignInvitation(page);

    await expect(page.getByTestId(eorEquityServiceSelectors.cancelInvitationTestId)).toBeHidden();
    await expect(page.getByTestId(eorEquityServiceSelectors.agreementPendingSignatureTestId)).toBeHidden();
    await expect(page.getByTestId(eorEquityServiceSelectors.sendEquityAgreementTestId)).toBeVisible();
  });

  test('Admin can send an unsigned equity standard agreement @xtra-qa-front', async ({ page }) => {
    // Send/Upload an unsigned equity standard agreement
    await sendEquityAgreement(page);
    await sendUnsignedStandardEquityAgreement(page);
    await confirmSendingStandardAgreement(page);

    await expect(page.getByTestId(eorEquityServiceSelectors.cancelInvitationTestId)).toBeVisible();
    await expect(page.getByTestId(eorEquityServiceSelectors.agreementPendingSignatureTestId)).toBeVisible();
    await expect(page.getByTestId(eorEquityServiceSelectors.serviceAgreementTestId)).toBeVisible();
  });

  test('Admin can cancel invitation for an unsigned equity standard agreement @xtra-qa-front', async ({ page }) => {
    // Send/Upload an unsigned equity standard agreement
    await sendEquityAgreement(page);
    await sendUnsignedStandardEquityAgreement(page);
    await confirmSendingStandardAgreement(page);

    // Cancel agreement
    await cancelSignInvitation(page);

    await expect(page.getByTestId(eorEquityServiceSelectors.cancelInvitationTestId)).toBeHidden();
    await expect(page.getByTestId(eorEquityServiceSelectors.agreementPendingSignatureTestId)).toBeHidden();
    await expect(page.getByTestId(eorEquityServiceSelectors.sendEquityAgreementTestId)).toBeVisible();
  });
});
