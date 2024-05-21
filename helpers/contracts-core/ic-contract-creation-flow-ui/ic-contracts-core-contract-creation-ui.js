import icContractInfo from '../../../selectors/ic-contracts-core/contact-info-contractor';
import icContractCreationSelectors from '../../../selectors/ic-contracts-core/contract-creation';
import {
  fillCurrency,
  fillRate,
  fillScopeOfWork,
  fillSeniorityLevel,
  fillSpecialClause,
  selectInvoiceCycle,
  selectPaymentFrequency,
} from './ic-base-methods';

const { personalDetailsStep, roleDetailsStep, paymentAndDatesStep } = icContractCreationSelectors;

/**
 * Filling the 1st step of contract creation - "Personal details" as Client
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} personalDetails - Data for filling all required fields
 * @returns {Promise<void>}
 */
export async function fillPersonalDetailsAsClient(page, personalDetails) {
  await page.getByLabel(personalDetailsStep.firstNameLabel).fill(personalDetails.firstName);
  await page.getByLabel(personalDetailsStep.lastNameLabel).fill(personalDetails.lastName);
  await page.getByLabel(personalDetailsStep.emailLabel).fill(personalDetails.email);
  await page.getByLabel(personalDetailsStep.contractNameLabel).fill(personalDetails.contractName);
  await page.getByPlaceholder(personalDetailsStep.taxResidenceFieldLabel).click();
  await page.getByText(personalDetails.contractorResidence).click();
}

/**
 * Filling the 1st step of contract creation - "Personal details" as Contractor
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} personalDetails - Data for filling all required fields
 * @returns {Promise<void>}
 */
export async function fillPersonalDetailsAsContractor(page, personalDetails) {
  await page.getByLabel(personalDetailsStep.contractNameLabel).fill(personalDetails.contractName);
  await page.getByPlaceholder(personalDetailsStep.taxResidenceFieldLabel).click();
  await page.getByText(personalDetails.contractorResidence).click();
}

/**
 * Filling the 2nd step of contract creation - "Role details"
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} roleDetails - Data for filling seniority level and scope of work
 * @returns {Promise<void>}
 */
export async function fillRoleDetails(page, roleDetails) {
  await fillSeniorityLevel(page, roleDetails.seniority);
  await fillScopeOfWork(page, roleDetails.sow);
}

/**
 * Filling the 3rd step of contract creation - "Payment and dates" for FIXED contract type
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} paymentDetails - Data for filling currency and payment rate
 * @returns {Promise<void>}
 */
export async function fillFixedPaymentAndDates(page, paymentDetails) {
  await fillCurrency(page, paymentDetails.currency);
  await fillRate(page, paymentDetails.paymentRate);
}

/**
 * Filling the 3rd step of contract creation - "Payment and dates" for PAYG (Fixed) contract type
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} paymentDetails - Data for filling currency and payment rate, payment frequency, invoice cycle
 * @param {string} paymentDetails.currency - Data for filling currency
 * @param {string} paymentDetails.paymentRate - Data for filling payment rate
 * @param {string} paymentDetails.paymentFrequency - Data for filling payment frequency
 * @param {string} paymentDetails.invoiceCycle - Data for filling invoice cycle
 * @returns {Promise<void>}
 */
export async function fillPAYGPaymentAndDatesForFixedRate(page, paymentDetails) {
  await page.getByText(paymentDetails.rate).click();
  await fillCurrency(page, paymentDetails.currency);
  await fillRate(page, paymentDetails.paymentRate);
  await selectPaymentFrequency(page, paymentDetails.paymentFrequency);
  await selectInvoiceCycle(page, paymentDetails.invoiceCycle);
}

/**
 * Filling the 3rd step of contract creation - "Payment and dates" for PAYG (Task) contract type
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Page} page
 * @param {Object} paymentDetails - Data for filling currency and invoice cycle
 * @param {string} paymentDetails.currency - Data for filling currency
 * @param {string} paymentDetails.invoiceCycle - Data for filling invoice cycle
 * @returns {Promise<void>}
 * @returns {Promise<void>}
 */

export async function fillPAYGPaymentAndDatesForPerTask(page, paymentDetails) {
  await page.getByTestId(paymentAndDatesStep.paygPerTaskTestId).click();
  await fillCurrency(page, paymentDetails.currency);
  await selectInvoiceCycle(page, paymentDetails.invoiceCycle);
}

/**
 * Filling "Step 2: Role details and dates" for Milestone contract type
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} roleDetails - Data for filling role details like seniority level and scope of work
 * @param {string} roleDetails.seniority - Data for filling seniority
 * @param {string} roleDetails.sow - Data for filling scope of work
 * @param {Object} paymentAndMilestoneDetails - Data for filling currency and Milestone-specific fields
 * like Milestone name, Milestone description and Milestone amount
 * @param {string} paymentAndMilestoneDetails.currency - Data for filling currency
 * @param {string} paymentAndMilestoneDetails.milestoneName - Data for filling Milestone name
 * @param {string} paymentAndMilestoneDetails.milestoneDescription - Data for filling Milestone description
 * @param {string} paymentAndMilestoneDetails.milestoneAmount - Data for filling Milestone amount
 * @returns {Promise<void>}
 */
export async function fillMilestoneRolesAndDates(page, roleDetails, paymentAndMilestoneDetails) {
  await fillSeniorityLevel(page, roleDetails.seniority);
  await fillScopeOfWork(page, roleDetails.sow);
  await fillCurrency(page, paymentAndMilestoneDetails.currency);
  await page.getByPlaceholder(roleDetailsStep.milestoneNamePlaceholder).fill(paymentAndMilestoneDetails.milestoneName);
  await page
    .getByPlaceholder(roleDetailsStep.milestoneDescriptionPlaceholder)
    .fill(paymentAndMilestoneDetails.milestoneDescription);
  await page.getByLabel(roleDetailsStep.milestoneAmountLabel).fill(`${paymentAndMilestoneDetails.milestoneAmount}`);
}

/**
 * Filling the 4th step of contact creation - "Compliance"
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} compliance - Data for filling compliance-related fields
 * @param {string} compliance.specialClause - Data for filling special clause
 * @returns {Promise<void>}
 */
export async function fillComplianceStep(page, compliance) {
  await fillSpecialClause(page, compliance.specialClause);
}

/**
 * Open contract details tab on contractors view
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function openContractDetailsByContractor(page) {
  await page.getByTestId(icContractInfo.contractDetailsTab.contractorDetailsTabTestId).click();
}
