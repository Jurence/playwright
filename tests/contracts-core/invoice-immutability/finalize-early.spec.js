import { expect, test } from '@playwright/test';
import moment from 'moment';
import country from '../../../data/countries.json';
import { contractsCore } from '../../../data/texts';
import { finalizeInvoiceEarly } from '../../../helpers/contracts-core/ic-invoice-immutability';
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

test.describe('Invoice immutability: Finalize invoice early', () => {
  let client;
  let contractor;
  let contract;

  test.beforeEach(
    'Create user, contract with the first pay date in the next month and login via API',
    async ({ page, request }) => {
      test.setTimeout(120 * 1000);
      contractor = await createIndividualContractor({ country: country.ES.value });
      client = await createClientWithNonUSEntity({ country: country.ES.value });
      const firstPaymentDateNextMonth = moment().add('1', 'months').endOf('month').format('YYYY-MM-DD');
      const contractData = {
        client,
        contractor,
        contract: {
          rate: 100,
          currency: 'USD',
          cycle: 'monthly',
          firstPayDate: firstPaymentDateNextMonth,
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
    'Client shall be able to finalize invoice early @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await finalizeInvoiceEarly(page);

      // Assert that "Pay" button becomes active and has the correct text
      await expect(page.getByTestId(icInvoiceImmutabilitySelectors.payButtonTestId)).toBeEnabled();
      await expect(page.getByTestId(icInvoiceImmutabilitySelectors.payButtonTestId)).toHaveText(contractsCore.payButtonText);
    }
  );
});
