/**
 * Wait for a download event to occur.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<void>} A promise that resolves when the download event occurs.
 */

export async function waitForDownload(page) {
  return page.waitForEvent('download');
}

/**
 * Save the downloaded file to the specified file path.
 *
 * @param {Object} download - The downloaded file object.
 * @param {string} filePath - The file path where the downloaded file should be saved.
 * @returns {Promise<void>} - A promise that resolves when the file is saved successfully.
 */

export async function saveDownloadedFile(download, filePath) {
  await download.saveAs(filePath);
}
