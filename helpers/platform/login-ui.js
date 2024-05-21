import { ADMIN_TOKEN, ADMIN_URL } from '../../playwright.config';
import loginSelectors from '../../selectors/login/login';
import { loginAPI, loginAsAdminAPI } from '../../setup/endpoints/login/login';
import URLS from '../../setup/urls';
import configPage from '../../utils/config-page';
import { loadingScreenIsHidden } from '../shared-functions/general-functions';

const { loginForm } = loginSelectors;

/**
 * Log in as an admin user.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when the login is successful.
 */
export async function loginAsAdmin(page) {
  await page.goto(`${ADMIN_URL}/setup?token=${ADMIN_TOKEN}`);
}

/**
 * Log in to a Deel App using the provided email and password credentials.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} emailCredentials - The email credentials to use for logging in.
 * @param {string} passwordCredentials - The password credentials to use for logging in.
 * @returns {Promise<void>}
 */
export async function login(page, emailCredentials, passwordCredentials) {
  await page.getByPlaceholder(loginForm.emailPlaceholder).fill(emailCredentials);
  await page.getByLabel(loginForm.passwordLabel).fill(passwordCredentials);
  await page.getByRole('button', { name: 'log in', exact: true }).click();
}

/**
 * Log via the API into a specific page using the provided email and password credentials.
 *
 * @param {Object} request - The request object.
 * @param {string} emailCredentials - The email credentials.
 * @param {string} passwordCredentials - The password credentials.
 * @param {string} pageUrl - The URL of the page to navigate to.
 * @returns {Promise<string>} - A promise that resolves when the login process is complete and returns the token for the given user.
 */
export async function loginIntoSpecificPage(page, request, emailCredentials, passwordCredentials, pageUrl) {
  const token = await loginAPI(request, emailCredentials, passwordCredentials);
  await configPage(page, token);

  await page.goto(pageUrl);
  await loadingScreenIsHidden(page);

  return token;
}

/**
 * Log via the API into a specific page using the client token. This comes from the dotenv file, from the CLIENT_TOKEN variable.
 *
 * This method uses the client token to log in, so you don't need to provide email and password credentials.
 * This method takes the default test user (client) created before running all the tests in the global config and logs in with it and then navigates to the provided page URL.
 *
 * @param {Object} request - The request object.
 * @param {Object} token - The client token.
 * @param {string} pageUrl - The URL of the page to navigate to.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
export async function loginIntoSpecificPageUsingDefaultClient(page, token, pageUrl) {
  await configPage(page, token);

  await page.goto(pageUrl);
  await loadingScreenIsHidden(page);
}

/**
 * Log via the API into a specific page with an admin User.
 *
 * @param {Object} apiContext - The API context..
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} pageUrl - The URL of the page to navigate to.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
export async function loginAsAdminIntoSpecificPage(apiContext, page, pageUrl) {
  const token = await loginAsAdminAPI(apiContext);
  await configPage(page, token);

  await page.goto(`${ADMIN_URL}/${pageUrl}`);
}

/**
 * Go to Login Page.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function navigateToLoginPage(page) {
  await page.goto(URLS.LOGIN);
  await loadingScreenIsHidden(page);
}

/**
 * Fill in email and password fields for Login form.*
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} email - User email
 * @param {string} email - User password
 * @returns {Promise<void>}
 */
export async function fillEmailAndPassword(page, email, password) {
  await page.getByPlaceholder(loginForm.emailPlaceholder).fill(email);
  await page.getByLabel(loginForm.passwordLabel).fill(password);
}

/**
 * Click Login button on Login Form.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function completeLogin(page) {
  await page.getByRole('button', loginForm.loginButton).click();
}

/**
 * Login via email and password.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} email - User email
 * @param {string} email - User password
 * @returns {Promise<void>}
 */
export async function loginViaEmailAndPassword(page, email, password) {
  await fillEmailAndPassword(page, email, password);
  await completeLogin(page);
  await loadingScreenIsHidden(page);
}

/**
 * Special case of the original function with reload: Logs via the API into a specific page using the provided email and password credentials.
 * Use this feature only if you need a page reload before goTo()
 *
 * @param {Object} request - The request object.
 * @param {string} emailCredentials - The email credentials.
 * @param {string} passwordCredentials - The password credentials.
 * @param {string} pageUrl - The URL of the page to navigate to.
 * @returns {Promise<string>} - A promise that resolves when the login process is complete and returns the token for the given user.
 */
export async function loginIntoSpecificPageReload(page, request, emailCredentials, passwordCredentials, pageUrl) {
  const token = await loginAPI(request, emailCredentials, passwordCredentials);
  await configPage(page, token);

  await page.goto(pageUrl);
  await page.reload();
  await loadingScreenIsHidden(page);

  return token;
}
