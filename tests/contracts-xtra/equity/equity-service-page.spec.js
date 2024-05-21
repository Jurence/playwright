import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import equitySelector from '../../../selectors/equities/equity-selectors';
import { createClient } from '../../../setup/commands/create-client';
import { password } from '../../../setup/constants';
import URLS from '../../../setup/urls';

let client;

test.describe('Equity service page', () => {
  test.describe('Common', () => {
    test.beforeEach('Create users via API', async ({ page, request }) => {
      test.setTimeout(120 * 1000);

      client = await createClient({ country: country.UG.value });

      await loginIntoSpecificPage(page, request, client.email, password, URLS.SERVICES_EQUITY);
    });

    test('Client should be able to see the equity banner @xtra-qa-front', async ({ page }) => {
      await expect(page.getByRole('heading', { name: equitySelector.equityServicePage.bannerText })).toBeVisible();
    });
  });

  test.describe('Compliance risk alert and modal', () => {
    test.describe('NOT onboarded organization to EOR equity service', () => {
      test.beforeEach('Create users via API and mock response', async ({ page, request }) => {
        test.setTimeout(120 * 1000);

        client = await createClient({ country: country.UG.value });

        await page.route('**/equities/under_risk_profiles', (route) => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              isOrganizationOnboarded: false,
              employees: [
                {
                  id: '1',
                  email: 'testemail@letsdeel.co',
                  firstName: 'John',
                  middleName: null,
                  lastName: 'Doe',
                  picUrl: null,
                  grantName: 'IS-100',
                },
              ],
            }),
          });
        });

        await loginIntoSpecificPage(page, request, client.email, password, URLS.SERVICES_EQUITY);
      });

      test('Client should be able to see the Compliance risk alert @xtra-qa-front', async ({ page }) => {
        await expect(page.getByRole('heading', { name: equitySelector.equityServicePage.complianceRiskAlertText })).toBeVisible();
      });

      test('Client should be able to see the Compliance risk modal after click Review button in alert @xtra-qa-front', async ({
        page,
      }) => {
        await page.getByRole('button', { name: equitySelector.equityServicePage.reviewButton }).click();

        await expect(page.getByTestId('compliance-risk-modal-modal-title')).toBeVisible();
        await expect(
          page.getByRole('heading', {
            name: equitySelector.equityServicePage.complianceRiskModal.notOnboardedOrganizationHeading,
          })
        ).toBeVisible();
        await expect(page.getByText('John Doe')).toBeVisible();
        await expect(
          page.getByRole('link', { name: equitySelector.equityServicePage.complianceRiskModal.learnMoreButton })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: equitySelector.equityServicePage.complianceRiskModal.continueButton })
        ).toBeVisible();
      });

      test('Client should see onboard organization to EOR Equity Service educational modal @xtra-qa-front', async ({ page }) => {
        await page.getByRole('button', { name: equitySelector.equityServicePage.reviewButton }).click();

        await expect(
          page.getByRole('button', { name: equitySelector.equityServicePage.complianceRiskModal.continueButton })
        ).toBeVisible();
        await page.getByRole('button', { name: equitySelector.equityServicePage.complianceRiskModal.continueButton }).click();

        await expect(
          page.getByText(equitySelector.equityServicePage.EOREducationalModal.notOnboardedOrganizationHeading)
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: equitySelector.equityServicePage.complianceRiskModal.getStartedButton })
        ).toBeVisible();
      });
    });

    test.describe('Onboarded organization to EOR equity service', () => {
      test.beforeEach('Create users via API and mock response', async ({ page, request }) => {
        test.setTimeout(120 * 1000);

        client = await createClient({ country: country.UG.value });

        await page.route('**/equities/enabled_organizations/**', (route) => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              enabledAsDeelGrant: true,
              enabledAsDirectGrant: false,
              hasUsedStockOptions: false,
            }),
          });
        });

        await page.route('**/equities/under_risk_profiles', (route) => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              isOrganizationOnboarded: true,
              employees: [
                {
                  id: '1',
                  email: 'testemail@letsdeel.co',
                  firstName: 'John',
                  middleName: null,
                  lastName: 'Doe',
                  picUrl: null,
                  grantName: 'IS-100',
                },
              ],
            }),
          });
        });

        await loginIntoSpecificPage(page, request, client.email, password, URLS.SERVICES_EQUITY);
      });

      test('Client should be able to see the Compliance risk alert @xtra-qa-front', async ({ page }) => {
        await expect(page.getByRole('heading', { name: equitySelector.equityServicePage.complianceRiskAlertText })).toBeVisible();
      });

      test('Client should be able to see the Compliance risk modal after click Review button in alert @xtra-qa-front', async ({
        page,
      }) => {
        await page.getByRole('button', { name: equitySelector.equityServicePage.reviewButton }).click();

        await expect(page.getByTestId('compliance-risk-modal-modal-title')).toBeVisible();
        await expect(
          page.getByRole('heading', { name: equitySelector.equityServicePage.complianceRiskModal.EORsNotOnboardedHeading })
        ).toBeVisible();
        await expect(page.getByText('John Doe')).toBeVisible();
        await expect(
          page.getByRole('link', { name: equitySelector.equityServicePage.complianceRiskModal.learnMoreButton })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: equitySelector.equityServicePage.complianceRiskModal.continueButton })
        ).toBeVisible();
      });

      test('Client should see onboard EOR employees educational modal @xtra-qa-front', async ({ page }) => {
        await page.getByRole('button', { name: equitySelector.equityServicePage.reviewButton }).click();

        await expect(
          page.getByRole('button', { name: equitySelector.equityServicePage.complianceRiskModal.continueButton })
        ).toBeVisible();
        await page.getByRole('button', { name: equitySelector.equityServicePage.complianceRiskModal.continueButton }).click();

        await expect(page.getByText(equitySelector.equityServicePage.EOREducationalModal.notOnboardedEORsHeading)).toBeVisible();
        await expect(
          page.getByRole('button', { name: equitySelector.equityServicePage.EOREducationalModal.getStartedButton })
        ).toBeVisible();
      });
    });
  });

  test.describe('Equity data grid', () => {
    test.describe('Empty', () => {
      test.beforeEach('Create users via API and mock response', async ({ page, request }) => {
        test.setTimeout(120 * 1000);

        client = await createClient({ country: country.UG.value });

        await page.route('**/equities/service_hub_listing**', (route) => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({}),
          });
        });

        await loginIntoSpecificPage(page, request, client.email, password, URLS.SERVICES_EQUITY);
      });

      test('Client should see empty equity data grid @xtra-qa-front', async ({ page }) => {
        await expect(page.getByText(equitySelector.equityServicePage.noEquitiesHeading)).toBeVisible();
        await expect(page.getByText(equitySelector.equityServicePage.noEquitiesDescription)).toBeVisible();
      });
    });

    test.describe('With data', () => {
      test.beforeEach('Create users via API and mock response', async ({ page, request }) => {
        test.setTimeout(120 * 1000);

        client = await createClient({ country: country.UG.value });

        await page.route('**/equities/service_hub_listing**', (route) => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              items: [
                {
                  id: '123',
                  grantName: 'IS-100',
                  equityType: null,
                  equityGrantType: null,
                  value: null,
                  quantity: null,
                  grantDate: null,
                  grantStatus: null,
                  optionExpiration: null,
                  exercisePrice: null,
                  valueCurrency: null,
                  exercisePriceCurrency: null,
                  vestingStartDate: null,
                  vestingLength: null,
                  cliffPeriod: null,
                  tranches: null,
                  additionalGrantRequirementsAndRestrictions: null,
                  source: 'MANUAL',
                  vestedQuantity: null,
                  hrisProfile: {
                    id: '123',
                    email: 'testemail@letsdeel.co',
                    picUrl: null,
                    firstName: 'John',
                    middleName: null,
                    lastName: 'Doe',
                    jobTitle: 'Software Engineer',
                    hiringType: 'direct_employee',
                    isUnderRisk: true,
                  },
                },
              ],
              total: 1,
            }),
          });
        });

        await loginIntoSpecificPage(page, request, client.email, password, URLS.SERVICES_EQUITY);
      });

      test('Client should see 1 row in data grid @xtra-qa-front', async ({ page }) => {
        await expect(page.getByText('John Doe')).toBeVisible();
        await expect(page.getByText('IS-100')).toBeVisible();
      });
    });
  });
});
