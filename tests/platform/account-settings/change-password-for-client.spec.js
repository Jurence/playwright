import { expect, test } from '@playwright/test';
import { enterVerificationCode, fillPasswordForm, openChangePasswordModal } from '../../../helpers/platform/account-settings-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import accountSettingsSecurity from '../../../selectors/account-settings/account-settings-security';
import { createClient } from '../../../setup/commands/create-client';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';

const { changePasswordModal, passwordUpdatedModal } = accountSettingsSecurity;

test.describe('Change password for client', () => {
  let clientEmail;
  const newPassword = 'Test_098765';

  test.beforeEach(async ({ page, request }) => {
    clientEmail = (await createClient()).email;
    await loginIntoSpecificPage(page, request, clientEmail, password, URLS.ACCOUNT_SETTINGS_SECURITY);
  });

  test(`Client changes account password @platform-qa-front`, async ({ page }) => {
    // Change Password
    await openChangePasswordModal(page);
    await fillPasswordForm(page, password, newPassword);
    await enterVerificationCode(page);

    // Get Modal title text
    const passwordUpdatedModalTitle = await page.getByTestId(passwordUpdatedModal.modalHeadingTestId).textContent();

    // Check password changed
    await page.getByTestId(passwordUpdatedModal.okButtonTestId).click();
    await openChangePasswordModal(page);
    await fillPasswordForm(page, password, newPassword);
    const validationError = page.getByTestId(changePasswordModal.validationErrorTestId);

    expect(passwordUpdatedModalTitle).toContain(passwordUpdatedModal.modalHeadingText);
    await expect(validationError).toHaveText(changePasswordModal.incorrectPasswordErrorText);
  });
});
