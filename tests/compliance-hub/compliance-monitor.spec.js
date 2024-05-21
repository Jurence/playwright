import { expect, test } from '@playwright/test';
import { loginIntoSpecificPageUsingDefaultClient } from '../../helpers/platform/login-ui';
import chilipiperModal from '../../selectors/chilipiper';
import complianceHub from '../../selectors/compliance-hub-menu/compliance-hub';
import URLS from '../../setup/urls';

test.describe('Compliance Hub - Compliance monitor section', () => {
  const expectedConfirmationMessage = 'An email has been sent with the full booking details!';
  const bookingConsultationExpectedResult = 'Booking a consultation should be successful';
  const confirmationTextExpectedResult = 'Confirmation message should have a correct text';

  test.beforeEach('Client navigates to compliance monitor page', async ({ page }) => {
    const clientToken = process.env.CLIENT_TOKEN;
    await loginIntoSpecificPageUsingDefaultClient(page, clientToken, URLS.COMPLIANCE_HUB_COMPLIANCE_MONITOR);
  });

  test('Client can successfully book a consultation in Compliance Hub page @growth-qa-front', async ({ page }) => {
    await page.getByText(complianceHub.bookingConsultationButtonText).click();

    const chilipiperIframe = page.frameLocator('#chilipiper-frame');
    await chilipiperIframe.getByText(chilipiperModal.whatTimeWorksText).waitFor();

    const firstTimeSlot = chilipiperIframe.locator(chilipiperModal.allEmptyTimeSlots).first();
    await firstTimeSlot.click();

    const confirmationMessage = chilipiperIframe.locator(chilipiperModal.confirmationMessage);
    await expect(confirmationMessage, { message: bookingConsultationExpectedResult }).toBeVisible();
    await expect(confirmationMessage, { message: confirmationTextExpectedResult }).toContainText(expectedConfirmationMessage);
  });
});
