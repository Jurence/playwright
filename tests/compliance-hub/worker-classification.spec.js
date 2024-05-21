import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import assertColumnNamesInCSVExportedFile from '../../helpers/compliance-hub/compliance-hub';
import { loginIntoSpecificPageUsingDefaultClient } from '../../helpers/platform/login-ui';
import { saveDownloadedFile } from '../../helpers/shared-functions/download-functions';
import complianceHub from '../../selectors/compliance-hub-menu/compliance-hub';
import { mockWorkerClassificationCsvReport, mockWorkerClassificationTable } from '../../setup/mocks/mock-worker-classification';
import URLS from '../../setup/urls';

test.describe('Compliance Hub - Worker Classification section', () => {
  let clientToken;
  const downloadFilePath = '../../downloads';
  const { workerClassification } = complianceHub;

  test.beforeEach('Client navigates to worker classification page', async ({ page }) => {
    clientToken = process.env.CLIENT_TOKEN;

    await mockWorkerClassificationTable(page);
    await mockWorkerClassificationCsvReport(page);
    await loginIntoSpecificPageUsingDefaultClient(page, clientToken, URLS.COMPLIANCE_HUB_WORKER_CLASSIFICATION);
  });

  test('Client can successfully generate CSV report of worker assessment table with correct context @growth-qa-front', async ({
    page,
  }) => {
    await page.locator(workerClassification.threeDotMenuIcon).click();

    // Download CSV file.
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByText(workerClassification.exportAsCsvButtonText).click(),
    ]);

    // Wait for the download process to complete and save the downloaded file.
    const filePath = path.join(__dirname, downloadFilePath, download.suggestedFilename());
    await saveDownloadedFile(download, filePath);

    // Assert the download file and column names
    const expectedCsvColumnNames = [
      'person',
      'tax_residence',
      'coverage',
      'compliance_status',
      'assessment_expiration_date',
      'last_assessment_date',
      'latest_assessment_result',
      'latest_assessment_rationale',
    ];

    expect(fs.existsSync(filePath), 'CSV report should have folder path').toBeTruthy();
    assertColumnNamesInCSVExportedFile(filePath, expectedCsvColumnNames);
  });
});
