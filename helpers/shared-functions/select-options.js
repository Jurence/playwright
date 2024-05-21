/**
 * Select a country from a dropdown list by label and data-qa attribute.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @param {string} testId - The data-qa attribute of the dropdown list.
 * @param {string} label - The label of the dropdown list.
 * @param {string} country - The name of the country to select.
 * @returns {Promise<void>}
 */
export async function selectCountry(page, country, label, testId) {
  const countrySelect = page.getByLabel(label);
  const countryTxt = page.getByTestId(testId).getByLabel(label);
  const countryValue = page.getByRole('option', { name: country, exact: true });

  await countrySelect.waitFor();
  await countrySelect.click({ delay: 300 });
  await page.getByRole('listbox', { name: label }).waitFor();
  await countryTxt.pressSequentially(country.substring(0, 4).toLowerCase(), { delay: 200 });
  await page.waitForLoadState('domcontentloaded');
  await countryValue.click();
}

/**
 * Select a state from a dropdown list using data-qa attribute.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} state - The name of the state to select.
 * @param {string} testId - The data-qa attribute of the dropdown list.
 * @returns {Promise<void>}
 */
export async function selectState(page, state, testId) {
  const dropdown = page.getByTestId(testId).locator('button');
  const stateValue = page.getByRole('option', { name: state, exact: true });

  await dropdown.waitFor();
  await dropdown.click();
  await page.waitForLoadState('domcontentloaded');
  await stateValue.click();
}

/**
 * Select an item with the search name given from a dropdown list using locator method
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} dropdownInput - Accepts css selectors/attribute
 * @param {string} searchName - The option text you want to click on
 * @returns {Promise<void>}
 */
export async function selectOptionFromDropdownBySearchText(page, dropdownInput, searchName) {
  await page.locator(dropdownInput).click({ delay: 300 });
  await page.locator(dropdownInput).pressSequentially(searchName.substring(0, 4).toLowerCase(), { delay: 200 });
  await page.getByRole('option', { name: searchName }).click();
  await page.getByRole('option', { name: searchName }).waitFor({ state: 'hidden' });
}

/**
 * Select the item from dropdown list using the role index -This is for a case when items on dropdown are anonymized
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string} dropdownInput - Accepts css selectors/attribute
 * @param {number} optionToSelect - The role option index you want to select
 * @returns {Promise<void>}
 */
export async function selectOptionFromDropdownByRoleIndex(page, dropdownInput, optionToSelect) {
  await page.getByLabel(dropdownInput).click({ delay: 300 });
  await page.getByRole('option').nth(optionToSelect).click();
  await page.getByRole('option').nth(optionToSelect).waitFor({ state: 'hidden' });
}

/**
 * Select an option from a dropdown on a page by clicking options.
 *
 * @param {import('@playwright/test').Page} page - The page object representing the web page.
 * @param {string} dropdownElement - The dropdown element to interact with.
 * @param {string} optionName - The option to select from the dropdown.
 * @returns {Promise<void>} - A promise that resolves when the option is selected.
 */
export async function selectDropdownOption(page, dropdownElement, optionName) {
  await dropdownElement.click({ delay: 500 });

  const option = page.getByRole('option', { name: optionName, exact: true });
  await option.click({ delay: 500 });
  await option.waitFor({ state: 'hidden' });

  await page.waitForLoadState('domcontentloaded');
}
