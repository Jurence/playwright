import { API_URL } from '../../playwright.config';
import URLS from '../../setup/urls';

/**
 * Upload a given file to an input element.
 * Before uploading files, it waits the response from /mobility/upload/form endpoint returning 200.
 *
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {string} fileUploadFieldLocator - The locator for the file upload field.
 * @param {string} filePath - The path to the file to be uploaded.
 * @param {string} url - The URL the method will wait for
 * @throws {Error} If an error occurs while uploading the file.
 */
export default async function uploadFile(page, fileUploadFieldLocator, filePath, url = `${URLS.UPLOAD_FORM}`) {
  let inputElement;

  try {
    inputElement = await page.locator(fileUploadFieldLocator);
    await Promise.all([
      page.waitForResponse((response) => response.url() === `${API_URL}${url}` && response.ok()),
      inputElement.setInputFiles(filePath),
    ]);
  } catch (error) {
    throw new Error(`Error occurred while uploading file: ${error}`);
  }
}

/**
 * Uploads a given file to an input element without waiting a response.
 *
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {string} fileUploadFieldLocator - The locator for the file upload field.
 * @param {string} filePath - The path to the file to be uploaded.
 * @throws {Error} If an error occurs while uploading the file.
 */
export async function uploadFileWithoutWaitFor(page, fileUploadFieldLocator, filePath) {
  let inputElement;

  try {
    inputElement = await page.locator(fileUploadFieldLocator);
    await Promise.all([inputElement.setInputFiles(filePath)]);
  } catch (error) {
    throw new Error(`Error occurred while uploading file: ${error}`);
  }
}
