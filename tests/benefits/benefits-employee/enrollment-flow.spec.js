import { expect, test } from '@playwright/test';
import benefitsEmployees from '../../../data/benefits/benefits-employees-dev.json';
import benefitsInfo from '../../../data/benefits/benefits-info-dev.json';
import { loadingScreenIsHidden } from '../../../helpers/shared-functions/general-functions';
import benefitsAdminDetailsPageSelectors from '../../../selectors/benefits/benefits-admin-enrollment-page';
import {
  getContractBenefitsByTypeAndStatus,
  optOutAndEnrollBenefit,
  postOptOutContractBenefitByTypeAndStatus,
} from '../../../setup/commands/benefits/contract-benefits';
import { loginAPI } from '../../../setup/endpoints/login/login';
import URLS from '../../../setup/urls';
import { createRequestContextWithAuthToken } from '../../../utils/add-extra-http-headers';
import configPage from '../../../utils/config-page';

test.describe('Global Payroll contract enrolling', () => {
  // TODO: We need this integrations to be enabled in RC prior running this test  - Remove this line when the test is ready to run in all environments -
  test.beforeAll('Skip tests if running on giger', () => {
    if (process.env.ENV !== 'dev') {
      test.skip();
    }
  });

  const { healthcareEnroll, fsaEnroll, lifeEnroll, k401Enroll, reviewModal, reviewBtnTestId } = benefitsAdminDetailsPageSelectors;
  const employee = benefitsEmployees;
  const benefits = benefitsInfo;
  const statusEnrollment = [
    'OPTED_OUT_PENDING_PROCESS',
    'OPTED_OUT',
    'AWAITING_ENROLLMENT',
    'ENROLLED_PENDING_PROCESS',
    'ENROLLED',
  ];

  let employeeContext;

  test.beforeEach(async ({ page, request }) => {
    const employeeToken = await loginAPI(request, employee[0].email, employee[0].password);
    await configPage(page, employeeToken);
    employeeContext = await createRequestContextWithAuthToken(employeeToken);
  });

  // TODO: There is a possible locator issue here. Benefits team need to investigate on BA-1244.
  test.skip(`GP employee should enroll into healthcare benefit @benefits-qa-front`, async ({ page }) => {
    const benefitType = 'HEALTHCARE';
    const successText = healthcareEnroll.enrolledSuccessText;

    // Opt out of healthcare contract benefit
    await postOptOutContractBenefitByTypeAndStatus(employeeContext, benefitType);

    // Find enrolled or opted out contract benefit and retrieve the contract benefit ID
    const [{ contractBenefitId }] = await getContractBenefitsByTypeAndStatus(employeeContext, benefitType, statusEnrollment);

    const editUrl = `${URLS.BENEFITS_ADMIN}/${benefitType.toLowerCase()}/${contractBenefitId}/edit`;
    await page.goto(editUrl);
    await loadingScreenIsHidden(page);

    await page.locator(healthcareEnroll.planSlide).getByTestId(reviewBtnTestId).first().click();

    // Accept terms, enroll, and verify successful enrollment message
    await page.getByText(reviewModal.termsTxt).click();
    await page.getByRole('button', reviewModal.acceptModalBtn).click();
    await page.getByRole('button', reviewModal.enrollModalBtn).click();

    const successModal = page.getByText(successText);
    await expect(successModal).toBeVisible();
  });

  test(`GP employee should enroll into fsa benefit @benefits-qa-front`, async ({ page }) => {
    const benefitType = 'FSA';
    const enrollBenefitType = 'HEALTHCARE';
    const successText = fsaEnroll.enrolledSuccessText;
    const annualContribution = '10';

    // Must be enrolled in HEALTHCARE before enrolling in FSA
    await optOutAndEnrollBenefit(employeeContext, enrollBenefitType, statusEnrollment, benefits[0].provider.plan.id);

    // Opt out of healthcare contract benefit
    await postOptOutContractBenefitByTypeAndStatus(employeeContext, benefitType, statusEnrollment);

    // Find enrolled or opted out contract benefit and retrieve the contract benefit ID
    const [{ contractBenefitId }] = await getContractBenefitsByTypeAndStatus(employeeContext, benefitType, statusEnrollment);

    const editUrl = `${URLS.BENEFITS_ADMIN}/${benefitType.toLowerCase()}/${contractBenefitId}/edit`;
    await page.goto(editUrl);
    await loadingScreenIsHidden(page);

    await page.getByLabel(fsaEnroll.annualFieldLabel).fill(annualContribution);

    await page.getByRole('button', fsaEnroll.reviewBtn).click();

    // Accept terms, enroll, and verify successful enrollment message
    await page.getByText(reviewModal.termsTxt).click();
    await page.getByRole('button', reviewModal.acceptModalBtn).click();
    await page.getByRole('button', reviewModal.enrollModalBtn).click();

    const successModal = page.getByText(successText);
    await expect(successModal).toBeVisible();
  });

  test(`GP employee should enroll into life insurance benefit @benefits-qa-front`, async ({ page }) => {
    const benefitType = 'LIFE_INSURANCE';
    const successText = lifeEnroll.enrolledSuccessText;

    // Opt out of life insurance contract benefit
    await postOptOutContractBenefitByTypeAndStatus(employeeContext, benefitType);

    // Find enrolled or opted out contract benefit and retrieve the contract benefit ID
    const [{ contractBenefitId }] = await getContractBenefitsByTypeAndStatus(employeeContext, benefitType, statusEnrollment);

    const editUrl = `${URLS.BENEFITS_ADMIN}/${benefitType.toLowerCase().replace('_', '-')}/${contractBenefitId}/edit`;
    await page.goto(editUrl);
    await loadingScreenIsHidden(page);

    await page.getByRole('button', lifeEnroll.reviewBtn).click();

    // Accept terms, enroll, and verify successful enrollment message
    await page.getByText(reviewModal.termsTxt).click();
    await page.getByRole('button', reviewModal.acceptModalBtn).click();
    await page.getByRole('button', reviewModal.enrollModalBtn).click();

    const successModal = page.getByText(successText);
    await expect(successModal).toBeVisible();
  });

  test(`GP employee should enroll into 401K benefit @benefits-qa-front`, async ({ page }) => {
    const benefitType = '401_K';
    const successText = k401Enroll.enrolledSuccessText;
    const percentageAmount = '10';

    // Opt out of 401K contract benefit
    await postOptOutContractBenefitByTypeAndStatus(employeeContext, benefitType);

    // Find enrolled or opted out contract benefit and retrieve the contract benefit ID
    const [{ contractBenefitId }] = await getContractBenefitsByTypeAndStatus(employeeContext, benefitType, statusEnrollment);

    const editUrl = `${URLS.BENEFITS_ADMIN}/${benefitType.toLowerCase().replace('_', '-')}/${contractBenefitId}/edit`;
    await page.goto(editUrl);
    await loadingScreenIsHidden(page);

    // Fill coverage percentage amount that will be contributed to 401K
    await page.getByLabel(k401Enroll.percentageLabel, { exact: true }).fill(percentageAmount);

    await page.getByTestId(reviewBtnTestId).click({ delay: 200 });

    // Enroll, and verify successful enrollment message
    await page.getByRole('button', reviewModal.enrollModalBtn).click();

    const successModal = page.getByText(successText);
    await expect(successModal).toBeVisible();
  });
});
