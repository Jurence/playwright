import { expect, test } from '@playwright/test';
import country from '../../../data/countries.json';
import reactivateEndedContract from '../../../helpers/contracts-core/ic-contracts-core-termination';
import { loginIntoSpecificPage } from '../../../helpers/platform/login-ui';
import icTerminationFlow from '../../../selectors/ic-contracts-core/termination';
import { createClientWithNonUSEntity } from '../../../setup/commands/create-client';
import { createIndividualContractor } from '../../../setup/commands/create-contractor';
import createFixedContract from '../../../setup/commands/ic-contracts-core/ic-fixed-contract';
import {
  sendInvitationToContractorFromClient,
  signUpICContractWithoutTaxForms,
} from '../../../setup/commands/ic-contracts-core/ic-sign-contract';
import terminateFixedContract from '../../../setup/commands/ic-contracts-core/ic-termination-fixed';
import { password } from '../../../setup/constants';

let client;
let contractor;
let contract;
let createdContractLink;

test.describe('Reactivation of terminated IC contract', () => {
  test.beforeEach('Create contract, user and login via API', async ({ request }) => {
    contractor = await createIndividualContractor({ country: country.ES.value });
    client = await createClientWithNonUSEntity({ country: country.ES.value });

    const contractData = {
      client,
      contractor,
      contract: { rate: 222, currency: 'USD' },
      creator: 'client',
    };
    contract = await createFixedContract(request, contractData);

    createdContractLink = `/people/${contract.contractorHrisProfile.id}/contracts/${contract.id}`;
  });

  test(
    'Client should reactivate Fixed contract after Termination @contract-core-qa-front',
    {
      tag: ['@slowRegression'],
    },
    async ({ page, request }) => {
      // Set the timeout for this test
      test.setTimeout(120 * 1000);

      // Sign contract as Client and invite Contractor via API
      await signUpICContractWithoutTaxForms(request, contract.id, client.token, client.legalEntityId);
      await sendInvitationToContractorFromClient(request, contract.id, contractor.email, { type: null }, client.token);

      // Sign contract as Contractor via API
      await signUpICContractWithoutTaxForms(request, contract.id, contractor.token, client.legalEntityId);

      // Login as Client and Terminate contract via API
      await terminateFixedContract(request, client.token, { customAmount: 5 }, contract.id);
      await loginIntoSpecificPage(page, request, client.email, password, createdContractLink);

      // Reactivate the terminated contract and assert the result
      await reactivateEndedContract(page);

      await expect(page.getByTestId(icTerminationFlow.terminationBannerTestId)).not.toBeVisible();
      await expect(page.getByTestId(icTerminationFlow.editContractBtnTestId)).toBeEnabled();
      await expect(page.getByTestId(icTerminationFlow.actionsBtnTestId)).toBeEnabled();
    }
  );
});
