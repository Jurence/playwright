import { expect } from '@playwright/test';
import csv from 'csv-parser';
import fs from 'fs';

/**
 * Assert that the column names in a CSV exported file match the expected column names.
 *
 * @param {string} filePath - The path to the CSV exported file.
 * @param {string[]} expectedCsvColumnNames - An array of expected column names.
 * @returns {void}
 */
export default function assertColumnNamesInCSVExportedFile(filePath, expectedCsvColumnNames) {
  // Write code here
  fs.createReadStream(filePath, 'utf8')
    .pipe(csv())
    .on('headers', (headers) => {
      for (const columnName of expectedCsvColumnNames) {
        expect(headers, `CSV report column should include ${columnName}`).toContain(columnName);
      }
    });
}
