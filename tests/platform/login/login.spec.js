import { expect, test } from '@playwright/test';
import {
  completeLogin,
  fillEmailAndPassword,
  loginViaEmailAndPassword,
  navigateToLoginPage,
} from '../../../helpers/platform/login-ui';
import { continueWithoutSetup, skipSuggestionModal } from '../../../helpers/platform/setup-authenticator-ui';
import loginSelectors from '../../../selectors/login/login';
import setupAuthenticatorSelectors from '../../../selectors/login/setup-authenticator';
import appDashboardMenuSelectors from '../../../selectors/navigation-menu/app-dashboard-menu';
import { createClient } from '../../../setup/commands/create-client';
import { password } from '../../../setup/constants';
import { blockPopups } from '../../../utils/remove-popups';

const { suggestionModal } = setupAuthenticatorSelectors;
const { loginForm } = loginSelectors;

test.describe('Client login', () => {
  let clientEmail;

  test.beforeAll(async () => {
    clientEmail = (await createClient()).email;
  });
  test.beforeEach(async ({ page }) => {
    await navigateToLoginPage(page);
    await blockPopups(page);
  });

  test(`Client logins successfully and redirects to Setup Authenticator page @platform-qa-front`, async ({ page }) => {
    await loginViaEmailAndPassword(page, clientEmail, password);

    // Assert Setup Authenticator page
    await expect(page.getByRole('heading', setupAuthenticatorSelectors.pageHeading)).toBeVisible();
    await expect(page.getByRole('button', setupAuthenticatorSelectors.getSetUpButton)).toBeEnabled();
    await expect(page.getByRole('button', setupAuthenticatorSelectors.continueWithoutSetupButton)).toBeEnabled();
    await expect(page.getByRole('button', setupAuthenticatorSelectors.logoutButton)).toBeEnabled();
  });

  test(`Client skips Setup Authenticator page successfully and observes Suggestion modal @platform-qa-front`, async ({
    page,
  }) => {
    await loginViaEmailAndPassword(page, clientEmail, password);
    await continueWithoutSetup(page);

    // Assert Suggestion modal
    const modal = page.locator(suggestionModal.rootElement);
    const modalTitle = modal.getByRole('heading', suggestionModal.modalTitleText);
    const continueButton = modal.getByRole('button', suggestionModal.continueWithoutSetupButton);
    const setupButton = modal.getByRole('button', suggestionModal.setUpAuthenticatorButton);
    const checkBox = modal.locator(suggestionModal.dontShowAgainCheckbox);

    await expect(modal).toBeVisible();
    await expect(modalTitle).toBeVisible();
    await expect(continueButton).toBeEnabled();
    await expect(checkBox).toBeEnabled();
    await expect(setupButton).toBeEnabled();
  });

  test(`Client skips Suggestion modal and redirects to Home page @platform-qa-front`, async ({ page }) => {
    await loginViaEmailAndPassword(page, clientEmail, password);

    await continueWithoutSetup(page);
    await skipSuggestionModal(page);

    // Assert Home page
    await expect(page.getByRole('heading', appDashboardMenuSelectors.welcomeToDeelHeading)).toBeEnabled();
  });

  test(`Client gets error after login with wrong password @platform-qa-front`, async ({ page }) => {
    const wrongPassword = 'WrongPassword1!';
    await fillEmailAndPassword(page, clientEmail, wrongPassword);
    await completeLogin(page);

    // Assert error after login with wrong email
    await expect(page.locator(loginForm.loginError)).toBeVisible();
    await expect(page.locator(loginForm.loginError)).toHaveText(loginForm.wrongPasswordErrorText);
  });
});
