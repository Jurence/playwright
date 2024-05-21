import { test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  assertContractCanceledByClient,
  cancelContractFromSigningPage,
} from '../../../helpers/contracts-core/ic-review-and-sign-ui';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createFixedContract from '../../../setup/commands/ic-contracts-core/ic-fixed-contract';
import { password } from '../../../setup/constants';

test.describe('Cancel contract from as Client and Contractor', () => {
  let client;
  let contractor;
  let contract;
  let createdContractLink;
  let contractData;

  test.beforeAll('Create Client and Contractor via API', async () => {
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });
  });

  test.beforeEach('Set timeout for every test and shared contractData', async () => {
    test.setTimeout(120 * 1000);
    contractData = {
      client,
      contractor,
      contract: { rate: 222, currency: 'USD' },
      creator: 'client',
    };
  });

  test(
    'Client should cancel not signed by Client Fixed contract from Signing page @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Create Fixed contract from Client's side
      contract = await createFixedContract(request, contractData);
      createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;

      // Open created contract
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);

      // Cancel contract and open the contract again to see the updated status
      await cancelContractFromSigningPage(page);
      await page.goto(createdContractLink);

      await assertContractCanceledByClient(page);
    }
  );
});
