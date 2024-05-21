import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import { contractsCore } from '../../../data/texts';
import { removePaymentItem } from '../../../helpers/contracts-core/ic-invoice-immutability';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import icInvoiceImmutabilitySelectors from '../../../selectors/ic-contracts-core/invoice-immutability';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createFixedContract from '../../../setup/commands/ic-contracts-core/ic-fixed-contract';
import {
  sendInvitationToContractorFromClient,
  signUpICContractWithoutTaxForms,
} from '../../../setup/commands/ic-contracts-core/ic-sign-contract';
import { password } from '../../../setup/constants';

test.describe('Invoice immutability and Credit notes', () => {
  let client;
  let contractor;
  let contract;
  let contractData;

  test.beforeEach(
    'Create user, contract with the first pay date in the next month and login via API',
    async ({ page, request }) => {
      test.setTimeout(120 * 1000);
      contractor = await createIndividualContractor({ country: country.ES.value });
      client = await createClientWithNonUSEntity({ country: country.ES.value });
      contractData = {
        client,
        contractor,
        contract: {
          rate: 100,
          currency: 'USD',
        },
        creator: 'client',
      };
      contract = await createFixedContract(request, contractData);

      await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
      await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
      await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

      const createdContractLink = `/people/${contract.contractorHrisProfile.id}/payments/${contract.id}`;
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);
    }
  );

  test(
    'Client shall be able to create a Credit note by removing an approved payment item from a finalized invoice @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await removePaymentItem(page);

      // Assert Credit note to be created with the correct amount
      await expect(page.getByTestId(icInvoiceImmutabilitySelectors.invoiceDetailsTestId)).toBeVisible();
      await expect(
        page
          .getByTestId(icInvoiceImmutabilitySelectors.invoiceDetailsTestId)
          .getByTestId(icInvoiceImmutabilitySelectors.creditedInvoiceAmountTestId)
      ).toContainText(`${contractData.contract.rate}`);
      await expect(page.getByTestId(icInvoiceImmutabilitySelectors.creditedLabelTestId)).toHaveText(
        contractsCore.creditedInvoiceLabel
      );
    }
  );
});
