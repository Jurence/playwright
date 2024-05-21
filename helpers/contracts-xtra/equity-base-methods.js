import equityData from '../../data/contracts-xtra/equity';
import eorEquityServiceSelectors from '../../selectors/admin/equity-service/eor-equity-service';
import equitySelector from '../../selectors/equities/equity-selectors';

const { grantInformationDetails } = equityData;
const { grantInformationDetailsStep, additionalInformationStep, documentDetailsStep } = equitySelector;

/**
 * Fill the equity grant name
 *
 * @param {import('@playwright/test').Page} page
 * @param grantName - Data for filling grant name
 * @returns {Promise<void>}
 */
export async function fillEquityGrantName(page, grantName) {
  await page.getByLabel(grantInformationDetailsStep.equityGrantNameLabel).fill(`${grantName}`);
}

/**
 * Fill the equity type
 *
 * @param {import('@playwright/test').Page} page
 * @param equityType - Data for filling equity type
 * @returns {Promise<void>}
 */
export async function fillEquityType(page, equityType) {
  await page.waitForTimeout(1000);
  await page.getByTestId(grantInformationDetailsStep.equityTypeTestId).click();
  await page.getByText(equityType).click();
}

/**
 * Fill the grant type
 *
 * @param {import('@playwright/test').Page} page
 * @param grantType - Data for filling grant type
 * @returns {Promise<void>}
 */
export async function fillGrantType(page, grantType) {
  await page.getByTestId(grantInformationDetailsStep.equityGrantTypeTestId).click();
  await page.getByText(grantType).click();
}

/**
 * Fill the grant status
 *
 * @param {import('@playwright/test').Page} page
 * @param grantStatus - Data for filling grant status
 * @returns {Promise<void>}
 */
export async function fillGrantStatus(page, grantStatus) {
  await page.getByTestId(grantInformationDetailsStep.equityGrantStatusTestId).click();
  await page.getByText(grantStatus).click();
}

/**
 * Fill the grant currency
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function fillGrantCurrency(page) {
  await page.getByTestId(grantInformationDetailsStep.equityGrantCurrencyTestId).click();
  await page.getByText(grantInformationDetails.equityGrantCurrencyText).click();
}

/**
 * Fill the grant value
 *
 * @param {import('@playwright/test').Page} page
 * @param grantValue - Data for filling grant value
 * @returns {Promise<void>}
 */
export async function fillGrantValue(page, grantValue) {
  await page.getByLabel(grantInformationDetailsStep.equityGrantValueLabel).fill(`${grantValue}`);
}

/**
 * Fill the grant quantity
 *
 * @param {import('@playwright/test').Page} page
 * @param grantQuantity - Data for filling grant quantity
 * @returns {Promise<void>}
 */
export async function fillGrantQuantity(page, grantQuantity) {
  await page.getByLabel(grantInformationDetailsStep.equityGrantQuantityLabel).fill(`${grantQuantity}`);
}

/**
 * Fill the grant date
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function fillEquityGrantDate(page) {
  await page.getByLabel(grantInformationDetailsStep.equityGrantDateLabel).click();
  await page
    .getByLabel(grantInformationDetailsStep.equityGrantDateLabel)
    .getByPlaceholder(grantInformationDetailsStep.dateFormatPlaceholder);
  await page.locator(equitySelector.dateSelector).click();
}

/**
 * Fill date for the service agreement MSA
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>} promise that resolves when the MSA date is filled
 */
export async function fillAgreementMsaDate(page) {
  await page.getByTestId(grantInformationDetailsStep.msaDateTestId).click();
  await page
    .getByTestId(grantInformationDetailsStep.msaDateTestId)
    .getByPlaceholder(grantInformationDetailsStep.dateFormatPlaceholder);
  await page.locator(equitySelector.dateSelector).click();
}

/**
 * Send unsigned custom equity agreement
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @returns {Promise<void>} - A promise that resolves when signed agreement is sent
 */
export async function sendUnsignedStandardEquityAgreement(page) {
  await page.getByTestId(eorEquityServiceSelectors.uploadUnsignedEquityAgreementTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.serviceAgreementTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.standardServiceAgreementTestId).click();
  await fillAgreementMsaDate(page, grantInformationDetails.agreementMSADate);
  await page.getByTestId(eorEquityServiceSelectors.continueBtnTestId).click();
  await page.getByTestId(eorEquityServiceSelectors.reviewAndSendStepTestId).waitFor();
  await page.getByTestId(eorEquityServiceSelectors.sendUnsignedEquityAgreementTestId).click();
}

/**
 * Fill the grant exercise price
 *
 * @param {import('@playwright/test').Page} page
 * @param grantExercisePrice - Data for filling grant exercise price
 * @returns {Promise<void>}
 */
export async function fillGrantExercisePrice(page, grantExercisePrice) {
  await page.getByLabel(grantInformationDetailsStep.equityGrantExercisePriceLabel).fill(`${grantExercisePrice}`);
}

/**
 * Fill the grant exercise currency
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function fillGrantExerciseCurrency(page) {
  await page.getByTestId(grantInformationDetailsStep.equityGrantExerciseCurrencyTestId).click();
  await page.getByText(grantInformationDetails.equityGrantExerciseCurrencyText).click();
}

/**
 * Fill the grant expiration date
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function fillEquityGrantExpirationDate(page) {
  await page.getByLabel(grantInformationDetailsStep.equityGrantExpirationDateLabel).click();
  await page
    .getByLabel(grantInformationDetailsStep.equityGrantExpirationDateLabel)
    .getByPlaceholder(grantInformationDetailsStep.dateFormatPlaceholder);
  await page.locator(equitySelector.dateSelector).click();
}

/**
 * Fill the grant additional requirements
 *
 * @param {import('@playwright/test').Page} page
 * @param additionalGrantRequirements - Data for filling grant additional requirements
 * @returns {Promise<void>}
 */
export async function fillAdditionalGrantRequirements(page, additionalGrantRequirements) {
  await page
    .getByLabel(grantInformationDetailsStep.equityAdditionalGrantRequirementsLabel)
    .fill(`${additionalGrantRequirements}`);
}

/**
 * Fill the grant vesting effective date
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function fillVestingEffectiveDate(page) {
  await page.getByLabel(additionalInformationStep.vestingEffectiveDateLabel).click();
  await page
    .getByLabel(additionalInformationStep.vestingEffectiveDateLabel)
    .getByPlaceholder(additionalInformationStep.dateFormatPlaceholder);
  await page.locator(equitySelector.dateSelector).click();
}

/**
 * Fill Document Type
 *
 * @param {import('@playwright/test').Page} page
 * @param {String} documentType - Document Type
 * @returns {Promise<void>}
 */
export async function selectDocumentType(page, documentType) {
  await page.getByTestId(documentDetailsStep.documentTypeTestId).click();
  await page.getByText(documentType).click();
}
