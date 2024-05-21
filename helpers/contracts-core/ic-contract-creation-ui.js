import { faker } from '@faker-js/faker';
import fixedContractFlowSelectors from '../../selectors/ic/fixed-ic-contract-flow';
import URLS from '../../setup/urls';
import { loadingScreenIsHidden } from '../shared-functions/general-functions';

const { personalDetailsStep, jobDetailsStep } = fixedContractFlowSelectors;

/**
 * Go to Fixed Contract Page.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function goToFixedContractPage(page) {
  const request = /profiles\/me/;
  await page.goto(URLS.FIXED_CONTRACT_CREATION);
  await Promise.all([
    page.waitForRequest(request),
    loadingScreenIsHidden(page),
    page.getByText(fixedContractFlowSelectors.pageTitleText).waitFor(),
    page.getByText(fixedContractFlowSelectors.pageSubTitleText).waitFor(),
  ]);
}

/**
 * Fill contractor's personal details information. Step 1 in the flow.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>}
 */
export async function fillPersonalDetailsStep(page) {
  await page.getByLabel(personalDetailsStep.contractorFirstNameLabel).fill(`Test ${faker.person.firstName()}`);
  await page.getByLabel(personalDetailsStep.contractorLastNameLabel).fill(`Test ${faker.person.lastName()}`);
  await page.getByLabel(personalDetailsStep.contractorEmailLabel).fill(`test${faker.internet.email()}`);
  await page.getByLabel(personalDetailsStep.contractNameLabel).fill(`${faker.lorem.words()}`);
}

/**
 * Select a state or province from a dropdown list on a page based on provided argument.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} stateOrProvince - The name of the state or province to select.
 * @param {string} nameOfRegion - The name of the region to select. Should be either the state or province.
 * @returns {Promise<void>}
 */
export async function selectContractorStateOrProvince(page, stateOrProvince, nameOfRegion) {
  const stateSelect = page.getByLabel(`Choose a ${stateOrProvince}`);
  const stateTxt = page.getByRole('listbox', { name: `Choose a ${stateOrProvince}` });
  const stateValue = page.getByRole('option', { name: nameOfRegion, exact: true });

  await stateSelect.click({ delay: 300 });
  await stateTxt.pressSequentially(nameOfRegion.substring(0, 4).toLowerCase(), { delay: 200 });
  await page.waitForLoadState('domcontentloaded');
  await stateValue.click();
}

/**
 * Fill required job details step of contractor creation. Step 2 in the flow.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} predefinedJobScope - The predefined job scope to select.
 * @returns {Promise<void>}
 */
export async function fillContractorRoleDetailsStep(page, predefinedJobScope, seniorityLevel) {
  // TODO: create a separate shared function for selecting option from dropdown
  const seniorityLevelSelect = page.getByLabel('Seniority level');
  const seniorityLevelInput = page.locator('input#contract-form-seniority');
  const seniorityLevelValue = page.getByRole('option', { name: seniorityLevel, exact: true });

  await seniorityLevelSelect.click({ delay: 300 });
  await seniorityLevelInput.pressSequentially(seniorityLevel.substring(0, 4).toLowerCase(), { delay: 200 });
  await page.waitForLoadState('domcontentloaded');
  await seniorityLevelValue.click();

  await page
    .getByTestId(jobDetailsStep.selectTeamTestId)
    .getByLabel(jobDetailsStep.scopeOfWorkLabel)
    .fill(predefinedJobScope.substring(0, 4));
  await page.getByRole('option', { name: `${predefinedJobScope} deel` }).click();
}

/**
 * Continue with the next step in Fixed contract creation flow.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export default async function continueWithNextStep(page) {
  const continueBtn = page.getByTestId(fixedContractFlowSelectors.continueButtonTestId).first();
  await continueBtn.click();
  await page.waitForLoadState('domcontentloaded');
}
