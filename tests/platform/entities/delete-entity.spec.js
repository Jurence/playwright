import { expect, test } from '@playwright/test';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import entitySelectors from '../../../selectors/account-settings/entitySelectors';
import sharedSelectors from '../../../selectors/shared-selectors';
import { createClient } from '../../../setup/commands/create-client';
import { addEntityToOrganization } from '../../../setup/commands/create-legal-entity';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';

test.describe('Delete Entity', () => {
  const { viewEntity, deleteEntity } = entitySelectors;

  test.beforeEach('Login and open the entity details page', async ({ page, request }) => {
    const { email, organization, token } = await createClient();
    const legalEntityId = await addEntityToOrganization(request, organization.id, token);
    const url = `${URLS.ACCOUNT_SETTINGS_ENTITY}/${legalEntityId}/details`;
    await loginIntoSpecificPage(page, request, email, password, url);
  });

  // TODO: Platform team is fixing the Server error when deleting entity
  test.skip(`Client deletes an existing entity @platform-qa-front`, async ({ page }) => {
    const expectedSnackBarText = 'Entity deleted';
    await page.getByRole('button', viewEntity.deleteEntityButton).click();
    await page.getByRole('button', deleteEntity.confirmDeleteModalButton).click();

    // Assert
    await expect(page.locator(sharedSelectors.snackbar)).toBeVisible();
    await expect(page.locator(sharedSelectors.snackbar)).toHaveText(expectedSnackBarText);
  });
});
