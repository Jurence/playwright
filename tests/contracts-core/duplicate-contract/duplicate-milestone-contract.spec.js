import { faker } from '@faker-js/faker';
import { test } from '@playwright/test';
import country from '../../../data/countries.json';
import {
  assertDuplicatedMilestoneContract,
  duplicateMilestoneContract,
  openDuplicationFlow,
} from '../../../helpers/contracts-core/ic-duplication';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createMilestoneContract from '../../../setup/commands/ic-contracts-core/ic-milestone-contract';
import {
  sendInvitationToContractorFromClient,
  signUpICContractWithoutTaxForms,
} from '../../../setup/commands/ic-contracts-core/ic-sign-contract';
import { password } from '../../../setup/constants';

test.describe('Duplicate Milestone contract', () => {
  let client;
  let contractor;
  let contract;
  let contractData;

  test.beforeEach('Create Contractor and Client, sign contracts and login as a Client', async ({ page, request }) => {
    test.setTimeout(120 * 1000);
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });

    contractData = {
      client,
      contractor,
      contract: {
        currency: 'EUR',
        name: 'Test Duplication',
        jobTitleName: 'Software QA Engineer',
        scope: faker.lorem.sentences(4),
        milestoneTitle: '1st Milestone',
        milestoneAmount: 100,
      },
      creator: 'client',
    };

    contract = await createMilestoneContract(request, contractData);

    await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
    await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);
    await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, contractor.legalEntityId);

    const createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
    await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);
  });

  test(
    'Client should duplicate Milestone contract successfully @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page }) => {
      await openDuplicationFlow(page);
      await duplicateMilestoneContract(page);

      await assertDuplicatedMilestoneContract(page, contractData);
    }
  );
});
