import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  assertDuplicatedFixedContract,
  duplicateFixedContractWithCustomAmount,
  openDuplicationFlow,
} from '../../../helpers/contracts-core/ic-duplication';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createFixedContract from '../../../setup/commands/ic-contracts-core/ic-fixed-contract';
import {
  sendInvitationToContractorFromClient,
  signUpICContractWithoutTaxForms,
} from '../../../setup/commands/ic-contracts-core/ic-sign-contract';
import { password } from '../../../setup/constants';

test.describe('Duplicate Fixed contract', () => {
  let client;
  let contractor;
  let contract;
  let contractData;
  let newCustomAmount;

  test.beforeEach('Create Contractor and Client, sign contracts and login as a Client', async ({ page, request }) => {
    test.setTimeout(120 * 1000);
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });

    contractData = {
      client,
      contractor,
      contract: {
        rate: 1000,
        currency: 'USD',
        jobTitleName: 'Software QA Engineer',
        scope: faker.lorem.sentences(4),
        name: 'Test Duplication',
      },
      creator: 'client',
    };

    contract = await createFixedContract(request, contractData);
    newCustomAmount = faker.number.int({ min: 1, max: contractData.contract.rate });

    await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
    await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
    await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

    const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
    await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);
  });

  test(
    'Client should duplicate Fixed contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await openDuplicationFlow(page);
      await duplicateFixedContractWithCustomAmount(page, newCustomAmount);

      await assertDuplicatedFixedContract(page, contractData, newCustomAmount);
    }
  );
});
