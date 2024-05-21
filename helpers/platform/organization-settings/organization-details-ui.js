import organizationSettings from '../../../selectors/organization-settings-menu/organization-settings';

const { organizationDetailsBox } = organizationSettings.organizationDetails;
const { editOrganizationDetailsModal } = organizationSettings.organizationDetails;

/**
 * Click on Edit button on Organization details box
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function openEditOrganizationDetailsModal(page) {
  await page.getByTestId(organizationDetailsBox.editButtonTestId).click();
}

/**
 * Edit organization name
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @param {string}organizationName - the name of organization
 * @returns {Promise<void>}
 */
export async function fillOrganizationName(page, organizationName) {
  await page.locator(editOrganizationDetailsModal.organizationNameField).fill(organizationName);
}

/**
 * Click on Save button on Edit Organization details modal
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object representing the browser page.
 * @returns {Promise<void>}
 */
export async function saveOrganizationDetails(page) {
  await page.getByRole('button', editOrganizationDetailsModal.saveButton).click();
}
