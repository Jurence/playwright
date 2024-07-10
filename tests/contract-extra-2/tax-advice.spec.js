import { expect, test } from '@playwright/test';a
import { fixedContractData } from '../../data/contracts-core/contract-creation';
import country from '../../data/countries.json';
import { loginIntoSpecificPage } from '../../helpers/platform/login-ui';
import taxSelectors from '../../selectors/extra-2/tax-advice-selectors';
import sharedSelectors from '../../selectors/shared-selectors';
import { createIndividualContractor } from '../../setup/commands/create-contractor';
import { password } from '../../setup/constants';
import URLS from '../../setup/urls';

test.describe('Contractor - Tax Advice for German Contractors', () => {
  let contractor;
  const { taxAdvicePopup } = taxSelectors;
  const { addPaymentMethodModal } = taxSelectors;
  const { termsModal } = taxSelectors;

  const testData = {
    taxQuestion: 'This is a tax advice request',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '04/26',
    cardCvc: '424',
  };

  test.beforeEach('Create Individual Contractor via API', async () => {
    contractor = await createIndividualContractor({ country: country.DE.value });
    fixedContractData.personalDetails.firstName = contractor.firstName;
    fixedContractData.personalDetails.lastName = contractor.lastName;
    fixedContractData.personalDetails.email = contractor.email;
  });

  test('Contractor should request for tax advice @xtra2-qa-front', async ({ page, request }) => {
    const expectedText = 'Your payment has been processed successfully';

    // Setup the handler for Tax Advice Popup
    await page.addLocatorHandler(page.getByRole('heading', taxAdvicePopup.taxAdviceBoxTooltip), async () => {
      await page.getByRole('tooltip', taxAdvicePopup.taxAdviceBoxTooltip).getByTestId(taxAdvicePopup.closeBtnTestId).click();
    });
    await loginIntoSpecificPage(page, request, contractor.email, password, URLS.TAX_ADVICE);

    // Request tax advice
    await page.getByTestId(taxSelectors.getStartedBtnTestId).click();
    await page.getByTestId(taxSelectors.continueBtnTestId).click();
    await page.getByPlaceholder(taxSelectors.textFields).fill(testData.taxQuestion);
    await page.getByTestId(taxSelectors.continueBtnTestId).click();

    // Save payment method
    await page.getByRole('button', addPaymentMethodModal.addPaymentMethodBtn).click();
    await page
      .frameLocator(addPaymentMethodModal.cardNumberFrame)
      .getByPlaceholder(addPaymentMethodModal.cardNumberPlaceholder)
      .fill(testData.cardNumber);
    await page
      .frameLocator(addPaymentMethodModal.cardExpiryFrame)
      .getByPlaceholder(addPaymentMethodModal.cardExpiryPlaceholder)
      .fill(testData.cardExpiry);
    await page
      .frameLocator(addPaymentMethodModal.cvvFrame)
      .getByPlaceholder(addPaymentMethodModal.cvvPlaceholder)
      .fill(testData.cardCvc);
    await page.getByRole('button', addPaymentMethodModal.saveCreditCardBtn).click();

    // Send request
    await page.getByTestId(taxSelectors.continueBtnTestId).click();
    await page.getByTestId(taxSelectors.sendRequestBtnTestId).click();
    await page.getByLabel(termsModal.agreeToTermsTestId).check();
    await page.getByTestId(termsModal.confirmBtnTestId).click();

    // Verify success message
    await expect(page.getByTestId(sharedSelectors.undefinedTitleTestId)).toContainText(expectedText);
  });
});
